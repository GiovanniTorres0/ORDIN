// src/pages/EditorDeModelo/EditorDeModelo.jsx

import React, { useState } from 'react';
import RGL, { WidthProvider } from 'react-grid-layout';
import './EditorDeModelo.css';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { saveTemplate } from '../../services/apiService.js';

const ResponsiveGridLayout = WidthProvider(RGL);

const EditorDeModelo = ({ initialItems = [] }) => {
    const [pages, setPages] = useState(
        initialItems.length > 0 ? [{ pageNumber: 1, items: initialItems }] : [{ pageNumber: 1, items: [] }]
    );
    const [selectedItem, setSelectedItem] = useState({ pageIndex: null, itemId: null });
    const [templateName, setTemplateName] = useState('');

    // --- MANIPULADORES DE ESTADO (Handlers) ---

    const handleAddPage = () => {
        setPages([...pages, { pageNumber: pages.length + 1, items: [] }]);
    };

    const handleDeletePage = (pageIndexToDelete) => {
        if (pages.length <= 1) {
            alert("Não é possível deletar a última página.");
            return;
        }
        const newPages = pages
            .filter((_, index) => index !== pageIndexToDelete)
            .map((page, index) => ({ ...page, pageNumber: index + 1 }));
        setPages(newPages);
    };

    const onAddItem = (pageIndex) => {
        const newPages = [...pages];
        const targetPage = { ...newPages[pageIndex] };
        const newItem = { i: `item-${Date.now()}`, x: 0, y: Infinity, w: 3, h: 2, content: 'Novo Campo', fontSize: 16 };
        targetPage.items = [...targetPage.items, newItem];
        newPages[pageIndex] = targetPage;
        setPages(newPages);
    };

    const handleDeleteItem = () => {
        const { pageIndex, itemId } = selectedItem;
        if (pageIndex === null || itemId === null) return;

        const newPages = [...pages];
        const targetPage = { ...newPages[pageIndex] };
        targetPage.items = targetPage.items.filter(item => item.i !== itemId);
        newPages[pageIndex] = targetPage;
        setPages(newPages);
        setSelectedItem({ pageIndex: null, itemId: null });
    };

    const handleLayoutChange = (newLayout, pageIndex) => {
        const newPages = [...pages];
        const targetPage = { ...newPages[pageIndex] };
        targetPage.items = targetPage.items.map(originalItem => {
            const layoutItem = newLayout.find(l => l.i === originalItem.i);
            return { ...originalItem, ...layoutItem };
        });
        newPages[pageIndex] = targetPage;
        setPages(newPages);
    };

    const handlePropertyChange = (property, value) => {
        const { pageIndex, itemId } = selectedItem;
        if (pageIndex === null || itemId === null) return;

        const newPages = [...pages];
        const targetPage = { ...newPages[pageIndex] };
        targetPage.items = targetPage.items.map(item =>
            item.i === itemId ? { ...item, [property]: value } : item
        );
        newPages[pageIndex] = targetPage;
        setPages(newPages);
    };

    const handleSave = async () => {
        const allItems = pages.reduce((acc, page) => [...acc, ...page.items], []);
        if (!templateName || allItems.length === 0) {
            alert('Por favor, preencha o nome do modelo e adicione itens ao layout.');
            return;
        }
        try {
            await saveTemplate(templateName, allItems);
            alert(`Modelo "${templateName}" salvo com sucesso!`);
        } catch (error) {
            alert('Ocorreu um erro ao salvar o modelo.');
        }
    };
    
    const currentSelectedItem = selectedItem.pageIndex !== null && pages[selectedItem.pageIndex]
        ? pages[selectedItem.pageIndex].items.find(item => item.i === selectedItem.itemId)
        : null;

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
                <button onClick={() => onAddItem(pages.length - 1)}>Adicionar Campo</button>
                <hr />
                <h3>Documento</h3>
                <button onClick={handleAddPage}>+ Adicionar Nova Página</button>
            </div>

            <div className="canvas" onClick={(e) => {
                if (e.target.closest('.page-container')) return;
                setSelectedItem({ pageIndex: null, itemId: null });
            }}>
                {pages.map((page, pageIndex) => (
                    <div key={`page-container-${page.pageNumber}`} className="page-container">
                        <div className="a4-page">
                            <ResponsiveGridLayout
                                className="layout"
                                layout={page.items.map(item => ({ i: item.i, x: item.x, y: item.y, w: item.w, h: item.h }))}
                                cols={12}
                                rowHeight={30}
                                isBounded={true}
                                onLayoutChange={(layout) => handleLayoutChange(layout, pageIndex)}
                                onDragStart={(layout, oldItem) => setSelectedItem({ pageIndex, itemId: oldItem.i })}
                                onResizeStart={(layout, oldItem) => setSelectedItem({ pageIndex, itemId: oldItem.i })}
                            >
                                {page.items.map(item => (
                                    <div key={item.i} className="grid-item-wrapper">
                                        <div
                                            className={item.i === selectedItem.itemId ? 'grid-item-content selected' : 'grid-item-content'}
                                            onMouseDown={() => setSelectedItem({ pageIndex, itemId: item.i })}
                                        >
                                            <span style={{ fontSize: `${item.fontSize || 16}px` }}>{item.content}</span>
                                        </div>
                                    </div>
                                ))}
                            </ResponsiveGridLayout>
                        </div>
                        <div className="page-actions">
                            <span>Página {page.pageNumber}</span>
                            {pages.length > 1 && (
                                <button onClick={() => handleDeletePage(pageIndex)} className="delete-page-btn">&times;</button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="inspector">
                <h3>Inspetor de Propriedades</h3>
                {currentSelectedItem ? (
                    <div>
                        <label htmlFor="content-input">Conteúdo:</label>
                        <input id="content-input" type="text" className="property-input" value={currentSelectedItem.content || ''} onChange={(e) => handlePropertyChange('content', e.target.value)} />
                        
                        <div style={{ marginTop: '1rem' }}>
                            <label htmlFor="fontsize-input">Fonte (px):</label>
                            <input id="fontsize-input" type="number" className="property-input" value={currentSelectedItem.fontSize || 16} onChange={(e) => handlePropertyChange('fontSize', parseInt(e.target.value, 10) || 16)} />
                        </div>

                        <div style={{ marginTop: '2rem', borderTop: '1px solid #ccc', paddingTop: '1rem' }}>
                            <button onClick={handleDeleteItem} style={{ backgroundColor: '#dc3545', color: 'white', width: '100%', border: 'none' }}>
                                Deletar Item
                            </button>
                        </div>
                    </div>
                ) : (
                    <p>Selecione um item para editar.</p>
                )}
            </div>
        </div>
    );
};

export default EditorDeModelo;