import { useState, useEffect } from 'react';

/**
 * Validar estrutura do JSON de pilotos
 */
function validarPilotos(data) {
  if (!data || !Array.isArray(data.pilotos)) {
    throw new Error('Estrutura inválida: esperado array "pilotos"');
  }
  
  data.pilotos.forEach((piloto, idx) => {
    if (!piloto.nome || typeof piloto.nome !== 'string') {
      throw new Error(`Piloto ${idx}: nome inválido`);
    }
    if (typeof piloto.pontos !== 'number' || piloto.pontos < 0) {
      throw new Error(`Piloto ${piloto.nome}: pontos deve ser número ≥ 0`);
    }
    if (typeof piloto.vitorias !== 'number' || piloto.vitorias < 0) {
      throw new Error(`Piloto ${piloto.nome}: vitórias deve ser número ≥ 0`);
    }
    if (typeof piloto.podios !== 'number' || piloto.podios < 0) {
      throw new Error(`Piloto ${piloto.nome}: pódios deve ser número ≥ 0`);
    }
  });
  
  return true;
}

/**
 * Get base path dinâmico
 */
function getBasePath() {
  // Em /TucanosRacingBR-SITE/ → /TucanosRacingBR-SITE
  // Em / → ''
  const path = window.location.pathname;
  const parts = path.split('/').filter(Boolean);
  return parts.length > 0 ? '/' + parts[0] : '';
}

/**
 * Hook para carregar dados de pilotos do JSON e ordenar pelo ranking
 * Carrega de: /docs/pilotos.json (gerado pelo bot Discord)
 * Os pontos são definidos manualmente no Discord (não calcula automaticamente)
 * Formato Discord: "Nome: pontos,vitórias,pódios"
 */
export function useRanking() {
  const [pilotos, setPilotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const carregarPilotos = async () => {
      try {
        setLoading(true);
        
        const basePath = getBasePath();
        
        // Carregar o JSON - tentar múltiplos caminhos
        const urls = [
          `${basePath}/pilotos.json`,
          '/pilotos.json',
          './pilotos.json',
        ];

        let response = null;
        let lastError = null;

        for (const url of urls) {
          try {
            // Adicionar timestamp para evitar cache
            const urlComTimestamp = `${url}?t=${Date.now()}`;
            response = await fetch(urlComTimestamp);
            
            if (response.ok) {
              console.log(`✅ Pilotos carregados de: ${url}`);
              break;
            }
          } catch (err) {
            lastError = err;
            console.warn(`⚠️ Falha ao carregar de ${url}:`, err.message);
          }
        }

        if (!response || !response.ok) {
          throw new Error(`Não foi possível carregar pilotos. Erro: ${lastError?.message || 'Desconhecido'}`);
        }

        const data = await response.json();
        
        // Validar dados
        validarPilotos(data);
        
        // Processar dados: mapear estrutura e ordenar por pontos (sem calcular)
        const pilotosProcessados = data.pilotos.map((piloto, index) => {
          return {
            position: index + 1,
            driver: piloto.nome,
            points: piloto.pontos,
            wins: piloto.vitorias,
            podiums: piloto.podios,
          };
        });

        // Ordenar por pontos (decrescente)
        pilotosProcessados.sort((a, b) => b.points - a.points);

        // Atualizar posições após ordenar
        pilotosProcessados.forEach((piloto, index) => {
          piloto.position = index + 1;
        });

        console.log('📊 Pilotos carregados:', pilotosProcessados);
        setPilotos(pilotosProcessados);
        setError(null);
      } catch (err) {
        console.error('❌ Erro ao carregar pilotos:', err);
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
 * Hook para obter dados de um piloto específico pelo nome
 * Retorna formato compatível com Perfil.jsx
 */
export function usePiloto(nome) {
  const [piloto, setPiloto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const carregarPiloto = async () => {
      try {
        if (!nome) {
          setPiloto(null);
          setLoading(false);
          return;
        }

        setLoading(true);
        
        const basePath = getBasePath();
        
        // Tentar múltiplos caminhos
        const urls = [
          `${basePath}/pilotos.json`,
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

        const data = await response.json();
        
        // Validar dados
        validarPilotos(data);
        
        // Encontrar o piloto pelo nome
        const pilotoEncontrado = data.pilotos.find(
          (p) => p.nome.toLowerCase() === nome.toLowerCase()
        );

        if (!pilotoEncontrado) {
          setPiloto(null);
          setError(null);
          return;
        }

        // Processar dados do piloto - formato compatível com Perfil
        setPiloto({
          id: pilotoEncontrado.nome,
          driver: pilotoEncontrado.nome,
          wins: pilotoEncontrado.vitorias,
          podiums: pilotoEncontrado.podios,
          points: pilotoEncontrado.pontos,
          dataCadastro: pilotoEncontrado.dataCadastro || null, // Data que o piloto foi criado no bot
        });
        
        setError(null);
      } catch (err) {
        console.error('❌ Erro ao carregar piloto:', err);
        setError(err.message);
        setPiloto(null);
      } finally {
        setLoading(false);
      }
    };

    carregarPiloto();
  }, [nome]);

  return { piloto, loading, error };
}
