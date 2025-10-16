# HSilveira Financial - Sistema de Controle Financeiro

Sistema completo de gerenciamento financeiro pessoal com autenticação JWT e integração MongoDB.

## 📋 Pré-requisitos

- Conta no [Vercel](https://vercel.com)
- Node.js instalado (versão 18 ou superior)
- Acesso ao MongoDB Atlas (já configurado)

## 🚀 Estrutura do Projeto

```
hsilveira-financial/
├── index.html                      # Frontend principal
├── package.json                    # Dependências do projeto
├── vercel.json                     # Configuração do Vercel
├── api/
│   ├── auth/
│   │   ├── login.js               # Endpoint de login
│   │   └── validate.js            # Validação de token
│   ├── transactions/
│   │   ├── index.js               # CRUD de transações
│   │   ├── [id].js                # Deletar transação
│   │   ├── overview.js            # Resumo financeiro
│   │   └── upcoming.js            # Próximos pagamentos
│   ├── contracts/
│   │   ├── index.js               # CRUD de contratos
│   │   └── [id].js                # Deletar contrato
│   └── settings/
│       └── index.js               # Configurações do usuário
└── scripts/
    └── init-user.js               # Script de inicialização
```

## 📦 Passo 1: Preparar o Ambiente

### 1.1 Criar pasta do projeto

```bash
mkdir hsilveira-financial
cd hsilveira-financial
```

### 1.2 Criar estrutura de pastas

```bash
mkdir -p api/auth api/transactions api/contracts api/settings scripts
```

### 1.3 Copiar os arquivos

Copie todos os arquivos fornecidos para suas respectivas pastas:

- `index.html` na raiz
- `package.json` na raiz
- `vercel.json` na raiz
- Arquivos `.js` nas pastas correspondentes dentro de `api/`
- `init-user.js` na pasta `scripts/`

## 🔧 Passo 2: Instalar Dependências

```bash
npm install
```

## 🗄️ Passo 3: Inicializar Banco de Dados

### 3.1 Executar script de inicialização

```bash
node scripts/init-user.js
```

Este script irá:
- Criar as coleções necessárias no MongoDB
- Criar usuário inicial com credenciais:
  - **Username:** `henrique`
  - **Password:** `hsilveira2025`

⚠️ **IMPORTANTE:** Troque a senha após o primeiro login!

### 3.2 Verificar no MongoDB Atlas

Acesse o [MongoDB Atlas](https://cloud.mongodb.com) e verifique:
- Database: `data-finnancial-hsilveira`
- Collections criadas: `users`, `transactions`, `contracts`, `settings`

## ☁️ Passo 4: Deploy no Vercel

### 4.1 Instalar Vercel CLI (se ainda não tiver)

```bash
npm install -g vercel
```

### 4.2 Login no Vercel

```bash
vercel login
```

### 4.3 Configurar variáveis de ambiente

No terminal, durante o deploy, ou pelo dashboard do Vercel, configure:

```env
MONGO_URI=mongodb+srv://henriquesilveira:HZ0ufTMylBV7oJQY@data-finnancial-hsilvei.brqhp2y.mongodb.net/?retryWrites=true&w=majority&appName=data-finnancial-hsilveira

JWT_SECRET=hsilveira_secret_key_2025_production_change_this
```

⚠️ **CRÍTICO:** Antes de ir para produção, gere um novo JWT_SECRET:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4.4 Deploy inicial

```bash
vercel
```

Responda às perguntas:
- Set up and deploy? **Y**
- Which scope? Selecione sua conta
- Link to existing project? **N**
- Project name? `hsilveira-financial`
- In which directory is your code located? **./`**

### 4.5 Adicionar variáveis de ambiente no Vercel

```bash
vercel env add MONGO_URI
# Cole a URI do MongoDB quando solicitado

vercel env add JWT_SECRET
# Cole seu JWT_SECRET quando solicitado
```

### 4.6 Deploy em produção

```bash
vercel --prod
```

## 🎉 Passo 5: Acessar o Sistema

Após o deploy, você receberá uma URL como:
```
https://hsilveira-financial.vercel.app
```

### 5.1 Fazer login

Use as credenciais:
- **Username:** `henrique`
- **Password:** `hsilveira2025`

### 5.2 Trocar senha (IMPORTANTE!)

Por segurança, você deve:
1. Conectar ao MongoDB Atlas
2. Atualizar o campo `password` do usuário
3. Em produção, implemente hash de senha (bcrypt)

## 🔒 Melhorias de Segurança Recomendadas

### 1. Implementar hash de senha

Instale bcrypt:
```bash
npm install bcrypt
```

Atualize `api/auth/login.js`:
```javascript
const bcrypt = require('bcrypt');

// No login:
const isValid = await bcrypt.compare(password, user.password);

// Para criar hash (use no init-user.js):
const hashedPassword = await bcrypt.hash('sua_senha', 10);
```

### 2. Atualizar credenciais MongoDB

⚠️ **URGENTE:** As credenciais do MongoDB foram expostas nesta conversa. Execute:

1. Acesse MongoDB Atlas
2. Database Access → Edit User
3. Gere nova senha
4. Atualize a variável `MONGO_URI` no Vercel:

```bash
vercel env rm MONGO_URI production
vercel env add MONGO_URI production
```

### 3. Configurar domínio customizado (opcional)

No dashboard do Vercel:
1. Settings → Domains
2. Adicione seu domínio personalizado

## 📱 Funcionalidades do Sistema

✅ **Autenticação JWT** - Login seguro com token
✅ **Lançamentos Futuros** - Registro de receitas e despesas futuras
✅ **Categorização** - Organização por categorias
✅ **Contratos de Serviço** - Gestão de contratos com parcelas
✅ **Planejamento Financeiro** - Simulador de cenários
✅ **Configurações de Salário** - Com calculadora de adiantamento
✅ **Upload de Documentos** - Envio via webhook
✅ **Dashboard Responsivo** - Design moderno e intuitivo

## 🔄 Atualizações Futuras

Para atualizar o sistema:

```bash
# Fazer alterações nos arquivos
git add .
git commit -m "Descrição das mudanças"
vercel --prod
```

## 🐛 Troubleshooting

### Erro: "Module not found"
```bash
npm install
vercel --prod
```

### Erro: "Unauthorized"
- Verifique se as variáveis de ambiente estão configuradas
- Confirme que o token JWT está sendo enviado corretamente

### Erro de conexão MongoDB
- Verifique se a URI está correta
- Confirme que o IP está na whitelist do MongoDB Atlas (0.0.0.0/0 para permitir todos)

### Frontend não carrega
- Verifique se o arquivo `index.html` está na raiz
- Confirme a configuração do `vercel.json`

## 📞 Suporte

Para problemas ou dúvidas:
1. Verifique os logs no Vercel Dashboard
2. Acesse a aba "Functions" para ver logs das APIs
3. Use `vercel logs` no terminal

## 📄 Licença

Projeto pessoal de Henrique Silveira

---

**Desenvolvido com ❤️ para controle financeiro eficiente**