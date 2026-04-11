# 🤖 Tucanos Discord Bot

Bot Discord para coletar dados de pilotos do canal #pilotos e fazer deploy automático para o GitHub Pages.

## 📋 Setup

### 1. Instalar Dependências

```bash
cd discord-bot
npm install
```

### 2. Configurar Variáveis de Ambiente

Copie `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite `.env` com suas informações:

```env
# Discord
DISCORD_TOKEN=seu_token_aqui
GUILD_ID=1491753893099606108
CHANNEL_ID=1492514823488143550

# GitHub
GITHUB_TOKEN=seu_token_github_aqui
GITHUB_REPO=seu_usuario/TucanosRacingBR-SITE
GITHUB_REPO_PATH=src/data
GITHUB_FILE_NAME=pilotos.json
GITHUB_BRANCH=main

# Local
LOCAL_REPO_PATH=../
```

### 3. Obter GitHub Token

1. Vá para: https://github.com/settings/tokens
2. Clique em "Generate new token" (Classic)
3. Selecione escopos: `repo` (acesso completo ao repositório)
4. Copie o token e cole em `GITHUB_TOKEN` no `.env`

![GitHub Token](https://docs.github.com/assets/cb-3861434/images/help/settings/personal_access_tokens.png)

### 4. Configurar Git Localmente

O bot precisa que o git esteja configurado:

```bash
git config user.name "TucanosBot"
git config user.email "bot@tucanos.com"
```

## 🚀 Como Usar

### Iniciar o Bot

```bash
npm start
```

Você verá:
```
✅ Bot conectado como: TucanosBot#7150
🆔 Guild ID: 1491753893099606108
📢 Channel ID: 1492514823488143550

💡 Use /deploy no Discord para coletar dados e fazer push ao GitHub!
```

### Usar o Comando `/deploy`

1. Vá ao Discord no canal #pilotos
2. Digite: `/deploy`
3. Selecione o comando e pressione Enter
4. O bot irá:
   - ✅ Coletar dados de pilotos do canal
   - ✅ Formatar em JSON
   - ✅ Fazer commit e push ao GitHub
   - ✅ Enviar mensagem de confirmação

### Formato de Dados no Discord

No canal #pilotos, escreva:

```
Douglas Pedroso: 5,2
Brayan Santos: 3,1
João Silva: 10,7
```

Onde: `Nome: vitórias,pódios`

## 📁 Estrutura

```
discord-bot/
├── bot.js                 # Arquivo principal
├── commands/
│   └── deploy.js         # Comando /deploy
├── utils/
│   ├── parseData.js      # Parser de mensagens
│   └── githubPush.js     # Lógica de push ao GitHub
├── package.json
├── .env.example
└── README.md
```

## 🔄 Fluxo de Funcionamento

```
Discord Channel
    ↓ (você digita /deploy)
Bot coleta mensagens
    ↓
Parse dados (Nome: X,Y)
    ↓
Formata JSON
    ↓
Git commit + push
    ↓
GitHub (pilotos.json atualizado)
    ↓
Site carrega dados automaticamente
```

## ⚙️ Configurar para Rodar 24/7

Para manter o bot rodando o tempo todo em nuvem grátis:

### Opção 1: Railway (Recomendado)

1. Vá para: https://railway.app
2. Conecte seu GitHub
3. Selecione este repositório
4. Configure as variáveis de ambiente (`.env`)
5. Deploy automático

### Opção 2: Render

1. Vá para: https://render.com
2. Crie um novo "Web Service"
3. Configure build: `npm install`
4. Configure start: `npm start`
5. Adicione variáveis de ambiente

### Opção 3: Replit

1. Vá para: https://replit.com
2. Importe do GitHub
3. Configure `.env`
4. Click "Run"

## 🛡️ Segurança

- **Nunca compartilhe seu `.env`**
- Tokens são confidenciais
- Use `.gitignore` para não enviar `.env` ao GitHub

```ini
# .gitignore
.env
node_modules/
.DS_Store
```

## 🐛 Troubleshooting

### "Comando não aparece no Discord"

- Aguarde 5 minutos após iniciar o bot
- Tente sair do servidor e voltar
- Reinicie o Discord

### "Erro ao fazer push ao GitHub"

- Verifique se o `GITHUB_TOKEN` está correto
- Verifique se o repositório é privado ou público
- Teste: `git push origin main` manualmente

### "Nenhum dado encontrado"

- Certifique-se de que as mensagens estão no formato correto
- Exemplo correto: `Douglas Pedroso: 5,2`
- Exemplo incorreto: `douglas pedroso 5 2`

## 📞 Suporte

Se tiver dúvidas, abra uma issue no repositório ou contate o desenvolvedor.

---

**Made with ❤️ for Tucanos Racing BR**
