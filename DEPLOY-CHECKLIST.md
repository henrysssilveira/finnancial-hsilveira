# ✅ CHECKLIST DE DEPLOY - HSilveira Financial

Use este checklist para garantir que tudo está configurado corretamente.

## 📋 Pré-Deploy

### Ambiente Local
- [ ] Node.js instalado (versão 18+)
- [ ] npm ou yarn funcionando
- [ ] Git instalado (opcional, mas recomendado)
- [ ] Editor de código (VS Code, Sublime, etc)

### Contas e Acessos
- [ ] Conta no Vercel criada
- [ ] Acesso ao MongoDB Atlas
- [ ] Credenciais do MongoDB anotadas em local seguro

## 📁 Estrutura do Projeto

### Criar Pastas
```bash
mkdir hsilveira-financial
cd hsilveira-financial
mkdir -p api/auth api/transactions api/contracts api/settings scripts
```

- [ ] Pasta raiz criada
- [ ] Subpasta `api/` criada
- [ ] Subpasta `api/auth/` criada
- [ ] Subpasta `api/transactions/` criada
- [ ] Subpasta `api/contracts/` criada
- [ ] Subpasta `api/settings/` criada
- [ ] Subpasta `scripts/` criada

### Arquivos na Raiz
- [ ] `index.html` (Frontend)
- [ ] `package.json` (Dependências)
- [ ] `vercel.json` (Config Vercel)
- [ ] `.gitignore` (Arquivos ignorados)
- [ ] `.env.example` (Exemplo de variáveis)
- [ ] `README.md` (Documentação)

### Arquivos em api/auth/
- [ ] `login.js`
- [ ] `validate.js`

### Arquivos em api/transactions/
- [ ] `index.js`
- [ ] `[id].js`
- [ ] `overview.js`
- [ ] `upcoming.js`

### Arquivos em api/contracts/
- [ ] `index.js`
- [ ] `[id].js`

### Arquivos em api/settings/
- [ ] `index.js`

### Arquivos em scripts/
- [ ] `init-user.js`

## 🔧 Configuração Inicial

### Instalar Dependências
```bash
npm install
```

- [ ] `package.json` configurado
- [ ] Dependências instaladas
- [ ] Pasta `node_modules/` criada
- [ ] Arquivo `package-lock.json` gerado

### Inicializar Banco de Dados
```bash
node scripts/init-user.js
```

- [ ] Script executado sem erros
- [ ] Database `data-finnancial-hsilveira` criada
- [ ] Collection `users` criada
- [ ] Collection `transactions` criada
- [ ] Collection `contracts` criada
- [ ] Collection `settings` criada
- [ ] Usuário inicial criado
- [ ] Credenciais anotadas:
  - Username: `henrique`
  - Password: `hsilveira2025`

## 🔒 Segurança (CRÍTICO!)

### MongoDB
- [ ] ⚠️ Senha do MongoDB TROCADA (exposição pública)
- [ ] Nova URI do MongoDB anotada
- [ ] IP Whitelist configurado (0.0.0.0/0 ou IPs específicos)
- [ ] Conexão testada

### JWT Secret
- [ ] Novo JWT_SECRET gerado:
  ```bash
  node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
  ```
- [ ] JWT_SECRET anotado em local seguro
- [ ] JWT_SECRET diferente do padrão

### Senha do Usuário
- [ ] Senha padrão planejada para ser trocada após primeiro login

## ☁️ Deploy no Vercel

### Instalar Vercel CLI
```bash
npm install -g vercel
```

- [ ] Vercel CLI instalado
- [ ] Comando `vercel` funciona no terminal

### Login no Vercel
```bash
vercel login
```

- [ ] Login realizado com sucesso
- [ ] Conta verificada

### Deploy Inicial
```bash
vercel
```

- [ ] Projeto nome: `hsilveira-financial`
- [ ] Deploy de preview criado
- [ ] URL de preview anotada: ________________

### Configurar Variáveis de Ambiente

#### Via CLI:
```bash
vercel env add MONGO_URI
vercel env add JWT_SECRET
```

- [ ] `MONGO_URI` adicionada (production)
- [ ] `MONGO_URI` adicionada (preview)
- [ ] `MONGO_URI` adicionada (development)
- [ ] `JWT_SECRET` adicionada (production)
- [ ] `JWT_SECRET` adicionada (preview)
- [ ] `JWT_SECRET` adicionada (development)

#### Ou via Dashboard:
- [ ] Acessado Settings → Environment Variables
- [ ] `MONGO_URI` configurada
- [ ] `JWT_SECRET` configurada

### Deploy em Produção
```bash
vercel --prod
```

- [ ] Deploy de produção realizado
- [ ] URL de produção anotada: ________________
- [ ] Site acessível na URL

## 🧪 Testes Pós-Deploy

### Teste de Login
- [ ] Acessar URL de produção
- [ ] Página de login carrega corretamente
- [ ] Design verde/escuro conforme esperado
- [ ] Fazer login com credenciais:
  - Username: `henrique`
  - Password: `hsilveira2025`
- [ ] Login bem-sucedido
- [ ] Dashboard carrega

### Teste de Funcionalidades

#### Dashboard
- [ ] Cards de resumo aparecem
- [ ] Valores iniciais em R$ 0,00
- [ ] Próximos vencimentos vazio (normal)

#### Lançamentos
- [ ] Formulário de novo lançamento funciona
- [ ] Criar receita teste:
  - Tipo: Receita
  - Categoria: Serviço
  - Descrição: "Teste de receita"
  - Valor: 100
  - Data: hoje
  - Status: Pago
- [ ] Transação aparece na tabela
- [ ] Valores do dashboard atualizam
- [ ] Deletar transação funciona

#### Contratos
- [ ] Formulário de novo contrato funciona
- [ ] Criar contrato teste:
  - Cliente: "Cliente Teste"
  - Valor: 1000
  - Datas: próximo mês
  - Parcelas: 2
  - Status: Ativo
- [ ] Contrato aparece na tabela
- [ ] Deletar contrato funciona

#### Planejamento
- [ ] Calculadora de cenários funciona
- [ ] Inserir valores teste
- [ ] Cálculo de projeção aparece
- [ ] Valores corretos exibidos

#### Documentos
- [ ] Área de upload aparece
- [ ] Selecionar arquivo funciona
- [ ] Upload para webhook funciona

#### Configurações
- [ ] Formulário de configurações carrega
- [ ] Salvar configurações funciona
- [ ] Calculadora de adiantamento funciona
- [ ] Valores calculados corretamente

### Teste de APIs (via curl ou Postman)
- [ ] `POST /api/auth/login` funciona
- [ ] `GET /api/auth/validate` funciona
- [ ] `GET /api/transactions` funciona
- [ ] `POST /api/transactions` funciona
- [ ] `DELETE /api/transactions/[id]` funciona
- [ ] `GET /api/transactions/overview` funciona
- [ ] `GET /api/transactions/upcoming` funciona
- [ ] `GET /api/contracts` funciona
- [ ] `POST /api/contracts` funciona
- [ ] `DELETE /api/contracts/[id]` funciona
- [ ] `GET /api/settings` funciona
- [ ] `POST /api/settings` funciona

## 🔐 Segurança Pós-Deploy

### Trocar Senha do Usuário
- [ ] Acessar MongoDB Atlas
- [ ] Atualizar senha do usuário `henrique`
- [ ] Nova senha anotada em local seguro
- [ ] Testar login com nova senha

### Implementar Hash de Senha (Recomendado)
- [ ] Instalar bcrypt: `npm install bcrypt`
- [ ] Criar script `change-password.js`
- [ ] Executar script com nova senha
- [ ] Atualizar `api/auth/login.js` para usar bcrypt
- [ ] Deploy atualizado: `vercel --prod`
- [ ] Testar login com senha hasheada

### Monitoramento
- [ ] Configurar alertas no Vercel
- [ ] Verificar logs funcionando
- [ ] Configurar backup no MongoDB

## 📱 Extras (Opcional)

### Domínio Customizado
- [ ] Comprar/ter domínio próprio
- [ ] Adicionar domínio no Vercel
- [ ] Configurar DNS
- [ ] SSL automático funcionando

### Analytics
- [ ] Habilitar Vercel Analytics
- [ ] Configurar Web Vitals

### Git Repository
- [ ] Criar repositório no GitHub
- [ ] Fazer commit inicial
- [ ] Push para repositório
- [ ] Conectar Vercel ao repositório

### PWA (Progressive Web App)
- [ ] Adicionar manifest.json
- [ ] Adicionar service worker
- [ ] Testar instalação no mobile

## 📊 Monitoramento Contínuo

### Diário
- [ ] Verificar se site está online
- [ ] Testar login

### Semanal
- [ ] Revisar logs de erro
- [ ] Verificar uso de recursos
- [ ] Fazer backup manual

### Mensal
- [ ] Executar `npm audit`
- [ ] Atualizar dependências
- [ ] Revisar logs de acesso
- [ ] Trocar JWT_SECRET (opcional)
- [ ] Verificar backups automáticos

## 🎉 Finalização

### Documentação
- [ ] README.md completo
- [ ] SECURITY.md revisado
- [ ] API-EXAMPLES.md disponível
- [ ] QUICK-START.md acessível

### Backup
- [ ] Credenciais salvas em gerenciador de senhas
- [ ] URLs anotadas
- [ ] Backup do código fonte
- [ ] Documentação impressa/salva

### Comunicação
- [ ] Time/stakeholders informados
- [ ] URLs compartilhadas
- [ ] Credenciais distribuídas (seguramente)

---

## 📝 Informações do Deploy

Preencha após conclusão:

**Data do Deploy:** ___/___/______

**URLs:**
- Produção: _________________________________
- Preview: __________________________________

**Credenciais:**
- Username: henrique
- Password inicial: hsilveira2025
- Nova senha: (em gerenciador de senhas)

**Variáveis de Ambiente:**
- MONGO_URI: ✅ Configurada
- JWT_SECRET: ✅ Configurada

**Status:**
- [ ] ✅ Deploy concluído com sucesso
- [ ] ✅ Todos os testes passaram
- [ ] ✅ Segurança configurada
- [ ] ✅ Sistema em produção

---

**🎊 PARABÉNS! Seu sistema está no ar!**

Lembre-se de seguir o checklist de segurança e manutenção regularmente.