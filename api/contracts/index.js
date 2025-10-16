const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');

const JWT_SECRET = process.env.JWT_SECRET || 'hsilveira_secret_key_2025';
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

function verifyToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Token não fornecido');
  }
  const token = authHeader.substring(7);
  return jwt.verify(token, JWT_SECRET);
}

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const decoded = verifyToken(req);
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    // GET - Listar contratos
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('contracts')
        .select('*')
        .eq('user_id', decoded.userId)
        .order('start_date', { ascending: false });

      if (error) throw error;

      return res.status(200).json({ contracts: data || [] });
    }

    // POST - Criar contrato
    if (req.method === 'POST') {
      const contract = {
        ...req.body,
        user_id: decoded.userId
      };

      const { data, error } = await supabase
        .from('contracts')
        .insert([contract])
        .select()
        .single();

      if (error) throw error;

      return res.status(201).json({ 
        success: true, 
        id: data.id 
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Contract error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido' });
    }
    return res.status(500).json({ error: 'Erro no servidor' });
  }
};