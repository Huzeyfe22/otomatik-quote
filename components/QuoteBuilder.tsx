'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { ChipGroup } from './ChipGroup';
import { LibraryEntity, QuoteItem } from '../types';
import { cn } from '../lib/utils';
import dynamic from 'next/dynamic';

const DownloadPDFButton = dynamic(
    () => import('./DownloadPDFButton').then((mod) => mod.DownloadPDFButton),
    { ssr: false }
);

export const QuoteBuilder = () => {
    const store = useStore();

    // Local state for the current item being built
    const [selectedProductType, setSelectedProductType] = useState<LibraryEntity | null>(null);
    const [selectedSeries, setSelectedSeries] = useState<LibraryEntity | null>(null);

    // Dynamic Attributes State: Record<CategoryId, SelectedEntity>
    const [selectedAttributes, setSelectedAttributes] = useState<Record<string, LibraryEntity | LibraryEntity[]>>({});

    // Dimensions & Qty
    const [width, setWidth] = useState<number>(0);
    const [height, setHeight] = useState<number>(0);
    const [selectedUnit, setSelectedUnit] = useState<LibraryEntity | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [price, setPrice] = useState<number>(0);
    const [description, setDescription] = useState(''); // New: Item Description

    // Toggles
    const [hasScreen, setHasScreen] = useState(false);
    const [showDimensions, setShowDimensions] = useState(true);

    // Client Info State
    const [clientName, setClientName] = useState('');
    const [clientAddress, setClientAddress] = useState('');
    const [quoteName, setQuoteName] = useState('New Quote');
    const [quoteNumber, setQuoteNumber] = useState('');
    const [isAutoNumber, setIsAutoNumber] = useState(false);

    // Meta Options
    const [quoteDate, setQuoteDate] = useState<string>(new Date().toISOString().slice(0, 10));
    const [showQuoteName, setShowQuoteName] = useState(true);
    const [showQuoteDate, setShowQuoteDate] = useState(true);

    // Extra Notes
    const [extraNotes, setExtraNotes] = useState('');
    const [showExtraNotes, setShowExtraNotes] = useState(false);

    // Dynamic Terms Selection: Record<CategoryId, Array of Selected Item IDs>
    const [selectedTerms, setSelectedTerms] = useState<Record<string, string[]>>({});

    // Editing State
    const [editingItemId, setEditingItemId] = useState<string | null>(null);

    // Hydration check for persist
    useEffect(() => {
        useStore.persist.rehydrate();
    }, []);

    // Initialize/Sync local state from store's currentQuote when loaded
    useEffect(() => {
        if (store.currentQuote) {
            setClientName(store.currentQuote.client.name);
            setClientAddress(store.currentQuote.client.address);
            setQuoteName(store.currentQuote.name);
            setQuoteNumber(store.currentQuote.quoteNumber || '');

            // Sync Meta
            if (store.currentQuote.quoteDate) {
                try {
                    setQuoteDate(new Date(store.currentQuote.quoteDate).toISOString().slice(0, 10));
                } catch (e) {
                    setQuoteDate(new Date().toISOString().slice(0, 10));
                }
            }
            setShowQuoteName(store.currentQuote.showQuoteName ?? true);
            setShowQuoteDate(store.currentQuote.showQuoteDate ?? true);

            // Sync Extra Notes
            setExtraNotes(store.currentQuote.extraNotes || '');
            setShowExtraNotes(store.currentQuote.showExtraNotes ?? false);

            // Sync Terms
            const termsState: Record<string, string[]> = {};
            if (store.currentQuote.selectedTerms) {
                Object.entries(store.currentQuote.selectedTerms).forEach(([catId, items]) => {
                    termsState[catId] = items.map(i => i.id);
                });
            }
            setSelectedTerms(termsState);
        }
    }, [store.currentQuote?.id]); // Only re-sync if quote ID changes (loaded new quote)

    // Sync terms changes back to store
    useEffect(() => {
        if (!store.currentQuote) return;

        store.termCategories.forEach(category => {
            const selectedIds = selectedTerms[category.id] || [];
            const selectedItems = category.items.filter(item => selectedIds.includes(item.id));
            store.updateQuoteTerms(category.id, selectedItems);
        });
    }, [selectedTerms, store.termCategories]);

    // Helper to toggle term selection
    const handleTermToggle = (categoryId: string, itemId: string, isMulti: boolean) => {
        setSelectedTerms(prev => {
            const current = prev[categoryId] || [];
            if (isMulti) {
                if (current.includes(itemId)) {
                    return { ...prev, [categoryId]: current.filter(id => id !== itemId) };
                } else {
                    return { ...prev, [categoryId]: [...current, itemId] };
                }
            } else {
                return { ...prev, [categoryId]: [itemId] };
            }
        });
    };

    // Reset form function
    const resetForm = () => {
        setSelectedProductType(null);
        setSelectedSeries(null);
        setSelectedAttributes({});
        setWidth(0);
        setHeight(0);
        setSelectedUnit(null);
        setQuantity(1);
        setPrice(0);
        setHasScreen(false);
        setShowDimensions(true);
        setDescription('');
        setEditingItemId(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleAddItem = () => {
        if (!selectedProductType) {
            alert('Please select a product type.');
            return;
        }

        // Validation: Dimensions are required ONLY if showDimensions is true
        if (showDimensions && (width <= 0 || height <= 0 || !selectedUnit)) {
            alert('Please enter valid dimensions and select a unit.');
            return;
        }

        const itemData = {
            productType: selectedProductType,
            productSeries: selectedSeries!, // Series might be optional depending on logic, but usually required
            attributes: selectedAttributes,
            description,
            width,
            height,
            unit: selectedUnit!,
            quantity,
            price,
            hasScreen,
            showDimensions
        };

        if (editingItemId) {
            store.updateQuoteItem(editingItemId, itemData);
        } else {
            store.addQuoteItem({
                id: crypto.randomUUID(),
                ...itemData
            } as QuoteItem);
        }

        resetForm();
    };

    const handleEditItem = (item: QuoteItem) => {
        setSelectedProductType(item.productType);
        setSelectedSeries(item.productSeries);
        setSelectedAttributes(item.attributes || {});
        setWidth(item.width);
        setHeight(item.height);
        setSelectedUnit(item.unit);
        setQuantity(item.quantity);
        setPrice(item.price);
        setHasScreen(item.hasScreen);
        setShowDimensions(item.showDimensions);
        setDescription(item.description || '');
        setEditingItemId(item.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDuplicateItem = (itemId: string) => {
        store.duplicateQuoteItem(itemId);
    };

    // Attribute Selection Helper
    const handleAttributeSelect = (categoryId: string, item: LibraryEntity, isMulti: boolean) => {
        setSelectedAttributes(prev => {
            const current = prev[categoryId];
            if (isMulti) {
                const currentArray = Array.isArray(current) ? current : (current ? [current] : []);
                const exists = currentArray.find(i => i.id === item.id);
                let newArray;
                if (exists) {
                    newArray = currentArray.filter(i => i.id !== item.id);
                } else {
                    newArray = [...currentArray, item];
                }
                return { ...prev, [categoryId]: newArray };
            } else {
                // If clicking same item in single mode, maybe deselect? Or just switch.
                // Let's just switch for now.
                return { ...prev, [categoryId]: item };
            }
        });
    };

    return (
        <div className="mx-auto max-w-[1600px] p-6 pb-32">
            {/* HEADER */}
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {store.companySettings.logoUrl && (
                        <img
                            src={store.companySettings.logoUrl}
                            alt="Company Logo"
                            className="h-12 w-auto object-contain"
                        />
                    )}
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Aluminum Station Quotation Robot</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Build your quote by adding items below.</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={store.saveCurrentQuote}
                        className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                        Save Draft
                    </button>
                    <button
                        onClick={() => {
                            if (confirm('Are you sure you want to start a new quote? Unsaved changes will be lost.')) {
                                store.setQuote({
                                    id: crypto.randomUUID(),
                                    name: 'New Quote',
                                    quoteNumber: '',
                                    client: { name: '', address: '', email: '', phone: '' },
                                    items: [],
                                    selectedTerms: {},
                                    totalPrice: 0,
                                    taxRate: store.companySettings.taxRate,
                                    hasCoverPage: true,
                                    createdAt: new Date(),
                                    updatedAt: new Date(),
                                    // New Fields Defaults
                                    quoteDate: new Date(),
                                    showQuoteName: true,
                                    showQuoteDate: true,
                                    extraNotes: '',
                                    showExtraNotes: false
                                });
                                setClientName('');
                                setClientAddress('');
                                setQuoteName('New Quote');
                                setQuoteNumber('');
                                setIsAutoNumber(false);
                                setQuoteDate(new Date().toISOString().slice(0, 10));
                                setShowQuoteName(true);
                                setShowQuoteDate(true);
                                setExtraNotes('');
                                setShowExtraNotes(false);
                                setSelectedTerms({});
                            }
                        }}
                        className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                    >
                        New Quote
                    </button>
                </div>
            </div>

            {/* PROJECT INFO */}
            <div className="mb-6 rounded-xl border-l-4 border-l-blue-500 border-y border-r border-slate-200 bg-blue-50/30 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                        <span className="font-bold">1</span>
                    </div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">Project Information</h2>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">

                    {/* Quote Name & Date Row - Full Width Container */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-4 flex flex-wrap gap-4">
                        <div className="flex-1 min-w-[250px]">
                            <div className="mb-1 flex items-center justify-between">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Quote Name</label>
                                <label className="flex items-center gap-1 text-xs text-slate-500">
                                    <input
                                        type="checkbox"
                                        checked={showQuoteName}
                                        onChange={(e) => {
                                            setShowQuoteName(e.target.checked);
                                            store.updateQuoteMeta({ showQuoteName: e.target.checked });
                                        }}
                                        className="rounded border-slate-300"
                                    />
                                    Show in PDF
                                </label>
                            </div>
                            <input
                                type="text"
                                value={quoteName}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\b\w/g, c => c.toUpperCase());
                                    setQuoteName(val);
                                    store.updateQuoteName(val);
                                }}
                                className={cn(
                                    "w-full rounded-lg border p-2 dark:bg-slate-800",
                                    !showQuoteName ? "border-slate-200 text-slate-400" : "border-slate-300"
                                )}
                            />
                        </div>

                        <div className="flex-1 min-w-[200px]">
                            <div className="mb-1 flex items-center justify-between">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Quote No</label>
                                <label className="flex items-center gap-1 text-xs text-slate-500">
                                    <input
                                        type="checkbox"
                                        checked={isAutoNumber}
                                        onChange={(e) => {
                                            setIsAutoNumber(e.target.checked);
                                            if (e.target.checked) {
                                                const nextNum = store.generateNextQuoteNumber();
                                                setQuoteNumber(nextNum);
                                                store.updateQuoteNumber(nextNum);
                                            }
                                        }}
                                        className="rounded border-slate-300"
                                    />
                                    Auto
                                </label>
                            </div>
                            <input
                                type="text"
                                value={quoteNumber}
                                onChange={(e) => {
                                    setQuoteNumber(e.target.value);
                                    store.updateQuoteNumber(e.target.value);
                                    if (isAutoNumber) setIsAutoNumber(false); // Disable auto if manually edited
                                }}
                                className="w-full rounded-lg border border-slate-300 p-2 dark:bg-slate-800"
                                placeholder="e.g. 20240501/1"
                            />
                        </div>

                        <div className="w-full sm:w-auto min-w-[160px]">
                            <div className="mb-1 flex items-center justify-between">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Date</label>
                                <label className="flex items-center gap-1 text-xs text-slate-500">
                                    <input
                                        type="checkbox"
                                        checked={showQuoteDate}
                                        onChange={(e) => {
                                            setShowQuoteDate(e.target.checked);
                                            store.updateQuoteMeta({ showQuoteDate: e.target.checked });
                                        }}
                                        className="rounded border-slate-300"
                                    />
                                    Show
                                </label>
                            </div>
                            <input
                                type="date"
                                value={quoteDate}
                                onChange={(e) => {
                                    setQuoteDate(e.target.value);
                                    store.updateQuoteMeta({ quoteDate: new Date(e.target.value) });
                                }}
                                className={cn(
                                    "w-full rounded-lg border p-2 dark:bg-slate-800",
                                    !showQuoteDate ? "border-slate-200 text-slate-400" : "border-slate-300"
                                )}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Client Name</label>
                        <input
                            type="text"
                            value={clientName}
                            onChange={(e) => {
                                const val = e.target.value.replace(/\b\w/g, c => c.toUpperCase());
                                setClientName(val);
                                store.updateClientInfo({ name: val });
                            }}
                            className="w-full rounded-lg border border-slate-300 p-2 dark:bg-slate-800"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Client Address</label>
                        <textarea
                            value={clientAddress}
                            onChange={(e) => {
                                const val = e.target.value.replace(/\b\w/g, c => c.toUpperCase());
                                setClientAddress(val);
                                store.updateClientInfo({ address: val });
                            }}
                            className="w-full rounded-lg border border-slate-300 p-2 dark:bg-slate-800"
                            rows={2}
                        />
                    </div>
                </div>
            </div>

            {/* ITEM BUILDER */}
            <div className="mb-6 rounded-xl border-l-4 border-l-emerald-500 border-y border-r border-slate-200 bg-emerald-50/30 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="mb-4 flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                        <span className="font-bold">2</span>
                    </div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                        {editingItemId ? 'Edit Item' : 'Add Products'}
                    </h2>
                </div>

                <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
                    {/* LEFT COLUMN: Configuration (Wider) */}
                    <div className="xl:col-span-8 space-y-6">
                        {/* Product Type */}
                        <ChipGroup
                            label={store.companySettings.categoryLabels?.['productTypes'] || 'Product Type'}
                            items={store.productTypes}
                            selectedId={selectedProductType?.id}
                            onSelect={setSelectedProductType}
                        />

                        {/* Series */}
                        <ChipGroup
                            label={store.companySettings.categoryLabels?.['productSeries'] || 'Product Series'}
                            items={store.productSeries}
                            selectedId={selectedSeries?.id}
                            onSelect={setSelectedSeries}
                        />

                        {/* Dynamic Attributes */}
                        {store.attributeCategories.map(category => {
                            const isMulti = category.type === 'multiple';
                            const selectedVal = selectedAttributes[category.id];
                            const selectedId = isMulti
                                ? (Array.isArray(selectedVal) ? selectedVal.map(i => i.id) : [])
                                : (Array.isArray(selectedVal) ? selectedVal[0]?.id : selectedVal?.id);

                            return (
                                <ChipGroup
                                    key={category.id}
                                    label={category.name + (isMulti ? ' (Multi)' : '')}
                                    items={category.items}
                                    selectedId={selectedId}
                                    multiSelect={isMulti}
                                    onSelect={(item) => handleAttributeSelect(category.id, item, isMulti)}
                                />
                            );
                        })}

                        {/* Description */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold uppercase tracking-wider text-slate-500">
                                Description / Notes
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:bg-slate-800"
                                placeholder="Optional details about this item..."
                                rows={3}
                            />
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Preview & Pricing (Narrower) */}
                    <div className="xl:col-span-4">
                        <div className="sticky top-24 space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            {/* Dimensions Toggle */}
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Specify Dimensions?</label>
                                <button
                                    onClick={() => setShowDimensions(!showDimensions)}
                                    className={cn(
                                        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                                        showDimensions ? "bg-blue-600" : "bg-slate-300"
                                    )}
                                >
                                    <span className={cn(
                                        "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                                        showDimensions ? "translate-x-6" : "translate-x-1"
                                    )} />
                                </button>
                            </div>

                            {showDimensions && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="mb-1 block text-xs font-bold text-slate-500">Width</label>
                                        <input
                                            type="number"
                                            value={width || ''}
                                            onChange={(e) => setWidth(Number(e.target.value))}
                                            className="w-full rounded-lg border border-slate-200 p-2 dark:bg-slate-800"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs font-bold text-slate-500">Height</label>
                                        <input
                                            type="number"
                                            value={height || ''}
                                            onChange={(e) => setHeight(Number(e.target.value))}
                                            className="w-full rounded-lg border border-slate-200 p-2 dark:bg-slate-800"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="mb-1 block text-xs font-bold text-slate-500">Unit</label>
                                        <div className="flex gap-2">
                                            {store.units.map(u => (
                                                <button
                                                    key={u.id}
                                                    onClick={() => setSelectedUnit(u)}
                                                    className={cn(
                                                        "rounded-md border px-3 py-1 text-xs font-bold transition-colors",
                                                        selectedUnit?.id === u.id
                                                            ? "border-blue-600 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                                                            : "border-slate-200 text-slate-500 hover:border-slate-300 dark:border-slate-700 dark:text-slate-400"
                                                    )}
                                                >
                                                    {u.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="h-px bg-slate-200 dark:bg-slate-700" />

                            {/* Options */}
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                    <input
                                        type="checkbox"
                                        checked={hasScreen}
                                        onChange={(e) => setHasScreen(e.target.checked)}
                                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    Include Screen
                                </label>
                            </div>

                            <div className="h-px bg-slate-200 dark:bg-slate-700" />

                            {/* Price & Qty */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1 block text-xs font-bold text-slate-500">Quantity</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                                        className="w-full rounded-lg border border-slate-200 p-2 font-bold dark:bg-slate-800"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-bold text-slate-500">Total Price ($)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={price || ''}
                                        onChange={(e) => setPrice(Number(e.target.value))}
                                        className="w-full rounded-lg border border-slate-200 p-2 font-bold dark:bg-slate-800"
                                    />
                                </div>
                            </div>

                            {/* Total Preview */}
                            <div className="flex items-center justify-between rounded-xl bg-blue-600 p-4 text-white">
                                <span className="font-bold">Item Total</span>
                                <span className="text-xl font-bold">${price.toLocaleString()}</span>
                            </div>

                            {/* Add/Update Button */}
                            <button
                                onClick={handleAddItem}
                                className="w-full rounded-xl bg-emerald-600 py-3 font-bold text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] hover:bg-emerald-700 dark:bg-emerald-500 dark:text-slate-900"
                            >
                                {editingItemId ? 'Update Item' : 'Add Item to Quote'}
                            </button>

                            {editingItemId && (
                                <button
                                    onClick={resetForm}
                                    className="w-full rounded-xl border border-slate-300 py-2 font-bold text-slate-600 hover:bg-slate-100"
                                >
                                    Cancel Edit
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ADDED ITEMS LIST */}
            {
                store.currentQuote && store.currentQuote.items.length > 0 && (
                    <div className="mb-8">
                        <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Added Items ({store.currentQuote.items.length})</h2>
                        <div className="space-y-4">
                            {store.currentQuote.items.map((item, index) => (
                                <div
                                    key={item.id}
                                    className="group relative flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-start sm:justify-between"
                                >
                                    {/* ITEM CONTENT - MATCHING PDF STYLE */}
                                    <div className="flex-1">
                                        {/* Header: Name + Dims + Qty */}
                                        <div className="mb-2 flex flex-wrap items-center gap-3">
                                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                                {item.productType?.name}
                                            </h3>
                                            {item.showDimensions && (
                                                <span className="text-lg font-medium text-slate-500">
                                                    ({item.width} x {item.height} {item.unit?.name})
                                                </span>
                                            )}
                                            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                                x{item.quantity}
                                            </span>
                                        </div>

                                        {/* Series */}
                                        <div className="mb-3">
                                            <div className="text-sm font-medium text-slate-500">
                                                {item.productSeries?.name}
                                            </div>
                                            {item.productSeries?.description && (
                                                <div className="mt-1 text-xs text-slate-400">
                                                    {item.productSeries.description}
                                                </div>
                                            )}
                                        </div>

                                        {/* Description */}
                                        {item.description && (
                                            <div className="mb-4 text-sm italic text-slate-600 dark:text-slate-400">
                                                "{item.description}"
                                            </div>
                                        )}

                                        {/* Attributes List */}
                                        <div className="space-y-2 border-l-2 border-slate-100 pl-4 dark:border-slate-800">
                                            {store.attributeCategories.map(cat => {
                                                const attr = item.attributes?.[cat.id];
                                                if (!attr) return null;

                                                const attrArray = Array.isArray(attr) ? attr : [attr];
                                                if (attrArray.length === 0) return null;

                                                return (
                                                    <div key={cat.id} className="mb-2 last:mb-0">
                                                        <div className="flex items-start gap-2 text-sm">
                                                            <span className="mt-0.5 min-w-[80px] text-xs font-bold uppercase text-slate-500">{cat.name}:</span>
                                                            <div className="flex flex-wrap gap-2">
                                                                {attrArray.map((a, idx) => (
                                                                    <div key={idx} className="flex items-center">
                                                                        <span className="font-medium text-slate-700 dark:text-slate-300">
                                                                            {a.name}{idx < attrArray.length - 1 ? ',' : ''}
                                                                        </span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            {item.hasScreen && (
                                                <div className="mt-2 text-sm font-bold text-green-600">
                                                    ✓ Includes Screen
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* PRICE */}
                                    <div className="flex flex-col items-end gap-1">
                                        <div className="text-xl font-bold text-slate-900 dark:text-white">
                                            ${item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </div>
                                    </div>

                                    {/* ACTIONS */}
                                    <div className="absolute right-4 top-16 flex flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100 sm:static sm:flex-row sm:justify-end sm:opacity-100">
                                        <button
                                            onClick={() => handleEditItem(item)}
                                            className="rounded-lg bg-white px-3 py-2 text-sm font-medium text-amber-600 shadow-sm hover:bg-amber-50 dark:bg-slate-800"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDuplicateItem(item.id)}
                                            className="rounded-lg bg-white px-3 py-2 text-sm font-medium text-blue-600 shadow-sm hover:bg-blue-50 dark:bg-slate-800"
                                        >
                                            Duplicate
                                        </button>
                                        <button
                                            onClick={() => store.removeQuoteItem(item.id)}
                                            className="rounded-lg bg-white px-3 py-2 text-sm font-medium text-red-600 shadow-sm hover:bg-red-50 dark:bg-slate-800"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {/* TOTALS SUMMARY */}
                            <div className="mt-6 flex flex-col items-end gap-1 border-t border-slate-200 pt-4 dark:border-slate-700">
                                <div className="flex w-full max-w-xs justify-between text-slate-600 dark:text-slate-400">
                                    <span>Subtotal:</span>
                                    <span>${store.currentQuote.totalPrice.toLocaleString()}</span>
                                </div>
                                <div className="flex w-full max-w-xs justify-between text-slate-600 dark:text-slate-400">
                                    <span>Tax ({store.companySettings.taxRate}%):</span>
                                    <span>${(store.currentQuote.totalPrice * (store.companySettings.taxRate / 100)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex w-full max-w-xs justify-between text-xl font-bold text-slate-900 dark:text-white">
                                    <span>Grand Total:</span>
                                    <span className="text-blue-600">${(store.currentQuote.totalPrice * (1 + store.companySettings.taxRate / 100)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* SECTION 3: TERMS & CONDITIONS (DYNAMIC) */}
            <div className="rounded-xl border-l-4 border-l-amber-500 border-y border-r border-slate-200 bg-amber-50/30 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="mb-4 flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-xs text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                        <span className="font-bold">3</span>
                    </div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">Terms & Conditions</h2>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {store.termCategories.map(category => (
                        <ChipGroup
                            key={category.id}
                            label={category.name}
                            items={category.items}
                            selectedId={category.type === 'single' ? (selectedTerms[category.id]?.[0] || undefined) : selectedTerms[category.id]}
                            onSelect={(item) => handleTermToggle(category.id, item.id, category.type === 'multiple')}
                            multiSelect={category.type === 'multiple'}
                        />
                    ))}
                </div>

                {/* Extra Notes Section */}
                <div className="mt-8 border-t border-slate-100 pt-6 dark:border-slate-800">
                    <div className="mb-2 flex items-center justify-between">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Extra Notes / Additional Info</label>
                        <label className="flex items-center gap-1 text-xs text-slate-500">
                            <input
                                type="checkbox"
                                checked={showExtraNotes}
                                onChange={(e) => {
                                    setShowExtraNotes(e.target.checked);
                                    store.updateExtraNotes(extraNotes, e.target.checked);
                                }}
                                className="rounded border-slate-300"
                            />
                            Show in PDF
                        </label>
                    </div>
                    <textarea
                        value={extraNotes}
                        onChange={(e) => {
                            setExtraNotes(e.target.value);
                            store.updateExtraNotes(e.target.value, showExtraNotes);
                        }}
                        className={cn(
                            "w-full rounded-xl border p-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:bg-slate-800",
                            !showExtraNotes ? "border-slate-200 text-slate-400" : "border-slate-300"
                        )}
                        placeholder="Add any extra terms, warranty details, or notes here..."
                        rows={4}
                    />
                </div>
            </div>

            {/* FOOTER ACTION */}
            <div className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white/80 p-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
                <div className="mx-auto flex max-w-5xl justify-end">
                    {store.currentQuote && store.currentQuote.items.length > 0 ? (
                        <DownloadPDFButton
                            quote={store.currentQuote}
                            categories={store.attributeCategories}
                            termCategories={store.termCategories}
                            companySettings={store.companySettings}
                        />
                    ) : (
                        <button disabled className="cursor-not-allowed rounded-xl bg-slate-200 px-8 py-3 font-bold text-slate-400">
                            Add Items to Download PDF
                        </button>
                    )}
                </div>
            </div>

        </div >
    );
};
