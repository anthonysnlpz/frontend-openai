import { useState, useEffect } from 'react';
import { generateImage } from './OpenAIAPI';

function App() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [lastPrompt, setLastPrompt] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setImageUrl('');
    setButtonDisabled(true);

    const imageUrl = await generateImage(prompt);
    setImageUrl(imageUrl); // Asignar directamente la URL de la imagen
    setLoading(false);
    setButtonDisabled(false);
    setLastPrompt(prompt);

  };

  useEffect(() => {
    setButtonDisabled(prompt.length < 3 || loading || prompt === lastPrompt);
  }, [prompt, loading, lastPrompt]);

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
      {loading && <p>Cargando...</p>}
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
      </div>
    </div>
  );
}

export default App;
