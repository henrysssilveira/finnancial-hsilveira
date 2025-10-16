# 🔌 API Examples - HSilveira Financial

Exemplos de requisições para testar todas as APIs do sistema.

## 🔐 Autenticação

### Login
```bash
curl -X POST https://seu-dominio.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "henrique",
    "password": "hsilveira2025"
  }'
```

**Resposta:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "username": "henrique",
    "name": "Henrique Silveira"
  }
}
```

### Validar Token
```bash
curl -X GET https://seu-dominio.vercel.app/api/auth/validate \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

**Resposta:**
```json
{
  "valid": true,
  "user": {
    "userId": "507f1f77bcf86cd799439011",
    "username": "henrique"
  }
}
```

## 💰 Transações

### Listar Todas as Transações
```bash
curl -X GET https://seu-dominio.vercel.app/api/transactions \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

**Resposta:**
```json
{
  "transactions": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "type": "income",
      "category": "salary",
      "description": "Salário Novembro",
      "amount": 5000,
      "date": "2025-11-05",
      "status": "paid",
      "userId": "507f191e810c19729de860ea",
      "createdAt": "2025-10-16T10:30:00.000Z"
    }
  ]
}
```

### Criar Nova Transação (Receita)
```bash
curl -X POST https://seu-dominio.vercel.app/api/transactions \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "income",
    "category": "service",
    "description": "Projeto Web Cliente X",
    "amount": 3500.00,
    "date": "2025-10-20",
    "status": "pending"
  }'
```

### Criar Nova Transação (Despesa)
```bash
curl -X POST https://seu-dominio.vercel.app/api/transactions \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "expense",
    "category": "food",
    "description": "Supermercado",
    "amount": 450.75,
    "date": "2025-10-16",
    "status": "paid"
  }'
```

**Resposta:**
```json
{
  "success": true,
  "id": "507f1f77bcf86cd799439012"
}
```

### Deletar Transação
```bash
curl -X DELETE https://seu-dominio.vercel.app/api/transactions/507f1f77bcf86cd799439012 \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

**Resposta:**
```json
{
  "success": true
}
```

### Obter Resumo Financeiro
```bash
curl -X GET https://seu-dominio.vercel.app/api/transactions/overview \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

**Resposta:**
```json
{
  "totalBalance": 12450.50,
  "monthIncome": 5000.00,
  "monthExpenses": 2340.75
}
```

### Próximos Pagamentos
```bash
curl -X GET https://seu-dominio.vercel.app/api/transactions/upcoming \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

**Resposta:**
```json
{
  "transactions": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "description": "Aluguel",
      "amount": 1500,
      "date": "2025-10-25",
      "status": "pending"
    }
  ]
}
```

## 📄 Contratos

### Listar Todos os Contratos
```bash
curl -X GET https://seu-dominio.vercel.app/api/contracts \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

**Resposta:**
```json
{
  "contracts": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "client": "Empresa ABC Ltda",
      "amount": 15000,
      "startDate": "2025-10-01",
      "endDate": "2025-12-31",
      "installments": 3,
      "status": "active",
      "description": "Desenvolvimento de sistema completo",
      "userId": "507f191e810c19729de860ea",
      "createdAt": "2025-10-01T08:00:00.000Z"
    }
  ]
}
```

### Criar Novo Contrato
```bash
curl -X POST https://seu-dominio.vercel.app/api/contracts \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "client": "Empresa XYZ",
    "amount": 8000,
    "startDate": "2025-11-01",
    "endDate": "2025-11-30",
    "installments": 2,
    "status": "pending",
    "description": "Consultoria em TI - 40 horas"
  }'
```

**Resposta:**
```json
{
  "success": true,
  "id": "507f1f77bcf86cd799439015"
}
```

### Deletar Contrato
```bash
curl -X DELETE https://seu-dominio.vercel.app/api/contracts/507f1f77bcf86cd799439015 \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## ⚙️ Configurações

### Obter Configurações
```bash
curl -X GET https://seu-dominio.vercel.app/api/settings \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

**Resposta:**
```json
{
  "settings": {
    "monthlySalary": 5000,
    "salaryDay": 5,
    "advanceLimit": 40,
    "advanceFee": 5,
    "userId": "507f191e810c19729de860ea",
    "updatedAt": "2025-10-16T12:00:00.000Z"
  }
}
```

### Salvar Configurações
```bash
curl -X POST https://seu-dominio.vercel.app/api/settings \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "monthlySalary": 6000,
    "salaryDay": 5,
    "advanceLimit": 50,
    "advanceFee": 4.5
  }'
```

**Resposta:**
```json
{
  "success": true
}
```

## 📤 Upload de Documentos

### Enviar Documento
```bash
curl -X POST https://vps61817.publiccloud.com.br/webhook/cadastro/files \
  -F "file=@/caminho/para/documento.pdf"
```

**Nota:** Este endpoint já está configurado no seu webhook.

## 🧪 Testando com JavaScript (Frontend)

### Exemplo Completo de Fluxo

```javascript
// 1. Login
async function login() {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'henrique',
      password: 'hsilveira2025'
    })
  });
  
  const data = await response.json();
  localStorage.setItem('authToken', data.token);
  return data.token;
}

// 2. Criar transação
async function createTransaction(token) {
  const response = await fetch('/api/transactions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      type: 'income',
      category: 'service',
      description: 'Freelance Project',
      amount: 2500,
      date: '2025-10-20',
      status: 'pending'
    })
  });
  
  return await response.json();
}

// 3. Obter overview
async function getOverview(token) {
  const response = await fetch('/api/transactions/overview', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return await response.json();
}

// Usar
const token = await login();
await createTransaction(token);
const overview = await getOverview(token);
console.log(overview);
```

## 🔍 Testando com Postman

### Importar Collection

Crie uma collection no Postman com estas variáveis:
- `baseUrl`: https://seu-dominio.vercel.app
- `token`: (será preenchido após login)

### Pre-request Script (para usar token automaticamente)

```javascript
pm.request.headers.add({
    key: 'Authorization',
    value: 'Bearer ' + pm.environment.get('token')
});
```

### Test Script (salvar token após login)

```javascript
if (pm.response.code === 200) {
    var jsonData = pm.response.json();
    if (jsonData.token) {
        pm.environment.set('token', jsonData.token);
    }
}
```

## 📊 Exemplos de Dados para Teste

### Categorias Disponíveis

**Receitas:**
- `salary` - Salário
- `service` - Serviço Prestado
- `other` - Outros

**Despesas:**
- `food` - Alimentação
- `transport` - Transporte
- `housing` - Moradia
- `health` - Saúde
- `education` - Educação
- `entertainment` - Lazer
- `other` - Outros

### Status Disponíveis