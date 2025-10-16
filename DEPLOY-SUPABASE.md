# 🚀 GUIA DE DEPLOY - HSilveira Financial (Supabase)

## ✅ **PASSO 1: Configurar Supabase**

### 1.1 Criar Projeto

1. Acesse [supabase.com](https://supabase.com)
2. Faça login (pode usar GitHub)
3. Clique em **New Project**
4. Preencha:
   - **Name:** hsilveira-financial
   - **Database Password:** Anote essa senha! (ex: `gere_uma_senha_forte`)
   - **Region:** South America (São Paulo)
5. Clique em **Create new project**
6. Aguarde ~2 minutos

### 1.2 Criar Tabelas

1. No menu lateral, clique em **SQL Editor**
2. Clique em **New Query**
3. Copie e cole o conteúdo do arquivo `supabase-schema.sql`
4. Clique em **Run** ou pressione `Ctrl+Enter`
5. ✅ Deve aparecer "Success. No rows returned"

### 1.3 Verificar Tabelas Criadas

1. No menu lateral, clique em **Table Editor**
2. Você deve ver 4 tabelas:
   - ✅ users
   - ✅ transactions
   - ✅ contracts
   - ✅ settings

### 1.4 Verificar Usuário Criado

1. Clique na tabela **users**
2. Você deve ver 1 linha com:
   - username: henrique
   - password: hsilveira2025
   - name: Henrique Silveira

### 1.5 Pegar Credenciais

1. Clique em **Settings** → **API**
2. Copie e anote:
   - **Project URL:** `https://xxxxx.supabase.co`
   - **anon public key:** `eyJhbG...` (chave pública)
   - **service_role key:** `eyJhbG...` (chave secreta) ⚠️ NUNCA compartilhe!

---

## 📦 **PASSO 2: Preparar Projeto Local**

### 2.1 Atualizar Arquivos

Certifique-se de ter TODOS os arquivos atualizados:

```bash
# Estrutura do projeto
hsilveira-financial/
├── index.html               # (mesmo arquivo, não precisa mudar)
├── package.json             # ✅ ATUALIZADO (com @supabase/supabase-js)
├── vercel.json              # ✅ ATUALIZADO
├── .env.example             # ✅ ATUALIZADO
├── .gitignore               # (mesmo arquivo)
│
├── api/
│   ├── auth/
│   │   ├── login.js         # ✅ ATUALIZADO (Supabase)
│   │   └── validate.js      # (mesmo arquivo)
│   ├── transactions/
│   │   ├── index.js         # ✅ ATUALIZADO (Supabase)
│   │   ├── [id].js          # ✅ ATUALIZADO (Supabase)
│   │   ├── overview.js      # ✅ ATUALIZADO (Supabase)
│   │   └── upcoming.js      # ✅ ATUALIZADO (Supabase)
│   ├── contracts/
│   │   ├── index.js         # ✅ ATUALIZADO (Supabase)
│   │   └── [id].js          # ✅ ATUALIZADO (Supabase)
│   └── settings/
│       └── index.js         # ✅ ATUALIZADO (Supabase)
│
└── supabase-schema.sql      # ✅ NOVO ARQUIVO
```

### 2.2 Instalar Dependências

```bash
cd hsilveira-financial

# Deletar node_modules e package-lock.json antigos
rm -rf node_modules package-lock.json

# Instalar novas dependências
npm install
```

### 2.3 Criar arquivo .env para teste local

```bash
# Criar arquivo .env
touch .env
```

Adicione no `.env`:

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=sua_service_role_key_aqui
JWT_SECRET=gere_um_novo_secret_aqui
```

Para gerar JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## ☁️ **PASSO 3: Deploy no Vercel**

### 3.1 Login

```bash
vercel login
```

### 3.2 Deploy Inicial

```bash
vercel
```

Responda:
- Set up and deploy? **Y**
- Which scope? Selecione sua conta
- Link to existing project? **N** (ou **Y** se já tiver criado)
- Project name? `hsilveira-financial`
- In which directory is your code located? **./`**

### 3.3 Configurar Variáveis de Ambiente

#### Opção A: Via CLI (Recomendado)

```bash
# Adicionar SUPABASE_URL
vercel env add SUPABASE_URL production
# Cole: https://xxxxx.supabase.co

vercel env add SUPABASE_URL preview
# Cole: https://xxxxx.supabase.co

vercel env add SUPABASE_URL development
# Cole: https://xxxxx.supabase.co

# Adicionar SUPABASE_SERVICE_KEY
vercel env add SUPABASE_SERVICE_KEY production
# Cole: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

vercel env add SUPABASE_SERVICE_KEY preview
# Cole: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

vercel env add SUPABASE_SERVICE_KEY development
# Cole: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Adicionar JWT_SECRET
vercel env add JWT_SECRET production
# Cole o secret gerado

vercel env add JWT_SECRET preview
# Cole o secret gerado

vercel env add JWT_SECRET development
# Cole o secret gerado
```

#### Opção B: Via Dashboard Vercel

1. Acesse [vercel.com/dashboard](https://vercel.com/dashboard)
2. Selecione seu projeto **hsilveira-financial**
3. Vá em **Settings** → **Environment Variables**
4. Adicione cada variável:

| Key | Value | Environments |
|-----|-------|--------------|
| `SUPABASE_URL` | https://xxxxx.supabase.co | Production, Preview, Development |
| `SUPABASE_SERVICE_KEY` | eyJhbGci... | Production, Preview, Development |
| `JWT_SECRET` | seu_secret... | Production, Preview, Development |

5. Clique em **Save**

### 3.4 Deploy em Produção

```bash
vercel --prod
```

Aguarde o deploy completar (~1-2 minutos).

---

## 🧪 **PASSO 4: Testar o Sistema**

### 4.1 Acessar o Site

Abra a URL fornecida pelo Vercel (ex: `https://hsilveira-financial.vercel.app`)

### 4.2 Fazer Login

- **Username:** henrique
- **Password:** hsilveira2025

✅ Se aparecer o dashboard, está funcionando!

### 4.3 Testar Funcionalidades

1. **Criar uma transação:**
   - Aba "Lançamentos"
   - Preencher formulário
   - Clicar em "Adicionar Lançamento"
   - ✅ Deve aparecer na tabela

2. **Verificar Overview:**
   - Aba "Visão Geral"
   - ✅ Valores devem atualizar

3. **Criar um contrato:**
   - Aba "Contratos"
   - Preencher formulário
   - ✅ Deve salvar e aparecer na lista

4. **Configurações:**
   - Aba "Configurações"
   - Salvar salário
   - ✅ Deve confirmar "salvo com sucesso"

---

## 🔍 **PASSO 5: Verificar no Supabase**

### Ver dados salvos:

1. Acesse seu projeto no Supabase
2. Vá em **Table Editor**
3. Clique em **transactions**
4. ✅ Você deve ver as transações criadas

---

## 🐛 **TROUBLESHOOTING**

### Erro: "Failed to fetch"

**Causa:** Variáveis de ambiente não configuradas

**Solução:**
```bash
# Verificar variáveis no Vercel
vercel env ls

# Se estiverem faltando, adicione-as
vercel env add SUPABASE_URL production
vercel env add SUPABASE_SERVICE_KEY production
vercel env add JWT_SECRET production

# Refazer deploy
vercel --prod
```

### Erro: "Invalid API key"

**Causa:** SUPABASE_SERVICE_KEY incorreta

**Solução:**
1. Volte ao Supabase → Settings → API
2. Copie novamente a **service_role** key (não a anon key!)
3. Atualize no Vercel:
```bash
vercel env rm SUPABASE_SERVICE_KEY production
vercel env add SUPABASE_SERVICE_KEY production
vercel --prod
```

### Erro: "Relation does not exist"

**Causa:** Tabelas não foram criadas

**Solução:**
1. Volte ao Supabase → SQL Editor
2. Execute novamente o `supabase-schema.sql`
3. Verifique em Table Editor se as tabelas existem

### Login não funciona

**Causa:** Usuário não foi criado

**Solução:**
1. Supabase → Table Editor → users
2. Clique em **Insert** → **Insert row**
3. Preencha:
   - username: henrique
   - password: hsilveira2025
   - name: Henrique Silveira
4. Save

### Deploy falha

**Causa:** Dependências não instaladas

**Solução:**
```bash
rm -rf node_modules package-lock.json
npm install
vercel --prod --force
```

---

## ✅ **CHECKLIST COMPLETO**

### Supabase:
- [ ] Projeto criado
- [ ] SQL schema executado
- [ ] Tabelas criadas (users, transactions, contracts, settings)
- [ ] Usuário inicial criado
- [ ] SUPABASE_URL copiada
- [ ] SUPABASE_SERVICE_KEY copiada

### Projeto Local:
- [ ] Arquivos atualizados com Supabase
- [ ] package.json atualizado
- [ ] node_modules reinstalado
- [ ] .env criado (para testes locais)

### Vercel:
- [ ] Login realizado
- [ ] Projeto criado/atualizado
- [ ] SUPABASE_URL configurada
- [ ] SUPABASE_SERVICE_KEY configurada
- [ ] JWT_SECRET configurada
- [ ] Deploy produção realizado
- [ ] URL anotada

### Testes:
- [ ] Site abre
- [ ] Login funciona
- [ ] Dashboard carrega
- [ ] Criar transação funciona
- [ ] Overview atualiza
- [ ] Contratos funcionam
- [ ] Configurações salvam

---

## 🎉 **PRONTO!**

Seu sistema agora está rodando com Supabase! 

**Vantagens do Supabase:**
- ✅ Dashboard visual amigável
- ✅ PostgreSQL (mais robusto que MongoDB)
- ✅ Backups automáticos
- ✅ Interface SQL para queries
- ✅ Real-time opcional
- ✅ Row Level Security (RLS)
- ✅ Grátis até 500MB

---

## 📊 **Próximos Passos (Opcional)**

### Implementar hash de senha:

```bash
npm install bcrypt
```

Atualizar `api/auth/login.js` para usar bcrypt (veja SECURITY.md)

### Configurar domínio customizado:

Vercel Dashboard → Settings → Domains

### Habilitar backups:

Supabase → Settings → Backups (já ativo no free tier)

---

**Alguma dúvida? Revise os passos ou consulte os logs no Vercel Dashboard!**