const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');

const JWT_SECRET = process.env.JWT_SECRET;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Validar variáveis de ambiente
  if (!JWT_SECRET || !SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Missing environment variables');
    return res.status(500).json({ 
      error: 'Erro na configuração do servidor',
      details: {
        JWT_SECRET: !!JWT_SECRET,
        SUPABASE_URL: !!SUPABASE_URL,
        SUPABASE_SERVICE_KEY: !!SUPABASE_KEY
      }
    });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Usuário e senha são obrigatórios' });
    }

    // Buscar usuário
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    if (error || !user) {
      console.error('User not found:', error);
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    // Verificar senha (em produção, use bcrypt!)
    if (user.password !== password) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        username: user.username,
        name: user.name
      }
    });

  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ 
      error: 'Erro no servidor',
      message: error.message 
    });
  }
};