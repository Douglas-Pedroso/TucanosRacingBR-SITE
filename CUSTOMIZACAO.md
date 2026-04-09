# 📋 Arquivo de Configuração de Dados

Este arquivo contém exemplos de como customizar os dados da aplicação.

## 🏎️ Eventos - `src/pages/Eventos.jsx`

### Adicionar Novo Evento

```javascript
{
  id: 7,
  name: 'Seu Nome de Evento',
  track: 'Nome da Pista',
  date: '2024-06-10',
  category: 'Categoria do Veículo',
  description: 'Descrição detalhada da corrida',
  participants: 30,
}
```

### Categorias de Veículos Sugeridas
- GT3
- GT4
- LMP2
- LMP3
- Porsche 992 GT2 RS
- BMW M4 GT3
- Ferrari 296 GT3
- Mercedes-AMG GT3
- Lamborghini Revuelto GT3

### Pistas Populares (Assetto Corsa)
- Monza
- Suzuka
- Spa-Francorchamps
- Nürburgring
- Le Mans
- Silverstone
- Interlagos
- Battersea Park
- Donington Park
- Mugello

## 🏆 Ranking - `src/pages/Ranking.jsx`

### Adicionar Novo Piloto

```javascript
{
  position: 11,
  driver: 'NomeDoDrivers',
  points: 2100,
  wins: 2,
  podiums: 12,
}
```

### Sistema de Pontos Padrão
- 1º Lugar: 25 pontos
- 2º Lugar: 18 pontos
- 3º Lugar: 15 pontos
- 4º Lugar: 12 pontos
- 5º Lugar: 10 pontos
- 6º Lugar: 8 pontos
- 7º Lugar: 6 pontos
- 8º Lugar: 4 pontos
- 9º Lugar: 2 pontos
- 10º Lugar: 1 ponto
- Volta Mais Rápida: +1 ponto

## 💬 Comunidade - `src/pages/Comunidade.jsx`

Posts são salvos em localStorage automaticamente como:

```javascript
{
  id: timestamp,
  author: 'nickname_do_usuario',
  content: 'Texto do post',
  timestamp: '2024-04-09T...',
  likes: 0,
}
```

Nenhuma configuração necessária - funciona automaticamente!

## 📜 Regras - `src/pages/Regras.jsx`

Para editar as regras, modifique o conteúdo do arquivo `src/pages/Regras.jsx`.

Seções principais:
- 🏁 Regras de Conduta nas Corridas
- 💬 Regras de Convivência na Comunidade
- ⚖️ Sistema de Penalidades
- 🎯 Boas Práticas Recomendadas
- 📞 Contato e Denúncias

## 🎨 Tema e Cores

### Localização: `src/index.css` e arquivos `.module.css`

```css
/* Cores Principais */
--dark-bg: #0a0e27;
--dark-card: #1a1f3a;
--green: #22c55e;
--yellow: #fbbf24;
--text: #e0e0e0;
--text-secondary: #a0aabf;
```

### Como Alterar o Tema

1. **Cor Verde:** Substitua `#22c55e` pela cor desejada
2. **Cor Amarela:** Substitua `#fbbf24` pela cor desejada
3. **Fundo Escuro:** Substitua `#0a0e27` pela cor desejada
4. **Fundos de Componentes:** Substitua `#1a1f3a` pela cor desejada

## 📱 Mensagens Customizáveis

### Login - `src/pages/Login.jsx`

```javascript
<h1>Tucanos Racing BR</h1>
<p>Comunidade de Automobilismo Virtual</p>
<input placeholder="Digite seu apelido na comunidade" />
<button>Entrar</button>
```

### Dashboard - `src/pages/Dashboard.jsx`

```javascript
<h1>Bem-vindo, {user?.nickname}! 🏁</h1>
<p>Bem-vindo à família de pilotos virtuais Tucanos Racing BR</p>
```

### Comunidade - `src/pages/Comunidade.jsx`

```javascript
<p>Compartilhe seus pensamentos sobre as corridas... 🏁</p>
<span>Nenhuma postagem ainda. Seja o primeiro a publicar! 🎯</span>
```

## 🔄 Fluxo de Customização Recomendado

1. **Edite dados primeiro** (eventos, ranking, regras)
2. **Customize cores** no CSS
3. **Altere mensagens** nos componentes
4. **Teste localmente** com `npm run dev`
5. **Faça build** com `npm run build`
6. **Deploy** para GitHub Pages

## 🎯 Exemplo Completo de Customização

### Adicionar Novo Evento e Piloto

```javascript
// 1. Evento novo em src/pages/Eventos.jsx
{
  id: 7,
  name: 'Sprint de Monza',
  track: 'Monza',
  date: '2024-06-15',
  category: 'GT3',
  description: 'Corrida sprint no famoso circuito italiano',
  participants: 28,
}

// 2. Novo piloto em src/pages/Ranking.jsx
{
  position: 11,
  driver: 'MeuNickname',
  points: 2050,
  wins: 2,
  podiums: 11,
}

// 3. Testar:
npm run dev

// 4. Build e Deploy:
npm run build
git add .
git commit -m "Adicionar novo evento e piloto"
git push origin main
```

## 📊 Estrutura de Dados Completa

### Usuário (localStorage.tucano_user)
```json
{
  "nickname": "string",
  "id": "number (timestamp)",
  "joinedAt": "ISO string"
}
```

### Participações (localStorage.tucano_participations)
```json
["id_evento_1", "id_evento_2"]
```

### Posts (localStorage.tucano_posts)
```json
[
  {
    "id": "number (timestamp)",
    "author": "string",
    "content": "string",
    "timestamp": "ISO string",
    "likes": "number"
  }
]
```

## ✅ Checklist de Customização

- [ ] Adicionar/editar eventos
- [ ] Adicionar/editar pilotos no ranking
- [ ] Customizar cores (se desejado)
- [ ] Editar mensagens (se desejado)
- [ ] Editar regras da comunidade
- [ ] Testar localmente
- [ ] Fazer build
- [ ] Fazer deploy

---

Para mais detalhes, veja `README.md` e `DEPLOY.md`
