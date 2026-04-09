import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { useLocalStorage } from '../hooks/useLocalStorage';
import styles from './Eventos.module.css';

// 📌 Lista de eventos
// Adicione novos eventos aqui quando quiser criar corridas
// Exemplo de evento:
// {
//   id: 1,
//   name: 'Nome do Evento',
//   track: 'Nome da Pista',
//   date: '2024-04-15',
//   category: 'GT3',
//   description: 'Descrição da corrida',
//   participants: 30,
// }

const eventsData = [];

export function EventosPage() {
  const [participations, setParticipations] = useLocalStorage('tucano_participations', []);
  const user = JSON.parse(localStorage.getItem('tucano_user'));

  const handleParticipate = (eventId) => {
    if (participations.includes(eventId)) {
      setParticipations(participations.filter((id) => id !== eventId));
    } else {
      setParticipations([...participations, eventId]);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      weekday: 'short',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>🏎️ Eventos</h1>
          <p>Confira todos os eventos e participe das corridas</p>
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statValue}>{eventsData.length}</span>
            <span className={styles.statLabel}>Eventos Disponíveis</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{participations.length}</span>
            <span className={styles.statLabel}>Eventos Inscritos</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{eventsData.reduce((a, e) => a + e.participants, 0)}</span>
            <span className={styles.statLabel}>Pilotos Totais</span>
          </div>
        </div>

        <div className={styles.eventsGrid}>
          {eventsData.map((event) => (
            <div key={event.id} className={styles.eventCard}>
              <div className={styles.eventHeader}>
                <h3>{event.name}</h3>
                <span className={styles.category}>{event.category}</span>
              </div>

              <div className={styles.eventDetails}>
                <div className={styles.detail}>
                  <span className={styles.icon}>📍</span>
                  <span>{event.track}</span>
                </div>
                <div className={styles.detail}>
                  <span className={styles.icon}>📅</span>
                  <span>{formatDate(event.date)}</span>
                </div>
                <div className={styles.detail}>
                  <span className={styles.icon}>👥</span>
                  <span>{event.participants} pilotos participando</span>
                </div>
              </div>

              <p className={styles.description}>{event.description}</p>

              <button
                onClick={() => handleParticipate(event.id)}
                className={`${styles.button} ${
                  participations.includes(event.id) ? styles.participating : ''
                }`}
              >
                {participations.includes(event.id) ? '✓ Inscrito' : 'Participar'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
