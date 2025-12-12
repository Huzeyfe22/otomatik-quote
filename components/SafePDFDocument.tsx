import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { Quote, AttributeCategory, TermCategory, CompanySettings } from '../types';

// --- THEME MATCHING UI (Tailwind Slate/Blue/Amber) ---
const theme = {
    slate900: '#0F172A',
    slate800: '#1E293B',
    slate700: '#334155',
    slate600: '#475569',
    slate500: '#64748B',
    slate400: '#94A3B8',
    slate200: '#E2E8F0',
    slate100: '#F1F5F9',
    slate50: '#F8FAFC',

    blue700: '#1D4ED8',
    blue100: '#DBEAFE',
    blue500: '#3B82F6', // Added for bars

    green600: '#16A34A',

    amber500: '#F59E0B',
    amber100: '#FEF3C7',

    white: '#FFFFFF',
};

const styles = StyleSheet.create({
    page: {
        fontFamily: 'Helvetica',
        fontSize: 10,
        lineHeight: 1.5,
        color: theme.slate700,
        // backgroundColor: theme.white, // Removed to ensure watermark visibility
        paddingTop: 40,
        paddingBottom: 60,
        paddingHorizontal: 40,
    },

    // --- WATERMARK ---
    watermarkContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: -1, // Force background
    },
    watermarkImage: {
        width: '55%',
        opacity: 0.15,
        objectFit: 'contain',
    },

    // --- COVER PAGE STYLES (Copied & Adapted) ---
    coverPage: {
        flexDirection: 'column',
        height: '100%',
        padding: 0, // Reset padding for full bleed
    },
    coverHeader: {
        height: '35%',
        backgroundColor: '#006994', // Sea Blue
        padding: 40,
        justifyContent: 'center',
        position: 'relative',
    },
    coverAccentLine: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 8,
        backgroundColor: theme.blue500,
    },
    coverLogo: {
        width: 150,
        height: 100,
        objectFit: 'contain',
        marginRight: 20,
        backgroundColor: 'white', // Optional: if logo needs bg
        borderRadius: 4,
        padding: 5,
    },
    coverTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    coverTitle: {
        fontSize: 24,
        fontFamily: 'Helvetica-Bold',
        color: '#FFFFFF',
        letterSpacing: 1,
        // textTransform: 'uppercase', // Removed to allow Title Case
    },
    coverSubtitle: {
        fontSize: 14,
        color: '#94A3B8', // Matches Contract PDF color
        marginTop: 10,
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    coverBody: {
        padding: 40,
        flex: 1,
        justifyContent: 'center',
    },
    coverInfoBox: {
        borderLeftWidth: 4,
        borderLeftColor: theme.blue500,
        paddingLeft: 20,
        marginBottom: 40,
    },
    coverLabel: {
        fontSize: 9,
        color: theme.slate500,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 4,
    },
    coverValue: {
        fontSize: 18,
        fontFamily: 'Helvetica-Bold',
        color: theme.slate900,
        marginBottom: 15,
    },
    coverDate: {
        marginTop: 40,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: theme.slate200,
    },

    // --- MAIN PAGE HEADER/FOOTER BARS ---
    topBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 8,
        backgroundColor: theme.slate900,
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 8,
        backgroundColor: theme.blue500,
    },

    // HEADER
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
        alignItems: 'center',
        marginTop: 10, // Space from top bar
    },
    logo: {
        height: 60,
        objectFit: 'contain',
    },
    headerTitle: {
        fontSize: 24,
        fontFamily: 'Helvetica-Bold',
        color: theme.slate900,
    },
    headerSubtitle: {
        fontSize: 10,
        color: theme.slate500,
    },

    // PROJECT INFO BOX
    projectInfo: {
        marginBottom: 10,
        padding: 10,
        backgroundColor: 'rgba(239, 246, 255, 0.6)', // blue-50 transparent
        borderLeftWidth: 4,
        borderLeftColor: '#3B82F6', // blue-500
        borderTopWidth: 1,
        borderTopColor: theme.slate200,
        borderRightWidth: 1,
        borderRightColor: theme.slate200,
        borderBottomWidth: 1,
        borderBottomColor: theme.slate200,
        borderRadius: 6,
    },
    sectionTitle: {
        fontSize: 12,
        fontFamily: 'Helvetica-Bold',
        color: theme.slate900,
        marginBottom: 10,
    },
    infoGrid: {
        flexDirection: 'row',
        gap: 20,
    },
    infoCol: {
        flex: 1,
    },
    label: {
        fontSize: 8,
        fontFamily: 'Helvetica-Bold',
        color: theme.slate500,
        marginBottom: 1,
        textTransform: 'uppercase',
    },
    value: {
        fontSize: 10,
        color: theme.slate900,
        marginBottom: 4,
    },

    // ADDED ITEMS LIST
    itemsHeader: {
        fontSize: 14,
        fontFamily: 'Helvetica-Bold',
        color: theme.slate900,
        marginBottom: 10,
        marginTop: 10,
    },
    itemCard: {
        marginBottom: 12,
        padding: 20,
        backgroundColor: 'rgba(248, 250, 252, 0.6)', // slate-50 transparent
        borderWidth: 1,
        borderColor: theme.slate200,
        borderRadius: 8,
    },
    itemHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        flexWrap: 'wrap',
    },
    itemName: {
        fontSize: 14,
        fontFamily: 'Helvetica-Bold',
        color: theme.slate900,
        marginRight: 8,
    },
    itemDims: {
        fontSize: 12,
        color: theme.slate500,
        marginRight: 8,
    },
    qtyBadge: {
        backgroundColor: theme.blue100,
        color: theme.blue700,
        fontSize: 9,
        fontFamily: 'Helvetica-Bold',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },

    itemSeries: {
        fontSize: 10,
        fontFamily: 'Helvetica-Bold',
        color: theme.slate500,
        marginBottom: 4,
    },

    itemDesc: {
        fontSize: 10,
        fontStyle: 'italic',
        color: theme.slate600,
        marginBottom: 10,
    },

    attrContainer: {
        borderLeftWidth: 2,
        borderLeftColor: theme.slate100,
        paddingLeft: 10,
        marginTop: 5,
    },
    attrGroup: {
        marginBottom: 6,
    },
    attrLabel: {
        fontSize: 8,
        fontFamily: 'Helvetica-Bold',
        color: theme.slate500,
        textTransform: 'uppercase',
        marginBottom: 2,
    },
    attrValueRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    attrValue: {
        fontSize: 10,
        fontFamily: 'Helvetica-Bold',
        color: theme.slate800,
        marginRight: 4,
    },
    attrDescription: {
        fontSize: 8,
        color: theme.slate500,
        marginTop: 1,
        fontStyle: 'italic',
    },

    screenText: {
        marginTop: 6,
        fontSize: 10,
        fontFamily: 'Helvetica-Bold',
        color: theme.green600,
    },

    itemFooter: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        borderTopWidth: 1,
        borderTopColor: theme.slate100,
        paddingTop: 10,
    },
    priceText: {
        fontSize: 14,
        fontFamily: 'Helvetica-Bold',
        color: theme.slate900,
    },

    // TOTALS
    totalsSection: {
        marginTop: 20,
        alignItems: 'flex-end',
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: theme.slate200,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 200,
        marginBottom: 4,
    },
    totalLabel: {
        fontSize: 10,
        color: theme.slate600,
    },
    totalValue: {
        fontSize: 10,
        fontFamily: 'Helvetica-Bold',
        color: theme.slate900,
    },
    grandTotalValue: {
        fontSize: 14,
        fontFamily: 'Helvetica-Bold',
        color: theme.blue700,
    },

    // TERMS
    termsSection: {
        marginTop: 30,
        padding: 15,
        backgroundColor: 'rgba(255, 251, 235, 0.6)', // amber-50 transparent
        borderLeftWidth: 4,
        borderLeftColor: theme.amber500,
        borderTopWidth: 1,
        borderTopColor: theme.slate200,
        borderRightWidth: 1,
        borderRightColor: theme.slate200,
        borderBottomWidth: 1,
        borderBottomColor: theme.slate200,
        borderRadius: 6,
    },
    termGroup: {
        marginBottom: 12,
    },
    termLabel: {
        fontSize: 9,
        fontFamily: 'Helvetica-Bold',
        color: theme.slate900,
        marginBottom: 4,
    },
    termItem: {
        marginBottom: 4,
        paddingLeft: 8,
    },
    termText: {
        fontSize: 9,
        color: theme.slate700,
        fontFamily: 'Helvetica-Bold',
    },
    termDesc: {
        fontSize: 9,
        color: theme.slate600,
        marginTop: 1,
        lineHeight: 1.4,
    },

    // FOOTER
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        textAlign: 'center',
        borderTopWidth: 1,
        borderTopColor: theme.slate200,
        paddingTop: 10,
    },
    footerText: {
        fontSize: 8,
        color: theme.slate400,
    }
});

interface SafePDFProps {
    quote: Quote;
    categories: AttributeCategory[];
    termCategories: TermCategory[];
    companySettings: CompanySettings;
}

export const SafePDFDocument: React.FC<SafePDFProps> = ({ quote, categories, termCategories, companySettings }) => {

    // Resolve Logo Source
    const logoSrc = companySettings.logo || companySettings.logoUrl;
    // Resolve Watermark Source
    const watermarkSrc = companySettings.watermarkUrl;

    const subtotal = quote.totalPrice || 0;
    const taxRate = quote.taxRate || companySettings.taxRate || 0;
    const taxAmount = subtotal * (taxRate / 100);
    const total = subtotal + taxAmount;

    return (
        <Document>
            {/* --- COVER PAGE (Optional) --- */}
            {quote.hasCoverPage && (
                <Page size="LETTER" style={[styles.page, { padding: 0 }]}>
                    {/* NO WATERMARK ON COVER PAGE */}

                    <View style={styles.coverPage}>
                        {/* Top Dark Section (Sea Blue) */}
                        <View style={styles.coverHeader}>
                            {/* Logo and Name Side-by-Side */}
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                                {logoSrc && (
                                    <Image src={logoSrc} style={styles.coverLogo} />
                                )}
                                <View style={{ flexDirection: 'column' }}>
                                    <Text style={styles.coverTitle}>{companySettings.name}</Text>
                                    <Text style={styles.coverSubtitle}>Quotation</Text>
                                </View>
                            </View>
                            <View style={styles.coverAccentLine} />
                        </View>

                        {/* Body */}
                        <View style={styles.coverBody}>
                            <View style={styles.coverInfoBox}>
                                <Text style={styles.coverLabel}>Prepared For</Text>
                                <Text style={styles.coverValue}>{quote.client.name || 'Valued Client'}</Text>

                                <Text style={styles.coverLabel}>Project</Text>
                                <Text style={styles.coverValue}>{quote.name}</Text>

                                <Text style={styles.coverLabel}>Quote Number</Text>
                                <Text style={styles.coverValue}>{quote.quoteNumber || 'DRAFT'}</Text>
                            </View>

                            <View style={styles.coverDate}>
                                <Text style={styles.coverLabel}>Date</Text>
                                <Text style={styles.coverValue}>{new Date(quote.quoteDate || quote.createdAt).toLocaleDateString()}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Bottom Bar for Cover */}
                    <View style={styles.bottomBar} />
                </Page>
            )}

            {/* --- PAGE 2+: CONTENT --- */}
            <Page size="LETTER" style={styles.page}>
                {/* Watermark - Rendered FIRST (Background Layer) */}
                {watermarkSrc && (
                    <View fixed style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: -1,
                    }}>
                        <Image
                            src={watermarkSrc}
                            style={{
                                width: '80%',
                                opacity: 0.1,
                                transform: 'rotate(-45deg)',
                                marginBottom: '30%', // Shift up
                            }}
                        />
                    </View>
                )}

                {/* Bars */}
                <View style={styles.topBar} fixed />
                <View style={styles.bottomBar} fixed />

                {/* HEADER */}
                <View style={styles.header}>
                    <View>
                        {logoSrc ? (
                            <Image src={logoSrc} style={styles.logo} />
                        ) : (
                            <Text style={styles.headerTitle}>{companySettings.name}</Text>
                        )}
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.headerTitle}>QUOTATION</Text>
                        <Text style={styles.headerSubtitle}>Generated by Aluminum Station</Text>
                    </View>
                </View>

                {/* PROJECT INFO */}
                <View style={styles.projectInfo}>
                    <Text style={styles.sectionTitle}>Project Information</Text>
                    <View style={styles.infoGrid}>
                        <View style={styles.infoCol}>
                            <Text style={styles.label}>Client</Text>
                            <Text style={styles.value}>{quote.client.name || 'Valued Client'}</Text>
                            <Text style={styles.label}>Address</Text>
                            <Text style={styles.value}>{quote.client.address}</Text>
                            {quote.client.showEmail && quote.client.email && (
                                <>
                                    <Text style={styles.label}>Email</Text>
                                    <Text style={styles.value}>{quote.client.email}</Text>
                                </>
                            )}
                            {quote.client.showPhone && quote.client.phone && (
                                <>
                                    <Text style={styles.label}>Phone</Text>
                                    <Text style={styles.value}>{quote.client.phone}</Text>
                                </>
                            )}
                        </View>
                        <View style={styles.infoCol}>
                            <Text style={styles.label}>Quote Name</Text>
                            <Text style={styles.value}>{quote.name}</Text>
                            <Text style={styles.label}>Quote #</Text>
                            <Text style={styles.value}>{quote.quoteNumber || 'DRAFT'}</Text>
                        </View>
                        <View style={styles.infoCol}>
                            <Text style={styles.label}>Date</Text>
                            <Text style={styles.value}>{new Date(quote.quoteDate || quote.createdAt).toLocaleDateString()}</Text>
                            <Text style={styles.label}>Valid Until</Text>
                            <Text style={styles.value}>
                                {new Date(new Date(quote.quoteDate || quote.createdAt).getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* ADDED ITEMS LIST */}
                <Text style={styles.itemsHeader}>Added Items ({quote.items.length})</Text>

                {quote.items.map((item, i) => (
                    <View key={i} style={styles.itemCard} wrap={false}>
                        {/* Header */}
                        <View style={styles.itemHeaderRow}>
                            <Text style={styles.itemName}>{item.name || item.productType.name}</Text>
                            {item.showDimensions && (
                                <Text style={styles.itemDims}>
                                    ({item.width} x {item.height} {item.unit.name})
                                </Text>
                            )}
                            <Text style={styles.qtyBadge}>x{item.quantity}</Text>
                        </View>

                        {/* Series - Only show if no custom description (as it's included there) */}
                        {/* Series - Only show if no custom description */}
                        {!item.isCustomDescription && (
                            <View style={{ marginBottom: 6 }}>
                                <Text style={styles.itemSeries}>{item.productSeries.name}</Text>
                                {item.productSeries.description && (
                                    <Text style={styles.attrDescription}>{item.productSeries.description}</Text>
                                )}
                            </View>
                        )}

                        {/* Description */}
                        {/* If custom description exists, parse and style it to match the rich look */}
                        {item.isCustomDescription && item.description ? (
                            <View style={styles.attrContainer}>
                                {item.description.split('\n').map((line, idx) => {
                                    const splitIndex = line.indexOf(':');
                                    if (splitIndex > -1) {
                                        const label = line.substring(0, splitIndex).trim();
                                        const value = line.substring(splitIndex + 1).trim();
                                        return (
                                            <View key={idx} style={styles.attrGroup}>
                                                <Text style={styles.attrLabel}>{label}:</Text>
                                                <Text style={[styles.attrValue, { flex: 1 }]}>{value}</Text>
                                            </View>
                                        );
                                    } else {
                                        // Regular line (e.g. description or screen info)
                                        return (
                                            <View key={idx} style={{ marginBottom: 4 }}>
                                                <Text style={styles.attrDescription}>{line}</Text>
                                            </View>
                                        );
                                    }
                                })}
                            </View>
                        ) : (
                            /* Attributes List - Standard Rich Display */
                            <View style={styles.attrContainer}>
                                {Object.entries(item.attributes).map(([catId, val], idx) => {
                                    const cat = categories.find(c => c.id === catId);
                                    const valArray = Array.isArray(val) ? val : [val];
                                    if (valArray.length === 0) return null;

                                    return (
                                        <View key={idx} style={styles.attrGroup}>
                                            <Text style={styles.attrLabel}>{cat?.name}:</Text>
                                            <View style={styles.attrValueRow}>
                                                {valArray.map((v, vIdx) => (
                                                    <View key={vIdx} style={{ marginRight: 8, marginBottom: 2 }}>
                                                        <Text style={styles.attrValue}>
                                                            {v.name}{vIdx < valArray.length - 1 ? ',' : ''}
                                                        </Text>
                                                        {v.description && (
                                                            <Text style={styles.attrDescription}>{v.description}</Text>
                                                        )}
                                                    </View>
                                                ))}
                                            </View>
                                        </View>
                                    );
                                })}
                            </View>
                        )}

                        {/* GREEN SCREEN TEXT */}
                        {item.hasScreen && (
                            <Text style={styles.screenText}>✓ Includes Screen</Text>
                        )}

                        {/* Price - Only show if NOT manual pricing */}
                        {!quote.isManualPricing && (
                            <View style={styles.itemFooter}>
                                <Text style={styles.priceText}>
                                    ${(item.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </Text>
                            </View>
                        )}
                    </View>
                ))}

                {/* TOTALS */}
                <View style={styles.totalsSection} wrap={false}>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Subtotal</Text>
                        <Text style={styles.totalValue}>
                            ${(quote.isManualPricing && quote.manualSubtotal !== undefined
                                ? quote.manualSubtotal
                                : subtotal
                            ).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </Text>
                    </View>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Tax ({taxRate}%)</Text>
                        <Text style={styles.totalValue}>
                            ${(quote.isManualPricing && quote.manualSubtotal !== undefined
                                ? quote.manualSubtotal * (taxRate / 100)
                                : taxAmount
                            ).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </Text>
                    </View>
                    <View style={[styles.totalRow, { marginTop: 4 }]}>
                        <Text style={[styles.totalLabel, { fontSize: 12, fontFamily: 'Helvetica-Bold', color: theme.slate900 }]}>Grand Total</Text>
                        <Text style={styles.grandTotalValue}>
                            ${(quote.isManualPricing && quote.manualSubtotal !== undefined
                                ? quote.manualSubtotal * (1 + taxRate / 100)
                                : total
                            ).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </Text>
                    </View>
                </View>

                {/* TERMS & CONDITIONS */}
                <View style={styles.termsSection} break>
                    <Text style={[styles.sectionTitle, { color: theme.slate900 }]}>Terms & Conditions</Text>

                    {quote.extraNotes && quote.showExtraNotes && (
                        <View style={styles.termGroup}>
                            <Text style={styles.termLabel}>Additional Notes:</Text>
                            <Text style={styles.termDesc}>{quote.extraNotes}</Text>
                        </View>
                    )}

                    {termCategories.map(cat => {
                        const selectedRaw = quote.selectedTerms[cat.id];
                        if (!selectedRaw || (Array.isArray(selectedRaw) && selectedRaw.length === 0)) return null;

                        let selectedItems: any[] = [];
                        if (Array.isArray(selectedRaw)) {
                            if (selectedRaw.length > 0 && typeof selectedRaw[0] === 'string') {
                                selectedItems = cat.items.filter(i => (selectedRaw as any[]).includes(i.id));
                            } else {
                                selectedItems = selectedRaw;
                            }
                        }

                        if (selectedItems.length === 0) return null;

                        return (
                            <View key={cat.id} style={styles.termGroup}>
                                <Text style={styles.termLabel}>{cat.name}:</Text>
                                {selectedItems.map((item, idx) => (
                                    <View key={idx} style={styles.termItem}>
                                        <Text style={styles.termText}>• {item.name}</Text>
                                        {item.description && (
                                            <Text style={styles.termDesc}>{item.description}</Text>
                                        )}
                                    </View>
                                ))}
                            </View>
                        );
                    })}
                </View>

                {/* FOOTER */}
                <View style={styles.footer} fixed>
                    <Text style={styles.footerText}>{companySettings.name} | {companySettings.website || 'www.example.com'}</Text>
                    <Text style={styles.footerText} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
                </View>

                {/* Watermark Block Removed from Bottom */}
            </Page>
        </Document >
    );
};
