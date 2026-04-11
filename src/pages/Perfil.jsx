import { useState } from 'react';
import { Layout } from '../components/Layout';
import { useAuth } from '../hooks/useAuth';
import { usePiloto } from '../hooks/useRanking';
import styles from './Perfil.module.css';

export function PerfilPage() {
  const { user, updateNickname } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [newNickname, setNewNickname] = useState(user?.nickname || '');
  const [error, setError] = useState('');

  // Buscar dados do piloto logado
  const { piloto: pilotData } = usePiloto(user?.nickname);
  const isPilotNotRegistered = !pilotData;
  const corridas = pilotData?.races || 0;
  const vitorias = pilotData?.wins || 0;
  const podios = pilotData?.podiums || 0;
  const pontos = pilotData?.points || 0;

  const handleSave = (e) => {
    e.preventDefault();

    if (!newNickname.trim()) {
      setError('Nickname não pode estar vazio');
      return;
    }

    if (newNickname.trim().length < 3) {
      setError('Nickname deve ter pelo menos 3 caracteres');
      return;
    }

    updateNickname(newNickname.trim());
    setIsEditing(false);
    setError('');
  };

  const handleCancel = () => {
    setNewNickname(user?.nickname || '');
    setIsEditing(false);
    setError('');
  };

  const joinedDate = new Date(user?.joinedAt).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>👤 Meu Perfil</h1>
          <p>Gerencie suas informações pessoais</p>
        </div>

        <div className={styles.grid}>
          <div className={styles.profileCard}>
            <div className={styles.profileHeader}>
              <div className={styles.profileAvatar}>👤</div>
              <div>
                <h2>{user?.nickname}</h2>
                <p>Piloto da Comunidade Tucanos Racing BR</p>
              </div>
            </div>

            <div className={styles.profileInfo}>
              <div className={styles.infoItem}>
                <span className={styles.label}>ID do Piloto</span>
                <span className={styles.value}>{user?.id}</span>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.label}>Membro desde</span>
                <span className={styles.value}>{joinedDate}</span>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.label}>Status</span>
                <span className={`${styles.value} ${styles.statusActive}`}>🟢 Ativo</span>
              </div>
            </div>
          </div>

          <div className={styles.settingsCard}>
            <h3>Editar Nickname</h3>

            {!isEditing ? (
              <>
                <div className={styles.nicknameDisplay}>
                  <p className={styles.currentNickname}>{user?.nickname}</p>
                  <button onClick={() => setIsEditing(true)} className={styles.editBtn}>
                    Editar
                  </button>
                </div>
              </>
            ) : (
              <form onSubmit={handleSave} className={styles.editForm}>
                <div className={styles.formGroup}>
                  <label htmlFor="nickname">Novo Nickname</label>
                  <input
                    id="nickname"
                    type="text"
                    value={newNickname}
                    onChange={(e) => {
                      setNewNickname(e.target.value);
                      setError('');
                    }}
                    className={styles.input}
                    maxLength={30}
                    autoFocus
                  />
                  {error && <span className={styles.error}>{error}</span>}
                </div>

                <div className={styles.buttonGroup}>
                  <button type="submit" className={styles.saveBtn}>
                    Salvar
                  </button>
                  <button type="button" onClick={handleCancel} className={styles.cancelBtn}>
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        <div className={styles.statsCard}>
          <h3>📊 Estatísticas</h3>
          {isPilotNotRegistered ? (
            <div className={styles.notRegisteredMessage}>
              <p>❌ Piloto Não cadastrado</p>
            </div>
          ) : (
            <div className={styles.statsGrid}>
              <div className={styles.stat}>
                <span className={styles.statValue}>{corridas}</span>
                <span className={styles.statLabel}>Corridas Disputadas</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>{vitorias}</span>
                <span className={styles.statLabel}>Vitórias</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>{podios}</span>
                <span className={styles.statLabel}>Pódios</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>{pontos}</span>
                <span className={styles.statLabel}>Pontos Totais</span>
              </div>
            </div>
          )}
        </div>

        <div className={styles.preferencesCard}>
          <h3>Preferências</h3>
          <div className={styles.preference}>
            <label>
              <input type="checkbox" defaultChecked />
              <span>Receber notificações de novos eventos</span>
            </label>
          </div>
          <div className={styles.preference}>
            <label>
              <input type="checkbox" defaultChecked />
              <span>Receber notificações de novos posts na comunidade</span>
            </label>
          </div>
          <div className={styles.preference}>
            <label>
              <input type="checkbox" defaultChecked />
              <span>Mostrar meu perfil para outros pilotos</span>
            </label>
          </div>
        </div>
      </div>
    </Layout>
  );
}
