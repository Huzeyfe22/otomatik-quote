import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#E4E4E4',
        padding: 30
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1
    },
    text: {
        fontSize: 12,
        marginBottom: 10
    }
});

export const SimplePDFDocument = ({ data }: { data: any }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.section}>
                <Text style={{ fontSize: 24, marginBottom: 20 }}>Test PDF Document</Text>
                <Text style={styles.text}>If you can read this, PDF generation is working.</Text>
                <Text style={styles.text}>Client: {data?.client?.name || 'No Client'}</Text>
                <Text style={styles.text}>Total Price: ${data?.totalPrice || 0}</Text>
            </View>
        </Page>
    </Document>
);
