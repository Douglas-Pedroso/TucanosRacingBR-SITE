/**
 * 📊 Dados dos Pilotos da Tucanos Racing BR
 * 
 * Estrutura:
 * - position: Posição no ranking
 * - driver: Nome do piloto
 * - wins: Número de vitórias
 * - podiums: Número de pódios (incluindo vitórias)
 * - races: Corridas disputadas
 * - points: Pontos totais
 * 
 * Sistema de Pontos:
 * - Vitória: 10 pontos
 * - Pódio: 5 pontos
 */

export const pilotos = [
  {
    id: 1,
    position: 1,
    driver: 'Brayan Santos',
    wins: 2,
    podiums: 2,
    races: 2,
    points: 30, // 2 vitórias (10+10) + 2 pódios (5+5)
  },
  {
    id: 2,
    position: 2,
    driver: 'Douglas Barros',
    wins: 1,
    podiums: 2,
    races: 1,
    points: 20, // 1 vitória (10) + 2 pódios (5+5)
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
