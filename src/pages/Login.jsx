import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import styles from './Login.module.css';

function getBasePath() {
  const path = window.location.pathname;
  if (path.includes('/TucanosRacingBR-SITE/')) {
    return '/TucanosRacingBR-SITE';
  }
  return '';
}

export function LoginPage() {
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [nicknameFound, setNicknameFound] = useState(null); // null = não verificou, true = encontrado, false = não encontrado
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Verificar se nickname existe no ranking quando usuário para de digitar
  useEffect(() => {
    const timer = setTimeout(() => {
      if (nickname.trim().length >= 3) {
        checkNicknameInRanking(nickname.trim());
      } else {
        setNicknameFound(null);
      }
    }, 500); // Delay de 500ms para não fazer muitas requisições

    return () => clearTimeout(timer);
  }, [nickname]);

  const checkNicknameInRanking = async (nicknameToCheck) => {
    try {
      setLoading(true);
      const basePath = getBasePath();
      const timestamp = new Date().getTime();
      const url = `${basePath}/pilotos.json?t=${timestamp}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        setNicknameFound(null);
        return;
      }

      const data = await response.json();
      if (!data.pilotos || !Array.isArray(data.pilotos)) {
        setNicknameFound(null);
        return;
      }

      // Verificar se o nickname existe (case-insensitive)
      const found = data.pilotos.some(
        (p) => p.nome.toLowerCase() === nicknameToCheck.toLowerCase()
      );

      setNicknameFound(found);
    } catch (err) {
      console.error('Erro ao verificar nickname:', err);
      setNicknameFound(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginPiloto = (e) => {
    e.preventDefault();

    if (!nickname.trim()) {
      setError('Digite um nickname válido');
      return;
    }

    if (nickname.trim().length < 3) {
      setError('O nickname deve ter pelo menos 3 caracteres');
      return;
    }

    // Verificar se o piloto foi encontrado
    if (nicknameFound === false) {
      setError('❌ Esse nickname não está registrado no ranking');
      return;
    }

    if (nicknameFound === null) {
      setError('⏳ Carregando dados do ranking...');
      return;
    }

    // Login como piloto registrado
    login(nickname.trim(), false);
    navigate('/dashboard');
  };

  const handleLoginGuest = (e) => {
    e.preventDefault();

    // Login como convidado - sem necessidade de nickname
    const guestNickname = nickname.trim() || 'Convidado';
    login(guestNickname, true);
    navigate('/dashboard');
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Logo Section */}
        <div className={styles.logoSection}>
          <img 
            src={`${getBasePath()}/tucanoslogo.png`} 
            alt="TUCANOS" 
          />
          <h1>TUCANOS CUP</h1>
          <p>Comunidade de Automobilismo Virtual</p>
        </div>

        {/* Login Card */}
        <div className={styles.card}>
          <form onSubmit={handleLoginPiloto} className={styles.form}>
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

              {/* Indicador de status do nickname */}
              {nickname.trim().length >= 3 && (
                <div className={styles.nicknameStatus}>
                  {loading && (
                    <span className={styles.statusLoading}>⏳ Verificando...</span>
                  )}
                  {!loading && nicknameFound === true && (
                    <span className={styles.statusFound}>✅ Piloto encontrado no ranking!</span>
                  )}
                  {!loading && nicknameFound === false && (
                    <span className={styles.statusNotFound}>❌ Nickname não encontrado no ranking</span>
                  )}
                </div>
              )}

              {error && <span className={styles.error}>{error}</span>}
            </div>

            <button 
              type="submit" 
              className={styles.button}
              disabled={loading || (nicknameFound !== true && nickname.trim().length >= 3)}
            >
              Entrar como Piloto
            </button>

            <button 
              type="button" 
              onClick={handleLoginGuest} 
              className={styles.buttonGuest}
            >
              Entrar como Convidado
            </button>

            <div className={styles.info}>
              <p><strong>Piloto:</strong> Se seu nickname está no ranking, você terá acesso ao seu perfil com estatísticas.</p>
              <p><strong>Convidado:</strong> Acesso completo ao site sem necessidade de estar no ranking.</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
