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

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!JWT_SECRET || !SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Missing environment variables');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    // Login usando Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('Auth error:', error.message);
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    if (!data.user) {
      return res.status(401).json({ error: 'Erro ao fazer login' });
    }

    // Gerar token JWT customizado (opcional, você pode usar o token do Supabase)
    const token = jwt.sign(
      { 
        userId: data.user.id, 
        email: data.user.email,
        supabaseToken: data.session.access_token
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Buscar dados do perfil do usuário se existir
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', data.user.id)
      .single();

    res.status(200).json({
      success: true,
      token,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: profile?.name || data.user.user_metadata?.name || 'Usuário'
      }
    });

  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ error: 'Erro no servidor' });
  }
};