/**
 * 📊 Dados dos Pilotos da Tucanos Racing BR (Fallback)
 * 
 * Estrutura:
 * - position: Posição no ranking
 * - driver: Nome do piloto
 * - points: Pontos totais (definidos manualmente no Discord)
 * - wins: Número de vitórias
 * - podiums: Número de pódios
 * 
 * Sistema de Pontos:
 * - Pontos são definidos MANUALMENTE no Discord
 * - Formato: "Nome: pontos,vitórias,pódios"
 * - Exemplo: "Brayan Santos: 30,2,2"
 * 
 * Estes dados são um FALLBACK quando pilotos.json não pode ser carregado
 */

export const pilotos = [
  {
    id: 1,
    position: 1,
    driver: 'Brayan Santos',
    points: 30,
    wins: 2,
    podiums: 2,
  },
  {
    id: 2,
    position: 2,
    driver: 'Douglas Barros',
    points: 20,
    wins: 1,
    podiums: 2,
  },
];

/**
 * Buscar piloto por nome (nickname)
 */
export const buscarPilotoPorNome = (nome) => {
  return pilotos.find(
    (piloto) => piloto.driver.toLowerCase() === nome.toLowerCase()
  );
};

/**
 * Retornar ranking ordenado por posição
 */
export const obterRanking = () => {
  return [...pilotos].sort((a, b) => a.position - b.position);
};

/**
 * Retornar estatísticas padrão para piloto não encontrado
 */
export const estatisticasPadrao = {
  races: 0,
  wins: 0,
  podiums: 0,
  points: 0,
};
