# 🎯 Arquitetura: Discord Bot + GitHub Pages

## 1️⃣ Discord Bot (Node.js)

**Localização:** `discord-bot/`

**Funcionamento:**
- ✅ Bot aguarda comando `/deploy` no Discord
- ✅ Coleta mensagens do canal #pilotos
- ✅ Parse formato: `Nome: vitórias,pódios`
- ✅ Converte para JSON estruturado
- ✅ Faz git commit + push automaticamente

**Comando:**
```bash
npm start  # Roda o bot
/deploy    # Comando no Discord para coletar e fazer push
```

---

## 2️⃣ Arquivo JSON no GitHub

**Localização:** `src/data/pilotos.json`

**Estrutura:**
```json
{
  "pilotos": [
    {"nome": "Douglas Pedroso", "vitorias": 0, "podios": 0},
    {"nome": "Brayan Santos", "vitorias": 0, "podios": 0}
  ],
  "ultimaAtualizacao": "2026-04-11T14:02:03.501Z"
}
```

**Atualizado por:** Bot Discord automaticamente

---

## 3️⃣ Site React (GitHub Pages)

**Localização:** `src/`

**Hook:** `usePilotos.js`
- ✅ Carrega `pilotos.json` automaticamente
- ✅ Converte formato para dados do ranking
- ✅ Ordena por pontos e vitórias
- ✅ Fallback para dados padrão se falhar

**Cálculo de Pontos:**
- Vitória: 10 pontos
- Pódio (não vitória): 5 pontos

**Exemplo:**
```
Douglas Pedroso: 3 vitórias, 1 pódio
Pontos = (3 × 10) + ((1-3) × 5) = 30 + (-10) = 20 pontos
```

---

## 🔄 Fluxo Completo

```
Discord (#pilotos)
    ↓ (Escreve dados)
"Douglas Pedroso: 3,1"
"Brayan Santos: 2,0"
    ↓ (Usuario comando /deploy)
Bot Discord
    ↓ (Coleta + Parse)
pilotos.json
    ↓ (Commit + Push)
GitHub
    ↓ (Build & Deploy)
GitHub Pages
    ↓ (React carrega)
Site React
    ↓ (Hook usePilotos)
Página Ranking & Perfil
```

---

## 📝 Como Usar

### 1. Atualizar Dados no Discord
```
#pilotos
Douglas Pedroso: 5,3
Brayan Santos: 4,2
João Silva: 3,1
```

### 2. Fazer Deploy
```
/deploy
```

Bot responde:
```
✅ Deploy realizado com sucesso!
📊 Pilotos atualizados (3)
🚀 Dados enviados para o GitHub!
```

### 3. Site Atualiza Automaticamente
- GitHub Pages faz rebuild
- React carrega novo `pilotos.json`
- Ranking e Perfil mostram dados atualizados

---

## 🛡️ Segurança

- `.env` do bot não é commitado (`.gitignore`)
- Tokens não são expostos
- Bot rodando 24/7 (Railway/Render grátis)

---

## 🚀 Deploy 24/7

Bot rodando em nuvem grátis:
- **Railway** (recomendado)
- **Render**
- **Replit**

Simplemente conecte seu GitHub e configure `.env`.

---

**Resultado Final:**
- ✅ Zero banco de dados
- ✅ Discord como CMS (gerenciador de conteúdo)
- ✅ GitHub como armazenamento
- ✅ Site atualiza automaticamente
- ✅ Tudo grátis! 🎉
