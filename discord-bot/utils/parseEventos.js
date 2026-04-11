/**
 * Parse de eventos a partir de mensagens do Discord
 * Formato esperado: "Evento: [Nome] [Data] [Hora] [Timezone]"
 * Exemplo: "Evento: Suzuka 11/04/2026 18:00 Brasília"
 */

export function parseEventoMessage(content) {
  if (!content.toLowerCase().startsWith('evento:')) {
    return null;
  }

  const eventoPart = content.substring(6).trim();
  
  // Regex para extrair: Nome Data Hora Timezone
  // Exemplo: "Suzuka 11/04/2026 18:00 hr Brasília"
  const regex = /^(.+?)\s+(\d{1,2}\/\d{1,2}\/\d{4})\s+(\d{1,2}:\d{2})\s+(?:hr\s+)?(.+)$/;
  const match = eventoPart.match(regex);

  if (!match) {
    console.log('❌ Formato de evento não reconhecido:', eventoPart);
    return null;
  }

  return {
    nome: match[1].trim(),
    data: match[2],
    hora: match[3],
    timezone: match[4].trim(),
  };
}

/**
 * Formata JSON de eventos
 */
export function formatEventosJSON(eventos) {
  return {
    eventos: eventos,
    ultimaAtualizacao: new Date().toISOString(),
    total: eventos.length,
  };
}

/**
 * Calcula status do evento (aberto/expirado)
 */
export function calcularStatusEvento(data, hora) {
  try {
    // Parser: "11/04/2026 18:00"
    const [dia, mes, ano] = data.split('/').map(Number);
    const [h, m] = hora.split(':').map(Number);

    // Criar data em UTC (assumindo que a data é em tempo local)
    const eventoDate = new Date(ano, mes - 1, dia, h, m, 0);
    const agora = new Date();

    return agora > eventoDate ? 'expirado' : 'aberto';
  } catch (error) {
    console.error('❌ Erro ao calcular status:', error);
    return 'desconhecido';
  }
}

/**
 * Extrai eventos de um array de mensagens
 * @param {Array} messages - Array de mensagens do Discord
 * @returns {Array} Array de eventos únicos com estrutura completa
 */
export function extrairEventosDesMensagens(messages) {
  const eventosMap = new Map(); // Usar Map para evitar duplicatas

  messages.forEach((msg) => {
    if (!msg.content) return;

    const evento = parseEventoMessage(msg.content);
    if (!evento) return;

    // Usar combinação nome+data como chave única
    const chave = `${evento.nome}|${evento.data}|${evento.hora}`;

    // Se ainda não existe ou a mensagem atual é mais recente, usar esta
    if (!eventosMap.has(chave) || msg.id > eventosMap.get(chave).messageId) {
      eventosMap.set(chave, {
        messageId: msg.id,
        channelId: msg.channelId,
        ...evento,
        participantes: [],
        totalParticipantes: 0,
        status: calcularStatusEvento(evento.data, evento.hora),
      });
    }
  });

  // Converter Map para Array
  return Array.from(eventosMap.values());
}

/**
 * Processa reações em mensagens de eventos
 * @param {Array} events - Array de eventos
 * @param {Object} client - Cliente Discord para buscar reações
 * @returns {Promise<Array>} Array de eventos com participantes
 */
export async function processarReacoes(eventos, client) {
  const eventosComParticipantes = [];

  for (const evento of eventos) {
    try {
      const channel = await client.channels.fetch(evento.channelId);
      const message = await channel.messages.fetch(evento.messageId);

      // Coletar todas as reações
      const participantesSet = new Set();

      for (const [reactionEmoji, reactionObj] of message.reactions.cache) {
        // Buscar todos os users que reagiram com este emoji
        const users = await reactionObj.users.fetch();
        
        // Adicionar ao conjunto (excluindo o bot)
        users.forEach((user) => {
          if (!user.bot) {
            participantesSet.add({
              username: user.username,
              userId: user.id,
              displayName: user.displayName || user.username,
            });
          }
        });
      }

      evento.participantes = Array.from(participantesSet);
      evento.totalParticipantes = evento.participantes.length;
      eventosComParticipantes.push(evento);
    } catch (error) {
      console.error(`❌ Erro ao processar reações do evento ${evento.nome}:`, error.message);
      evento.participantes = [];
      evento.totalParticipantes = 0;
      eventosComParticipantes.push(evento);
    }
  }

  return eventosComParticipantes;
}
