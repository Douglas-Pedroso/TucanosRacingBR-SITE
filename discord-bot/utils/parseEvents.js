/**
 * Parser para extrair eventos de mensagens no canal #eventos
 * Formato esperado: "Evento: [Nome] [Data] [Hora] [Timezone] - [Jogo/Local]"
 * Exemplo: "Evento: Suzuka 11/04/2026 18:00 Brasília - Assetto Corsa Competizione"
 */

export function parseEventMessage(content) {
  // Procura por padrão "Evento: ..."
  const eventoMatch = content.match(/Evento:\s*(.+)/i);
  if (!eventoMatch) return null;

  const eventoText = eventoMatch[1].trim();

  // Separar jogo/local (depois do -)
  let mainPart = eventoText;
  let jogo = 'ACC';
  
  if (eventoText.includes('-')) {
    const parts = eventoText.split('-');
    mainPart = parts[0].trim();
    jogo = parts.slice(1).join('-').trim(); // Pega tudo depois do primeiro -
  }

  // Tenta fazer parse: Nome Data Hora [hr] Timezone
  // Exemplo: "Suzuka 11/04/2026 18:00 hr Brasília"
  const partes = mainPart.split(/\s+/);

  if (partes.length < 4) return null; // Mínimo: Nome Data Hora Timezone

  const nome = partes[0];
  const data = partes[1];
  const hora = partes[2];
  
  // Timezone: skip "hr" se existir, pegar próxima palavra
  let timezoneIdx = 3;
  if (partes[3].toLowerCase() === 'hr' && partes.length > 4) {
    timezoneIdx = 4;
  }
  const timezone = partes[timezoneIdx];

  // Validar formato de data (DD/MM/YYYY)
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(data)) {
    return null;
  }

  // Validar formato de hora (HH:MM)
  if (!/^\d{2}:\d{2}$/.test(hora)) {
    return null;
  }

  return {
    nome,
    data,
    hora,
    timezone,
    jogo,
  };
}

/**
 * Coleta eventos do canal com reactions + participants
 */
export async function collectEvents(channel, messagesArray) {
  const eventos = [];
  const eventMap = new Map();

  // Primeiro pass: encontrar eventos
  for (const message of messagesArray) {
    const evento = parseEventMessage(message.content);
    if (evento) {
      const eventKey = `${evento.nome}_${evento.data}`;

      // Se já existe, pega o ID da mensagem anterior (primeira menção)
      if (!eventMap.has(eventKey)) {
        eventMap.set(eventKey, {
          ...evento,
          messageId: message.id,
          participantes: [],
        });
      }
    }
  }

  // Segundo pass: coletar reactions
  for (const [messageId, eventData] of eventMap) {
    try {
      const message = await channel.messages.fetch(eventData.messageId);

      // Coletar todos os usuários que reagiram
      const allReactors = new Set();

      for (const reaction of message.reactions.cache.values()) {
        try {
          const users = await reaction.users.fetch();
          for (const user of users.values()) {
            if (!user.bot) {
              allReactors.add(user.username);
            }
          }
        } catch (e) {
          console.error(`Erro ao buscar reactions:`, e.message);
        }
      }

      eventData.participantes = Array.from(allReactors);
    } catch (e) {
      console.error(`Erro ao buscar mensagem de evento:`, e.message);
    }
  }

  return Array.from(eventMap.values());
}

/**
 * Formata eventos com status (ativo/expirado)
 */
export function formatEventosJSON(eventos) {
  const agora = new Date();

  const eventosComStatus = eventos.map((evento) => {
    // Parsear data DD/MM/YYYY HH:MM
    const [dia, mes, ano] = evento.data.split('/').map(Number);
    const [hora, minuto] = evento.hora.split(':').map(Number);

    const dataEvento = new Date(ano, mes - 1, dia, hora, minuto);
    const expirado = dataEvento < agora;

    return {
      ...evento,
      status: expirado ? 'expirado' : 'ativo',
      totalParticipantes: evento.participantes.length,
    };
  });

  return {
    eventos: eventosComStatus,
    ultimaAtualizacao: new Date().toISOString(),
    total: eventosComStatus.length,
  };
}
