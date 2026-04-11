/**
 * Parse dados do canal #pilotos no formato:
 * "Douglas Pedroso: 5,2" (5 vitórias, 2 pódios)
 * "Brayan Santos: 3,1"
 * 
 * Retorna apenas a ÚLTIMA menção de cada piloto (ignora versões antigas)
 */
export function parseChannelMessages(messages) {
  const pilotosMapa = {}; // Usar map para evitar duplicatas e pegar a última

  messages.forEach((msg) => {
    const content = msg.content.trim();

    // Ignora mensagens vazias e mensagens de sistema
    if (!content || content.startsWith('Este é o começ')) return;

    // Formato: "Nome: X,Y" onde X = vitórias, Y = pódios
    const match = content.match(/^(.+?):\s*(\d+),(\d+)$/);

    if (match) {
      const nome = match[1].trim();
      const vitorias = parseInt(match[2], 10);
      const podios = parseInt(match[3], 10);

      // Sobrescreve a versão antiga se o piloto já existir
      // Isso garante que pegamos a ÚLTIMA menção
      pilotosMapa[nome] = {
        nome,
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
 */
export function formatPilotosJSON(pilotos) {
  return {
    pilotos,
    ultimaAtualizacao: new Date().toISOString(),
    total: pilotos.length,
  };
}
