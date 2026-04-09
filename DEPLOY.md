# 🚀 Guia Rápido de Deploy

## Deploy no GitHub Pages

### Passo 1: Preparar o Repositório

```bash
# Inicializar git (se não estiver inicializado)
git init
git add .
git commit -m "Inicial - Tucanos Racing BR"

# Adicionar repositório remoto
git remote add origin https://github.com/seu-usuario/Tucanos.git
git branch -M main
git push -u origin main
```

### Passo 2: Configurar GitHub Pages

1. Vá para: `https://github.com/seu-usuario/Tucanos/settings/pages`
2. Em "Build and deployment":
   - Source: **Deploy from a branch**
   - Branch: **gh-pages** / **/root**
3. Salve

### Passo 3: GitHub Actions

O arquivo `.github/workflows/deploy.yml` faz o deploy automático quando você faz push para `main`.

**Primeira execução:**
- GitHub Actions vai automaticamente:
  1. Fazer build: `npm run build`
  2. Gerar pasta `dist/`
  3. Fazer push para branch `gh-pages`
  4. GitHub Pages publica automaticamente

### Passo 4: Acessar a Aplicação

Após 1-2 minutos, sua aplicação estará disponível em:

```
https://seu-usuario.github.io/Tucanos/
```

## ✅ Checklist Antes de Deploy

- [ ] Verificar se logo está em `/public/logo.png`
- [ ] Testar localmente: `npm run dev`
- [ ] Verificar se não tem erros: `npm run lint`
- [ ] Fazer build: `npm run build`
- [ ] Verificar se `dist/` foi gerado corretamente

## 🔧 Troubleshooting

### Aplicação carrega tudo em branco
- Abra DevTools (F12)
- Verifique o Console por erros
- Limpe cache do navegador (Ctrl+Shift+Del)

### GitHub Pages não atualiza
- Verifique em: `https://github.com/seu-usuario/Tucanos/actions`
- Veja o workflow em execução
- Se tiver ❌, clique para ver o erro

### Logo não aparece
- Verifique se arquivo está em `/public/logo.png`
- Tente converter para PNG se estiver em SVG
- Verifique o tamanho (ideal 512x512px)

## 📝 Atualizações Futuras

Após o setup inicial, para qualquer mudança:

```bash
# Fazer mudanças...
git add .
git commit -m "Descrição da mudança"
git push origin main

# GitHub Actions fará deploy automático!
```

## 🎯 Customizações Comuns

### Mudar Nome da Aplicação
1. Edite `package.json` - campo `"name"`
2. Edite `vite.config.js` - campo `base`
3. Edite `index.html` - campo `<title>`

### Mudar Cores
- Edite `src/index.css` ou arquivos `.module.css`
- Cores: Verde `#22c55e`, Amarelo `#fbbf24`

### Adicionar Eventos
- Edite `src/pages/Eventos.jsx` - array `eventsData`

### Mudar Ranking
- Edite `src/pages/Ranking.jsx` - array `rankingData`

## 🆘 Suporte

Qualquer dúvida:
1. Verifique o console do navegador (F12)
2. Verifique os logs do GitHub Actions
3. Consulte o README.md principal
