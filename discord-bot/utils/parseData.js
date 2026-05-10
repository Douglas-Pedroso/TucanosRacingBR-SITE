/**
 * Parse dados do canal #pilotos no formato:
 * "Douglas Pedroso: 25,1,1" (25 pontos, 1 vitória, 1 pódio)
 * "Brayan Santos: 30,2,2"
 * 
 * Retorna apenas a ÚLTIMA menção de cada piloto (ignora versões antigas)
 */
export function parseChannelMessages(messages) {
  const pilotosMapa = {}; // Usar map para evitar duplicatas e pegar a última

  messages.forEach((msg) => {
    const content = msg.content.trim();

    // Ignora mensagens vazias e mensagens de sistema
    if (!content || content.startsWith('Este é o começ')) return;

    // Formato: "Nome: X,Y,Z" onde X = pontos, Y = vitórias, Z = pódios
    const match = content.match(/^(.+?):\s*(\d+),(\d+),(\d+)$/);

    if (match) {
      const nome = match[1].trim();
      const pontos = parseInt(match[2], 10);
      const vitorias = parseInt(match[3], 10);
      const podios = parseInt(match[4], 10);

      // Sobrescreve a versão antiga se o piloto já existir
      // Isso garante que pegamos a ÚLTIMA menção
      pilotosMapa[nome] = {
        nome,
        pontos,
        vitorias,
        podios,
      };
    }
  });

  // Converter mapa de volta para array
  const pilotos = Object.values(pilotosMapa);

  return pilotos;
}

/**
 * Formata pilotos para JSON estruturado
 * Também gerencia datas de cadastro (NUNCA atualiza data de um piloto existente)
 */
export function formatPilotosJSON(pilotos, pilotosAntigos = []) {
  // Criar mapa dos pilotos antigos para busca rápida (case-insensitive)
  const pilotosAntMapa = {};
  if (Array.isArray(pilotosAntigos)) {
    pilotosAntigos.forEach(p => {
      const chave = p.nome?.toLowerCase() || '';
      pilotosAntMapa[chave] = p;
    });
  }

  console.log(`\n🔄 Processando datas de cadastro:`);
  console.log(`   📋 Pilotos antigos no mapa: ${Object.keys(pilotosAntMapa).length}`);

  // Adicionar dataCadastro aos pilotos
  const pilotosComData = pilotos.map(piloto => {
    const pilotoAntigoKey = piloto.nome?.toLowerCase() || '';
    const pilotoAnti = pilotosAntMapa[pilotoAntigoKey];

    // Se o piloto já existia e tem dataCadastro, MANTER a data antiga (NUNCA atualiza!)
    // Se é novo, criar a data de hoje
    let dataCadastro;
    let status = '';

    if (pilotoAnti && pilotoAnti.dataCadastro) {
      // Piloto antigo - PRESERVAR data
      dataCadastro = pilotoAnti.dataCadastro;
      status = '♻️  PRESERVADO (piloto antigo)';
    } else if (pilotoAnti) {
      // Piloto antigo mas sem data - CRIAR data (caso de migração)
      dataCadastro = new Date().toISOString();
      status = '⚠️  NOVO (piloto antigo sem data)';
    } else {
      // Piloto novo - CRIAR data
      dataCadastro = new Date().toISOString();
      status = '✨ NOVO (primeira vez)';
    }

    console.log(`   • ${piloto.nome}: ${status}`);

    return {
      ...piloto,
      dataCadastro, // ISO format: "2026-05-10T13:51:00.000Z"
    };
  });

  console.log(`\n✅ Datas de cadastro processadas corretamente!\n`);

  return {
    pilotos: pilotosComData,
    ultimaAtualizacao: new Date().toISOString(),
    total: pilotosComData.length,
  };
}
