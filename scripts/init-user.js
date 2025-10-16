// Script para criar usuário inicial no MongoDB
// Execute: node scripts/init-user.js

const { MongoClient } = require('mongodb');

const MONGO_URI = 'mongodb+srv://henriquesilveira:HZ0ufTMylBV7oJQY@data-finnancial-hsilvei.brqhp2y.mongodb.net/?retryWrites=true&w=majority&appName=data-finnancial-hsilveira';

async function initUser() {
  let client;
  
  try {
    console.log('Conectando ao MongoDB...');
    client = await MongoClient.connect(MONGO_URI);
    const db = client.db('data-finnancial-hsilveira');
    
    // Criar coleção de usuários se não existir
    const collections = await db.listCollections().toArray();
    const hasUsers = collections.some(col => col.name === 'users');
    
    if (!hasUsers) {
      await db.createCollection('users');
      console.log('✅ Coleção "users" criada');
    }
    
    const users = db.collection('users');
    
    // Verificar se já existe usuário
    const existingUser = await users.findOne({ username: 'henrique' });
    
    if (existingUser) {
      console.log('⚠️  Usuário já existe!');
      console.log('Username:', existingUser.username);
      return;
    }
    
    // Criar usuário inicial
    const newUser = {
      username: 'henrique',
      password: 'hsilveira2025', // IMPORTANTE: Troque esta senha!
      name: 'Henrique Silveira',
      email: 'henrique@hsilveira.com',
      createdAt: new Date()
    };
    
    await users.insertOne(newUser);
    console.log('✅ Usuário criado com sucesso!');
    console.log('Username:', newUser.username);
    console.log('Password:', newUser.password);
    console.log('\n⚠️  IMPORTANTE: Troque a senha após o primeiro login!');
    
    // Criar índices
    await users.createIndex({ username: 1 }, { unique: true });
    console.log('✅ Índices criados');
    
    // Criar outras coleções necessárias
    const collectionsToCreate = ['transactions', 'contracts', 'settings'];
    
    for (const collectionName of collectionsToCreate) {
      const exists = collections.some(col => col.name === collectionName);
      if (!exists) {
        await db.createCollection(collectionName);
        console.log(`✅ Coleção "${collectionName}" criada`);
      }
    }
    
    console.log('\n✅ Inicialização completa!');
    
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('\n🔌 Conexão fechada');
    }
  }
}

initUser();