# 🔒 GUIA DE SEGURANÇA CRÍTICO

## ⚠️ AÇÕES URGENTES - EXECUTAR IMEDIATAMENTE

### 1. TROCAR SENHA DO MONGODB (PRIORIDADE MÁXIMA!)

As credenciais do MongoDB foram expostas publicamente nesta conversa. **TROQUE IMEDIATAMENTE!**

#### Passos:

1. Acesse [MongoDB Atlas](https://cloud.mongodb.com)
2. Vá em **Database Access**
3. Clique em **Edit** no usuário `henriquesilveira`
4. Clique em **Edit Password**
5. Clique em **Autogenerate Secure Password** ou crie uma senha forte
6. **COPIE E SALVE** a nova senha em local seguro
7. Clique em **Update User**

#### Atualizar no Vercel:

```bash
# Remover variável antiga
vercel env rm MONGO_URI production

# Adicionar nova variável com nova senha
vercel env add MONGO_URI production
# Cole a nova URI quando solicitado
```

#### Nova URI será algo como:
```
mongodb+srv://henriquesilveira:NOVA_SENHA_AQUI@data-finnancial-hsilvei.brqhp2y.mongodb.net/?retryWrites=true&w=majority&appName=data-finnancial-hsilveira
```

### 2. GERAR NOVO JWT_SECRET

O JWT_SECRET atual é simples demais para produção.

```bash
# Gerar secret seguro
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Atualize no Vercel:
```bash
vercel env rm JWT_SECRET production
vercel env add JWT_SECRET production
# Cole o novo secret gerado
```

### 3. TROCAR SENHA DO USUÁRIO

A senha padrão `hsilveira2025` deve ser trocada.

#### Opção A: Via MongoDB Atlas (Recomendado)

1. Acesse MongoDB Atlas → Collections
2. Selecione database `data-finnancial-hsilveira`
3. Abra collection `users`
4. Encontre seu usuário
5. Edite o campo `password`
6. Salve com uma senha forte

#### Opção B: Implementar hash de senha (RECOMENDADO)

Instale bcrypt:
```bash
npm install bcrypt
```

Crie arquivo `scripts/change-password.js`:
```javascript
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

const MONGO_URI = 'SUA_NOVA_URI_AQUI';

async function changePassword() {
  const client = await MongoClient.connect(MONGO_URI);
  const db = client.db('data-finnancial-hsilveira');
  const users = db.collection('users');
  
  const newPassword = 'SUA_SENHA_FORTE_AQUI';
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
  await users.updateOne(
    { username: 'henrique' },
    { $set: { password: hashedPassword } }
  );
  
  console.log('✅ Senha atualizada com hash!');
  await client.close();
}

changePassword();
```

Execute:
```bash
node scripts/change-password.js
```

Atualize `api/auth/login.js` para usar bcrypt:
```javascript
const bcrypt = require('bcrypt');

// Substitua a linha:
// if (user.password !== password) {

// Por:
if (!await bcrypt.compare(password, user.password)) {
  return res.status(401).json({ error: 'Senha incorreta' });
}
```

### 4. CONFIGURAR IP WHITELIST NO MONGODB

Por segurança, não use `0.0.0.0/0` em produção.

1. MongoDB Atlas → Network Access
2. Adicione IPs específicos do Vercel
3. Ou use VPC Peering para maior segurança

## 🔐 MELHORES PRÁTICAS DE SEGURANÇA

### Proteção de Dados

#### 1. NUNCA commite credenciais
```bash
# Sempre use .gitignore
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
```

#### 2. Use variáveis de ambiente
- Todas as credenciais devem estar em variáveis de ambiente
- Configure no Vercel Dashboard ou via CLI
- Nunca hardcode senhas no código

#### 3. Implementar rate limiting

Adicione proteção contra brute force em `api/auth/login.js`:

```javascript
// Simples contador de tentativas
const loginAttempts = new Map();

// No início da função
const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
const attempts = loginAttempts.get(ip) || 0;

if (attempts >= 5) {
  return res.status(429).json({ 
    error: 'Muitas tentativas. Tente novamente em 15 minutos.' 
  });
}

// Se login falhar:
loginAttempts.set(ip, attempts + 1);
setTimeout(() => loginAttempts.delete(ip), 15 * 60 * 1000); // 15 min

// Se login suceder:
loginAttempts.delete(ip);
```

### Autenticação

#### 1. Tokens com expiração curta
```javascript
// Em api/auth/login.js, já configurado:
const token = jwt.sign(
  { userId: user._id, username: user.username },
  JWT_SECRET,
  { expiresIn: '7d' } // Considere reduzir para '1d' ou '12h'
);
```

#### 2. Implementar refresh tokens (Opcional)

Para sessões mais longas com segurança:
- Token de acesso: 15 minutos
- Refresh token: 7 dias
- Rotação automática de tokens

#### 3. Logout adequado
```javascript
// Adicione um endpoint de logout que invalide tokens
// Mantenha lista de tokens revogados no MongoDB
```

### Validação de Dados

#### 1. Validar todos os inputs

Instale validator:
```bash
npm install validator
```

Use em todas as APIs:
```javascript
const validator = require('validator');

// Exemplo em transactions
if (!validator.isNumeric(String(amount)) || amount <= 0) {
  return res.status(400).json({ error: 'Valor inválido' });
}

if (!validator.isDate(date)) {
  return res.status(400).json({ error: 'Data inválida' });
}
```

#### 2. Sanitizar dados

```javascript
const description = validator.escape(req.body.description);
const client = validator.escape(req.body.client);
```

### Proteção contra Ataques

#### 1. XSS (Cross-Site Scripting)
- ✅ Já protegido: Não usamos `innerHTML` no frontend
- ✅ Sempre use `textContent` ou frameworks seguros

#### 2. SQL/NoSQL Injection
- ✅ Já protegido: MongoDB driver sanitiza queries
- ⚠️ Nunca use strings concatenadas em queries

#### 3. CSRF (Cross-Site Request Forgery)
```javascript
// Adicione validação de origem
const allowedOrigins = ['https://seu-dominio.vercel.app'];
const origin = req.headers.origin;

if (origin && !allowedOrigins.includes(origin)) {
  return res.status(403).json({ error: 'Origin não permitida' });
}
```

## 📊 MONITORAMENTO

### 1. Logs de Acesso

Adicione logging em todas as APIs:
```javascript
console.log({
  timestamp: new Date(),
  method: req.method,
  path: req.url,
  user: decoded.username,
  ip: req.headers['x-forwarded-for']
});
```

### 2. Alertas de Segurança

Configure alertas no Vercel para:
- Falhas de autenticação repetidas
- Erros 500 em sequência
- Uso anormal de recursos

### 3. Backup Regular

Configure backups automáticos no MongoDB Atlas:
- Retenção de 7 dias mínimo
- Teste restauração mensalmente

## 🔍 AUDITORIA DE SEGURANÇA

### Checklist Mensal

- [ ] Revisar logs de acesso
- [ ] Verificar tentativas de login falhadas
- [ ] Atualizar dependências (`npm audit fix`)
- [ ] Verificar configurações do MongoDB
- [ ] Testar backup e restore
- [ ] Revisar permissões de usuários
- [ ] Verificar validade de tokens

### Verificar Vulnerabilidades

```bash
# Executar regularmente
npm audit

# Corrigir automaticamente
npm audit fix

# Para vulnerabilidades críticas
npm audit fix --force
```

## 🚨 RESPOSTA A INCIDENTES

### Se houver suspeita de comprometimento:

1. **IMEDIATO:**
   - Trocar TODAS as senhas
   - Gerar novo JWT_SECRET
   - Invalidar todos os tokens ativos
   - Revisar logs de acesso

2. **INVESTIGAÇÃO:**
   - Analisar logs do Vercel
   - Verificar acessos no MongoDB Atlas
   - Identificar padrões suspeitos

3. **RECUPERAÇÃO:**
   - Restaurar backup se necessário
   - Implementar medidas corretivas
   - Documentar o incidente

4. **PREVENÇÃO:**
   - Implementar controles adicionais
   - Atualizar documentação
   - Treinar sobre novas ameaças

## 📱 CONTATO DE EMERGÊNCIA

Mantenha acesso a:
- Email de recuperação do Vercel
- Email de recuperação do MongoDB
- 2FA backup codes
- Documentação de credenciais (em local seguro)

## ⚖️ COMPLIANCE E PRIVACIDADE

### LGPD (Lei Geral de Proteção de Dados)

Como este é um sistema pessoal:
- ✅ Você é o único usuário e controlador
- ✅ Dados armazenados apenas para uso próprio
- ⚠️ Se adicionar outros usuários, implemente:
  - Consentimento explícito
  - Direito ao esquecimento
  - Portabilidade de dados
  - Política de privacidade

### Retenção de Dados

Configure política de retenção:
```javascript
// Exemplo: deletar transações antigas
const oneYearAgo = new Date();
oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

await transactions.deleteMany({
  userId: decoded.userId,
  createdAt: { $lt: oneYearAgo },
  archived: true // Apenas se marcado como arquivado
});
```

## 📚 RECURSOS ADICIONAIS

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [MongoDB Security Checklist](https://docs.mongodb.com/manual/administration/security-checklist/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [Vercel Security](https://vercel.com/docs/security)

---

**🔒 A segurança é um processo contínuo, não um estado final!**

Revise este guia mensalmente e mantenha-se atualizado sobre novas ameaças.