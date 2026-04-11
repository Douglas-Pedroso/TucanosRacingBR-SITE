import { useState, useEffect } from 'react';

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
        // Tentar múltiplos caminhos
        const urls = [
          '/TucanosRacingBR-SITE/pilotos.json',
          '/pilotos.json',
          './pilotos.json',
        ];

        let response = null;
        let lastError = null;

        for (const url of urls) {
          try {
            const urlComTimestamp = `${url}?t=${Date.now()}`;
            response = await fetch(urlComTimestamp);
            
            if (response.ok) {
              break;
            }
          } catch (err) {
            lastError = err;
          }
        }

        if (!response || !response.ok) {
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
        setPiloto(null);
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
        // Tentar múltiplos caminhos
        const urls = [
          '/TucanosRacingBR-SITE/pilotos.json',
          '/pilotos.json',
          './pilotos.json',
        ];

        let response = null;
        let lastError = null;

        for (const url of urls) {
          try {
            const urlComTimestamp = `${url}?t=${Date.now()}`;
            response = await fetch(urlComTimestamp);
            
            if (response.ok) {
              console.log(`✅ Pilotos carregados de: ${url}`);
              break;
            }
          } catch (err) {
            lastError = err;
            console.warn(`⚠️ Falha em ${url}:`, err.message);
          }
        }

        if (!response || !response.ok) {
          throw new Error('Falha ao carregar dados');
        }

        const dados = await response.json();
        const pilotosFormatados = converterPilotos(dados.pilotos || []);
        setPilotos(pilotosFormatados);
      } catch (err) {
        console.error('Erro ao carregar pilotos:', err);
        setError(err.message);
        setPilotos([]);
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
 * Calcula pontos: 25 por vitória + 8 por pódio
 */
function calcularpuntos(vitorias, podios) {
  return vitorias * 25 + podios * 8;
}

