import { Layout } from '../components/Layout';
import styles from './Patrocinadores.module.css';

function getBasePath() {
  return window.location.pathname.includes('/TucanosRacingBR-SITE/') ? '/TucanosRacingBR-SITE' : '';
}

export function PatrocinidoresPage() {
  const basePath = getBasePath();
  const patrocinadores = [
    {
      id: 1,
      nome: 'Café Honório',
      logo: `${basePath}/cafehonorio.png`,
      descricao: 'Apoiador oficial da Tucanos Cup',
      website: '#',
      isImage: true,
    },
  ];

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>💼 Patrocinadores</h1>
          <p>Conheça os patrocinadores que tornam a Tucanos Cup possível</p>
        </div>

        <div className={styles.info}>
          <h2>Junte-se aos Nossos Patrocinadores</h2>
          <p>
            Interessado em apoiar a Tucanos Cup? Entre em contato conosco e saiba mais sobre
            as oportunidades de patrocínio disponíveis. Sua marca estará associada a uma
            comunidade apaixonada por automobilismo virtual!
          </p>
        </div>

        <div className={styles.grid}>
          {patrocinadores.map((patrocinador) => (
            <div key={patrocinador.id} className={styles.card}>
              <div className={styles.cardIcon}>
                {patrocinador.isImage ? (
                  <img src={patrocinador.logo} alt={patrocinador.nome} className={styles.cardImage} />
                ) : (
                  patrocinador.logo
                )}
              </div>
              <h3>{patrocinador.nome}</h3>
              <p>{patrocinador.descricao}</p>
              {patrocinador.website !== '#' && (
                <a href={patrocinador.website} target="_blank" rel="noopener noreferrer" className={styles.button}>
                  Visitar
                </a>
              )}
            </div>
          ))}
        </div>

        <div className={styles.contact}>
          <h2>Entre em Contato</h2>
          <p>📧 Para informações sobre patrocínio, envie um email para: tucanoscup@gmail.com</p>
        </div>
      </div>
    </Layout>
  );
}
