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

  let client;

  try {
    const decoded = verifyToken(req);
    client = await MongoClient.connect(MONGO_URI);
    const db = client.db('data-finnancial-hsilveira');
    const settings = db.collection('settings');

    // GET - Buscar configurações
    if (req.method === 'GET') {
      const userSettings = await settings.findOne({ userId: decoded.userId });
      
      return res.status(200).json({ 
        settings: userSettings || {
          monthlySalary: 0,
          salaryDay: 5,
          advanceLimit: 40,
          advanceFee: 5
        }
      });
    }

    // POST - Salvar configurações
    if (req.method === 'POST') {
      const newSettings = {
        ...req.body,
        userId: decoded.userId,
        updatedAt: new Date()
      };

      await settings.updateOne(
        { userId: decoded.userId },
        { $set: newSettings },
        { upsert: true }
      );
      
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Settings error:', error);
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