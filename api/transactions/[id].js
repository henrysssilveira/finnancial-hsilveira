const jwt = require('jsonwebtoken');
const { MongoClient, ObjectId } = require('mongodb');

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

  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let client;

  try {
    const decoded = verifyToken(req);
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'ID não fornecido' });
    }

    client = await MongoClient.connect(MONGO_URI);
    const db = client.db('data-finnancial-hsilveira');
    const transactions = db.collection('transactions');

    const result = await transactions.deleteOne({
      _id: new ObjectId(id),
      userId: decoded.userId
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Transação não encontrada' });
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Delete transaction error:', error);
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