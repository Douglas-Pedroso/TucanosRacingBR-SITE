import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import styles from './Layout.module.css';

export function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <div className={styles.navContent}>
          <Link to="/dashboard" className={styles.logo}>
            <img src={`${window.location.pathname.includes('/TucanosRacingBR-SITE/') ? '/TucanosRacingBR-SITE' : ''}/logo.png`} alt="TUCANOS CUP" className={styles.logoImg} />
            <span>TUCANOS CUP</span>
          </Link>

          <div className={styles.navLinks}>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/eventos">Eventos</Link>
            <Link to="/ranking">Ranking</Link>
            <Link to="/perfil">Perfil</Link>
            <Link to="/regras">Regras</Link>
            <Link to="/patrocinadores">Patrocinadores</Link>
          </div>

          <div className={styles.userSection}>
            <span className={styles.userName}>{user?.nickname}</span>
            <button onClick={handleLogout} className={styles.logoutBtn}>
              Sair
            </button>
          </div>
        </div>
      </nav>

      <main className={styles.mainContent}>{children}</main>
    </div>
  );
}
