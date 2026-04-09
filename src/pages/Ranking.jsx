import { Layout } from '../components/Layout';
import { obterRanking } from '../data/pilotos';
import styles from './Ranking.module.css';

export function RankingPage() {
  const rankingData = obterRanking();

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
            <li><strong>1º Lugar:</strong> 25 pontos</li>
            <li><strong>2º Lugar:</strong> 18 pontos</li>
            <li><strong>3º Lugar:</strong> 15 pontos</li>
            <li><strong>4º-10º Lugar:</strong> 12 a 1 ponto progressivos</li>
            <li><strong>Volta Mais Rápida:</strong> 1 ponto extra</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
