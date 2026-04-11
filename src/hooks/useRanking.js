import { useState, useEffect } from 'react';

/**
 * Hook para carregar dados de pilotos do JSON e calcular ranking
 * Carrega de: src/data/pilotos.json
 * Calcula pontos: Vitória = 25 pts, Pódio extra = 8pts
 */
export function useRanking() {
  const [pilotos, setPilotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const carregarPilotos = async () => {
      try {
        setLoading(true);
        
        // Carregar o JSON da pasta public
        const response = await fetch('/TucanosRacingBR-SITE/pilotos.json');
        
        if (!response.ok) {
          throw new Error('Erro ao carregar dados de pilotos');
        }

        const data = await response.json();
        
        // Processar dados: calcular pontos e ordenar
        const pilotosProcessados = data.pilotos.map((piloto, index) => {
          // Cálculo de pontos: 25 por vitória + 8 por pódio
          const pontos = piloto.vitorias * 25 + piloto.podios * 8;
          
          return {
            position: index + 1,
            driver: piloto.nome,
            wins: piloto.vitorias,
            podiums: piloto.podios,
            points: pontos,
          };
        });

        // Ordenar por pontos (decrescente)
        pilotosProcessados.sort((a, b) => b.points - a.points);

        // Atualizar posições após ordenar
        pilotosProcessados.forEach((piloto, index) => {
          piloto.position = index + 1;
        });

        setPilotos(pilotosProcessados);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar pilotos:', err);
        setError(err.message);
        setPilotos([]);
      } finally {
        setLoading(false);
      }
    };

    carregarPilotos();
  }, []);

  return { pilotos, loading, error };
}

/**
 * Hook para obter dados de um piloto específico
 */
export function usePiloto(nome) {
  const [piloto, setPiloto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const carregarPiloto = async () => {
      try {
        setLoading(true);
        
        const response = await fetch('/TucanosRacingBR-SITE/pilotos.json');
        
        if (!response.ok) {
          throw new Error('Erro ao carregar dados de pilotos');
        }

        const data = await response.json();
        
        // Encontrar o piloto pelo nome
        const pilotoEncontrado = data.pilotos.find(
          (p) => p.nome.toLowerCase() === nome.toLowerCase()
        );

        if (!pilotoEncontrado) {
          throw new Error(`Piloto "${nome}" não encontrado`);
        }

        // Processar dados do piloto
        const pontos = pilotoEncontrado.vitorias * 25 + pilotoEncontrado.podios * 8;
        
        setPiloto({
          nome: pilotoEncontrado.nome,
          vitorias: pilotoEncontrado.vitorias,
          podios: pilotoEncontrado.podios,
          pontos,
        });
        
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar piloto:', err);
        setError(err.message);
        setPiloto(null);
      } finally {
        setLoading(false);
      }
    };

    if (nome) {
      carregarPiloto();
    }
  }, [nome]);

  return { piloto, loading, error };
}
