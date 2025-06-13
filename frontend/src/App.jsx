// src/App.jsx
import React, { useState } from 'react';
// Correção aplicada nas duas linhas abaixo:
import EditorDeModelo from './pages/EditoDeModelo/EditorDeModelo.jsx';
import GaleriaDeModelos from './pages/GaleriaDeModelos/GaleriaDeModelos.jsx';

function App() {
  const [selectedLayout, setSelectedLayout] = useState(null);

  // Se um layout foi selecionado, mostre o editor. Senão, mostre a galeria.
  if (selectedLayout) {
    // Passamos o layout como uma prop para o editor
    return <EditorDeModelo initialItems={selectedLayout} />;
  } else {
    // A galeria recebe uma função para atualizar qual layout foi selecionado
    return <GaleriaDeModelos onSelectTemplate={setSelectedLayout} />;
  }
}

export default App;