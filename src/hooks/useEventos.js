import { useState, useEffect } from 'react';

function getBasePath() {
  const path = window.location.pathname;
  if (path.includes('/TucanosRacingBR-SITE/')) {
    return '/TucanosRacingBR-SITE';
  }
  return '';
}

function validarEventos(data) {
  if (!data || typeof data !== 'object') return [];
  if (!Array.isArray(data.eventos)) return [];
  
  return data.eventos.filter(evento => 
    evento &&
    typeof evento === 'object' &&
    evento.nome &&
    evento.data &&
    evento.hora &&
    evento.timezone &&
    Array.isArray(evento.participantes)
  );
}

export function useEventos() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        setLoading(true);
        const basePath = getBasePath();
        const timestamp = new Date().getTime();
        const url = `${basePath}/eventos.json?t=${timestamp}`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        const validatedEventos = validarEventos(data);
        
        setEventos(validatedEventos);
        setError(null);
      } catch (err) {
        console.error('❌ Erro ao carregar eventos:', err);
        setError(err.message);
        setEventos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEventos();
  }, []);

  return { eventos, loading, error };
}
