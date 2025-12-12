'use client';

import React, { useState, useRef } from 'react';
import { useStore } from '../store/useStore';
import { LibraryEntity } from '../types';
import { cn } from '../lib/utils';
import { PDF_TEMPLATES } from './PDFTemplates';

type Tab = 'products' | 'attributes' | 'terms' | 'settings';

interface CategoryCardProps {
    title: string;
    items: LibraryEntity[];
    onAddItem: (name: string, desc: string) => void;
    onDeleteItem: (id: string) => void;
    onEditItem: (id: string, updates: Partial<LibraryEntity>) => void;
    isFixed?: boolean;
    onDeleteCategory?: () => void;
    onRenameCategory?: (newName: string) => void;
    onMoveUp?: () => void;
    onMoveDown?: () => void;
    isFirst?: boolean;
    isLast?: boolean;
    showExtrasCheckbox?: boolean;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
    title,
    items,
    onAddItem,
    onDeleteItem,
    onEditItem,
    isFixed = false,
    onDeleteCategory,
    onRenameCategory,
    onMoveUp,
    onMoveDown,
    isFirst,
    isLast,
    showExtrasCheckbox
}) => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const [editDescription, setEditDescription] = useState('');

    // Category Title Editing
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [editTitle, setEditTitle] = useState(title);

    const startEditing = (item: LibraryEntity) => {
        setEditingId(item.id);
        setEditName(item.name);
        setEditDescription(item.description || '');
    };

    const saveEditing = (id: string) => {
        if (!editName.trim()) return;
        onEditItem(id, {
            name: editName,
            hasDescription: !!editDescription,
            description: editDescription
        });
        setEditingId(null);
    };

    const cancelEditing = () => {
        setEditingId(null);
    };

    const handleSaveTitle = () => {
        if (editTitle.trim() && onRenameCategory) {
            onRenameCategory(editTitle.trim());
        }
        setIsEditingTitle(false);
    };

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 h-full flex flex-col">
            <div className="mb-2 flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
                <div className="flex items-center gap-2 flex-1">
                    {!isFixed && (
                        <div className="flex flex-col">
                            <button
                                disabled={isFirst}
                                onClick={onMoveUp}
                                className="text-[10px] text-slate-400 hover:text-blue-600 disabled:opacity-30"
                            >
                                ▲
                            </button>
                            <button
                                disabled={isLast}
                                onClick={onMoveDown}
                                className="text-[10px] text-slate-400 hover:text-blue-600 disabled:opacity-30"
                            >
                                ▼
                            </button>
                        </div>
                    )}

                    {isEditingTitle ? (
                        <div className="flex items-center gap-2 flex-1">
                            <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="flex-1 rounded border border-blue-300 p-1 text-sm font-bold"
                                autoFocus
                                onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()}
                            />
                            <button onClick={handleSaveTitle} className="text-green-600 hover:text-green-700">✓</button>
                            <button onClick={() => setIsEditingTitle(false)} className="text-red-600 hover:text-red-700">✕</button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 group">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h3>
                            {onRenameCategory && (
                                <button
                                    onClick={() => { setEditTitle(title); setIsEditingTitle(true); }}
                                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-blue-600 text-xs"
                                >
                                    ✎
                                </button>
                            )}
                        </div>
                    )}
                </div>
                {!isFixed && onDeleteCategory && (
                    <button
                        onClick={onDeleteCategory}
                        className="text-xs font-medium text-red-500 hover:underline ml-2"
                    >
                        Delete
                    </button>
                )}
            </div>

            {/* Items List */}
            <div className="pl-2 flex-1 flex flex-col">
                {/* Add New Item */}
                <div className="mb-2 space-y-2">
                    <input
                        type="text"
                        placeholder={`Add new item...`}
                        className="w-full rounded-lg border border-slate-300 p-1.5 text-xs dark:bg-slate-800"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                const nameInput = e.currentTarget;
                                const descInput = nameInput.nextElementSibling as HTMLInputElement;
                                const val = nameInput.value;
                                const desc = descInput?.value || '';

                                if (val.trim()) {
                                    onAddItem(val, desc);
                                    nameInput.value = '';
                                    if (descInput) descInput.value = '';
                                }
                            }
                        }}
                    />
                    <input
                        type="text"
                        placeholder="Description (Optional) - Press Enter above to add"
                        className="w-full rounded-lg border border-slate-300 p-1.5 text-xs dark:bg-slate-800"
                    />
                </div>

                <div className="max-h-60 overflow-y-auto space-y-1 custom-scrollbar">
                    {items.length === 0 && <p className="text-[10px] text-slate-400 italic">No items yet.</p>}
                    {items.map((item) => (
                        <div key={item.id} className="flex flex-col gap-1 rounded bg-slate-50 p-1.5 text-xs dark:bg-slate-800/50">
                            {editingId === item.id ? (
                                <div className="space-y-1">
                                    <input
                                        type="text"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        className="w-full rounded border border-blue-300 p-1 text-xs"
                                        autoFocus
                                    />
                                    <input
                                        type="text"
                                        value={editDescription}
                                        onChange={(e) => setEditDescription(e.target.value)}
                                        placeholder="Description"
                                        className="w-full rounded border border-blue-300 p-1 text-xs"
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => saveEditing(item.id)}
                                            className="rounded bg-green-500 px-2 py-0.5 text-[10px] font-bold text-white hover:bg-green-600"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={cancelEditing}
                                            className="rounded bg-slate-400 px-2 py-0.5 text-[10px] font-bold text-white hover:bg-slate-500"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            {showExtrasCheckbox && (
                                                <input
                                                    type="checkbox"
                                                    checked={!!item.isExtras}
                                                    onChange={(e) => onEditItem(item.id, { isExtras: e.target.checked })}
                                                    className="h-3 w-3 flex-shrink-0 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                    title="Mark as Extra (No Dimensions)"
                                                />
                                            )}
                                            <span className="truncate font-medium text-slate-700 dark:text-slate-300">{item.name}</span>
                                        </div>
                                        <div className="flex gap-1 flex-shrink-0">
                                            <button
                                                onClick={() => startEditing(item)}
                                                className="text-slate-400 hover:text-blue-600"
                                                title="Edit"
                                            >
                                                ✎
                                            </button>
                                            <button
                                                onClick={() => onDeleteItem(item.id)}
                                                className="text-slate-400 hover:text-red-600"
                                                title="Delete"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    </div>
                                    {item.hasDescription && (
                                        <p className="text-[10px] text-slate-500 truncate">{item.description}</p>
                                    )}
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const LibraryManager = () => {
    const store = useStore();
    const [activeTab, setActiveTab] = useState<Tab>('products');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Local state for adding new categories
    const [newAttrCategoryName, setNewAttrCategoryName] = useState('');
    const [newAttrType, setNewAttrType] = useState<'single' | 'multiple'>('single'); // Added state
    const [newTermCategoryName, setNewTermCategoryName] = useState('');
    const [newTermType, setNewTermType] = useState<'single' | 'multiple'>('multiple');

    const handleAddAttrCategory = () => {
        if (!newAttrCategoryName.trim()) return;
        store.addAttributeCategory(newAttrCategoryName, newAttrType); // Pass type
        setNewAttrCategoryName('');
        setNewAttrType('single'); // Reset type
    };

    const handleAddTermCategory = () => {
        if (!newTermCategoryName.trim()) return;
        store.addTermCategory(newTermCategoryName, newTermType);
        setNewTermCategoryName('');
    };

    const handleMoveCategory = (index: number, direction: 'up' | 'down') => {
        const defaultOrder = ['sys_productTypes', 'sys_productSeries', 'sys_units', ...store.attributeCategories.map(c => c.id)];
        const currentOrder = store.companySettings.categoryOrder || defaultOrder;

        // Ensure we have all current dynamic categories in the list (in case of sync issues)
        const knownIds = new Set(currentOrder);
        const missingIds = store.attributeCategories.filter(c => !knownIds.has(c.id)).map(c => c.id);
        const fullOrder = [...currentOrder, ...missingIds];

        const newOrder = [...fullOrder];
        if (direction === 'up' && index > 0) {
            [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
        } else if (direction === 'down' && index < newOrder.length - 1) {
            [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
        }

        store.updateCompanySettings({ categoryOrder: newOrder });
    };

    const moveTermCategory = (index: number, direction: 'up' | 'down') => {
        const newCategories = [...store.termCategories];
        if (direction === 'up' && index > 0) {
            [newCategories[index], newCategories[index - 1]] = [newCategories[index - 1], newCategories[index]];
        } else if (direction === 'down' && index < newCategories.length - 1) {
            [newCategories[index], newCategories[index + 1]] = [newCategories[index + 1], newCategories[index]];
        }
        store.reorderTermCategories(newCategories);
    };

    const handleExport = () => {
        try {
            const data = {
                productTypes: store.productTypes,
                productSeries: store.productSeries,
                units: store.units,
                attributeCategories: store.attributeCategories,
                termCategories: store.termCategories,
                companySettings: store.companySettings,
            };

            const jsonString = JSON.stringify(data, null, 2);
            // Use encodeURIComponent to ensure special characters don't break the data URI
            const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(jsonString);

            const dateStr = new Date().toISOString().split('T')[0];
            const fileName = `aluminum_station_library_${dateStr}.json`;

            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', fileName);
            linkElement.style.display = 'none';

            document.body.appendChild(linkElement);
            linkElement.click();
            document.body.removeChild(linkElement);

        } catch (err) {
            console.error('Export failed:', err);
            alert('Export failed. Please check console.');
        }
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target?.result as string);
                store.importLibrary(data);
                alert('Library imported successfully!');
            } catch (error) {
                console.error('Import failed:', error);
                alert('Failed to import library. Invalid JSON file.');
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    };

    return (
        <div className="mx-auto max-w-6xl p-4">
            <div className="mb-4 flex items-center justify-between">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">Library Manager</h1>
                <div className="flex gap-2">
                    <button
                        onClick={handleExport}
                        className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                        Export JSON
                    </button>
                    <button
                        onClick={handleImportClick}
                        className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                        Import JSON
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".json"
                        className="hidden"
                    />
                </div>
            </div>

            {/* TABS */}
            <div className="mb-6 flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800">
                <button
                    onClick={() => setActiveTab('products')}
                    className={cn(
                        "px-4 py-2 text-sm font-bold transition-colors",
                        activeTab === 'products' ? "border-b-2 border-blue-600 text-blue-600" : "text-slate-500 hover:text-slate-700"
                    )}
                >
                    Product Information
                </button>
                <button
                    onClick={() => setActiveTab('terms')}
                    className={cn(
                        "px-4 py-2 text-sm font-bold transition-colors",
                        activeTab === 'terms' ? "border-b-2 border-blue-600 text-blue-600" : "text-slate-500 hover:text-slate-700"
                    )}
                >
                    Terms & Conditions
                </button>
                <button
                    onClick={() => setActiveTab('settings')}
                    className={cn(
                        "px-4 py-2 text-sm font-bold transition-colors",
                        activeTab === 'settings' ? "border-b-2 border-blue-600 text-blue-600" : "text-slate-500 hover:text-slate-700"
                    )}
                >
                    Company Settings
                </button>
            </div>

            {/* CONTENT */}
            <div className="space-y-6">
                {activeTab === 'products' && (
                    <div className="space-y-6">
                        <h2 className="text-lg font-bold text-slate-800 dark:text-white">Dynamic Attributes & Product Info</h2>

                        {/* Add New Category */}
                        <div className="flex items-end gap-4 rounded-xl bg-blue-50 p-4 dark:bg-blue-900/20">
                            <div className="flex-1">
                                <label className="mb-1 block text-xs font-bold text-blue-900 dark:text-blue-100">Add New Attribute Category</label>
                                <input
                                    type="text"
                                    value={newAttrCategoryName}
                                    onChange={(e) => setNewAttrCategoryName(e.target.value)}
                                    placeholder="e.g. Frame Material, Handle Type..."
                                    className="w-full rounded-lg border border-blue-200 p-2 text-sm dark:border-blue-800 dark:bg-slate-900"
                                />
                            </div>
                            <div className="w-40">
                                <label className="mb-1 block text-xs font-bold text-blue-900 dark:text-blue-100">Selection Type</label>
                                <select
                                    value={newAttrType}
                                    onChange={(e) => setNewAttrType(e.target.value as 'single' | 'multiple')}
                                    className="w-full rounded-lg border border-blue-200 p-2 text-sm dark:border-blue-800 dark:bg-slate-900"
                                >
                                    <option value="single">Single Select</option>
                                    <option value="multiple">Multi Select</option>
                                </select>
                            </div>
                            <button
                                onClick={handleAddAttrCategory}
                                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
                            >
                                + Create Category
                            </button>
                        </div>

                        {/* Unified Grid */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {(() => {
                                const defaultOrder = ['sys_productTypes', 'sys_productSeries', 'sys_units', ...store.attributeCategories.map(c => c.id)];
                                const currentOrder = store.companySettings.categoryOrder || defaultOrder;

                                // Merge missing
                                const knownIds = new Set(currentOrder);
                                const missingIds = store.attributeCategories.filter(c => !knownIds.has(c.id)).map(c => c.id);
                                const fullOrder = [...currentOrder, ...missingIds];

                                return fullOrder.map((catId, index) => {
                                    // Determine Category Data
                                    let catData: any = null;

                                    if (catId === 'sys_productTypes') {
                                        catData = {
                                            id: catId, title: store.companySettings.categoryLabels?.['productTypes'] || 'Product Types',
                                            items: store.productTypes,
                                            onAdd: (n: string, d: string) => store.addSystemItem('productTypes', { id: crypto.randomUUID(), name: n, hasDescription: !!d, description: d }),
                                            onDel: (id: string) => store.deleteSystemItem('productTypes', id),
                                            onEdit: (id: string, u: any) => store.updateSystemItem('productTypes', id, u),
                                            onRename: (n: string) => store.updateSystemCategoryLabel('productTypes', n),
                                            isFixed: false, // Now movable
                                            showExtrasCheckbox: true // Enabled specifically for Product Types
                                        };
                                    } else if (catId === 'sys_productSeries') {
                                        catData = {
                                            id: catId, title: store.companySettings.categoryLabels?.['productSeries'] || 'Product Series',
                                            items: store.productSeries,
                                            onAdd: (n: string, d: string) => store.addSystemItem('productSeries', { id: crypto.randomUUID(), name: n, hasDescription: !!d, description: d }),
                                            onDel: (id: string) => store.deleteSystemItem('productSeries', id),
                                            onEdit: (id: string, u: any) => store.updateSystemItem('productSeries', id, u),
                                            onRename: (n: string) => store.updateSystemCategoryLabel('productSeries', n),
                                            isFixed: false
                                        };
                                    } else if (catId === 'sys_units') {
                                        catData = {
                                            id: catId, title: store.companySettings.categoryLabels?.['units'] || 'Units',
                                            items: store.units,
                                            onAdd: (n: string, d: string) => store.addSystemItem('units', { id: crypto.randomUUID(), name: n, hasDescription: !!d, description: d }),
                                            onDel: (id: string) => store.deleteSystemItem('units', id),
                                            onEdit: (id: string, u: any) => store.updateSystemItem('units', id, u),
                                            onRename: (n: string) => store.updateSystemCategoryLabel('units', n),
                                            isFixed: false
                                        };
                                    } else {
                                        const dynCat = store.attributeCategories.find(c => c.id === catId);
                                        if (dynCat) {
                                            catData = {
                                                id: catId, title: dynCat.name,
                                                items: dynCat.items,
                                                onAdd: (n: string, d: string) => store.addAttributeItem(catId, { id: crypto.randomUUID(), name: n, hasDescription: !!d, description: d }),
                                                onDel: (id: string) => store.deleteAttributeItem(catId, id),
                                                onEdit: (id: string, u: any) => store.updateAttributeItem(catId, id, u),
                                                onRename: (n: string) => store.updateAttributeCategory(catId, n),
                                                onDeleteCat: () => store.deleteAttributeCategory(catId),
                                                isFixed: false
                                            };
                                        }
                                    }

                                    if (!catData) return null;

                                    return (
                                        <CategoryCard
                                            key={catData.id}
                                            title={catData.title}
                                            items={catData.items}
                                            onAddItem={catData.onAdd}
                                            onDeleteItem={catData.onDel}
                                            onEditItem={catData.onEdit}
                                            isFixed={false} // All are movable now
                                            onDeleteCategory={catData.onDeleteCat}
                                            onRenameCategory={catData.onRename}
                                            onMoveUp={() => handleMoveCategory(index, 'up')}
                                            onMoveDown={() => handleMoveCategory(index, 'down')}
                                            isFirst={index === 0}
                                            isLast={index === fullOrder.length - 1}
                                            showExtrasCheckbox={catData.showExtrasCheckbox}
                                        />
                                    );
                                });
                            })()}
                        </div>
                    </div>
                )}

                {activeTab === 'terms' && (
                    <div className="space-y-6">
                        <h2 className="text-lg font-bold text-slate-800 dark:text-white">Terms & Conditions Manager</h2>

                        {/* Add New Term Category */}
                        <div className="flex items-end gap-4 rounded-xl bg-blue-50 p-4 dark:bg-blue-900/20">
                            <div className="flex-1">
                                <label className="mb-1 block text-xs font-bold text-blue-900 dark:text-blue-100">Add New Term Category</label>
                                <input
                                    type="text"
                                    value={newTermCategoryName}
                                    onChange={(e) => setNewTermCategoryName(e.target.value)}
                                    placeholder="e.g. Warranty, Installation..."
                                    className="w-full rounded-lg border border-blue-200 p-2 text-sm dark:border-blue-800 dark:bg-slate-900"
                                />
                            </div>
                            <div className="w-40">
                                <label className="mb-1 block text-xs font-bold text-blue-900 dark:text-blue-100">Selection Type</label>
                                <select
                                    value={newTermType}
                                    onChange={(e) => setNewTermType(e.target.value as 'single' | 'multiple')}
                                    className="w-full rounded-lg border border-blue-200 p-2 text-sm dark:border-blue-800 dark:bg-slate-900"
                                >
                                    <option value="multiple">Multi Select</option>
                                    <option value="single">Single Select</option>
                                </select>
                            </div>
                            <button
                                onClick={handleAddTermCategory}
                                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
                            >
                                + Create Term
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {store.termCategories.map((category, index) => (
                                <CategoryCard
                                    key={category.id}
                                    title={`${category.name} (${category.type === 'single' ? 'Single' : 'Multi'})`}
                                    items={category.items}
                                    onAddItem={(name, desc) => store.addTermItem(category.id, {
                                        id: crypto.randomUUID(),
                                        name,
                                        hasDescription: !!desc,
                                        description: desc
                                    })}
                                    onDeleteItem={(itemId) => store.deleteTermItem(category.id, itemId)}
                                    onEditItem={(itemId, updates) => store.updateTermItem(category.id, itemId, updates)}
                                    isFixed={false}
                                    onDeleteCategory={() => store.deleteTermCategory(category.id)}
                                    onRenameCategory={(newName) => store.updateTermCategory(category.id, { name: newName })}
                                    onMoveUp={() => moveTermCategory(index, 'up')}
                                    onMoveDown={() => moveTermCategory(index, 'down')}
                                    isFirst={index === 0}
                                    isLast={index === store.termCategories.length - 1}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="max-w-2xl space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Company Settings</h3>
                        <div className="grid gap-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Company Name</label>
                                <input
                                    type="text"
                                    value={store.companySettings.name}
                                    onChange={(e) => store.updateCompanySettings({ name: e.target.value })}
                                    className="w-full rounded-lg border border-slate-300 p-2 dark:bg-slate-800"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Address (Multi-line)</label>
                                <textarea
                                    value={store.companySettings.address}
                                    onChange={(e) => store.updateCompanySettings({ address: e.target.value })}
                                    className="w-full rounded-lg border border-slate-300 p-2 dark:bg-slate-800"
                                    rows={3}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                                    <input
                                        type="email"
                                        value={store.companySettings.email}
                                        onChange={(e) => store.updateCompanySettings({ email: e.target.value })}
                                        className="w-full rounded-lg border border-slate-300 p-2 dark:bg-slate-800"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Phone</label>
                                    <input
                                        type="text"
                                        value={store.companySettings.phone}
                                        onChange={(e) => store.updateCompanySettings({ phone: e.target.value })}
                                        className="w-full rounded-lg border border-slate-300 p-2 dark:bg-slate-800"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Company Logo</label>
                                <div className="flex items-center gap-4">
                                    {store.companySettings.logoUrl && (
                                        <div className="relative h-16 w-32 overflow-hidden rounded border border-slate-200 bg-slate-50">
                                            <img
                                                src={store.companySettings.logoUrl}
                                                alt="Company Logo"
                                                className="h-full w-full object-contain"
                                            />
                                            <button
                                                onClick={() => store.updateCompanySettings({ logoUrl: '' })}
                                                className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                                                title="Remove Logo"
                                            >
                                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => {
                                                        store.updateCompanySettings({ logoUrl: reader.result as string });
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                            className="block w-full text-sm text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-300"
                                        />
                                        <p className="mt-1 text-xs text-slate-500">Upload a JPG or PNG image. It will be saved automatically.</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Company Watermark (Optional)</label>
                                <div className="flex items-center gap-4">
                                    {store.companySettings.watermarkUrl && (
                                        <div className="relative h-16 w-32 overflow-hidden rounded border border-slate-200 bg-slate-50">
                                            <img
                                                src={store.companySettings.watermarkUrl}
                                                alt="Company Watermark"
                                                className="h-full w-full object-contain opacity-50"
                                            />
                                            <button
                                                onClick={() => store.updateCompanySettings({ watermarkUrl: '' })}
                                                className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                                                title="Remove Watermark"
                                            >
                                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => {
                                                        store.updateCompanySettings({ watermarkUrl: reader.result as string });
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                            className="block w-full text-sm text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-300"
                                        />
                                        <p className="mt-1 text-xs text-slate-500">Upload a separate image for the page watermark (e.g. transparent or faded logo).</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">PDF Template</label>
                                <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                                    {PDF_TEMPLATES.map(template => (
                                        <button
                                            key={template.id}
                                            onClick={() => store.updateCompanySettings({ selectedTemplate: template.id })}
                                            className={cn(
                                                "flex flex-col items-start rounded-lg border p-3 text-left transition-all",
                                                store.companySettings.selectedTemplate === template.id
                                                    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500 ring-offset-2 dark:bg-blue-900/20"
                                                    : "border-slate-200 hover:border-blue-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                                            )}
                                        >
                                            <span className="font-bold text-sm">{template.name}</span>
                                            <div className="mt-2 flex gap-1">
                                                <div className="h-4 w-4 rounded-full" style={{ backgroundColor: template.primaryColor }} />
                                                <div className="h-4 w-4 rounded-full" style={{ backgroundColor: template.secondaryColor }} />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Tax Rate (%)</label>
                                <input
                                    type="number"
                                    value={store.companySettings.taxRate}
                                    onChange={(e) => store.updateCompanySettings({ taxRate: Number(e.target.value) })}
                                    className="w-full rounded-lg border border-slate-300 p-2 dark:bg-slate-800"
                                    placeholder="13"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
