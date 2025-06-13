// src/pages/EditorDeModelo.jsx
import React, { useState } from 'react';
// MUDANÇA 1: Corrigindo a importação. O componente principal é a exportação DEFAULT.
import RGL, { WidthProvider } from 'react-grid-layout';
import './EditorDeModelo.css';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { saveTemplate } from '../../services/apiService';

// MUDANÇA 2: Usamos o RGL (React-Grid-Layout) que importamos corretamente.
const ResponsiveGridLayout = WidthProvider(RGL);

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
        const newItems = items.map(item =>
            item.i === selectedItemId ? { ...item, [property]: value } : item
        );
        setItems(newItems);
    };

    const handleSave = async () => {
        if (!templateName || items.length === 0) {
            alert('Por favor, preencha o nome do modelo e adicione itens ao layout.');
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
                    if (e.target.closest('.grid-item-wrapper')) return;
                    setSelectedItemId(null);
                }}
            >
                <div className="a4-page">
                    <ResponsiveGridLayout
                        className="layout"
                        layout={layout}
                        cols={12}
                        rowHeight={30}
                        measureBeforeMount={false}
                        useCSSTransforms={true}
                        onLayoutChange={(newLayout) => {
                            const newItems = items.map(originalItem => {
                                const layoutItem = newLayout.find(l => l.i === originalItem.i);
                                return { ...originalItem, ...layoutItem };
                            });
                            setItems(newItems);
                        }}
                        onDragStart={(layout, oldItem) => setSelectedItemId(oldItem.i)}
                        onResizeStart={(layout, oldItem) => setSelectedItemId(oldItem.i)}
                    >
                        {items.map(item => (
                            <div key={item.i} className="grid-item-wrapper">
                                <div
                                    className={item.i === selectedItemId ? 'grid-item-content selected' : 'grid-item-content'}
                                    onMouseDown={() => setSelectedItemId(item.i)}
                                >
                                    <span className="text">{item.content}</span>
                                </div>
                            </div>
                        ))}
                    </ResponsiveGridLayout>
                </div>
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