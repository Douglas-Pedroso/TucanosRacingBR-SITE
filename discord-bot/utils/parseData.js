/**
 * Parse dados do canal #pilotos no formato:
 * "Douglas Pedroso: 5,2" (5 vitórias, 2 pódios)
 * "Brayan Santos: 3,1"
 */

export function parseChannelMessages(messages) {
  const pilotos = [];

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

      pilotos.push({
        nome,
        vitorias,
        podios,
      });
    }
  });

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
