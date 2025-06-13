// src/pages/GaleriaDeModelos/GaleriaDeModelos.jsx
import React, { useState, useEffect } from 'react';
import { getTemplates } from '../../services/apiService.js'; // Verifique se o .js está aqui

const GaleriaDeModelos = ({ onSelectTemplate }) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const data = await getTemplates();
        setTemplates(data);
      } catch (error) {
        alert('Não foi possível carregar os modelos.');
      } finally {
        setLoading(false);
      }
    };
    loadTemplates();
  }, []);

  if (loading) {
    return <div>Carregando modelos...</div>;
  }

  return (
    // Usando um estilo simples para alinhar o título e o botão
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1>Galeria de Modelos</h1>
        {/*
          BOTÃO NOVO AQUI:
          Ao clicar, ele chama a função onSelectTemplate com um array vazio,
          sinalizando que queremos criar um novo modelo.
        */}
        <button 
          onClick={() => onSelectTemplate([])} 
          style={{ padding: '0.8rem 1.5rem', fontSize: '1rem' }}
        >
          + Criar Novo Modelo
        </button>
      </div>
      <p>Clique em um modelo existente para carregá-lo ou crie um novo.</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '2rem' }}>
        {templates.map(template => (
          <div 
            key={template.id} 
            onClick={() => onSelectTemplate(template.layout_json)}
            style={{ border: '1px solid #ddd', padding: '1rem', cursor: 'pointer', width: '200px' }}
          >
            <h3>{template.name}</h3>
            <small>ID: {template.id}</small>
          </div>
        ))}
        {templates.length === 0 && <p>Nenhum modelo salvo ainda. Crie o seu primeiro!</p>}
      </div>
    </div>
  );
};

export default GaleriaDeModelos;