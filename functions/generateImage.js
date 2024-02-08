/* eslint-disable no-undef */
// generateImage.js
const { OpenAI } = require("openai");
const express = require('express');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

app.use(cors({
  origin: ['*'], // Permite solicitudes desde estos orígenes
  methods: 'GET,POST',
  // Permitir solo estos encabezados en las solicitudes
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'], 
  credentials: true // Habilitar el intercambio de cookies entre dominios
}));

app.use(express.json());

// Almacena la clave de la API en una variable
// eslint-disable-next-line no-undef
const apiKey = process.env.OPENAI_API_KEY;

// Proporciona la clave de la API al instanciar el cliente de OpenAI
const openai = new OpenAI({ apiKey });

// Exportar la función como un controlador para Netlify Functions
// eslint-disable-next-line no-undef
exports.handler = async (event) => {
  const { prompt } = JSON.parse(event.body);
  try {
    const response = await openai.images.generate({
      prompt: prompt,
      n: 1,
    });
    const imageUrl = response.data[0].url;
    return {
      statusCode: 200,
      body: JSON.stringify({ url: imageUrl })
    };
  } catch (error) {
    console.error('Error al generar la imagen:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error al generar la imagen' })
    };
  }
};
