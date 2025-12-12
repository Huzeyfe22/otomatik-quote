import React, { useState, useEffect } from 'react';
import { Quote, CompanySettings } from '../types';
import { generateContractData } from '../lib/contractTemplate';
import { PDFViewer } from '@react-pdf/renderer';
import { ContractPDFDocument } from './ContractPDFDocument';
import { useStore } from '../store/useStore';

interface ContractPreviewProps {
    quote: Quote;
    companySettings: CompanySettings;
    onClose: () => void;
}

export const ContractPreview: React.FC<ContractPreviewProps> = ({ quote, companySettings, onClose }) => {
    const store = useStore();

    // 1. INITIALIZE DATA FROM TEMPLATE ENGINE
    const [data, setData] = useState(() => generateContractData(quote, companySettings, store.attributeCategories));
    const [localQuote, setLocalQuote] = useState<Quote>(quote);
    const [isClient, setIsClient] = useState(false);
    const [showPDF, setShowPDF] = useState(false);
    const [activeTab, setActiveTab] = useState<'products' | 'clauses' | 'project' | 'financial'>('products');

    useEffect(() => {
        setIsClient(true);
        setLocalQuote(quote);
    }, [quote]);

    // HANDLERS
    const handleIntroChange = (val: string) => setData(prev => ({ ...prev, intro: val }));
    const handleProjectInfoChange = (val: string) => setData(prev => ({ ...prev, projectInfo: val }));
    const handleFinancialsChange = (val: string) => setData(prev => ({ ...prev, financials: val }));

    const handleProductChange = (id: string, newContent: string) => {
        setData(prev => ({
            ...prev,
            products: prev.products.map(p => p.id === id ? { ...p, content: newContent } : p)
        }));
    };

    const handleClauseChange = (id: string, newContent: string) => {
        setData(prev => ({
            ...prev,
            clauses: prev.clauses.map(c => c.id === id ? { ...c, content: newContent } : c)
        }));
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900">

            {/* PDF VIEWER MODAL */}
            {showPDF && isClient && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-10 backdrop-blur-sm">
                    <div className="relative h-full w-full max-w-6xl rounded-xl bg-white shadow-2xl overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between bg-slate-100 px-4 py-2 border-b border-slate-200">
                            <h3 className="font-bold text-slate-700">Contract PDF Preview</h3>
                            <button
                                onClick={() => setShowPDF(false)}
                                className="rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white hover:bg-red-600"
                            >
                                CLOSE
                            </button>
                        </div>
                        <div className="flex-1 bg-slate-500">
                            <PDFViewer width="100%" height="100%" className="border-none">
                                <ContractPDFDocument
                                    quote={localQuote}
                                    companySettings={companySettings}
                                    data={data}
                                    categories={store.attributeCategories}
                                />
                            </PDFViewer>
                        </div>
                    </div>
                </div>
            )}

            {/* --- HEADER --- */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold text-slate-800 dark:text-white">Contract Editor</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <div className="text-xs text-slate-500">Total Contract Value</div>
                        <div className="text-lg font-bold text-slate-900 dark:text-white">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
                                localQuote.isManualPricing && localQuote.manualSubtotal !== undefined
                                    ? localQuote.manualSubtotal * (1 + (companySettings.taxRate / 100))
                                    : data.totals.totalContractPrice
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

            {/* --- MAIN EDITOR --- */}
            <div className="flex flex-1 overflow-hidden">

                {/* LEFT: NAVIGATION */}
                <div className="w-64 border-r border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                    <div className="space-y-2">
                        <button
                            onClick={() => setActiveTab('project')}
                            className={`w-full rounded-md px-4 py-2 text-left text-sm font-medium transition-colors ${activeTab === 'project' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400'}`}
                        >
                            Project Info
                        </button>
                        <button
                            onClick={() => setActiveTab('products')}
                            className={`w-full rounded-md px-4 py-2 text-left text-sm font-medium transition-colors ${activeTab === 'products' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400'}`}
                        >
                            Product Specifications
                        </button>
                        <button
                            onClick={() => setActiveTab('financial')}
                            className={`w-full rounded-md px-4 py-2 text-left text-sm font-medium transition-colors ${activeTab === 'financial' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400'}`}
                        >
                            Financial Summary
                        </button>
                        <button
                            onClick={() => setActiveTab('clauses')}
                            className={`w-full rounded-md px-4 py-2 text-left text-sm font-medium transition-colors ${activeTab === 'clauses' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400'}`}
                        >
                            Terms & Conditions
                        </button>
                    </div>

                    <div className="mt-8">
                        <label className="mb-2 block text-xs font-bold text-slate-400 uppercase">Cover / Intro Text</label>
                        <textarea
                            value={data.intro}
                            onChange={(e) => handleIntroChange(e.target.value)}
                            className="h-64 w-full rounded border border-slate-200 p-2 text-xs leading-relaxed focus:border-blue-500 focus:outline-none dark:bg-slate-900 dark:border-slate-700"
                        />
                    </div>
                </div>

                {/* RIGHT: CONTENT EDITOR */}
                <div className="flex-1 overflow-y-auto p-8">
                    <div className="mx-auto max-w-4xl">

                        {activeTab === 'project' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-serif text-slate-800 dark:text-white mb-6">Project Information</h2>
                                <textarea
                                    value={data.projectInfo}
                                    onChange={(e) => handleProjectInfoChange(e.target.value)}
                                    className="h-96 w-full rounded border border-slate-200 p-4 text-sm leading-relaxed focus:border-blue-500 focus:outline-none dark:bg-slate-900 dark:border-slate-600"
                                />
                            </div>
                        )}

                        {activeTab === 'products' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-serif text-slate-800 dark:text-white mb-6">Product Specifications</h2>
                                {data.products.map((prod, i) => (
                                    <div key={prod.id} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                                        <div className="mb-2 flex justify-between">
                                            <span className="font-bold text-slate-700 dark:text-slate-200">{prod.title}</span>
                                            <span className="text-xs text-slate-400">Item #{i + 1}</span>
                                        </div>
                                        <textarea
                                            value={prod.content}
                                            onChange={(e) => handleProductChange(prod.id, e.target.value)}
                                            className="h-40 w-full rounded border border-slate-200 p-3 text-sm leading-relaxed focus:border-blue-500 focus:outline-none dark:bg-slate-900 dark:border-slate-600"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'financial' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-serif text-slate-800 dark:text-white mb-6">Financial Summary</h2>
                                <textarea
                                    value={data.financials}
                                    onChange={(e) => handleFinancialsChange(e.target.value)}
                                    className="h-64 w-full rounded border border-slate-200 p-4 text-sm leading-relaxed focus:border-blue-500 focus:outline-none dark:bg-slate-900 dark:border-slate-600"
                                />
                            </div>
                        )}

                        {activeTab === 'clauses' && (
                            <div className="space-y-8">
                                <h2 className="text-2xl font-serif text-slate-800 dark:text-white mb-6">Terms & Conditions</h2>
                                {data.clauses.map((clause) => (
                                    <div key={clause.id} className="group">
                                        <label className="mb-2 block font-bold text-slate-700 dark:text-slate-300">{clause.title}</label>
                                        <textarea
                                            value={clause.content}
                                            onChange={(e) => handleClauseChange(clause.id, e.target.value)}
                                            className="w-full rounded-lg border border-slate-200 p-4 text-sm leading-relaxed shadow-sm focus:border-blue-500 focus:outline-none dark:bg-slate-800 dark:border-slate-700"
                                            rows={clause.content.split('\n').length + 2}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                    </div>
                </div>

            </div>
        </div>
    );
};
