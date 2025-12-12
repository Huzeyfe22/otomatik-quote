export interface LibraryEntity {
    id: string;
    name: string;
    hasDescription: boolean;
    description?: string; // Optional Rich Text or Plain Text
    isExtras?: boolean; // Flag to bypass dimensions/validation for service items like Delivery
}

// Entities extending the universal LibraryEntity

export interface ProductType extends LibraryEntity {
    // e.g. "Sliding Door", "Window", "Folding Door"
}

export interface ProductSeries extends LibraryEntity {
    // e.g. "S100", "W200"
}

export interface UnitType extends LibraryEntity {
    // e.g. "mm", "inch", "ft"
}

// Dynamic Attributes
export interface AttributeCategory {
    id: string;
    name: string;
    type: 'single' | 'multiple'; // Added selection type
    items: LibraryEntity[];
}

// Dynamic Terms
export interface TermCategory {
    id: string;
    name: string;
    type: 'single' | 'multiple';
    items: LibraryEntity[];
}

// Quote Related Types
export interface QuoteItem {
    id: string;
    productType: ProductType;
    productSeries: ProductSeries;
    // Dynamic attributes: key is category ID, value is the selected entity or array of entities
    attributes: Record<string, LibraryEntity | LibraryEntity[]>;
    name?: string; // Optional custom name override
    description?: string; // Optional override or additional text
    width: number;
    height: number;
    unit: UnitType;
    quantity: number;
    price: number;
    hasScreen: boolean;
    showDimensions: boolean;
    isCustomDescription?: boolean;
}

export interface ClientInfo {
    name: string;
    address: string;
    email: string;
    phone: string;
    showEmail?: boolean;
    showPhone?: boolean;
}

export interface CompanySettings {
    name: string;
    address: string;
    email: string;
    phone: string;
    website: string;
    logo?: string;
    logoUrl?: string; // Deprecated, kept for backward compatibility
    watermarkUrl?: string; // Separate watermark image
    taxRate: number; // Percentage (e.g., 13 for 13%)
    selectedTemplate?: string;
    // Labels for system categories (e.g. { 'productType': 'Window Type' })
    categoryLabels?: Record<string, string>;
    // Order of categories (system IDs: 'sys_productTypes', 'sys_productSeries', 'sys_units' + dynamic IDs)
    categoryOrder?: string[];
    geminiApiKey?: string;
}

export interface Quote {
    id: string;
    quoteNumber?: string; // Custom or Auto-generated Quote Number
    name: string; // Quote Name (e.g., "Living Room Renovation")
    client: ClientInfo;
    items: QuoteItem[];

    // Dynamic Terms: key is category ID, value is array of selected items
    selectedTerms: Record<string, LibraryEntity[]>;

    // Extra Notes
    extraNotes?: string;
    showExtraNotes: boolean;

    // Custom Terms Text (e.g. Warranty info)
    terms?: string;

    totalPrice: number;
    taxRate: number; // Snapshot of tax rate at time of quote
    isManualPricing?: boolean;
    manualSubtotal?: number;
    hasCoverPage: boolean;

    // Meta Display Options
    showQuoteName: boolean;
    showQuoteDate: boolean;
    quoteDate: Date; // Custom date override

    createdAt: Date;
    updatedAt: Date;
}
