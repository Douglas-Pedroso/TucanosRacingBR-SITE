import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useEventos } from '../hooks/useEventos';
import styles from './Eventos.module.css';

// 📌 Carrega eventos do arquivo JSON (gerado pelo bot)

export function EventosPage() {
  const { eventos, loading, error } = useEventos();
  const [participations, setParticipations] = useLocalStorage('tucano_participations', []);
  const user = JSON.parse(localStorage.getItem('tucano_user'));

  const handleParticipate = (eventId) => {
    if (participations.includes(eventId)) {
      setParticipations(participations.filter((id) => id !== eventId));
    } else {
      setParticipations([...participations, eventId]);
    }
  };

  const formatDate = (dateStr) => {
    try {
      const [dia, mes, ano] = dateStr.split('/').map(Number);
      const date = new Date(ano, mes - 1, dia);
      return date.toLocaleDateString('pt-BR', {
        weekday: 'short',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const totalParticipantes = eventos.reduce((sum, e) => sum + (e.totalParticipantes || 0), 0);

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>🏎️ Eventos</h1>
          <p>Confira todos os eventos e participe das corridas</p>
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statValue}>{eventos.length}</span>
            <span className={styles.statLabel}>Eventos Disponíveis</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{participations.length}</span>
            <span className={styles.statLabel}>Eventos Inscritos</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{totalParticipantes}</span>
            <span className={styles.statLabel}>Pilotos Totais</span>
          </div>
        </div>

        <div className={styles.eventsGrid}>
          {loading && <p>Carregando eventos...</p>}
          {error && <p>❌ Erro ao carregar eventos: {error}</p>}
          {!loading && eventos.length === 0 && <p>Nenhum evento disponível no momento</p>}
          
          {eventos.map((evento, idx) => {
            const statusEmoji = evento.status === 'expirado' ? '⏰' : '🔴';
            const statusText = evento.status === 'expirado' ? 'EXPIRADO' : 'ATIVO';
            
            return (
              <div key={idx} className={styles.eventCard}>
                <div className={styles.eventHeader}>
                  <h3>{evento.nome} <span className={styles.game}>🎮 {evento.jogo || 'ACC'}</span></h3>
                  <span className={`${styles.category} ${evento.status === 'expirado' ? styles.expired : ''}`}>
                    {statusEmoji} {statusText}
                  </span>
                </div>

                <div className={styles.eventDetails}>
                  <div className={styles.detail}>
                    <span className={styles.icon}>🕐</span>
                    <span>{evento.timezone}</span>
                  </div>
                  <div className={styles.detail}>
                    <span className={styles.icon}>📅</span>
                    <span>{formatDate(evento.data)} às {evento.hora}</span>
                  </div>
                  <div className={styles.detail}>
                    <span className={styles.icon}>👥</span>
                    <span>{evento.totalParticipantes} participantes inscritos</span>
                  </div>
                </div>

                <p className={styles.description}>
                  {evento.participantes.length > 0 
                    ? `Participantes: ${evento.participantes.join(', ')}`
                    : 'Nenhum participante ainda. Reaja no Discord para se inscrever!'}
                </p>

                <button
                  onClick={() => window.open('https://discord.gg/p8NEksdQnx', '_blank')}
                  className={`${styles.button} ${
                    participations.includes(idx) ? styles.participating : ''
                  }`}
                  disabled={evento.status === 'expirado'}
                >
                  {evento.status === 'expirado' 
                    ? '❌ Evento Expirado'
                    : '💬 Ir para Discord'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
