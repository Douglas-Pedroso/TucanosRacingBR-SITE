import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import styles from './Login.module.css';

export function LoginPage() {
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nickname.trim()) {
      setError('Digite um nickname válido');
      return;
    }

    if (nickname.trim().length < 3) {
      setError('O nickname deve ter pelo menos 3 caracteres');
      return;
    }

    login(nickname.trim());
    navigate('/dashboard');
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <img src="/logo.png" alt="Tucanos Racing BR" className={styles.logo} />
          <h1>Tucanos Racing BR</h1>
          <p>Comunidade de Automobilismo Virtual</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="nickname">Seu Nickname</label>
            <input
              id="nickname"
              type="text"
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                setError('');
              }}
              placeholder="Digite seu apelido na comunidade"
              className={styles.input}
              maxLength={30}
            />
            {error && <span className={styles.error}>{error}</span>}
          </div>

          <button type="submit" className={styles.button}>
            Entrar
          </button>

          <div className={styles.info}>
            <p>Bem-vindo à comunidade de pilotos virtuais mais apaixonados!</p>
            <p>Escolha um nickname e comece sua jornada no Assetto Corsa Competizione.</p>
          </div>
        </form>
      </div>
    </div>
  );
}
