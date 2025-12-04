import React from 'react';
import { cn } from '../lib/utils';
import { LibraryEntity } from '../types';

interface ChipGroupProps {
    label: string;
    items: LibraryEntity[];
    selectedId?: string | string[]; // Can be single ID or array of IDs for multi-select
    onSelect: (item: LibraryEntity) => void;
    multiSelect?: boolean;
}

export const ChipGroup: React.FC<ChipGroupProps> = ({
    label,
    items,
    selectedId,
    onSelect,
    multiSelect = false,
}) => {
    const isSelected = (item: LibraryEntity) => {
        if (multiSelect && Array.isArray(selectedId)) {
            return selectedId.includes(item.id);
        }
        return selectedId === item.id;
    };

    return (
        <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 dark:bg-slate-800/50 dark:border-slate-700">
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {label}
            </h3>
            <div className="flex flex-wrap gap-2">
                {items.map((item) => {
                    const active = isSelected(item);
                    return (
                        <button
                            key={item.id}
                            onClick={() => onSelect(item)}
                            className={cn(
                                "group relative flex flex-col items-start rounded-lg border px-3 py-2 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                                active
                                    ? "border-blue-600 bg-blue-50 shadow-sm dark:border-blue-500 dark:bg-blue-900/30"
                                    : "border-slate-200 bg-white hover:border-blue-300 dark:border-slate-600 dark:bg-slate-800 dark:hover:border-slate-500"
                            )}
                        >
                            <div className="flex items-center gap-2">
                                <div
                                    className={cn(
                                        "flex h-4 w-4 items-center justify-center rounded-full border transition-colors",
                                        active
                                            ? "border-blue-600 bg-blue-600 dark:border-blue-500 dark:bg-blue-500"
                                            : "border-slate-300 bg-transparent dark:border-slate-500"
                                    )}
                                >
                                    {active && (
                                        <svg
                                            className="h-2.5 w-2.5 text-white"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={4}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    )}
                                </div>
                                <span
                                    className={cn(
                                        "text-sm font-bold",
                                        active
                                            ? "text-blue-900 dark:text-blue-100"
                                            : "text-slate-700 dark:text-slate-200"
                                    )}
                                >
                                    {item.name}
                                </span>
                            </div>

                            {/* Description Tooltip / Subtext */}
                            {item.hasDescription && item.description && (
                                <p
                                    className={cn(
                                        "mt-1 text-[10px] line-clamp-2 pl-6 font-medium",
                                        active
                                            ? "text-blue-700 dark:text-blue-300"
                                            : "text-slate-500 dark:text-slate-400"
                                    )}
                                >
                                    {item.description}
                                </p>
                            )}
                        </button>
                    );
                })}

                {items.length === 0 && (
                    <div className="text-xs italic text-slate-400 px-2">
                        No items available.
                    </div>
                )}
            </div>
        </div>
    );
};
