// src/pages/TemplateManager.jsx

import React, { useState, useEffect } from 'react';
import './TemplateManager.css'; // Vamos criar este arquivo para estilização básica

function TemplateManager() {
  const [templates, setTemplates] = useState([]);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchTemplates = async () => {
    try {
      // Este '/api/templates' vai funcionar por causa de um 'proxy' que vamos configurar no passo 5
      const response = await fetch('/api/templates');
      const data = await response.json();
      setTemplates(data);
    } catch (error) {
      console.error("Erro ao buscar templates:", error);
      alert("Não foi possível carregar os templates. Verifique se o backend está rodando.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleSaveTemplate = async (e) => {
    e.preventDefault(); // Impede o recarregamento da página pelo formulário
    if (!newTemplateName) {
      alert('Por favor, digite um nome para o template.');
      return;
    }

    const mockLayout = {
      description: "Layout de teste gerado automaticamente",
      fields: [
        { id: "cliente", label: "Nome do Cliente", position: { x: 50, y: 50 } },
        { id: "data", label: "Data", position: { x: 50, y: 100 } }
      ]
    };

    try {
      await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newTemplateName, layout_json: mockLayout })
      });
      
      setNewTemplateName('');
      fetchTemplates(); // Re-busca a lista para mostrar o novo template
    } catch (error) {
      console.error("Erro ao salvar template:", error);
      alert("Erro ao salvar o template.");
    }
  };

  return (
    <div className="template-manager">
      <header>
        <h1>Gerenciador de Modelos de OS</h1>
      </header>
      <main>
        <div className="form-container">
          <form onSubmit={handleSaveTemplate}>
            <input 
              type="text"
              placeholder="Nome do novo modelo"
              value={newTemplateName}
              onChange={(e) => setNewTemplateName(e.target.value)}
            />
            <button type="submit">Salvar Novo Modelo</button>
          </form>
        </div>
        <div className="list-container">
          <h2>Modelos Salvos</h2>
          {isLoading ? (
            <p>Carregando modelos...</p>
          ) : (
            <ul>
              {templates.map(template => (
                <li key={template.id || template.name}>{template.name}</li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}

export default TemplateManager;