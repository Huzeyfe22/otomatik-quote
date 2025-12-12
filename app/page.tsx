"use client";

import React, { useState, useEffect } from 'react';
import { QuoteBuilder } from '../components/QuoteBuilder';
import { LibraryManager } from '../components/LibraryManager';
import { ContractPreview } from '../components/ContractPreview';
import { QuotePreview } from '../components/QuotePreview';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';

export default function Home() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    // Navigation State
    // 'dashboard' = QuoteBuilder (Main Input)
    // 'quote-preview' = QuotePreview (PDF Edit)
    // 'contract' = ContractPreview (Contract Edit)
    // 'library' = LibraryManager
    const [activeTab, setActiveTab] = useState<'dashboard' | 'quote-preview' | 'contract' | 'library'>('dashboard');

    const store = useStore();

    // Check session storage on mount
    useEffect(() => {
        const auth = sessionStorage.getItem("is_authenticated");
        if (auth === "true") {
            setIsAuthenticated(true);
        }
    }, []);

    // Hydration for store
    useEffect(() => {
        useStore.persist.rehydrate();
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === "admin123" || password === "1234") {
            setIsAuthenticated(true);
            sessionStorage.setItem("is_authenticated", "true");
            setError("");
        } else {
            setError("Hatalı şifre!");
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
                <div className="w-full max-w-md rounded-2xl bg-slate-900 p-8 shadow-2xl ring-1 ring-white/10">
                    <div className="mb-8 text-center">
                        <div className="mx-auto mb-4 h-12 w-12 rounded-xl bg-blue-600/20 text-blue-500 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-white">Giriş Yapın</h1>
                        <p className="text-slate-400 mt-2">Devam etmek için şifreyi giriniz</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-lg bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:ring-blue-500 focus:border-blue-500 p-3"
                                placeholder="Şifre..."
                                autoFocus
                            />
                        </div>

                        {error && (
                            <div className="text-red-400 text-sm text-center bg-red-400/10 p-2 rounded-lg">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-500 transition-colors"
                        >
                            Giriş Yap
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <main className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Left Sidebar */}
            <aside className="sticky top-0 flex h-screen w-64 flex-col justify-between border-r border-blue-800 bg-blue-900 text-white shadow-xl">
                <div>
                    {/* Logo / Brand */}
                    <div className="flex h-20 items-center gap-3 px-6 border-b border-blue-800/50">
                        <div className="h-8 w-8 rounded-lg bg-white/10" />
                        <h1 className="text-lg font-bold tracking-tight text-white">
                            Aluminum Station
                        </h1>
                    </div>

                    {/* Navigation */}
                    <nav className="mt-6 flex flex-col gap-2 px-4">
                        <div className="mb-2 px-2 text-xs font-bold text-blue-300 uppercase tracking-wider">Main</div>
                        <button
                            onClick={() => setActiveTab('dashboard')}
                            className={cn(
                                "flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all",
                                activeTab === 'dashboard'
                                    ? "bg-blue-800 text-white shadow-md ring-1 ring-blue-700"
                                    : "text-blue-200 hover:bg-blue-800/50 hover:text-white"
                            )}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                            Dashboard
                        </button>

                        <div className="mt-4 mb-2 px-2 text-xs font-bold text-blue-300 uppercase tracking-wider">Documents</div>
                        <button
                            onClick={() => setActiveTab('quote-preview')}
                            className={cn(
                                "flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all",
                                activeTab === 'quote-preview'
                                    ? "bg-blue-800 text-white shadow-md ring-1 ring-blue-700"
                                    : "text-blue-200 hover:bg-blue-800/50 hover:text-white"
                            )}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Quote
                        </button>
                        <button
                            onClick={() => setActiveTab('contract')}
                            className={cn(
                                "flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all",
                                activeTab === 'contract'
                                    ? "bg-blue-800 text-white shadow-md ring-1 ring-blue-700"
                                    : "text-blue-200 hover:bg-blue-800/50 hover:text-white"
                            )}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            Contract
                        </button>

                        <div className="mt-4 mb-2 px-2 text-xs font-bold text-blue-300 uppercase tracking-wider">Settings</div>
                        <button
                            onClick={() => setActiveTab('library')}
                            className={cn(
                                "flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all",
                                activeTab === 'library'
                                    ? "bg-blue-800 text-white shadow-md ring-1 ring-blue-700"
                                    : "text-blue-200 hover:bg-blue-800/50 hover:text-white"
                            )}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Library Settings
                        </button>
                    </nav>
                </div>

                {/* Footer / Version */}
                <div className="border-t border-blue-800/50 p-6">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-800" />
                        <div className="text-xs text-blue-300">
                            <p className="font-medium text-white">v1.1.0</p>
                            <p>Canada Edition</p>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            sessionStorage.removeItem("is_authenticated");
                            setIsAuthenticated(false);
                        }}
                        className="mt-4 text-xs text-blue-400 hover:text-white transition-colors"
                    >
                        Çıkış Yap
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-0">
                {activeTab === 'dashboard' && (
                    <div className="p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <QuoteBuilder />
                    </div>
                )}

                {activeTab === 'quote-preview' && (
                    <div className="h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {store.currentQuote ? (
                            <QuotePreview
                                quote={store.currentQuote}
                                companySettings={store.companySettings}
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center text-slate-500">
                                No active quote. Please create one in the Dashboard.
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'contract' && (
                    <div className="h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {store.currentQuote ? (
                            <ContractPreview
                                quote={store.currentQuote}
                                companySettings={store.companySettings}
                                onClose={() => setActiveTab('dashboard')}
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center text-slate-500">
                                No active quote. Please create one in the Dashboard.
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'library' && (
                    <div className="p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <LibraryManager />
                    </div>
                )}
            </div>
        </main>
    );
}
