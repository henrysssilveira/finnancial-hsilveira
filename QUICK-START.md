# 🚀 QUICK START - HSilveira Financial

## Comandos Essenciais

### Setup Inicial
```bash
# 1. Clonar/criar projeto
mkdir hsilveira-financial && cd hsilveira-financial

# 2. Instalar dependências
npm install

# 3. Inicializar banco de dados
node scripts/init-user.js
```

### Deploy Vercel
```bash
# Login
vercel login

# Deploy de desenvolvimento
vercel

# Deploy de produção
vercel --prod
```

### Variáveis de Ambiente
```bash
# Adicionar variável
vercel env add NOME_VARIAVEL production

# Listar variáveis
vercel env ls

# Remover variável
vercel env rm NOME_VARIAVEL production
```

## 📁 Estrutura de Arquivos

```
hsilveira-financial/
├── index.html              # ← Frontend (cole aqui)
├── package.json            # ← Dependências
├── vercel.json             # ← Config Vercel
├── .gitignore              # ← Arquivos ignorados
├── .env.example            # ← Exemplo de env vars
│
├── api/
│   ├── auth/
│   │   ├── login.js        # ← Login endpoint
│   │   └── validate.js     # ← Validação token
│   ├── transactions/
│   │   ├── index.js        # ← CRUD transações
│   │   ├── [id].js         # ← Delete transação
│   │   ├── overview.js     # ← Resumo financeiro
│   │   └── upcoming.js     # ← Pagamentos próximos
│   ├── contracts/
│   │   ├── index.js        # ← CRUD contratos
│   │   └── [id].js         # ← Delete contrato
│   └── settings/
│       └── index.js        # ← Config usuário
│
└── scripts/
    ├── init-user.js        # ← Criar usuário
    └── change-password.js  # ← Trocar senha
```

## 🔑 Credenciais Padrão

**⚠️ TROCAR IMEDIATAMENTE APÓS PRIMEIRO LOGIN!**

- **Username:** `henrique`
- **Password:** `hsilveira2025`

## 🔒 Checklist de Segurança (ANTES DE USAR)

- [ ] ✅ Trocar senha do MongoDB Atlas
- [ ] ✅ Gerar novo JWT_SECRET
- [ ] ✅ Trocar senha do usuário no sistema
- [ ] ✅ Implementar hash de senha (bcrypt)
- [ ] ✅ Configurar IP whitelist no MongoDB
- [ ] ✅ Revisar variáveis de ambiente no Vercel

## 📊 Collections MongoDB

**Database:** `data-finnancial-hsilveira`

| Collection | Descrição |
|------------|-----------|
| `users` | Usuários do sistema |
| `transactions` | Lançamentos financeiros |
| `contracts` | Contratos de serviço |
| `settings` | Configurações do usuário |

## 🎯 Endpoints da API

### Autenticação
- `POST /api/auth/login` - Login
- `GET /api/auth/validate` - Validar token

### Transações
- `GET /api/transactions` - Listar todas
- `POST /api/transactions` - Criar nova
- `DELETE /api/transactions/[id]` - Deletar
- `GET /api/transactions/overview` - Resumo
- `GET /api/transactions/upcoming` - Próximos pagamentos

### Contratos
- `GET /api/contracts` - Listar todos
- `POST /api/contracts` - Criar novo
- `DELETE /api/contracts/[id]` - Deletar

### Configurações
- `GET /api/settings` - Obter configurações
- `POST /api/settings` - Salvar configurações

## 🐛 Troubleshooting Rápido

### Erro: "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Erro: "Unauthorized" / Token inválido
1. Verificar variáveis de ambiente no Vercel
2. Fazer logout e login novamente
3. Verificar JWT_SECRET configurado

### Erro: "Cannot connect to MongoDB"
1. Verificar MONGO_URI nas env vars
2. Confirmar IP whitelist no MongoDB Atlas
3. Testar conexão com `scripts/init-user.js`

### Frontend não aparece
1. Verificar se `index.html` está na raiz
2. Conferir `vercel.json` configurado corretamente
3. Ver logs: `vercel logs`

### API retorna 500
1. Ver logs das functions no Vercel Dashboard
2. Verificar formato dos dados enviados
3. Confirmar conexão com MongoDB

## 📈 Workflow de Desenvolvimento

### 1. Desenvolvimento Local
```bash
# Instalar Vercel CLI
npm i -g vercel

# Rodar localmente
vercel dev

# Acessar: http://localhost:3000
```

### 2. Testar Mudanças
```bash
# Deploy de teste
vercel

# URL de preview será gerada
```

### 3. Deploy em Produção
```bash
# Quando tudo estiver OK
vercel --prod
```

## 🔄 Atualizar Sistema

```bash
# 1. Fazer mudanças nos arquivos

# 2. Testar localmente
vercel dev

# 3. Deploy de preview
vercel

# 4. Se OK, deploy produção
vercel --prod
```

## 📱 Funcionalidades Disponíveis

### ✅ Implementado
- Login com JWT
- Dashboard com resumo financeiro
- Cadastro de receitas e despesas
- Lançamentos futuros
- Gestão de contratos de serviço
- Calculadora de planejamento
- Configurações de salário
- Calculadora de adiantamento
- Upload de documentos
- Histórico completo

### 🔜 Melhorias Futuras Sugeridas
- [ ] Hash de senhas (bcrypt)
- [ ] Exportar relatórios PDF
- [ ] Gráficos de evolução
- [ ] Notificações de vencimento
- [ ] Categorias personalizadas
- [ ] Multi-moeda
- [ ] App mobile (PWA)
- [ ] Backup automático
- [ ] Modo escuro (já tem!)

## 🆘 Comandos de Emergência

### Resetar senha MongoDB
```javascript
// Em scripts/change-password.js
const newPassword = 'NOVA_SENHA_SEGURA';
// Execute: node scripts/change-password.js
```

### Gerar novo JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Ver logs em tempo real
```bash
vercel logs --follow
```

### Reverter deploy
```bash
vercel rollback
```

## 📞 Links Úteis

- **Vercel Dashboard:** https://vercel.com/dashboard
- **MongoDB Atlas:** https://cloud.mongodb.com
- **Vercel Docs:** https://vercel.com/docs
- **MongoDB Docs:** https://docs.mongodb.com

## ⏱️ Tempos Estimados

| Ação | Tempo |
|------|-------|
| Setup inicial | 10-15 min |
| Configurar variáveis | 5 min |
| Primeiro deploy | 2-3 min |
| Deploy subsequente | 1-2 min |
| Trocar credenciais | 10 min |

## 💡 Dicas Pro

1. **Use aliases no Vercel** para URLs amigáveis
2. **Configure domínio customizado** para profissionalismo
3. **Habilite Web Analytics** no Vercel para insights
4. **Configure alertas** para erros críticos
5. **Faça backups mensais** do MongoDB
6. **Documente mudanças** para fácil manutenção
7. **Use Git** para controle de versão

## 📊 Monitoramento

### Vercel Dashboard
- Functions → Ver logs de cada API
- Analytics → Tráfego e performance
- Deployments → Histórico de deploys

### MongoDB Atlas
- Metrics → Performance do banco
- Activity Feed → Atividades recentes
- Backup → Status dos backups

---

**🎉 Pronto para usar! Boa gestão financeira!**

Lembre-se: Execute o checklist de segurança antes de usar em produção!