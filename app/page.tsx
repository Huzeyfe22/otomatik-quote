"use client";

import React, { useState, useEffect } from 'react';
import { QuoteBuilder } from '../components/QuoteBuilder';
import { LibraryManager } from '../components/LibraryManager';
import { cn } from '../lib/utils';

export default function Home() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState<'quote' | 'library'>('quote');

    // Check session storage on mount
    useEffect(() => {
        const auth = sessionStorage.getItem("is_authenticated");
        if (auth === "true") {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // BASIT SIFRE: Burayi istediginiz sifre ile degistirebilirsiniz
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
                        <button
                            onClick={() => setActiveTab('quote')}
                            className={cn(
                                "flex w-full items-center rounded-lg px-4 py-3 text-sm font-medium transition-all",
                                activeTab === 'quote'
                                    ? "bg-blue-800 text-white shadow-md ring-1 ring-blue-700"
                                    : "text-blue-200 hover:bg-blue-800/50 hover:text-white"
                            )}
                        >
                            Quote Studio
                        </button>
                        <button
                            onClick={() => setActiveTab('library')}
                            className={cn(
                                "flex w-full items-center rounded-lg px-4 py-3 text-sm font-medium transition-all",
                                activeTab === 'library'
                                    ? "bg-blue-800 text-white shadow-md ring-1 ring-blue-700"
                                    : "text-blue-200 hover:bg-blue-800/50 hover:text-white"
                            )}
                        >
                            Library Settings
                        </button>
                    </nav>
                </div>

                {/* Footer / Version */}
                <div className="border-t border-blue-800/50 p-6">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-800" />
                        <div className="text-xs text-blue-300">
                            <p className="font-medium text-white">v1.0.0</p>
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
            <div className="flex-1 overflow-y-auto p-8">
                {activeTab === 'quote' ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <QuoteBuilder />
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <LibraryManager />
                    </div>
                )}
            </div>
        </main>
    );
}
