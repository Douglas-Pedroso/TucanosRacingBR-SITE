/**
 * Hook para carregar dados de um piloto específico por nome
 */
export function usePiloto(nome) {
  const [piloto, setPiloto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function carregarPiloto() {
      try {
        const response = await fetch('/TucanosRacingBR-SITE/pilotos.json');
        
        if (!response.ok) {
          throw new Error('Falha ao carregar dados');
        }

        const dados = await response.json();
        const pilotosFormatados = converterPilotos(dados.pilotos || []);
        const pilotoEncontrado = pilotosFormatados.find(
          (p) => p.driver.toLowerCase() === nome?.toLowerCase()
        );
        setPiloto(pilotoEncontrado || null);
      } catch (err) {
        console.error('Erro ao carregar piloto:', err);
        setError(err.message);
        // Fallback: buscar nos dados padrão
        const pilotoDefault = getPilotosDefault().find(
          (p) => p.driver.toLowerCase() === nome?.toLowerCase()
        );
        setPiloto(pilotoDefault || null);
      } finally {
        setLoading(false);
      }
    }

    if (nome) {
      carregarPiloto();
    } else {
      setLoading(false);
    }
  }, [nome]);

  return { piloto, loading, error };
}



/**
 * Hook para carregar dados de pilotos do JSON
 * Carrega do arquivo local ou do GitHub (quando em produção)
 */
export function usePilotos() {
  const [pilotos, setPilotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function carregarPilotos() {
      try {
        // Tentar carregar do arquivo local primeiro
        const response = await fetch('/TucanosRacingBR-SITE/pilotos.json');
        
        if (!response.ok) {
          throw new Error('Falha ao carregar dados');
        }

        const dados = await response.json();
        const pilotosFormatados = converterPilotos(dados.pilotos || []);
        setPilotos(pilotosFormatados);
      } catch (err) {
        console.error('Erro ao carregar pilotos:', err);
        setError(err.message);
        // Fallback: dados padrão
        setPilotos(getPilotosDefault());
      } finally {
        setLoading(false);
      }
    }

    carregarPilotos();
  }, []);

  return { pilotos, loading, error };
}

/**
 * Converte dados do bot (nome, vitórias, pódios)
 * para formato do site (driver, wins, podiums, position, points)
 */
function converterPilotos(pilotosBot) {
  return pilotosBot
    .map((piloto, index) => {
      const pontos = calcularpuntos(piloto.vitorias, piloto.podios);
      return {
        id: index + 1,
        position: index + 1,
        driver: piloto.nome,
        wins: piloto.vitorias,
        podiums: piloto.podios,
        races: piloto.vitorias + piloto.podios > 0 ? piloto.vitorias + piloto.podios : 0,
        points: pontos,
      };
    })
    .sort((a, b) => {
      // Ordenar por pontos (decrescente), depois por vitórias
      if (b.points !== a.points) {
        return b.points - a.points;
      }
      return b.wins - a.wins;
    })
    .map((piloto, index) => ({
      ...piloto,
      position: index + 1,
    }));
}

/**
 * Calcula pontos: 10 por vitória + 5 por pódio (não vitória)
 */
function calcularpuntos(vitorias, podios) {
  const pontosPorVitoria = vitorias * 10;
  const pontosPorPodio = (podios - vitorias) * 5; // Pódios que não são vitórias
  return pontosPorVitoria + pontosPorPodio;
}

/**
 * Dados padrão quando arquivo não está disponível
 */
function getPilotosDefault() {
  return [
    {
      id: 1,
      position: 1,
      driver: 'Brayan Santos',
      wins: 2,
      podiums: 2,
      races: 2,
      points: 30,
    },
    {
      id: 2,
      position: 2,
      driver: 'Douglas Barros',
      wins: 1,
      podiums: 2,
      races: 1,
      points: 20,
    },
  ];
}
