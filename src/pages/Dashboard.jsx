import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import styles from './Dashboard.module.css';

export function DashboardPage() {
  const user = JSON.parse(localStorage.getItem('tucano_user'));
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.hero}>
          <h1>Bem-vindo, {user?.nickname}! 🏁</h1>
          <p>Bem vindos à Tucanos Cup</p>
        </div>

        <div className={styles.grid}>
          <div className={styles.card} onClick={() => handleNavigate('/perfil')}>
            <div className={styles.cardIcon}>👤</div>
            <h3>Perfil</h3>
            <p>Confira e edite suas informações</p>
          </div>

          <div className={styles.card} onClick={() => handleNavigate('/eventos')}>
            <div className={styles.cardIcon}>🏎️</div>
            <h3>Eventos</h3>
            <p>Participe de corridas eletrizantes</p>
          </div>

          <div className={styles.card} onClick={() => handleNavigate('/ranking')}>
            <div className={styles.cardIcon}>🏆</div>
            <h3>Ranking</h3>
            <p>Veja o desempenho dos pilotos</p>
          </div>

          <div className={styles.card} onClick={() => handleNavigate('/regras')}>
            <div className={styles.cardIcon}>📜</div>
            <h3>Regras</h3>
            <p>Conheça as normas da comunidade</p>
          </div>

          <div className={styles.card} onClick={() => handleNavigate('/perfil')}>
            <div className={styles.cardIcon}>🎯</div>
            <h3>Meu Progresso</h3>
            <p>Acompanhe sua evolução</p>
          </div>
        </div>

        <div className={styles.recentActivity}>
          <h2>Atividade Recente</h2>
          <div className={styles.timeline}>
            <div className={styles.timelineItem}>
              <div className={styles.timelineMarker}></div>
              <div className={styles.timelineContent}>
                <h4>Bem-vindo à Tucanos Cup</h4>
                <p>Pronto para competir? Confira os eventos e junte-se à corrida!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
