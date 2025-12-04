"use client";

import React, { useState } from 'react';
import { QuoteBuilder } from '../components/QuoteBuilder';
import { LibraryManager } from '../components/LibraryManager';
import { cn } from '../lib/utils';

export default function Home() {
    const [activeTab, setActiveTab] = useState<'quote' | 'library'>('quote');

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
