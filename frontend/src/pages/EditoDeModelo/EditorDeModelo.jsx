// src/pages/EditorDeModelo.jsx
import React, { useState } from 'react';
import GridLayout from 'react-grid-layout';
import './EditorDeModelo.css';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { saveTemplate } from '../../services/apiService'; // Verifique o caminho se necessário


const EditorDeModelo = () => {
    const [items, setItems] = useState([]);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [templateName, setTemplateName] = useState('');

    const onAddItem = () => {
        const newItem = {
            i: 'item-' + Date.now(),
            x: 0,
            y: Infinity,
            w: 3,
            h: 1,
            content: 'Novo Campo'
        };
        setItems([...items, newItem]);
    };

    const handlePropertyChange = (property, value) => {
        const newItems = items.map(item => {
            if (item.i === selectedItemId) {
                return { ...item, [property]: value };
            }
            return item;
        });
        setItems(newItems);
    };

    const handleSave = async () => {
        if (!templateName) {
            alert('Por favor, dê um nome ao seu modelo.');
            return;
        }
        if (items.length === 0) {
            alert('Adicione pelo menos um item ao layout antes de salvar.');
            return;
        }

        try {
            await saveTemplate(templateName, items);
            alert(`Modelo "${templateName}" salvo com sucesso!`);
        } catch (error) {
            alert('Ocorreu um erro ao salvar o modelo.');
        }
    };

    const selectedItem = items.find(item => item.i === selectedItemId);

    const layout = items.map(item => ({
        i: item.i, x: item.x, y: item.y, w: item.w, h: item.h
    }));

    return (
        <div className="editor-container">
            <div className="toolbox">
                <div className="save-form">
                    <h4>Salvar Modelo</h4>
                    <input
                        type="text"
                        placeholder="Nome do Modelo"
                        className="property-input"
                        value={templateName}
                        onChange={(e) => setTemplateName(e.target.value)}
                    />
                    <button onClick={handleSave}>Salvar</button>
                </div>
                <hr />
                <h3>Caixa de Ferramentas</h3>
                <button onClick={onAddItem}>Adicionar Campo de Texto</button>
            </div>

            <div
                className="canvas"
                onClick={(e) => {
                    // A mágica acontece aqui: .closest() procura o elemento clicado e seus "pais".
                    // Se ele encontrar um elemento com a classe .grid-item-wrapper, significa que o clique foi DENTRO de um item.
                    if (e.target.closest('.grid-item-wrapper')) {
                        return; // Se foi dentro, não faz nada.
                    }
                    // Se não encontrou, o clique foi no fundo do canvas.
                    setSelectedItemId(null); // Agora sim, pode desselecionar.
                }}
            >
                <GridLayout
                    className="layout"
                    layout={layout}
                    cols={12}
                    rowHeight={30}
                    width={1200}
                    onLayoutChange={(newLayout) => {
                        const newItems = items.map(originalItem => {
                            const layoutItem = newLayout.find(l => l.i === originalItem.i);
                            return { ...originalItem, ...layoutItem };
                        });
                        setItems(newItems);
                    }}
                    // Adicionamos estes handlers para garantir a seleção durante o arrasto
                    onDragStart={(layout, oldItem) => setSelectedItemId(oldItem.i)}
                    onResizeStart={(layout, oldItem) => setSelectedItemId(oldItem.i)}
                >
                    {items.map(item => (
                        // MUDANÇA PRINCIPAL: A ESTRUTURA DE WRAPPER DIV
                        <div key={item.i} className="grid-item-wrapper">
                            <div
                                className={item.i === selectedItemId ? 'grid-item-content selected' : 'grid-item-content'}
                                onMouseDown={(e) => {
                                    setSelectedItemId(item.i);
                                }}
                            >
                                <span className="text">{item.content}</span>
                            </div>
                        </div>
                    ))}
                </GridLayout>
            </div>

            <div className="inspector">
                <h3>Inspetor de Propriedades</h3>
                {selectedItem ? (
                    <div>
                        <label htmlFor="content-input">Conteúdo do Campo:</label>
                        <input
                            id="content-input"
                            type="text"
                            className="property-input"
                            value={selectedItem.content || ''}
                            onChange={(e) => handlePropertyChange('content', e.target.value)}
                        />
                    </div>
                ) : (
                    <p>Selecione um item para editar.</p>
                )}
            </div>
        </div>
    );
};

export default EditorDeModelo;