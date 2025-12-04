import { StyleSheet, Font } from '@react-pdf/renderer';

// Register fonts (assuming they are available or using standard ones for now)
// In a real app, we'd register custom fonts here.

export const PDF_TEMPLATES = [
    { id: 'modern_1', name: 'Modern Blue (Default)', primaryColor: '#2563eb', secondaryColor: '#1e40af', headerLayout: 'left' },
    { id: 'modern_2', name: 'Modern Slate', primaryColor: '#475569', secondaryColor: '#334155', headerLayout: 'right' },
    { id: 'classic_1', name: 'Classic Serif', primaryColor: '#0f172a', secondaryColor: '#000000', headerLayout: 'center', fontFamily: 'Times-Roman' },
    { id: 'minimal_1', name: 'Minimalist', primaryColor: '#000000', secondaryColor: '#555555', headerLayout: 'left', tableStyle: 'minimal' },
    { id: 'bold_1', name: 'Bold Red', primaryColor: '#dc2626', secondaryColor: '#991b1b', headerLayout: 'left' },
    { id: 'nature_1', name: 'Nature Green', primaryColor: '#16a34a', secondaryColor: '#15803d', headerLayout: 'right' },
    { id: 'royal_1', name: 'Royal Gold', primaryColor: '#ca8a04', secondaryColor: '#854d0e', headerLayout: 'center' },
    { id: 'tech_1', name: 'Tech Cyan', primaryColor: '#0891b2', secondaryColor: '#0e7490', headerLayout: 'left' },
    { id: 'dark_1', name: 'Dark Mode', primaryColor: '#1e293b', secondaryColor: '#0f172a', headerLayout: 'left', background: '#f8fafc' },
    { id: 'elegant_1', name: 'Elegant Purple', primaryColor: '#7c3aed', secondaryColor: '#5b21b6', headerLayout: 'center' },
];

export const getTemplateConfig = (templateId: string) => {
    return PDF_TEMPLATES.find(t => t.id === templateId) || PDF_TEMPLATES[0];
};

export const createTemplateStyles = (templateId: string) => {
    const config = getTemplateConfig(templateId);

    return StyleSheet.create({
        page: {
            padding: 40,
            fontFamily: config.fontFamily || 'Helvetica',
            fontSize: 10,
            color: '#333',
            backgroundColor: config.background || '#ffffff',
        },
        header: {
            flexDirection: config.headerLayout === 'right' ? 'row-reverse' : 'row',
            justifyContent: config.headerLayout === 'center' ? 'center' : 'space-between',
            marginBottom: 30,
            borderBottomWidth: 2,
            borderBottomColor: config.primaryColor,
            paddingBottom: 10,
            alignItems: 'center',
        },
        logo: {
            width: 80,
            height: 80,
            objectFit: 'contain',
            marginBottom: config.headerLayout === 'center' ? 10 : 0,
        },
        companyInfo: {
            textAlign: config.headerLayout === 'right' ? 'left' : 'right',
            marginLeft: config.headerLayout === 'left' ? 'auto' : 0,
            marginRight: config.headerLayout === 'right' ? 'auto' : 0,
        },
        companyName: {
            fontSize: 20,
            fontWeight: 'bold',
            color: config.primaryColor,
            marginBottom: 4,
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            color: config.secondaryColor,
            marginBottom: 20,
            textAlign: 'center',
            textTransform: 'uppercase',
            letterSpacing: 2,
        },
        sectionTitle: {
            fontSize: 14,
            fontWeight: 'bold',
            color: config.primaryColor,
            marginTop: 20,
            marginBottom: 10,
            borderBottomWidth: 1,
            borderBottomColor: '#e2e8f0',
            paddingBottom: 4,
        },
        tableHeader: {
            flexDirection: 'row',
            backgroundColor: config.tableStyle === 'minimal' ? 'transparent' : config.primaryColor,
            color: config.tableStyle === 'minimal' ? config.primaryColor : '#fff',
            padding: 8,
            fontWeight: 'bold',
            borderBottomWidth: config.tableStyle === 'minimal' ? 2 : 0,
            borderBottomColor: config.primaryColor,
        },
        tableRow: {
            flexDirection: 'row',
            borderBottomWidth: 1,
            borderBottomColor: '#e2e8f0',
            padding: 8,
            alignItems: 'center',
        },
        totalSection: {
            marginTop: 20,
            alignItems: 'flex-end',
        },
        totalRow: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginBottom: 4,
        },
        totalLabel: {
            width: 100,
            fontWeight: 'bold',
            color: '#64748b',
        },
        totalValue: {
            width: 100,
            textAlign: 'right',
            fontWeight: 'bold',
            color: '#0f172a',
        },
        grandTotal: {
            fontSize: 14,
            color: config.primaryColor,
            borderTopWidth: 2,
            borderTopColor: config.primaryColor,
            paddingTop: 4,
            marginTop: 4,
        },
        footer: {
            position: 'absolute',
            bottom: 30,
            left: 40,
            right: 40,
            textAlign: 'center',
            color: '#94a3b8',
            fontSize: 8,
            borderTopWidth: 1,
            borderTopColor: '#e2e8f0',
            paddingTop: 10,
        }
    });
};
