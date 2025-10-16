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

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const decoded = verifyToken(req);
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    // Data atual
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Buscar transações do mês
    const { data: monthTransactions, error: monthError } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', decoded.userId)
      .gte('date', firstDayOfMonth.toISOString().split('T')[0])
      .lte('date', lastDayOfMonth.toISOString().split('T')[0]);

    if (monthError) throw monthError;

    // Calcular totais do mês
    let monthIncome = 0;
    let monthExpenses = 0;

    (monthTransactions || []).forEach(t => {
      if (t.status === 'paid') {
        if (t.type === 'income') {
          monthIncome += parseFloat(t.amount);
        } else {
          monthExpenses += parseFloat(t.amount);
        }
      }
    });

    // Buscar todas as transações pagas para saldo total
    const { data: allPaidTransactions, error: allError } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', decoded.userId)
      .eq('status', 'paid');

    if (allError) throw allError;

    let totalBalance = 0;
    (allPaidTransactions || []).forEach(t => {
      if (t.type === 'income') {
        totalBalance += parseFloat(t.amount);
      } else {
        totalBalance -= parseFloat(t.amount);
      }
    });

    return res.status(200).json({
      totalBalance,
      monthIncome,
      monthExpenses
    });

  } catch (error) {
    console.error('Overview error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido' });
    }
    return res.status(500).json({ error: 'Erro no servidor' });
  }
};