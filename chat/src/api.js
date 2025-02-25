import axios from 'axios';
import {API_KEY} from '@env';

const apiKey = API_KEY;

const procesarArchivo = async (prompt, archivo) => {
  try {
    const response = await axios.post('https://api.geminiflash.com/procesar-archivo', {
      archivo,
      prompt,
      apiKey,
    });

    return response.data;
  } catch (error) {
    console.error('Error al procesar el archivo:', error);
  }
};

export default procesarArchivo;
