const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb');

const JWT_SECRET = process.env.JWT_SECRET || 'hsilveira_secret_key_2025';
const MONGO_URI = process.env.MONGO_URI;

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

  let client;

  try {
    const decoded = verifyToken(req);
    client = await MongoClient.connect(MONGO_URI);
    const db = client.db('data-finnancial-hsilveira');
    const transactions = db.collection('transactions');

    // Data atual
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Buscar transações do mês
    const monthTransactions = await transactions.find({
      userId: decoded.userId,
      date: {
        $gte: firstDayOfMonth.toISOString(),
        $lte: lastDayOfMonth.toISOString()
      }
    }).toArray();

    // Calcular totais
    let monthIncome = 0;
    let monthExpenses = 0;

    monthTransactions.forEach(t => {
      if (t.status === 'paid') {
        if (t.type === 'income') {
          monthIncome += t.amount;
        } else {
          monthExpenses += t.amount;
        }
      }
    });

    // Buscar todas as transações pagas para saldo total
    const allPaidTransactions = await transactions.find({
      userId: decoded.userId,
      status: 'paid'
    }).toArray();

    let totalBalance = 0;
    allPaidTransactions.forEach(t => {
      if (t.type === 'income') {
        totalBalance += t.amount;
      } else {
        totalBalance -= t.amount;
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
  } finally {
    if (client) {
      await client.close();
    }
  }
};