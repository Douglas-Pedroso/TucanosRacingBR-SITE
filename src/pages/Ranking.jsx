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
          <ul>
            <li><strong>Vitória:</strong> 25 pontos</li>
            <li><strong>Pódio (2º ou 3º):</strong> 8 pontos adicionais</li>
            <li>Os dados são carregados automaticamente do Discord</li>
            <li>O ranking é atualizado toda vez que é feito deploy no Discord</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
