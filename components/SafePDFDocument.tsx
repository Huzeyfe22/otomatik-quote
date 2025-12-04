import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet, Font } from '@react-pdf/renderer';
import { Quote, AttributeCategory, TermCategory } from '../types';

// Register a bold font if needed, but Helvetica-Bold is standard.
// Font.register({ family: 'Inter', src: '...' }); // If we had custom fonts

interface PDFDocumentProps {
    quote: Quote;
    categories: AttributeCategory[];
    termCategories: TermCategory[];
    companySettings?: any;
}

export const SafePDFDocument: React.FC<PDFDocumentProps> = ({ quote, categories, termCategories, companySettings }) => {

    const styles = StyleSheet.create({
        // Page & Layout
        page: {
            padding: 40,
            fontFamily: 'Helvetica',
            fontSize: 12,
            color: '#334155', // slate-700
            backgroundColor: '#ffffff',
        },

        // Header Section (Modern & Compact)
        headerContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 15,
            borderBottomWidth: 1,
            borderBottomColor: '#e2e8f0',
            paddingBottom: 15,
        },
        headerLeft: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 40, // Increased gap to shift company info further right
        },
        logoImage: {
            width: 180, // Increased size
            height: 90, // Increased size
            objectFit: 'contain',
            objectPosition: 'left',
        },
        companyInfo: {
            justifyContent: 'center',
        },
        companyName: {
            fontSize: 16,
            fontWeight: 'bold',
            color: '#0f172a',
            marginBottom: 2,
        },
        companyText: {
            fontSize: 9,
            color: '#64748b',
        },

        // Header Right (Quote Meta)
        headerRight: {
            alignItems: 'flex-end',
        },
        quoteTitle: {
            fontSize: 24,
            fontWeight: 'bold',
            color: '#0f172a',
            textTransform: 'uppercase',
            marginBottom: 2,
        },
        quoteName: {
            fontSize: 10,
            fontWeight: 'bold',
            color: '#64748b',
            marginBottom: 2,
            textTransform: 'uppercase',
        },
        quoteMeta: {
            fontSize: 10,
            color: '#64748b',
        },

        // Project Details Section (Modern Layout: Name Left, Address Right)
        projectSection: {
            marginBottom: 20,
            padding: 12,
            backgroundColor: '#f8fafc',
            borderRadius: 8,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
        },
        projectColumn: {
            flex: 1,
        },
        projectLabel: {
            fontSize: 8,
            fontWeight: 'bold',
            color: '#94a3b8',
            textTransform: 'uppercase',
            marginBottom: 4,
        },
        clientName: {
            fontSize: 12,
            fontWeight: 'bold',
            color: '#0f172a',
            marginBottom: 2,
        },
        clientText: {
            fontSize: 10,
            color: '#334155',
        },
        addressText: {
            fontSize: 10,
            color: '#334155',
            maxWidth: 250, // Limit width for address
        },

        // --- THE "QUOTE STUDIO" ITEM STYLE (EXACT REPLICA) ---
        itemsContainer: {
            gap: 16,
        },
        itemCard: {
            backgroundColor: '#f8fafc', // bg-slate-50
            borderWidth: 1,
            borderColor: '#e2e8f0', // border-slate-200
            borderRadius: 12,
            padding: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 0, // Remove horizontal padding to use full width
        },
        itemLeft: {
            flex: 1,
            paddingRight: 10,
        },

        // 1. Header Row: Name + Dims + Qty
        itemHeaderRow: {
            flexDirection: 'row',
            alignItems: 'center',
            flexWrap: 'wrap',
            marginBottom: 8,
            gap: 12,
        },
        productName: {
            fontSize: 14, // Reduced from 18 (text-lg)
            fontWeight: 'bold',
            color: '#0f172a', // text-slate-900
        },
        dimensions: {
            fontSize: 12, // Reduced from 16
            fontWeight: 'medium',
            color: '#475569', // slate-600
        },
        qtyBadge: {
            backgroundColor: '#dbeafe', // bg-blue-100
            borderRadius: 10, // rounded-full approx
            paddingHorizontal: 8,
            paddingVertical: 2,
        },
        qtyText: {
            fontSize: 10, // Reduced from 12
            fontWeight: 'bold',
            color: '#1d4ed8', // text-blue-700
        },

        // 2. Series
        seriesText: {
            fontSize: 12, // text-sm
            color: '#475569', // slate-600
            marginBottom: 8,
        },

        // 3. Description
        descriptionText: {
            fontSize: 12, // text-sm
            fontStyle: 'italic',
            color: '#334155', // slate-700
            marginBottom: 12,
            marginTop: 4,
        },

        // 4. Attributes List
        attributesList: {
            marginTop: 8,
            gap: 4,
        },
        attributeRow: {
            flexDirection: 'column',
            marginBottom: 2,
        },
        attributeMain: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        attrLabel: {
            fontSize: 10, // Reduced slightly
            fontWeight: 'bold',
            color: '#0f172a', // slate-900
            textTransform: 'uppercase',
            marginRight: 6,
            minWidth: 50,
        },
        attrValue: {
            fontSize: 10, // Reduced slightly
            fontWeight: 'bold', // Match label weight
            color: '#0f172a', // Match label color
        },
        attrDesc: {
            fontSize: 9, // Reduced
            color: '#475569', // slate-600
            marginLeft: 4,
            fontStyle: 'italic',
        },
        screenText: {
            fontSize: 10, // Reduced
            fontWeight: 'bold',
            color: '#16a34a', // text-green-600
            marginTop: 2,
        },

        // Right Side: Price
        priceContainer: {
            alignItems: 'flex-end',
            minWidth: 80,
        },
        totalPrice: {
            fontSize: 14, // Reduced from 18
            fontWeight: 'bold',
            color: '#0f172a', // text-slate-900
        },
        unitPrice: {
            fontSize: 12, // text-sm
            color: '#475569', // slate-600
        },

        // Summary Section
        summarySection: {
            marginTop: 32,
            borderTopWidth: 1,
            borderTopColor: '#e2e8f0',
            paddingTop: 20,
            alignItems: 'flex-end',
        },
        summaryRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: 250,
            marginBottom: 6,
        },
        summaryLabel: {
            fontSize: 12,
            color: '#334155', // slate-700
        },
        summaryValue: {
            fontSize: 12,
            color: '#334155', // slate-700
            textAlign: 'right',
        },
        grandTotalRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: 250,
            marginTop: 8,
            paddingTop: 8,
        },
        grandTotalLabel: {
            fontSize: 18,
            fontWeight: 'bold',
            color: '#0f172a',
        },
        grandTotalValue: {
            fontSize: 18,
            fontWeight: 'bold',
            color: '#2563eb', // text-blue-600
            textAlign: 'right',
        },

        // Footer Terms
        termsSection: {
            marginTop: 40,
            paddingTop: 20,
            borderTopWidth: 1,
            borderTopColor: '#e2e8f0',
        },
        termsTitle: {
            fontSize: 14,
            fontWeight: 'bold',
            color: '#0f172a',
            marginBottom: 12,
        },
        termGroup: {
            marginBottom: 12,
        },
        termLabel: {
            fontSize: 11,
            fontWeight: 'bold',
            color: '#0f172a', // slate-900
            backgroundColor: '#f1f5f9', // slate-100
            padding: 5,
            borderRadius: 4,
            marginBottom: 12, // Increased from 6 to add more space
            textTransform: 'uppercase',
        },
        termValue: {
            fontSize: 12,
            color: '#475569', // slate-600
        },
        extraNotesBox: {
            marginTop: 20,
            padding: 15,
            backgroundColor: '#f8fafc',
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#e2e8f0',
        },
        extraNotesTitle: {
            fontSize: 12,
            fontWeight: 'bold',
            color: '#334155',
            marginBottom: 6,
        },
        extraNotesText: {
            fontSize: 11,
            color: '#475569',
            lineHeight: 1.4,
        },
        footer: {
            position: 'absolute',
            bottom: 30,
            left: 40,
            right: 40,
            textAlign: 'center',
            color: '#64748b', // slate-500
            fontSize: 10,
            borderTopWidth: 1,
            borderTopColor: '#e2e8f0',
            paddingTop: 10,
        }
    });

    const formatDate = (date: Date) => {
        try {
            return new Date(date).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
            });
        } catch (e) {
            return 'Date unavailable';
        }
    };

    const safeNumber = (num: number) => isNaN(num) ? 0 : num;
    const taxRate = safeNumber(companySettings?.taxRate || 0);
    const totalPrice = safeNumber(quote.totalPrice);
    const taxAmount = totalPrice * (taxRate / 100);
    const grandTotal = totalPrice + taxAmount;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* HEADER SECTION */}
                <View style={styles.headerContainer}>
                    {/* LEFT: Logo & Company Info */}
                    <View style={styles.headerLeft}>
                        {companySettings?.logoUrl ? (
                            <Image src={companySettings.logoUrl} style={styles.logoImage} />
                        ) : (
                            <View style={{ width: 120, height: 60, backgroundColor: '#f1f5f9', borderRadius: 8 }} />
                        )}
                        <View style={styles.companyInfo}>
                            <Text style={styles.companyName}>{companySettings?.name || 'Your Company'}</Text>
                            <Text style={styles.companyText}>{companySettings?.address}</Text>
                            <Text style={styles.companyText}>{companySettings?.email}</Text>
                            <Text style={styles.companyText}>{companySettings?.phone}</Text>
                        </View>
                    </View>

                    {/* RIGHT: Quote Meta */}
                    <View style={styles.headerRight}>
                        <Text style={styles.quoteTitle}>QUOTE</Text>

                        {/* Quote Number */}
                        {quote.quoteNumber && (
                            <Text style={styles.quoteMeta}>No: {quote.quoteNumber}</Text>
                        )}

                        {/* Date */}
                        {quote.showQuoteDate && (
                            <Text style={styles.quoteMeta}>
                                Date: {quote.quoteDate ? new Date(quote.quoteDate).toLocaleDateString() : new Date().toLocaleDateString()}
                            </Text>
                        )}

                        {/* Quote Name/Note below Date */}
                        {quote.showQuoteName && (
                            <Text style={[styles.quoteName, { marginTop: 4 }]}>{quote.name}</Text>
                        )}
                    </View>
                </View>

                {/* PROJECT DETAILS SECTION (Name Left, Address Right) */}
                <View style={styles.projectSection}>
                    {/* Left Column: Client Name & Contact */}
                    <View style={styles.projectColumn}>
                        <Text style={styles.projectLabel}>PREPARED FOR</Text>
                        <Text style={styles.clientName}>{quote.client?.name || 'Valued Client'}</Text>
                        <Text style={styles.clientText}>{quote.client?.email}</Text>
                        <Text style={styles.clientText}>{quote.client?.phone}</Text>
                    </View>

                    {/* Right Column: Project Address */}
                    <View style={[styles.projectColumn, { alignItems: 'flex-end' }]}>
                        <Text style={styles.projectLabel}>PROJECT LOCATION</Text>
                        <Text style={[styles.addressText, { textAlign: 'right' }]}>
                            {quote.client?.address || 'No Address Provided'}
                        </Text>
                    </View>
                </View>

                {/* ITEMS LIST - MATCHING QUOTE STUDIO DESIGN */}
                <View style={styles.itemsContainer}>
                    {quote.items.map((item, index) => {
                        const itemTotal = safeNumber(item.price);
                        return (
                            <View key={item.id || index} style={styles.itemCard} wrap={false}>
                                {/* LEFT SIDE */}
                                <View style={[styles.itemLeft, { flex: 1, paddingRight: 10 }]}>
                                    {/* 1. Header: Name + Dims + Qty */}
                                    <View style={styles.itemHeaderRow}>
                                        <Text style={styles.productName}>
                                            {item.productType?.name || 'Unknown Product'}
                                        </Text>

                                        {item.showDimensions && (
                                            <Text style={styles.dimensions}>
                                                ({item.width} x {item.height} {item.unit?.name})
                                            </Text>
                                        )}

                                        <View style={styles.qtyBadge}>
                                            <Text style={styles.qtyText}>x{item.quantity}</Text>
                                        </View>
                                    </View>

                                    {/* 3. Description */}
                                    {item.description && (
                                        <Text style={styles.descriptionText}>
                                            "{item.description}"
                                        </Text>
                                    )}

                                    {/* 4. Unified Attributes List (Series + Dynamic) */}
                                    <View style={styles.attributesList}>
                                        {(() => {
                                            const defaultOrder = ['sys_productTypes', 'sys_productSeries', 'sys_units', ...categories.map(c => c.id)];
                                            const order = companySettings?.categoryOrder || defaultOrder;

                                            // Merge any missing categories
                                            const knownIds = new Set(order);
                                            const missingIds = categories.filter(c => !knownIds.has(c.id)).map(c => c.id);
                                            const fullOrder = [...order, ...missingIds];

                                            return fullOrder.map(catId => {
                                                if (catId === 'sys_productTypes') return null; // Skip, in header
                                                if (catId === 'sys_units') return null; // Skip, in dims

                                                if (catId === 'sys_productSeries') {
                                                    if (!item.productSeries) return null;
                                                    return (
                                                        <View key="series" style={styles.attributeRow}>
                                                            <View style={styles.attributeMain}>
                                                                <Text style={styles.attrLabel}>SERIES:</Text>
                                                                <Text style={styles.attrValue}>{item.productSeries.name}</Text>
                                                            </View>
                                                            {item.productSeries.description && (
                                                                <Text style={styles.attrDesc}>{item.productSeries.description}</Text>
                                                            )}
                                                        </View>
                                                    );
                                                }

                                                // Dynamic Attribute
                                                const cat = categories.find(c => c.id === catId);
                                                if (!cat) return null;
                                                const attr = item.attributes?.[cat.id];
                                                if (!attr) return null;

                                                const attrArray = Array.isArray(attr) ? attr : [attr];
                                                if (attrArray.length === 0) return null;

                                                return (
                                                    <View key={cat.id} style={styles.attributeRow}>
                                                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
                                                            <Text style={styles.attrLabel}>{cat.name}:</Text>
                                                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}>
                                                                {attrArray.map((a, idx) => (
                                                                    <View key={idx} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                        <Text style={styles.attrValue}>{a.name}</Text>
                                                                        {idx < attrArray.length - 1 && (
                                                                            <Text style={[styles.attrValue, { marginRight: 4 }]}>,</Text>
                                                                        )}
                                                                    </View>
                                                                ))}
                                                            </View>
                                                        </View>
                                                    </View>
                                                );
                                            });
                                        })()}

                                        {item.hasScreen && (
                                            <Text style={styles.screenText}>✓ Includes Screen</Text>
                                        )}
                                    </View>
                                </View>

                                {/* RIGHT SIDE: PRICE */}
                                <View style={styles.priceContainer}>
                                    <Text style={styles.totalPrice}>
                                        ${itemTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </Text>
                                </View>
                            </View>
                        );
                    })}
                </View>

                {/* SUMMARY SECTION */}
                <View style={styles.summarySection} wrap={false}>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Subtotal:</Text>
                        <Text style={styles.summaryValue}>${totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Tax ({taxRate}%):</Text>
                        <Text style={styles.summaryValue}>${taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                    </View>
                    <View style={styles.grandTotalRow}>
                        <Text style={styles.grandTotalLabel}>Grand Total:</Text>
                        <Text style={styles.grandTotalValue}>${grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                    </View>
                </View>

                {/* TERMS SECTION (DYNAMIC) */}
                <View style={styles.termsSection} wrap={false}>
                    <Text style={styles.termsTitle}>Terms & Conditions</Text>

                    <View style={{ flexDirection: 'column' }}>
                        {termCategories.map(category => {
                            // Safe check for selectedTerms
                            const rawSelected = quote.selectedTerms?.[category.id];
                            if (!rawSelected) return null;

                            // Ensure it's an array
                            const selectedItems = Array.isArray(rawSelected) ? rawSelected : [rawSelected];
                            if (selectedItems.length === 0) return null;

                            return (
                                <View key={category.id} style={styles.termGroup}>
                                    <Text style={styles.termLabel}>{category.name}</Text>
                                    {selectedItems.map((item, i) => {
                                        if (!item) return null;
                                        return (
                                            <Text key={i} style={styles.termValue}>
                                                {category.type === 'multiple' ? `• ${item.name}` : item.name}
                                            </Text>
                                        );
                                    })}
                                </View>
                            );
                        })}
                    </View>

                    {/* Extra Notes Section */}
                    {quote.showExtraNotes && quote.extraNotes && (
                        <View style={styles.extraNotesBox}>
                            <Text style={styles.extraNotesTitle}>Additional Notes:</Text>
                            <Text style={styles.extraNotesText}>{quote.extraNotes}</Text>
                        </View>
                    )}
                </View>

                {/* FOOTER */}
                <Text style={styles.footer} render={({ pageNumber, totalPages }) =>
                    `Page ${pageNumber} of ${totalPages} | Generated by Aluminum Station Quotation Robot`
                } fixed />
            </Page>
        </Document>
    );
};
