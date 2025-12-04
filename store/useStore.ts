import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
    LibraryEntity,
    ProductType,
    ProductSeries,
    UnitType,
    AttributeCategory,
    TermCategory,
    Quote,
    QuoteItem,
    CompanySettings
} from '../types';

export interface AppState {
    // Library State (System Categories)
    productTypes: ProductType[];
    productSeries: ProductSeries[];
    units: UnitType[];

    // Dynamic Attributes
    attributeCategories: AttributeCategory[];

    // Dynamic Terms
    termCategories: TermCategory[];

    // Settings
    companySettings: CompanySettings;

    // Quote State
    currentQuote: Quote | null;
    savedQuotes: Quote[];

    // Actions

    // System Category Actions (Product Type, Series, Units)
    addSystemItem: (category: 'productTypes' | 'productSeries' | 'units', item: LibraryEntity) => void;
    updateSystemItem: (category: 'productTypes' | 'productSeries' | 'units', id: string, item: Partial<LibraryEntity>) => void;
    deleteSystemItem: (category: 'productTypes' | 'productSeries' | 'units', id: string) => void;
    updateSystemCategoryLabel: (key: string, label: string) => void;

    // Attribute Category Actions
    addAttributeCategory: (name: string, type?: 'single' | 'multiple') => void;
    deleteAttributeCategory: (id: string) => void;
    updateAttributeCategory: (id: string, name: string) => void;
    reorderAttributeCategories: (newOrder: AttributeCategory[]) => void;

    // Attribute Item Actions
    addAttributeItem: (categoryId: string, item: LibraryEntity) => void;
    deleteAttributeItem: (categoryId: string, itemId: string) => void;
    updateAttributeItem: (categoryId: string, itemId: string, item: Partial<LibraryEntity>) => void;

    // Term Category Actions
    addTermCategory: (name: string, type: 'single' | 'multiple') => void;
    deleteTermCategory: (id: string) => void;
    updateTermCategory: (id: string, updates: Partial<TermCategory>) => void;
    reorderTermCategories: (newOrder: TermCategory[]) => void;

    // Term Item Actions
    addTermItem: (categoryId: string, item: LibraryEntity) => void;
    deleteTermItem: (categoryId: string, itemId: string) => void;
    updateTermItem: (categoryId: string, itemId: string, item: Partial<LibraryEntity>) => void;

    setQuote: (quote: Quote) => void;

    // Settings Actions
    updateCompanySettings: (settings: Partial<CompanySettings>) => void;

    // Quote Actions
    addQuoteItem: (item: QuoteItem) => void;
    removeQuoteItem: (itemId: string) => void;
    updateQuoteItem: (itemId: string, item: Partial<QuoteItem>) => void;
    duplicateQuoteItem: (itemId: string) => void;

    // Updated Quote Terms Action
    updateQuoteTerms: (categoryId: string, items: LibraryEntity[]) => void;

    updateClientInfo: (client: Partial<Quote['client']>) => void;
    updateQuoteNumber: (quoteNumber: string) => void;
    generateNextQuoteNumber: () => string;
    updateQuoteName: (name: string) => void;
    updateQuoteMeta: (meta: Partial<Pick<Quote, 'name' | 'quoteDate' | 'showQuoteName' | 'showQuoteDate'>>) => void;
    updateExtraNotes: (notes: string, show: boolean) => void;
    toggleCoverPage: (enabled: boolean) => void;

    // Persistence Actions
    saveCurrentQuote: () => void;
    loadQuote: (id: string) => void;
    deleteSavedQuote: (id: string) => void;
    duplicateQuote: (id: string) => void;

    // Library Import/Export
    importLibrary: (data: Partial<AppState>) => void;
}

const dummyStorage = {
    getItem: () => null,
    setItem: () => { },
    removeItem: () => { },
};

export const useStore = create<AppState>()(
    persist(
        (set, get) => ({
            productTypes: [],
            productSeries: [],
            units: [],
            attributeCategories: [],

            // Initialize with default Term Categories
            termCategories: [
                { id: 'inclusions', name: 'Inclusions', type: 'multiple', items: [] },
                { id: 'exclusions', name: 'Exclusions', type: 'multiple', items: [] },
                { id: 'paymentTerms', name: 'Payment Terms', type: 'multiple', items: [] },
                { id: 'leadTime', name: 'Lead Time', type: 'single', items: [] },
                { id: 'validity', name: 'Validity', type: 'single', items: [] },
            ],

            companySettings: {
                name: '',
                address: '',
                email: '',
                phone: '',
                logoUrl: '',
                taxRate: 0,
                categoryLabels: {
                    'productTypes': 'Product Type',
                    'productSeries': 'Product Series',
                    'units': 'Units'
                }
            },
            currentQuote: null,
            savedQuotes: [],

            // System Item Actions
            addSystemItem: (category, item) => set((state) => ({
                [category]: [...state[category], item]
            })),
            updateSystemItem: (category, id, updates) => set((state) => ({
                [category]: state[category].map((i) => i.id === id ? { ...i, ...updates } : i)
            })),
            deleteSystemItem: (category, id) => set((state) => ({
                [category]: state[category].filter((i) => i.id !== id)
            })),
            updateSystemCategoryLabel: (key, label) => set((state) => ({
                companySettings: {
                    ...state.companySettings,
                    categoryLabels: {
                        ...state.companySettings.categoryLabels,
                        [key]: label
                    }
                }
            })),

            // Attribute Category Actions
            addAttributeCategory: (name, type = 'single') => set((state) => {
                const newId = crypto.randomUUID();
                const currentOrder = state.companySettings.categoryOrder || [
                    'sys_productTypes', 'sys_productSeries', 'sys_units',
                    ...state.attributeCategories.map(c => c.id)
                ];
                return {
                    attributeCategories: [...state.attributeCategories, {
                        id: newId,
                        name,
                        type,
                        items: []
                    }],
                    companySettings: {
                        ...state.companySettings,
                        categoryOrder: [...currentOrder, newId]
                    }
                };
            }),
            deleteAttributeCategory: (id) => set((state) => {
                const currentOrder = state.companySettings.categoryOrder || [];
                return {
                    attributeCategories: state.attributeCategories.filter((c) => c.id !== id),
                    companySettings: {
                        ...state.companySettings,
                        categoryOrder: currentOrder.filter(oid => oid !== id)
                    }
                };
            }),
            updateAttributeCategory: (id, name) => set((state) => ({
                attributeCategories: state.attributeCategories.map((c) => c.id === id ? { ...c, name } : c)
            })),
            reorderAttributeCategories: (newOrder) => set({ attributeCategories: newOrder }),

            // Attribute Item Actions
            addAttributeItem: (categoryId, item) => set((state) => ({
                attributeCategories: state.attributeCategories.map((c) =>
                    c.id === categoryId ? { ...c, items: [...c.items, item] } : c
                )
            })),
            deleteAttributeItem: (categoryId, itemId) => set((state) => ({
                attributeCategories: state.attributeCategories.map((c) =>
                    c.id === categoryId ? { ...c, items: c.items.filter((i) => i.id !== itemId) } : c
                )
            })),
            updateAttributeItem: (categoryId, itemId, updates) => set((state) => ({
                attributeCategories: state.attributeCategories.map((c) =>
                    c.id === categoryId ? {
                        ...c,
                        items: c.items.map((i) => i.id === itemId ? { ...i, ...updates } : i)
                    } : c
                )
            })),

            // Term Category Actions
            addTermCategory: (name, type) => set((state) => ({
                termCategories: [...state.termCategories, {
                    id: crypto.randomUUID(),
                    name,
                    type,
                    items: []
                }]
            })),
            deleteTermCategory: (id) => set((state) => ({
                termCategories: state.termCategories.filter((c) => c.id !== id)
            })),
            updateTermCategory: (id, updates) => set((state) => ({
                termCategories: state.termCategories.map((c) => c.id === id ? { ...c, ...updates } : c)
            })),
            reorderTermCategories: (newOrder) => set({ termCategories: newOrder }),

            // Term Item Actions
            addTermItem: (categoryId, item) => set((state) => ({
                termCategories: state.termCategories.map((c) =>
                    c.id === categoryId ? { ...c, items: [...c.items, item] } : c
                )
            })),
            deleteTermItem: (categoryId, itemId) => set((state) => ({
                termCategories: state.termCategories.map((c) =>
                    c.id === categoryId ? { ...c, items: c.items.filter((i) => i.id !== itemId) } : c
                )
            })),
            updateTermItem: (categoryId, itemId, updates) => set((state) => ({
                termCategories: state.termCategories.map((c) =>
                    c.id === categoryId ? {
                        ...c,
                        items: c.items.map((i) => i.id === itemId ? { ...i, ...updates } : i)
                    } : c
                )
            })),

            setQuote: (quote) => set({ currentQuote: quote }),

            updateCompanySettings: (settings) => set((state) => ({
                companySettings: { ...state.companySettings, ...settings }
            })),

            // Quote Actions
            addQuoteItem: (item) => set((state) => {
                if (!state.currentQuote) return state;
                const newQuote = {
                    ...state.currentQuote,
                    items: [...state.currentQuote.items, item],
                    updatedAt: new Date()
                };
                // Recalculate total
                newQuote.totalPrice = newQuote.items.reduce((sum, i) => sum + i.price, 0);
                return { currentQuote: newQuote };
            }),
            removeQuoteItem: (itemId) => set((state) => {
                if (!state.currentQuote) return state;
                const newQuote = {
                    ...state.currentQuote,
                    items: state.currentQuote.items.filter((i) => i.id !== itemId),
                    updatedAt: new Date()
                };
                newQuote.totalPrice = newQuote.items.reduce((sum, i) => sum + i.price, 0);
                return { currentQuote: newQuote };
            }),
            updateQuoteItem: (itemId, updates) => set((state) => {
                if (!state.currentQuote) return state;
                const newQuote = {
                    ...state.currentQuote,
                    items: state.currentQuote.items.map((i) => i.id === itemId ? { ...i, ...updates } : i),
                    updatedAt: new Date()
                };
                newQuote.totalPrice = newQuote.items.reduce((sum, i) => sum + i.price, 0);
                return { currentQuote: newQuote };
            }),
            duplicateQuoteItem: (itemId) => set((state) => {
                if (!state.currentQuote) return state;
                const itemToDuplicate = state.currentQuote.items.find((i) => i.id === itemId);
                if (!itemToDuplicate) return state;
                const newItem = { ...itemToDuplicate, id: crypto.randomUUID() };
                const newQuote = {
                    ...state.currentQuote,
                    items: [...state.currentQuote.items, newItem],
                    updatedAt: new Date()
                };
                newQuote.totalPrice = newQuote.items.reduce((sum, i) => sum + i.price, 0);
                return { currentQuote: newQuote };
            }),

            updateQuoteTerms: (categoryId, items) => set((state) => {
                if (!state.currentQuote) return state;
                return {
                    currentQuote: {
                        ...state.currentQuote,
                        selectedTerms: {
                            ...state.currentQuote.selectedTerms,
                            [categoryId]: items
                        },
                        updatedAt: new Date()
                    }
                };
            }),

            updateClientInfo: (client) => set((state) => {
                if (!state.currentQuote) return state;
                return {
                    currentQuote: {
                        ...state.currentQuote,
                        client: { ...state.currentQuote.client, ...client },
                        updatedAt: new Date()
                    }
                };
            }),
            updateQuoteNumber: (quoteNumber) => set((state) => {
                if (!state.currentQuote) return state;
                return {
                    currentQuote: { ...state.currentQuote, quoteNumber, updatedAt: new Date() }
                };
            }),
            generateNextQuoteNumber: () => {
                const state = get();
                const today = new Date();
                const dateStr = today.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD

                // Find all quotes from today that match the pattern
                const dailyQuotes = state.savedQuotes.filter(q =>
                    q.quoteNumber && q.quoteNumber.startsWith(dateStr)
                );

                // Find the max sequence number
                let maxSeq = 0;
                dailyQuotes.forEach(q => {
                    const parts = q.quoteNumber?.split('/');
                    if (parts && parts.length === 2) {
                        const seq = parseInt(parts[1], 10);
                        if (!isNaN(seq) && seq > maxSeq) maxSeq = seq;
                    }
                });

                return `${dateStr}/${maxSeq + 1}`;
            },
            updateQuoteName: (name) => set((state) => {
                if (!state.currentQuote) return state;
                return {
                    currentQuote: { ...state.currentQuote, name, updatedAt: new Date() }
                };
            }),
            updateQuoteMeta: (meta) => set((state) => {
                if (!state.currentQuote) return state;
                return {
                    currentQuote: { ...state.currentQuote, ...meta, updatedAt: new Date() }
                };
            }),
            updateExtraNotes: (notes, show) => set((state) => {
                if (!state.currentQuote) return state;
                return {
                    currentQuote: {
                        ...state.currentQuote,
                        extraNotes: notes,
                        showExtraNotes: show,
                        updatedAt: new Date()
                    }
                };
            }),
            toggleCoverPage: (enabled) => set((state) => {
                if (!state.currentQuote) return state;
                return {
                    currentQuote: { ...state.currentQuote, hasCoverPage: enabled, updatedAt: new Date() }
                };
            }),

            saveCurrentQuote: () => set((state) => {
                if (!state.currentQuote) return state;
                const existingIndex = state.savedQuotes.findIndex((q) => q.id === state.currentQuote!.id);
                let newSavedQuotes = [...state.savedQuotes];
                if (existingIndex >= 0) {
                    newSavedQuotes[existingIndex] = state.currentQuote;
                } else {
                    newSavedQuotes.push(state.currentQuote);
                }
                return { savedQuotes: newSavedQuotes };
            }),
            loadQuote: (id) => set((state) => ({
                currentQuote: state.savedQuotes.find((q) => q.id === id) || null
            })),
            deleteSavedQuote: (id) => set((state) => ({
                savedQuotes: state.savedQuotes.filter((q) => q.id !== id)
            })),
            duplicateQuote: (id) => set((state) => {
                const quoteToDuplicate = state.savedQuotes.find((q) => q.id === id);
                if (!quoteToDuplicate) return state;
                const newQuote = {
                    ...quoteToDuplicate,
                    id: crypto.randomUUID(),
                    name: `${quoteToDuplicate.name} (Copy)`,
                    createdAt: new Date(),
                    updatedAt: new Date()
                };
                return { savedQuotes: [...state.savedQuotes, newQuote] };
            }),

            importLibrary: (data) => set((state) => ({
                ...state,
                ...data,
                // Ensure termCategories are merged or preserved if missing in import
                termCategories: data.termCategories || state.termCategories
            })),
        }),
        {
            name: 'elite-quote-storage',
            storage: createJSONStorage(() => typeof window !== 'undefined' ? window.localStorage : dummyStorage),
        }
    )
);
