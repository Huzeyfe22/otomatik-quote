import React, { useState, useEffect } from 'react';
import { LibraryEntity } from '../types';
import { cn } from '../lib/utils';
// Assuming UI components exist or using standard HTML for now to demonstrate logic
// In a real setup, we would import { Dialog, DialogContent, ... } from './ui/dialog'
// For this file, I will build a self-contained modal structure using Tailwind to ensure it works without the full Shadcn library installed yet.

interface UniversalModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (item: LibraryEntity) => void;
    initialData?: LibraryEntity;
    title: string;
}

export const UniversalModal: React.FC<UniversalModalProps> = ({
    isOpen,
    onClose,
    onSave,
    initialData,
    title,
}) => {
    const [name, setName] = useState('');
    const [hasDescription, setHasDescription] = useState(false);
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setName(initialData.name);
                setHasDescription(initialData.hasDescription);
                setDescription(initialData.description || '');
            } else {
                // Reset for new item
                setName('');
                setHasDescription(false);
                setDescription('');
            }
        }
    }, [isOpen, initialData]);

    const handleSave = () => {
        if (!name.trim()) return;

        const newItem: LibraryEntity = {
            id: initialData?.id || Date.now().toString(),
            name,
            hasDescription,
            description: hasDescription ? description : undefined,
        };

        onSave(newItem);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl dark:bg-slate-900 animate-in fade-in zoom-in duration-200">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
                        ✕
                    </button>
                </div>

                <div className="space-y-4">
                    {/* Field 1: Name Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                            placeholder="e.g., Product Name, Color, Term..."
                        />
                    </div>

                    {/* Field 2: Add Detail Text Toggle */}
                    <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Add Detail Text?
                        </span>
                        <button
                            onClick={() => setHasDescription(!hasDescription)}
                            className={cn(
                                "relative h-6 w-11 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                                hasDescription ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-700"
                            )}
                        >
                            <span
                                className={cn(
                                    "inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out",
                                    hasDescription ? "translate-x-6" : "translate-x-1"
                                )}
                            />
                        </button>
                    </div>

                    {/* Field 3: Description Input (Conditional) */}
                    {hasDescription && (
                        <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Description / Detail Text
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm min-h-[100px] focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                placeholder="Enter detailed specifications, terms, or descriptions here..."
                            />
                        </div>
                    )}
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="rounded-md px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Save Item
                    </button>
                </div>
            </div>
        </div>
    );
};
