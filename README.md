# 🏁 Tucanos Racing BR - Comunidade de Automobilismo Virtual

Uma aplicação completa em React + Vite para a comunidade **Tucanos Racing BR**, focada no jogo **Assetto Corsa Competizione**.

## ✨ Funcionalidades

### 🔐 Autenticação Simples
- Login com nickname usando localStorage
- Logout com remoção de dados
- Proteção de rotas

### 🖥️ Páginas Disponíveis

- **Dashboard** - Bem-vindo e visão geral da comunidade
- **Eventos** - Lista de corridas com inscrição
- **Ranking** - Posição dos pilotos
- **Comunidade** - Posts e discussões
- **Perfil** - Edição de nickname e preferências
- **Regras** - Normas da comunidade

## 🛠️ Tecnologias

- **React 18** - Interface de usuário
- **Vite** - Build tool rápido
- **React Router v6** - Navegação
- **localStorage** - Persistência de dados
- **CSS Modules** - Estilos componentizados
- **Tema Escuro** - Cores temáticas (verde, amarelo, cinza escuro)

## 📋 Requisitos

- Node.js 16+
- npm ou yarn

## 🚀 Como Iniciar

### 1. Instalação
```bash
git clone <seu-repo>
cd Tucanos
npm install
```

### 2. Desenvolvimento
```bash
npm run dev
```
Acesse: `http://localhost:5173/Tucanos/`

### 3. Build para Produção
```bash
npm run build
```

## 📦 Estrutura do Projeto

```
src/
├── components/
│   ├── Layout.jsx              # Navbar reutilizável
│   ├── ProtectedRoute.jsx      # Proteção de rotas
│   └── Layout.module.css
├── pages/
│   ├── Login.jsx               # Autenticação
│   ├── Dashboard.jsx           # Página inicial
│   ├── Eventos.jsx             # Lista de eventos
│   ├── Ranking.jsx             # Ranking de pilotos
│   ├── Comunidade.jsx          # Posts e comunidade
│   ├── Perfil.jsx              # Perfil do usuário
│   └── Regras.jsx              # Normas da comunidade
├── context/
│   └── AuthContext.jsx         # Gerenciamento de autenticação
├── hooks/
│   ├── useAuth.js              # Hook de autenticação
│   └── useLocalStorage.js      # Hook para localStorage
├── App.jsx                     # Rotas principais
└── index.css                   # Estilos globais
```

## 🎨 Tema

### Cores Principais
- **Preto/Cinza Escuro**: `#0a0e27`, `#1a1f3a`
- **Verde (Tucano)**: `#22c55e`
- **Amarelo (Tucano)**: `#fbbf24`
- **Texto**: `#e0e0e0`

### Responsividade
Aplicação otimizada para:
- Desktop (1400px+)
- Tablet (768px - 1399px)
- Mobile (480px - 767px)

## 🔒 Dados Locais

A aplicação armazena no localStorage:
- `tucano_user` - Dados do usuário logado
- `tucano_participations` - Eventos que o usuário participa
- `tucano_posts` - Posts da comunidade

## 📱 Recursos

### Autenticação
```javascript
// Login
login('MeuNickname')

// Logout
logout()

// Atualizar nickname
updateNickname('NovoNickname')
```

### Eventos
- Lista fixa de corridas
- Inscrição em eventos
- Acompanhamento de participações

### Comunidade
- Publicação de posts (máx. 500 caracteres)
- Exibição de posts em tempo real
- Limite de postagem sem caracteres vazios

## 🚢 Deploy no GitHub Pages

### Configuração Inicial
1. Crie um repositório no GitHub: `https://github.com/seu-usuario/Tucanos`
2. Configure o repositório como público

### Build e Deploy
```bash
# Build da aplicação
npm run build

# Fazer push do código
git add .
git commit -m "Inicial"
git push -u origin main

# GitHub Actions fará o deploy automático
```

### Acessar Aplicação
```
https://seu-usuario.github.io/Tucanos/
```

## 📝 Notas Importantes

1. **Logo**: Coloque sua imagem em `/public/logo.png`
2. **LocalStorage**: Todos os dados são salvos localmente no navegador
3. **Sem Backend**: Esta aplicação não requer servidor backend
4. **Responsiva**: Funciona perfeitamente em todos os dispositivos

## 🔄 Fluxo de Autenticação

```
1. Usuário entra no site
2. Se não tem localStorage tucano_user:
   → Redireciona para /login
3. Se tem dados:
   → Redireciona para /dashboard
4. No logout:
   → Remove dados e volta para /login
```

## 🎯 Exemplo de Uso

### Adicionar um Novo Evento
Edite o array `eventsData` em `src/pages/Eventos.jsx`:

```javascript
{
  id: 7,
  name: 'Seu Evento',
  track: 'Nome da Pista',
  date: '2024-06-10',
  category: 'GT3',
  description: 'Descrição do evento',
  participants: 30,
}
```

### Ajustar Ranking
Edite o array `rankingData` em `src/pages/Ranking.jsx`

## 🤝 Contribuindo

Para adicionar novas funcionalidades:

1. Crie uma branch: `git checkout -b feature/sua-feature`
2. Commit: `git commit -am 'Add nova feature'`
3. Push: `git push origin feature/sua-feature`
4. Abra um Pull Request

## 📄 Licença

Este projeto é de código aberto e pode ser usado livremente pela comunidade.

## 🏆 Tucanos Racing BR

**Comunidade de Automobilismo Virtual**

Conectando pilotos apaixonados por Assetto Corsa Competizione em eventos, competições e amizades.

---

**Desenvolvido com ❤️ para a comunidade brasileira de sim racing**
