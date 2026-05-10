import { Layout } from '../components/Layout';
import { useRanking } from '../hooks/useRanking';
import styles from './Ranking.module.css';

export function RankingPage() {
  const { pilotos: rankingData, loading, error } = useRanking();

  const getPositionColor = (position) => {
    if (position === 1) return '#fbbf24';
    if (position === 2) return '#a1a1a1';
    if (position === 3) return '#d4843a';
    return '#e0e0e0';
  };

  const getMedalEmoji = (position) => {
    if (position === 1) return '🥇';
    if (position === 2) return '🥈';
    if (position === 3) return '🥉';
    return `#${position}`;
  };

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>🏆 Ranking Geral</h1>
          <p>Melhores pilotos da temporada</p>
        </div>

        {loading && <p className={styles.loading}>⏳ Carregando dados...</p>}
        {error && <p className={styles.error}>⚠️ Erro ao carregar dados: {error}</p>}

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Piloto</th>
                <th>Pontos</th>
                <th>Vitórias</th>
                <th>Pódios</th>
              </tr>
            </thead>
            <tbody>
              {rankingData.map((driver) => (
                <tr
                  key={driver.position}
                  className={`${styles.row} ${driver.position <= 3 ? styles.topThree : ''}`}
                >
                  <td className={styles.position} style={{ color: getPositionColor(driver.position) }}>
                    <span className={styles.medal}>{getMedalEmoji(driver.position)}</span>
                  </td>
                  <td className={styles.driver}>
                    <span className={styles.driverName}>{driver.driver}</span>
                  </td>
                  <td className={styles.points}>
                    <span className={styles.pointsValue}>{driver.points.toLocaleString()}</span>
                  </td>
                  <td className={styles.wins}>{driver.wins}</td>
                  <td className={styles.podiums}>{driver.podiums}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.info}>
          <h3>Como Funciona o Ranking?</h3>
          <p><strong>Sistema de Pontos por Posição:</strong></p>
          <ul>
            <li>🥇 1º lugar: 25 pontos</li>
            <li>🥈 2º lugar: 20 pontos</li>
            <li>🥉 3º lugar: 16 pontos</li>
            <li>4º lugar: 13 pontos</li>
            <li>5º lugar: 11 pontos</li>
            <li>6º lugar: 10 pontos</li>
            <li>7º lugar: 9 pontos</li>
            <li>8º lugar: 8 pontos</li>
            <li>9º lugar: 7 pontos</li>
            <li>10º lugar: 6 pontos</li>
            <li>11º lugar: 5 pontos</li>
            <li>12º lugar: 4 pontos</li>
            <li>13º lugar: 3 pontos</li>
            <li>14º lugar: 2 pontos</li>
            <li>15º lugar: 1 ponto</li>
          </ul>
          <p><strong>Extras:</strong></p>
          <ul>
            <li>🎯 Pole Position: +1 ponto</li>
            <li>⚡ Volta Rápida: +1 ponto</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
