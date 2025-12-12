import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { Quote, CompanySettings, AttributeCategory } from '../types';

// --- THEME CONFIGURATION ---
const theme = {
    primary: '#2563EB', // Modern Royal Blue
    secondary: '#1E293B', // Slate 900
    accent: '#F59E0B', // Amber 500
    text: '#334155', // Slate 700
    textLight: '#64748B', // Slate 500
    bgLight: '#F8FAFC', // Slate 50
    border: '#E2E8F0', // Slate 200
};

// --- STYLES ---
const styles = StyleSheet.create({
    page: {
        fontFamily: 'Helvetica',
        fontSize: 10,
        lineHeight: 1.5,
        color: theme.text,
        paddingTop: 60, // Increased to clear header
        paddingBottom: 60,
        paddingHorizontal: 40,
        flexDirection: 'column', // Explicit column layout
    },
    // Cover page specific style
    coverPage: {
        fontFamily: 'Helvetica',
        fontSize: 10,
        lineHeight: 1.5,
        color: theme.text,
        backgroundColor: '#FFFFFF',
        padding: 0,
        flexDirection: 'column',
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
        width: 400,
        opacity: 0.15,
        objectFit: 'contain',
    },

    // --- BARS ---
    topBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 8,
        backgroundColor: theme.secondary,
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 8,
        backgroundColor: theme.primary,
    },

    // --- COVER PAGE CONTENT ---
    coverContainer: {
        flex: 1,
        flexDirection: 'column',
    },
    coverHeader: {
        height: '35%',
        backgroundColor: theme.secondary,
        padding: 40,
        justifyContent: 'center',
        position: 'relative',
        flexDirection: 'column',
    },
    coverAccentLine: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 8,
        backgroundColor: theme.primary,
    },
    coverLogo: {
        width: 150,
        height: 100,
        objectFit: 'contain',
        marginBottom: 20,
    },
    coverTitle: {
        fontSize: 36,
        fontFamily: 'Helvetica-Bold',
        color: '#FFFFFF',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    coverSubtitle: {
        fontSize: 14,
        color: '#94A3B8',
        marginTop: 10,
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    coverBody: {
        padding: 40,
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'column',
    },
    coverInfoBox: {
        borderLeftWidth: 4,
        borderLeftColor: theme.primary,
        paddingLeft: 20,
        marginBottom: 40,
        flexDirection: 'column',
    },
    coverLabel: {
        fontSize: 9,
        color: theme.textLight,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 4,
    },
    coverValue: {
        fontSize: 18,
        fontFamily: 'Helvetica-Bold',
        color: theme.secondary,
        marginBottom: 15,
    },
    coverDate: {
        marginTop: 40,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: theme.border,
        flexDirection: 'column',
    },

    // --- MAIN CONTENT ---
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    headerBrand: {
        fontSize: 10,
        fontFamily: 'Helvetica-Bold',
        color: theme.secondary,
    },
    headerPageNum: {
        fontSize: 8,
        color: theme.textLight,
    },

    // Sections
    section: {
        marginBottom: 20,
        flexDirection: 'column',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 4,
        borderLeftWidth: 4,
        borderLeftColor: theme.primary,
    },
    sectionNumber: {
        fontSize: 12,
        fontFamily: 'Helvetica-Bold',
        color: theme.primary,
        marginRight: 10,
    },
    sectionTitle: {
        fontSize: 11,
        fontFamily: 'Helvetica-Bold',
        color: theme.secondary,
        textTransform: 'uppercase',
    },

    // Rich Text
    rtContainer: { marginBottom: 5, flexDirection: 'column' },
    rtHeading: { fontSize: 10, fontFamily: 'Helvetica-Bold', marginTop: 10, marginBottom: 4, color: theme.secondary },
    rtSubHeading: { fontSize: 9, fontFamily: 'Helvetica-Bold', marginTop: 6, marginBottom: 2, color: theme.primary },
    rtBullet: { flexDirection: 'row', marginBottom: 2, paddingLeft: 8 },
    rtBulletSymbol: { width: 12, fontSize: 12, color: theme.accent },
    rtBulletText: { fontSize: 9, color: theme.text, flex: 1 },
    rtParagraph: { fontSize: 9, color: theme.text, marginBottom: 6, lineHeight: 1.5, textAlign: 'justify' },

    // Financials
    financialBox: {
        marginTop: 5,
        padding: 15,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: theme.primary,
        flexDirection: 'column',
    },

    // Signatures
    signatureSection: {
        marginTop: 30,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: theme.border,
        flexDirection: 'column',
    },
    signatureRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30,
    },
    signatureBlock: { width: '45%', flexDirection: 'column' },
    signatureLine: { borderBottomWidth: 1, borderBottomColor: theme.secondary, marginBottom: 8, borderStyle: 'dashed' },
    signatureName: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: theme.secondary },
    signatureTitle: { fontSize: 8, color: theme.textLight, textTransform: 'uppercase' },

    // Footer
    footer: {
        position: 'absolute',
        bottom: 20,
        left: 40,
        right: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: theme.border,
        paddingTop: 10,
    },
    footerText: { fontSize: 7, color: '#94A3B8', textTransform: 'uppercase' },

    // --- PRODUCT STYLES ---
    itemCard: {
        marginBottom: 15,
        padding: 12,
        backgroundColor: 'rgba(248, 250, 252, 0.6)', // slate-50 transparent
        borderRadius: 4,
        borderWidth: 1,
        borderColor: theme.border,
        flexDirection: 'column',
    },
    itemHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 6,
    },
    itemName: {
        fontSize: 12,
        fontFamily: 'Helvetica-Bold',
        color: theme.secondary,
        marginRight: 8,
        flex: 1,
    },
    itemDims: {
        fontSize: 10,
        color: theme.textLight,
        marginRight: 8,
    },
    qtyBadge: {
        backgroundColor: '#DBEAFE', // blue100
        color: theme.primary,
        fontSize: 9,
        fontFamily: 'Helvetica-Bold',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
    },
    itemSeries: {
        fontSize: 10,
        fontFamily: 'Helvetica-Bold',
        color: theme.text,
        marginBottom: 2,
    },
    attrDescription: {
        fontSize: 9,
        color: theme.textLight,
        fontStyle: 'italic',
    },
    itemDesc: {
        fontSize: 10,
        color: theme.text,
        marginTop: 4,
        lineHeight: 1.4,
    },
    attrContainer: {
        marginTop: 6,
        paddingTop: 6,
        borderTopWidth: 1,
        borderTopColor: theme.border,
        flexDirection: 'column',
    },
    attrGroup: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    attrLabel: {
        width: 100,
        fontSize: 9,
        color: theme.textLight,
    },
    attrValueRow: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    attrValue: {
        fontSize: 9,
        fontFamily: 'Helvetica-Bold',
        color: theme.secondary,
    },
    screenText: {
        marginTop: 6,
        fontSize: 9,
        color: '#16A34A', // green600
        fontFamily: 'Helvetica-Bold',
    },
});

// --- HELPER: Rich Text Renderer ---
const RichTextRenderer = ({ text }: { text: string }) => {
    if (!text) return null;
    const lines = text.split('\n');
    return (
        <View style={styles.rtContainer}>
            {lines.map((line, i) => {
                const trimmed = line.trim();
                // If it's empty, render a spacer
                if (!trimmed) return <View key={i} style={{ height: 6 }} />;

                // Headings (Numbered lists like "1. Something")
                if (/^\d+\.\s/.test(trimmed)) {
                    return <Text key={i} style={styles.rtHeading}>{trimmed}</Text>;
                }

                // Key-Value pairs (Like "SERIES: Standard") or Subheadings (Caps + Colon)
                // We want to handle standard lines normally if they aren't strictly headers
                // Also explicitly handle our specific "Excluded" header which contains parens
                if (/^[A-Z\s&()]+:$/.test(trimmed)) {
                    return <Text key={i} style={styles.rtSubHeading}>{trimmed}</Text>;
                }

                // Bullets
                if (trimmed.startsWith('*') || trimmed.startsWith('-')) {
                    return (
                        <View key={i} style={styles.rtBullet}>
                            <Text style={styles.rtBulletSymbol}>•</Text>
                            <Text style={styles.rtBulletText}>{trimmed.substring(1).trim()}</Text>
                        </View>
                    );
                }

                // Standard Paragraph
                return <Text key={i} style={styles.rtParagraph}>{trimmed}</Text>;
            })}
        </View>
    );
};

interface ContractPDFProps {
    quote: Quote;
    companySettings: CompanySettings;
    data: any;
    categories: AttributeCategory[];
}

export const ContractPDFDocument: React.FC<ContractPDFProps> = ({ quote, companySettings, data, categories }) => {

    // Resolve Logo Source
    const logoSrc = companySettings.logo || companySettings.logoUrl;
    // Resolve Watermark Source
    const watermarkSrc = companySettings.watermarkUrl;

    return (
        <Document>
            {/* --- PAGE 1: COVER PAGE --- */}
            <Page size="LETTER" style={styles.coverPage}>
                {/* NO WATERMARK ON COVER PAGE */}

                {/* Bars */}
                <View style={styles.topBar} fixed />
                <View style={styles.bottomBar} fixed />

                <View style={styles.coverContainer}>
                    <View style={[styles.coverHeader, { backgroundColor: '#006994' }]}>
                        {/* Logo and Name Side-by-Side */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                            {logoSrc && (
                                <Image src={logoSrc} style={{ width: 80, height: 80, objectFit: 'contain', marginRight: 20, backgroundColor: 'white', borderRadius: 4, padding: 5 }} />
                            )}
                            <View style={{ flexDirection: 'column' }}>
                                <Text style={{ fontSize: 24, fontFamily: 'Helvetica-Bold', color: '#FFF' }}>
                                    {companySettings.name}
                                </Text>
                                <Text style={styles.coverSubtitle}>Supply Agreement</Text>
                            </View>
                        </View>
                        <View style={styles.coverAccentLine} />
                    </View>

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
                <View style={[styles.footer, { bottom: 40 }]} fixed>
                    <Text style={styles.footerText}>Confidential & Proprietary</Text>
                    <Text style={styles.footerText}>{companySettings.name}</Text>
                </View>
            </Page>

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

                {/* Header repeated on content pages */}
                <View style={styles.header} fixed>
                    <Text style={styles.headerBrand}>{companySettings.name}</Text>
                    <Text style={styles.headerPageNum} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
                </View>

                {/* 01. PARTIES */}
                <View style={styles.section} wrap={false}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionNumber}>01</Text>
                        <Text style={styles.sectionTitle}>Parties</Text>
                    </View>
                    <View style={styles.rtContainer}>
                        <Text style={styles.rtParagraph}>
                            This Agreement is entered into between <Text style={{ fontFamily: 'Helvetica-Bold' }}>{companySettings.name}</Text> ("Supplier")
                            and <Text style={{ fontFamily: 'Helvetica-Bold' }}>{quote.client.name || 'The Client'}</Text> ("Client").
                        </Text>
                        <Text style={styles.rtParagraph}>
                            Supplier Address: {companySettings.address}
                        </Text>
                        <Text style={styles.rtParagraph}>
                            Client Address: {quote.client.address}
                        </Text>
                        {quote.client.showEmail && quote.client.email && (
                            <Text style={styles.rtParagraph}>
                                Client Email: {quote.client.email}
                            </Text>
                        )}
                        {quote.client.showPhone && quote.client.phone && (
                            <Text style={styles.rtParagraph}>
                                Client Phone: {quote.client.phone}
                            </Text>
                        )}
                    </View>
                </View>

                {/* 02. SUBJECT */}
                <View style={styles.section} wrap={false}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionNumber}>02</Text>
                        <Text style={styles.sectionTitle}>Subject</Text>
                    </View>
                    <View style={styles.rtContainer}>
                        <Text style={styles.rtParagraph}>
                            The subject of this contract is the supply of architectural fenestration systems as detailed in the attached quote and specifications.
                        </Text>
                    </View>
                </View>

                {/* 03. SCOPE */}
                <View style={styles.section} wrap={false}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionNumber}>03</Text>
                        <Text style={styles.sectionTitle}>Scope</Text>
                    </View>
                    <View style={styles.rtContainer}>
                        <Text style={styles.rtParagraph}>
                            The scope includes the manufacturing and supply of the products listed in the quote. Installation is excluded unless explicitly stated.
                        </Text>
                    </View>
                </View>

                {/* 04. PRODUCT SPECIFICATIONS */}
                {/* IMPORTANT: Removed wrap={false} so products can span multiple pages */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionNumber}>04</Text>
                        <Text style={styles.sectionTitle}>Product Specifications</Text>
                    </View>
                    {quote.items.map((item, index) => {
                        // Use the pre-formatted content from generateContractData
                        const productContent = data.products && data.products[index] ? data.products[index].content : '';

                        return (
                            <View key={index} style={styles.itemCard} wrap={false}>
                                {/* Header Row */}
                                <View style={styles.itemHeaderRow}>
                                    <Text style={styles.itemName}>{item.name || item.productType.name}</Text>
                                    <Text style={styles.qtyBadge}>x{item.quantity}</Text>
                                </View>

                                {/* Content Body */}
                                <View style={styles.attrContainer}>
                                    <RichTextRenderer text={productContent} />
                                </View>
                            </View>
                        );
                    })}
                </View>

                {/* 05. FINANCIAL SUMMARY */}
                <View style={styles.section} wrap={false}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionNumber}>05</Text>
                        <Text style={styles.sectionTitle}>Financial Summary</Text>
                    </View>
                    <View style={styles.financialBox}>
                        <RichTextRenderer text={data.financials} />
                    </View>
                </View>

                {/* 06. TERMS & CONDITIONS (Dynamic Clauses) */}
                {data.clauses.map((clause: any, index: number) => (
                    <View key={index} style={styles.section} wrap={false}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionNumber}>{String(index + 6).padStart(2, '0')}</Text>
                            <Text style={styles.sectionTitle}>{clause.title}</Text>
                        </View>
                        <RichTextRenderer text={clause.content} />
                    </View>
                ))}

                {/* SIGNATURES */}
                <View style={styles.signatureSection} wrap={false}>
                    <Text style={{ fontSize: 10, marginBottom: 20 }}>
                        IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first above written.
                    </Text>
                    <View style={styles.signatureRow}>
                        <View style={styles.signatureBlock}>
                            <View style={styles.signatureLine} />
                            <Text style={styles.signatureName}>{companySettings.name}</Text>
                            <Text style={styles.signatureTitle}>Authorized Signature</Text>
                        </View>
                        <View style={styles.signatureBlock}>
                            <View style={styles.signatureLine} />
                            <Text style={styles.signatureName}>{quote.client.name || 'Client'}</Text>
                            <Text style={styles.signatureTitle}>Authorized Signature</Text>
                        </View>
                    </View>
                </View>

                {/* Footer repeated */}
                <View style={styles.footer} fixed>
                    <Text style={styles.footerText}>Confidential & Proprietary</Text>
                    <Text style={styles.footerText}>{companySettings.name}</Text>
                </View>

                {/* Watermark Block Removed from Bottom */}
            </Page>
        </Document >
    );
};
