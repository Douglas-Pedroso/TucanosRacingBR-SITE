import { Layout } from '../components/Layout';
import styles from './Regras.module.css';

export function RegrasPage() {
  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>📜 Regras da Comunidade</h1>
          <p>Normas e diretrizes para uma experiência segura e divertida</p>
        </div>

        <div className={styles.content}>
          <section className={styles.section}>
            <h2>🏁 Regras de Conduta nas Corridas</h2>
            <div className={styles.rules}>
              <div className={styles.rule}>
                <h4>1. Respeito Mútuo</h4>
                <p>
                  Toda competição deve se basear no respeito entre os pilotos. Comportamentos agressivos,
                  provocativos ou desrespeitosos resultarão em advertências ou banimento.
                </p>
              </div>

              <div className={styles.rule}>
                <h4>2. Corrida Limpa</h4>
                <p>
                  Comportamento de corrida agressivo não é tolerado. Manobras perigosas, colisões
                  premeditadas ou bloqueios excessivos são proibidos. Use racecraft, não força bruta.
                </p>
              </div>

              <div className={styles.rule}>
                <h4>3. Diversidade de Pistas</h4>
                <p>
                  Apreciamos corridas em diferentes pistas. Participar de eventos variados enriquece a
                  experiência de todos. Incentivamos experimentar novos circuitos!
                </p>
              </div>

              <div className={styles.rule}>
                <h4>4. Pontualidade</h4>
                <p>
                  Eventos começam no horário programado. Chegue com antecedência para preparar seu
                  carro e verificar as condições da pista. Ausências frequentes podem resultar em
                  exclusão de eventos.
                </p>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2>💬 Regras de Convivência na Comunidade</h2>
            <div className={styles.rules}>
              <div className={styles.rule}>
                <h4>5. Linguagem Apropriada</h4>
                <p>
                  Proibido: linguagem ofensiva, xingamentos, discriminação de qualquer natureza,
                  discurso de ódio. Queremos um ambiente acolhedor para todos.
                </p>
              </div>

              <div className={styles.rule}>
                <h4>6. Sem Spam ou Propaganda</h4>
                <p>
                  Não divulgue conteúdo spam, links maliciosos ou propaganda comercial. Se deseja
                  compartilhar algo relevante, converse com os moderadores.
                </p>
              </div>

              <div className={styles.rule}>
                <h4>7. Respeito à Privacidade</h4>
                <p>
                  Não compartilhe dados pessoais de outros membros sem consentimento. Não divulgue
                  informações sensíveis em posts públicos.
                </p>
              </div>

              <div className={styles.rule}>
                <h4>8. Sem Provocações Fora da Pista</h4>
                <p>
                  Rivalidades nascidas na pista ficam na pista. Na comunidade, mantenha um tom
                  respeitoso e amigável com todos os membros.
                </p>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2>⚖️ Sistema de Penalidades</h2>
            <div className={styles.penalties}>
              <div className={styles.penalty}>
                <h4>Advertência</h4>
                <p>
                  Para infrações leves. O membro será notificado e poderá corrigir o comportamento.
                </p>
              </div>

              <div className={styles.penalty}>
                <h4>Suspensão Temporária</h4>
                <p>
                  Para infrações moderadas. O membro fica impedido de participar de eventos por um
                  período determinado.
                </p>
              </div>

              <div className={styles.penalty}>
                <h4>Banimento Permanente</h4>
                <p>
                  Para infrações graves ou reincidência. O membro é removido da comunidade
                  permanentemente.
                </p>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2>🎯 Boas Práticas Recomendadas</h2>
            <ul className={styles.recommendations}>
              <li>Dar feedback construtivo ao invés de críticas negativas</li>
              <li>Ajudar pilotos novatos com dicas e orientações</li>
              <li>Participate ativamente dos eventos e das discussões</li>
              <li>Reporte comportamentos inadequados aos moderadores</li>
              <li>Mantenha um setup de carro competitivo mas justo</li>
              <li>Respeite os limites de pista - sem cortes</li>
              <li>Comemore vitórias com humildade, perdas com dignidade</li>
              <li>Divirta-se! O mais importante é a paixão por automobilismo</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>📞 Contato e Denúncias</h2>
            <p className={styles.contact}>
              Se você presenciar violação de regras ou tiver denúncias, reporte aos moderadores
              através da comunidade. Todas as denúncias serão analisadas de forma justa e confidencial.
            </p>
          </section>

          <div className={styles.footer}>
            <p>
              ✓ Ao participar da Tucanos Racing BR, você concorda em seguir todas as regras acima e
              contribuir para manter nossa comunidade segura e acolhedora.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
