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

    // GET - Buscar configurações
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('user_id', decoded.userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      return res.status(200).json({ 
        settings: data || {
          monthly_salary: 0,
          salary_day: 5,
          advance_limit: 40,
          advance_fee: 5
        }
      });
    }

    // POST - Salvar configurações
    if (req.method === 'POST') {
      const newSettings = {
        ...req.body,
        user_id: decoded.userId
      };

      // Tentar atualizar primeiro
      const { data: existing } = await supabase
        .from('settings')
        .select('id')
        .eq('user_id', decoded.userId)
        .single();

      if (existing) {
        // Atualizar
        const { error } = await supabase
          .from('settings')
          .update(newSettings)
          .eq('user_id', decoded.userId);

        if (error) throw error;
      } else {
        // Inserir
        const { error } = await supabase
          .from('settings')
          .insert([newSettings]);

        if (error) throw error;
      }

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Settings error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido' });
    }
    return res.status(500).json({ error: 'Erro no servidor' });
  }
};