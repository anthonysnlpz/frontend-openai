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
    return data.data[0].url;
  } catch (error) {
    console.error('Error al enviar la solicitud al servidor:', error);
    throw new Error('Error al enviar la solicitud al servidor:', error);
  }
};

export { generateImage };