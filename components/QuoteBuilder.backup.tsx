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

    // Validation State
    const [errors, setErrors] = useState<Record<string, string>>({});
    const itemsEndRef = React.useRef<HTMLDivElement>(null);
    const formTopRef = React.useRef<HTMLDivElement>(null);

    // Refs for auto-scrolling
    const productTypeRef = React.useRef<HTMLDivElement>(null);
    const seriesRef = React.useRef<HTMLDivElement>(null);
    const dimensionsRef = React.useRef<HTMLDivElement>(null);
    const descriptionRef = React.useRef<HTMLDivElement>(null);
    const pricingRef = React.useRef<HTMLDivElement>(null);

    // Helper to scroll to next section
    const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
        setTimeout(() => {
            ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300); // Small delay for better UX
    };

    // Hydration check for persist
    useEffect(() => {
        useStore.persist.rehydrate();
    }, []);

    // Initialize Quote if null (Fix for 'Add Item' not working)
    useEffect(() => {
        if (!store.currentQuote) {
            const newQuote: any = {
                id: Date.now().toString(), // Simple ID
                name: 'New Quote',
                client: { name: '', address: '', email: '', phone: '' },
                items: [],
                totalPrice: 0,
                status: 'draft',
                createdAt: new Date(),
                updatedAt: new Date(),
                selectedTerms: {},
                companySettings: store.companySettings
            };
            store.setQuote(newQuote);
        }
    }, [store.currentQuote, store.setQuote, store.companySettings]);

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

    // Auto-populate units if missing (Fix for existing users with empty units)
    useEffect(() => {
        // Check if hydration is complete (store is ready) and units are empty
        if (store.units.length === 0) {
            const defaultUnits = [
                { id: 'u_mm', name: 'mm', hasDescription: false },
                { id: 'u_cm', name: 'cm', hasDescription: false },
                { id: 'u_in', name: 'in', hasDescription: false },
                { id: 'u_ft', name: 'ft', hasDescription: false }
            ];
            // We use a timeout to ensure we don't conflict with hydration
            setTimeout(() => {
                defaultUnits.forEach(u => store.addSystemItem('units', u));
            }, 500);
        }
    }, [store.units.length]);

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
        setErrors({});
        // Scroll to form top to start fresh
        formTopRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleAddItem = () => {
        const newErrors: Record<string, string> = {};

        if (!selectedProductType) newErrors.productType = 'Product Type is required';
        if (!selectedSeries) newErrors.productSeries = 'Product Series is required';

        if (showDimensions) {
            if (width <= 0) newErrors.width = 'Width must be greater than 0';
            if (height <= 0) newErrors.height = 'Height must be greater than 0';
            if (!selectedUnit) newErrors.unit = 'Unit is required';
        }

        if (price < 0) newErrors.price = 'Price cannot be negative';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            // Scroll to the first error or form top
            formTopRef.current?.scrollIntoView({ behavior: 'smooth' });
            return;
        }

        const itemData = {
            productType: selectedProductType!,
            productSeries: selectedSeries!,
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

        try {
            if (editingItemId) {
                store.updateQuoteItem(editingItemId, itemData);
                setEditingItemId(null); // Exit edit mode
                resetForm();
                setTimeout(() => itemsEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
            } else {
                // Use a safer ID generation method than crypto.randomUUID()
                const newId = Date.now().toString() + Math.random().toString(36).substr(2, 9);

                // Ensure currentQuote exists before adding (Double check)
                if (!store.currentQuote) {
                    const newQuote: any = {
                        id: Date.now().toString(),
                        name: 'New Quote',
                        client: { name: '', address: '', email: '', phone: '' },
                        items: [],
                        totalPrice: 0,
                        status: 'draft',
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        selectedTerms: {},
                        companySettings: store.companySettings
                    };
                    store.setQuote(newQuote);
                    // Small delay to allow state update
                    setTimeout(() => {
                        store.addQuoteItem({
                            id: newId,
                            ...itemData
                        } as QuoteItem);
                    }, 50);
                } else {
                    store.addQuoteItem({
                        id: newId,
                        ...itemData
                    } as QuoteItem);
                }

                resetForm();
                setTimeout(() => itemsEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
            }
        } catch (error) {
            console.error("Failed to add/update item:", error);
            alert("An error occurred while adding the item. Please check the console for details.");
        }
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
        setErrors({});
        formTopRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleDuplicateItem = (itemId: string) => {
        store.duplicateQuoteItem(itemId);
        setTimeout(() => itemsEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
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
                                resetForm();
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
            <div ref={formTopRef} className="mb-6 rounded-xl border-l-4 border-l-emerald-500 border-y border-r border-slate-200 bg-emerald-50/30 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                            <span className="font-bold">2</span>
                        </div>
                        <h2 className="text-base font-bold text-slate-900 dark:text-white">
                            {editingItemId ? 'Edit Item' : 'Add Products'}
                        </h2>
                    </div>
                    <button
                        onClick={resetForm}
                        className="text-sm font-medium text-slate-500 hover:text-slate-800 underline"
                    >
                        Clear Form / New Item
                    </button>
                </div>

                <div className="space-y-8">
                    {/* LEFT COLUMN: Configuration (Wider) */}
                    <div className="space-y-6">
                        {/* Product Type */}
                        <div ref={productTypeRef} className={cn("rounded-xl p-4 transition-colors border border-blue-100 bg-blue-50/50 dark:border-blue-900/30 dark:bg-blue-900/10", errors.productType ? "bg-red-50 ring-1 ring-red-200" : "")}>
                            <ChipGroup
                                label={store.companySettings.categoryLabels?.['productTypes'] || 'Product Type'}
                                items={store.productTypes}
                                selectedId={selectedProductType?.id}
                                onSelect={(item) => {
                                    setSelectedProductType(item);
                                    if (errors.productType) setErrors({ ...errors, productType: '' });
                                    scrollToSection(seriesRef);
                                }}
                            />
                            {errors.productType && <p className="mt-1 text-xs font-bold text-red-500">{errors.productType}</p>}
                        </div>

                        {/* Series */}
                        <div ref={seriesRef} className={cn("rounded-xl p-4 transition-colors border border-indigo-100 bg-indigo-50/50 dark:border-indigo-900/30 dark:bg-indigo-900/10", errors.productSeries ? "bg-red-50 ring-1 ring-red-200" : "")}>
                            <ChipGroup
                                label={store.companySettings.categoryLabels?.['productSeries'] || 'Product Series'}
                                items={store.productSeries}
                                selectedId={selectedSeries?.id}
                                onSelect={(item) => {
                                    setSelectedSeries(item);
                                    if (errors.productSeries) setErrors({ ...errors, productSeries: '' });
                                    scrollToSection(dimensionsRef);
                                }}
                            />
                            {errors.productSeries && <p className="mt-1 text-xs font-bold text-red-500">{errors.productSeries}</p>}
                        </div>

                        {/* Dynamic Attributes */}
                        {store.attributeCategories.map(category => {
                            const isMulti = category.type === 'multiple';
                            const selectedVal = selectedAttributes[category.id];
                            const selectedId = isMulti
                                ? (Array.isArray(selectedVal) ? selectedVal.map(i => i.id) : [])
                                : (Array.isArray(selectedVal) ? selectedVal[0]?.id : selectedVal?.id);

                            return (
                                <div key={category.id} className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                    <ChipGroup
                                        label={category.name + (isMulti ? ' (Multi)' : '')}
                                        items={category.items}
                                        selectedId={selectedId}
                                        multiSelect={isMulti}
                                        onSelect={(item) => handleAttributeSelect(category.id, item, isMulti)}
                                    />
                                </div>
                            );
                        })}

                        {/* DIMENSIONS SECTION */}
                        <div ref={dimensionsRef} className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-6 dark:border-emerald-900/30 dark:bg-emerald-900/10">
                            <div className="mb-4 flex items-center justify-between">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Dimensions & Unit</label>
                                <button
                                    onClick={() => setShowDimensions(!showDimensions)}
                                    className={cn(
                                        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                                        showDimensions ? "bg-emerald-600" : "bg-slate-300"
                                    )}
                                >
                                    <span className={cn(
                                        "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                                        showDimensions ? "translate-x-6" : "translate-x-1"
                                    )} />
                                </button>
                            </div>

                            {showDimensions && (
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                                    <div>
                                        <label className="mb-1 block text-xs font-bold text-slate-500">Width</label>
                                        <input
                                            type="number"
                                            value={width || ''}
                                            onChange={(e) => {
                                                setWidth(Number(e.target.value));
                                                if (errors.width) setErrors({ ...errors, width: '' });
                                            }}
                                            className={cn(
                                                "w-full rounded-lg border p-3 text-sm font-medium transition-all focus:ring-2 focus:ring-emerald-500 dark:bg-slate-800",
                                                errors.width ? "border-red-500 bg-red-50" : "border-slate-200"
                                            )}
                                            placeholder="0"
                                        />
                                        {errors.width && <p className="mt-1 text-xs text-red-500">{errors.width}</p>}
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs font-bold text-slate-500">Height</label>
                                        <input
                                            type="number"
                                            value={height || ''}
                                            onChange={(e) => {
                                                setHeight(Number(e.target.value));
                                                if (errors.height) setErrors({ ...errors, height: '' });
                                            }}
                                            className={cn(
                                                "w-full rounded-lg border p-3 text-sm font-medium transition-all focus:ring-2 focus:ring-emerald-500 dark:bg-slate-800",
                                                errors.height ? "border-red-500 bg-red-50" : "border-slate-200"
                                            )}
                                            placeholder="0"
                                        />
                                        {errors.height && <p className="mt-1 text-xs text-red-500">{errors.height}</p>}
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs font-bold text-slate-500">Unit</label>
                                        <div className="flex flex-wrap gap-2">
                                            {store.units.map(u => (
                                                <button
                                                    key={u.id}
                                                    onClick={() => {
                                                        setSelectedUnit(u);
                                                        if (errors.unit) setErrors({ ...errors, unit: '' });
                                                        scrollToSection(descriptionRef);
                                                    }}
                                                    className={cn(
                                                        "rounded-md border px-4 py-2.5 text-xs font-bold transition-all",
                                                        selectedUnit?.id === u.id
                                                            ? "border-emerald-600 bg-emerald-600 text-white shadow-md"
                                                            : "border-slate-200 text-slate-500 hover:border-emerald-300 hover:text-emerald-700 dark:border-slate-700 dark:text-slate-400"
                                                    )}
                                                >
                                                    {u.name}
                                                </button>
                                            ))}
                                        </div>
                                        {errors.unit && <p className="mt-1 text-xs text-red-500">{errors.unit}</p>}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div ref={descriptionRef} className="rounded-xl border border-amber-100 bg-amber-50/50 p-6 dark:border-amber-900/30 dark:bg-amber-900/10">
                            <label className="mb-2 block text-sm font-semibold uppercase tracking-wider text-slate-500">
                                Description / Notes
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                onFocus={() => scrollToSection(pricingRef)}
                                className="w-full rounded-xl border border-slate-200 p-4 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500 dark:bg-slate-800"
                                placeholder="Optional details about this item..."
                                rows={3}
                            />
                        </div>

                        {/* ELITE PRICING & ACTION SECTION */}
                        <div ref={pricingRef} className="rounded-2xl border border-slate-200 bg-slate-50 p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
                            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">

                                {/* Inputs */}
                                <div className="flex-1 space-y-6">
                                    <div className="flex items-center gap-4">
                                        <label className="flex cursor-pointer items-center gap-3 rounded-lg bg-white px-4 py-2 shadow-sm border border-slate-200 hover:border-slate-300 transition-colors">
                                            <input
                                                type="checkbox"
                                                checked={hasScreen}
                                                onChange={(e) => setHasScreen(e.target.checked)}
                                                className="h-5 w-5 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                                            />
                                            <span className="text-sm font-bold text-slate-700">Include Screen</span>
                                        </label>
                                    </div>

                                    <div className="flex flex-wrap gap-6">
                                        <div className="w-32">
                                            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Quantity</label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={quantity}
                                                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                                                className="w-full rounded-lg border border-slate-200 bg-white p-3 text-lg font-bold text-slate-900 focus:border-slate-900 focus:ring-2 focus:ring-slate-900 dark:bg-slate-800 dark:text-white"
                                            />
                                        </div>
                                        <div className="w-48">
                                            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Unit Price</label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={price || ''}
                                                    onChange={(e) => setPrice(Number(e.target.value))}
                                                    className={cn(
                                                        "w-full rounded-lg border bg-white p-3 pl-7 text-lg font-bold text-slate-900 focus:border-slate-900 focus:ring-2 focus:ring-slate-900 dark:bg-slate-800 dark:text-white",
                                                        errors.price ? "border-red-500 bg-red-50" : "border-slate-200"
                                                    )}
                                                    placeholder="0.00"
                                                />
                                            </div>
                                            {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Total & Action */}
                                <div className="flex flex-col items-end gap-6">
                                    <div className="text-right">
                                        <span className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Estimated Total</span>
                                        <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                                            ${(price * quantity).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                    </div>

                                    <div className="flex gap-3 w-full sm:w-auto">
                                        {editingItemId && (
                                            <button
                                                onClick={resetForm}
                                                className="rounded-xl border border-slate-300 bg-white px-6 py-4 font-bold text-slate-600 transition-all hover:bg-slate-50 hover:shadow-md active:scale-95"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                        <button
                                            onClick={() => {
                                                console.log('Attempting to add item...');
                                                handleAddItem();
                                            }}
                                            className="flex-1 sm:flex-none min-w-[200px] rounded-xl bg-slate-900 px-8 py-4 font-bold text-white shadow-lg transition-all hover:bg-slate-800 hover:shadow-xl active:scale-95 dark:bg-white dark:text-slate-900"
                                        >
                                            {editingItemId ? 'UPDATE ITEM' : 'ADD ITEM'}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Error Summary */}
                            {Object.keys(errors).length > 0 && (
                                <div className="mt-6 rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-red-600 animate-pulse">
                                    <div className="flex items-center gap-2 font-bold mb-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        Please fix the following errors:
                                    </div>
                                    <ul className="list-inside list-disc pl-7">
                                        {Object.values(errors).map((err, i) => (
                                            <li key={i}>{err}</li>
                                        ))}
                                    </ul>
                                </div>
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
                                                        <div className="flex flex-col gap-1 text-sm">
                                                            <span className="text-xs font-bold uppercase text-slate-500">{cat.name}:</span>
                                                            <div className="flex flex-wrap gap-3">
                                                                {attrArray.map((a, idx) => (
                                                                    <div key={idx} className="flex flex-col">
                                                                        <span className="font-bold text-slate-800 dark:text-slate-200">
                                                                            {a.name}{idx < attrArray.length - 1 ? ',' : ''}
                                                                        </span>
                                                                        {a.description && (
                                                                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                                                                {a.description}
                                                                            </span>
                                                                        )}
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
                            <div ref={itemsEndRef} />

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
                    />
                </div>
            </div>

            {/* DOWNLOAD BUTTON */}
            <div className="fixed bottom-6 right-6 z-50">
                {store.currentQuote && (
                    <DownloadPDFButton
                        quote={store.currentQuote}
                        categories={store.attributeCategories}
                        termCategories={store.termCategories}
                        companySettings={store.companySettings}
                    />
                )}
            </div>
        </div>
    );
};
