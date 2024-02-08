import { useState, useEffect } from 'react';

function App() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [remainingRequests, setRemainingRequests] = useState(null);
  const [resetTimeRequests, setResetTimeRequests] = useState(null);
  const [exceededLimit, setExceededLimit] = useState(false);
  const [loading, setLoading] = useState(false); // Estado de carga
  const [lastPrompt, setLastPrompt] = useState(null); // Guardar el último prompt utilizado

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Activar estado de carga
    setImageUrl(''); // Limpiar la URL de la imagen anterior
    setButtonDisabled(true); // Deshabilitar el botón para evitar solicitudes duplicadas
    try {
      // URL Producción
      // https://backend-openai-beige.vercel.app/openai
      // URL testing
      // http://localhost:3001/openai
      const response = await fetch('https://backend-openai-beige.vercel.app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) {
        throw new Error('Error al enviar la solicitud al servidor');
      }

      const data = await response.json();
      setImageUrl(data.url);

      // Actualizar los encabezados de la tasa de solicitud
      const remainingRequests = response.headers.get('x-ratelimit-remaining-requests');
      const resetTimeRequests = response.headers.get('x-ratelimit-reset-requests');
      setRemainingRequests(remainingRequests);
      setResetTimeRequests(resetTimeRequests);

      // Verificar si se ha superado el límite de solicitudes
      if (parseInt(remainingRequests) === 0) {
        setExceededLimit(true);
      }
    } catch (error) {
      console.error('Error al enviar solicitud al servidor:', error);
    } finally {
      setLoading(false); // Desactivar estado de carga después de que la solicitud se complete
      setButtonDisabled(false); // Habilitar el botón después de que la solicitud se complete
      setLastPrompt(prompt); // Guardar el último prompt utilizado
    }
  };

  // Desactivar el botón si el prompt tiene menos de 3 caracteres, si hay una solicitud en curso o si es el mismo prompt que la solicitud anterior
  useEffect(() => {
    setButtonDisabled(prompt.length < 3 || loading || prompt === lastPrompt);
  }, [prompt, loading, lastPrompt]);

  // Mostrar alerta si se ha superado el límite de solicitudes
  useEffect(() => {
    if (exceededLimit) {
      alert('Has alcanzado el límite de imágenes generadas. Debes esperar antes de generar más.');
    }
  }, [exceededLimit]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1>Generador de imágenes EleganceWeb OpenAI</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Escriba su idea..."
          style={{ marginRight: '10px', width: '50%' }}
        />
        <button type="submit" disabled={buttonDisabled}>Generar imagen</button>
      </form>
      {loading && <p>Cargando...</p>} {/* Indicador de carga */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {imageUrl && (
          <div style={{ marginBottom: '20px' }}>
            <h2>Imagen generada:</h2>
            <img
              src={imageUrl}
              alt="Imagen generada"
              style={{
                height: '350px',
                width: '400px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                marginBottom: '10px',
                display: 'flex',
                flexDirection: 'row'
              }}
            />
            <button
              onClick={() => window.open(imageUrl)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              Descargar imagen
            </button>
          </div>
        )}
        {remainingRequests !== null && resetTimeRequests !== null && (
          <div style={{ marginBottom: '20px' }}>
            <p style={{ marginBottom: '5px' }}>Quedan <span style={{ fontWeight: 'bold' }}>{remainingRequests}</span> solicitudes.</p>
            <p>Se restablecerán en <span style={{ fontWeight: 'bold' }}>{resetTimeRequests}</span>.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
