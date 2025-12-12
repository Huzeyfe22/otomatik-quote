import React, { useState, useEffect } from 'react';
import { Quote, CompanySettings } from '../types';
import { PDFViewer } from '@react-pdf/renderer';
import { SafePDFDocument } from './SafePDFDocument';
import { useStore } from '../store/useStore';

interface QuotePreviewProps {
    quote: Quote;
    companySettings: CompanySettings;
}

export const QuotePreview: React.FC<QuotePreviewProps> = ({ quote: initialQuote, companySettings }) => {
    const store = useStore();
    const [quote, setQuote] = useState<Quote>(initialQuote);
    const [localQuote, setLocalQuote] = useState<Quote>(initialQuote);
    const [isClient, setIsClient] = useState(false);
    const [showPDF, setShowPDF] = useState(false);
    const [activeTab, setActiveTab] = useState<'client' | 'notes' | 'products'>('client');

    useEffect(() => {
        setIsClient(true);

        // Deep copy to avoid mutating prop
        const quoteCopy = JSON.parse(JSON.stringify(initialQuote));

        // Pre-populate descriptions if empty, to match PDF view
        if (quoteCopy.items) {
            quoteCopy.items.forEach((item: any) => {
                if (!item.description) {
                    const descParts: string[] = [];

                    // 1. Series Info
                    if (item.productSeries) {
                        descParts.push(`Series: ${item.productSeries.name}`);
                        if (item.productSeries.description) {
                            descParts.push(item.productSeries.description);
                        }
                    }

                    // 2. Dimensions
                    if (item.width && item.height) {
                        descParts.push(`Dimensions: ${item.width}" x ${item.height}"`);
                    }

                    // 3. Attributes & Descriptions
                    store.attributeCategories.forEach(cat => {
                        const attr = item.attributes?.[cat.id];
                        if (attr) {
                            const attrArray = Array.isArray(attr) ? attr : [attr];
                            if (attrArray.length > 0) {
                                // Value Line
                                const attrNames = attrArray.map((a: any) => a.name).join(', ');
                                descParts.push(`${cat.name}: ${attrNames}`);

                                // Description Line(s)
                                attrArray.forEach((a: any) => {
                                    if (a.description) {
                                        descParts.push(a.description);
                                    }
                                });
                            }
                        }
                    });

                    // 4. Screen
                    if (item.hasScreen) {
                        descParts.push('Includes Screen');
                    }

                    item.description = descParts.join('\n');
                    item.isCustomDescription = false; // Mark as auto-generated
                }
            });
        }

        setQuote(quoteCopy);
        setLocalQuote(quoteCopy);
    }, [initialQuote, store.attributeCategories]);

    // Handlers
    const handleClientChange = (field: keyof typeof quote.client, value: string) => {
        setQuote(prev => ({
            ...prev,
            client: { ...prev.client, [field]: value }
        }));
        setLocalQuote(prev => ({
            ...prev,
            client: { ...prev.client, [field]: value }
        }));
    };

    const handleNoteChange = (value: string) => {
        setQuote(prev => ({ ...prev, extraNotes: value }));
        setLocalQuote(prev => ({ ...prev, extraNotes: value }));
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900">

            {/* PDF VIEWER MODAL */}
            {showPDF && isClient && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-10 backdrop-blur-sm">
                    <div className="relative h-full w-full max-w-6xl rounded-xl bg-white shadow-2xl overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between bg-slate-100 px-4 py-2 border-b border-slate-200">
                            <h3 className="font-bold text-slate-700">Quote PDF Preview</h3>
                            <button
                                onClick={() => setShowPDF(false)}
                                className="rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white hover:bg-red-600"
                            >
                                CLOSE
                            </button>
                        </div>
                        <div className="flex-1 bg-slate-500">
                            <PDFViewer width="100%" height="100%" className="border-none">
                                <SafePDFDocument
                                    quote={localQuote}
                                    categories={store.attributeCategories}
                                    termCategories={store.termCategories}
                                    companySettings={companySettings}
                                />
                            </PDFViewer>
                        </div>
                    </div>
                </div>
            )}

            {/* HEADER */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold text-slate-800 dark:text-white">Quote Editor</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <div className="text-xs text-slate-500">Total Quote Value</div>
                        <div className="text-lg font-bold text-slate-900 dark:text-white">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
                                (quote.isManualPricing && quote.manualSubtotal !== undefined
                                    ? quote.manualSubtotal
                                    : quote.totalPrice) * (1 + (companySettings.taxRate / 100))
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 mr-4 border-r border-slate-200 pr-4 dark:border-slate-800">
                        <label className="flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-400 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={localQuote.client.showEmail || false}
                                onChange={(e) => {
                                    store.updateClientInfo({ showEmail: e.target.checked });
                                    setLocalQuote(prev => ({ ...prev, client: { ...prev.client, showEmail: e.target.checked } }));
                                }}
                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            Email
                        </label>
                        <label className="flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-400 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={localQuote.client.showPhone || false}
                                onChange={(e) => {
                                    store.updateClientInfo({ showPhone: e.target.checked });
                                    setLocalQuote(prev => ({ ...prev, client: { ...prev.client, showPhone: e.target.checked } }));
                                }}
                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            Phone
                        </label>
                        <label className="flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-400 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={localQuote.showQuoteDate || false}
                                onChange={(e) => {
                                    store.updateQuoteMeta({ showQuoteDate: e.target.checked });
                                    setLocalQuote(prev => ({ ...prev, showQuoteDate: e.target.checked }));
                                }}
                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            Date
                        </label>
                        <label className="flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-400 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={localQuote.hasCoverPage || false}
                                onChange={(e) => {
                                    store.toggleCoverPage(e.target.checked);
                                    setLocalQuote(prev => ({ ...prev, hasCoverPage: e.target.checked }));
                                }}
                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            Cover
                        </label>
                    </div>

                    <button
                        onClick={() => setShowPDF(true)}
                        className="rounded-lg bg-blue-600 px-6 py-2 font-bold text-white hover:bg-blue-700 shadow-md transition-all active:scale-95"
                    >
                        PREVIEW PDF
                    </button>
                </div>
            </div>

            {/* MAIN EDITOR */}
            <div className="flex flex-1 overflow-hidden">

                {/* LEFT: NAVIGATION */}
                <div className="w-64 border-r border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                    <div className="space-y-2">
                        <button
                            onClick={() => setActiveTab('client')}
                            className={`w-full rounded-md px-4 py-2 text-left text-sm font-medium transition-colors ${activeTab === 'client' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400'}`}
                        >
                            Client & Project Info
                        </button>
                        <button
                            onClick={() => setActiveTab('products')}
                            className={`w-full rounded-md px-4 py-2 text-left text-sm font-medium transition-colors ${activeTab === 'products' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400'}`}
                        >
                            Products
                        </button>
                        <button
                            onClick={() => setActiveTab('notes')}
                            className={`w-full rounded-md px-4 py-2 text-left text-sm font-medium transition-colors ${activeTab === 'notes' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400'}`}
                        >
                            Extra Notes
                        </button>
                    </div>
                </div>

                {/* RIGHT: CONTENT EDITOR */}
                <div className="flex-1 overflow-y-auto p-8">
                    <div className="mx-auto max-w-4xl">

                        {activeTab === 'client' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-serif text-slate-800 dark:text-white mb-6">Client & Project Information</h2>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">Client Name</label>
                                        <input
                                            type="text"
                                            value={quote.client.name}
                                            onChange={(e) => handleClientChange('name', e.target.value)}
                                            className="w-full rounded border border-slate-200 p-2 text-sm focus:border-blue-500 focus:outline-none dark:bg-slate-900 dark:border-slate-700"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">Project Name</label>
                                        <input
                                            type="text"
                                            value={quote.name}
                                            onChange={(e) => setQuote(prev => ({ ...prev, name: e.target.value }))}
                                            className="w-full rounded border border-slate-200 p-2 text-sm focus:border-blue-500 focus:outline-none dark:bg-slate-900 dark:border-slate-700"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">Client Address</label>
                                        <textarea
                                            value={quote.client.address}
                                            onChange={(e) => handleClientChange('address', e.target.value)}
                                            className="w-full rounded border border-slate-200 p-2 text-sm focus:border-blue-500 focus:outline-none dark:bg-slate-900 dark:border-slate-700"
                                            rows={3}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'products' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-serif text-slate-800 dark:text-white mb-6">Product Specifications</h2>
                                {quote.items.map((item, i) => (
                                    <div key={item.id} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                                        <div className="mb-4 flex flex-col gap-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs font-bold text-slate-400 uppercase">Item #{i + 1}</span>
                                                <span className="text-xs text-slate-400">
                                                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.price * item.quantity)}
                                                </span>
                                            </div>
                                            <input
                                                type="text"
                                                value={item.name || item.productType.name}
                                                onChange={(e) => {
                                                    const newName = e.target.value;
                                                    setQuote(prev => ({
                                                        ...prev,
                                                        items: prev.items.map(it => it.id === item.id ? { ...it, name: newName } : it)
                                                    }));
                                                    setLocalQuote(prev => ({
                                                        ...prev,
                                                        items: prev.items.map(it => it.id === item.id ? { ...it, name: newName } : it)
                                                    }));
                                                }}
                                                className="w-full rounded border border-slate-200 p-2 text-sm font-bold text-slate-700 focus:border-blue-500 focus:outline-none dark:bg-slate-900 dark:border-slate-600 dark:text-slate-200"
                                                placeholder="Item Name"
                                            />
                                        </div>
                                        <textarea
                                            value={item.description || ''}
                                            onChange={(e) => {
                                                const newDesc = e.target.value;
                                                setQuote(prev => ({
                                                    ...prev,
                                                    items: prev.items.map(it => it.id === item.id ? { ...it, description: newDesc, isCustomDescription: true } : it)
                                                }));
                                                setLocalQuote(prev => ({
                                                    ...prev,
                                                    items: prev.items.map(it => it.id === item.id ? { ...it, description: newDesc, isCustomDescription: true } : it)
                                                }));
                                            }}
                                            className="h-32 w-full rounded border border-slate-200 p-3 text-sm leading-relaxed focus:border-blue-500 focus:outline-none dark:bg-slate-900 dark:border-slate-600"
                                            placeholder="Item description..."
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'notes' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-serif text-slate-800 dark:text-white mb-6">Extra Notes</h2>
                                <textarea
                                    value={quote.extraNotes || ''}
                                    onChange={(e) => handleNoteChange(e.target.value)}
                                    className="h-64 w-full rounded border border-slate-200 p-4 text-sm font-mono leading-relaxed focus:border-blue-500 focus:outline-none dark:bg-slate-900 dark:border-slate-600"
                                    placeholder="Enter any additional notes for the quote PDF..."
                                />
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};
