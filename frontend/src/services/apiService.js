// Em produção, isso usará a variável de ambiente da Vercel. Em dev, o proxy do Vite.
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const saveTemplate = async (name, layout) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/templates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // No backend, o 'layout' será o nosso 'layout_json'
      body: JSON.stringify({ name: name, layout_json: layout }), 
    });

    if (!response.ok) {
      throw new Error('Falha ao salvar o modelo.');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro no serviço apiService:', error);
    throw error; // Re-lança o erro para o componente tratar
  }
}

export const getTemplates = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/templates`);
    if (!response.ok) {
      throw new Error('Falha ao buscar os modelos.');
    }
    return await response.json();
  } catch (error) {
    console.error('Erro no serviço apiService:', error);
    throw error;
  }
};
