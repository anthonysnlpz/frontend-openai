const generateImage = async (prompt) => {
  try {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer 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`
      },
      body: JSON.stringify({
        prompt: prompt
      })
    });

    if (!response.ok) {
      throw new Error(`Error al enviar la solicitud al servidor: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.data[0].url; // Suponiendo que la URL de la imagen está en un objeto `data` devuelto por la API
  } catch (error) {
    console.error('Error al enviar la solicitud al servidor:', error);
    throw new Error('Error al enviar la solicitud al servidor:', error);
  }
};

export { generateImage };