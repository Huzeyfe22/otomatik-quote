'use client';

import React from 'react';
import { Quote, AttributeCategory, TermCategory } from '../types';
import { SafePDFDocument } from './SafePDFDocument';
import { BlobProvider } from '@react-pdf/renderer';

interface DownloadPDFButtonProps {
    quote: Quote;
    categories: AttributeCategory[];
    termCategories: TermCategory[];
    companySettings: any;
}

export const DownloadPDFButton: React.FC<DownloadPDFButtonProps> = ({ quote, categories, termCategories, companySettings }) => {

    return (
        <div className="flex flex-col items-end gap-2">
            <BlobProvider document={
                <SafePDFDocument
                    quote={quote}
                    categories={categories}
                    termCategories={termCategories}
                    companySettings={companySettings}
                />
            }>
                {({ blob, url, loading, error }) => {
                    if (loading) {
                        return <button disabled className="rounded-xl bg-slate-300 px-8 py-3 font-bold text-white">Generating Quote PDF...</button>;
                    }
                    if (error) {
                        console.error('PDF Error:', error);
                        return <div className="text-red-500">Error: {error.message}</div>;
                    }
                    if (!blob) {
                        return null;
                    }

                    return (
                        <button
                            onClick={() => window.open(url || '', '_blank')}
                            className="rounded-xl bg-blue-600 px-8 py-3 font-bold text-white shadow-lg transition-transform hover:scale-105 hover:bg-blue-700"
                        >
                            Download PDF Quote
                        </button>
                    );
                }}
            </BlobProvider>
        </div>
    );
};
