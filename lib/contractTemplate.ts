import { Quote, CompanySettings, AttributeCategory } from '../types';

// Helper: Currency Formatter
const fmt = (amount: number) => new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(amount);

// Helper: Date Formatter
const dateFmt = (date: Date) => new Date(date).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' });

/**
 * GENERATE CONTRACT CONTENT - HEAVY DUTY LEGAL EDITION
 * Comprehensive legal protection, industry-specific clauses, and detailed liability limitations.
 */
export const generateContractData = (quote: Quote, companySettings: CompanySettings, categories: AttributeCategory[]) => {

    // Extract user terms early for smart parsing across all sections
    const userTerms = quote.terms || '';

    // --- HELPER: Get Selected Terms ---
    const getTerms = (categoryId: string, defaultText: string) => {
        const items = quote.selectedTerms[categoryId];
        if (items && items.length > 0) {
            return items.map(i => i.name).join(', ');
        }
        return defaultText;
    };

    // --- HELPER: Smart Duration Parser ---
    const extractDuration = (text: string | undefined, keyword: string, defaultValue: string) => {
        if (!text) return defaultValue;
        const regex = new RegExp(`${keyword}[:\\s-]*([\\d\\w\\s]+)(?=\\.|\\n|$)`, 'i');
        const match = text.match(regex);
        return match ? match[1].trim() : defaultValue;
    };

    // --- 1. INTRO (Formal & Binding) ---
    const introText = `THIS SUPPLY AGREEMENT (the "Agreement") is made and entered into on this ${dateFmt(new Date())}, by and between:

SELLER:
${companySettings.name}
(Hereinafter referred to as the "Supplier")

BUYER:
${quote.client.name || '[CLIENT NAME]'}
(Hereinafter referred to as the "Client")

PROJECT REFERENCE:
"${quote.name || '[PROJECT NAME]'}"

RECITALS:
WHEREAS, the Client wishes to purchase custom architectural fenestration products and related services; and
WHEREAS, the Supplier specializes in the fabrication, supply, and/or installation of such high-performance systems;
NOW, THEREFORE, in consideration of the mutual covenants, promises, and payments herein contained, the parties agree as follows:

1. ENTIRE AGREEMENT
This Agreement, including all attached schedules and specifications, constitutes the entire agreement between the parties and supersedes all prior negotiations, representations, or agreements, whether written or oral. No modification to this Agreement shall be binding unless made in writing and signed by authorized representatives of both parties.`;

    // --- 2. PROJECT INFO (Detailed Site & Scope) ---
    const projectInfoText = `1. SITE LOCATION & DELIVERY:
${quote.client.address || '[DELIVERY ADDRESS NOT PROVIDED]'}

2. CONTACT INFORMATION:
Client Representative: ${quote.client.name || 'N/A'}
Email: ${quote.client.email || 'N/A'} | Phone: ${quote.client.phone || 'N/A'}

4. VERIFICATION OF CONDITIONS:
The Client acknowledges that all manufacturing dimensions are critical. The Supplier reserves the right to conduct a final site measurement. If actual site conditions differ materially from the initial drawings, the Supplier reserves the right to adjust the Contract Price accordingly via a Change Order.`;

    // --- 3. PRODUCT SPECS (Rich) ---
    const productSpecs = quote.items.map(item => {
        const contentParts: string[] = [];

        // 1. Series Info
        if (item.productSeries && !item.productType.isExtras) {
            contentParts.push(`Series: ${item.productSeries.name}`);
            if (item.productSeries.description && !item.isCustomDescription) {
                contentParts.push(item.productSeries.description);
            }
        }

        // 2. Dimensions
        if (item.showDimensions && item.width && item.height) {
            contentParts.push(`Dimensions: ${item.width}" x ${item.height}"`);
        }

        // 3. Attributes
        Object.entries(item.attributes).forEach(([key, val]) => {
            const category = categories.find(c => c.id === key);
            const label = category ? category.name : key;
            const valArray = Array.isArray(val) ? val : [val];

            if (valArray.length > 0) {
                const valueString = valArray.map(v => v.name).join(', ');
                contentParts.push(`${label}: ${valueString}`);

                valArray.forEach(v => {
                    if (v.description) contentParts.push(v.description);
                });
            }
        });

        // 4. Screen
        if (item.hasScreen) {
            contentParts.push('Includes Screen');
        }

        // 5. Custom Description Override
        if (item.isCustomDescription && item.description) {
            return {
                id: item.id,
                title: `${item.quantity}x ${item.name || item.productType.name}`,
                content: item.description
            };
        }

        return {
            id: item.id,
            title: `${item.quantity}x ${item.name || item.productType.name}`,
            content: contentParts.join('\n')
        };
    });

    // --- 4. FINANCIALS (Detailed) ---
    const subtotal = (quote.isManualPricing && quote.manualSubtotal !== undefined)
        ? quote.manualSubtotal
        : quote.totalPrice;
    const taxRate = quote.taxRate || companySettings.taxRate || 13;
    const taxAmount = subtotal * (taxRate / 100);
    const totalContractPrice = subtotal + taxAmount;

    const financialText = `INVESTMENT SUMMARY & OBLIGATIONS:

    Net Product Value:      ${fmt(subtotal)}
    Applicable Taxes (${taxRate}%): ${fmt(taxAmount)}
    --------------------------------
    TOTAL CONTRACT VALUE:   ${fmt(totalContractPrice)}

    * Validity: Valid for 30 days from Agreement Date.
    * Currency: All amounts are in Canadian Dollars (CAD) unless otherwise noted.
    * Price Escalation: Prices are based on current raw material costs. In the event of significant industry-wide price increases (Aluminum, Glass) prior to the Deposit date, the Supplier reserves the right to adjust pricing with written notice.`;

    // --- 5. TECHNICAL & PERMITS (Merged) ---
    const technicalText = `SITE READINESS, PERMITS & RESPONSIBILITIES:

1. BUILDING PERMITS & COMPLIANCE:
The Client certifies that it has obtained all necessary building permits and is in compliance with all applicable laws. The Supplier has no responsibility to obtain building permits or ensure the Improvement complies with applicable laws.

2. WORKMANSHIP & CODES:
The Supplier agrees that all work performed shall be in a good and workmanlike manner and comply with applicable building codes relevant to the fenestration product itself.

3. STRUCTURE & FRAMING RESPONSIBILITY:
The Supplier is NOT responsible for the building structure. The stability of the frames/bucks around the windows and doors is the Customer's sole responsibility.

4. FRAMING IRREGULARITIES:
Any installation delays or additional job-site visits resulting from improper framing (out of square, not plumb, loose bucks) will be subject to additional charges billed to the Customer.

5. ROUGH OPENINGS:
Openings must be prepared 1 inch (25mm) wider and 1 inch (25mm) taller than the Net Frame Size. The Supplier accepts no liability for fitment issues caused by irregular openings.`;

    // --- 6. LEGAL & LIABILITY (Merged) ---
    const legalText = `TERMS OF SALE & LIABILITY:

1. TITLE & OWNERSHIP:
The title and ownership of the goods shall remain with the Supplier until all amounts are paid in full.

2. CUSTOM PRODUCTS & TERMINATION:
The Customer understands that products purchased under this agreement are unique and custom-made. Upon signing this agreement, the Customer agrees to pay the FULL contract price in the event the Customer chooses to terminate the contract prior to completion.

3. DAMAGE BY OTHERS:
The Supplier is not responsible for any damage caused to the windows and doors by other contractors working on site after the completion of the installation (or delivery).

4. FORCE MAJEURE & DELAYS:
The Supplier is not responsible for delays caused by port strikes, strikes at rail/transport lines, lockouts, natural disasters, unexpected weather conditions, or government lockdowns.

5. NON-ASSIGNABILITY:
This contract may not be assigned by the Customer to a third party without written consent.

6. GOVERNING LAW:
Customer and Supplier agree that they each have the right and authority to enter this contract. In the event of a dispute, the laws of Ontario shall apply.`;

    // NEW SECTION: DRAWINGS & CHANGES
    const changesText = `DRAWINGS & CHANGE ORDERS:

1. APPROVAL PROCESS:
Each window and door drawing will be submitted to the Customer for review. Production will not commence until these shop drawings are signed and approved.

2. CHANGES AFTER APPROVAL:
After agreement and confirmation of shop drawings, ANY change requested by the Customer will be subject to additional charges and potential schedule delays.`;

    // --- 7. PAYMENT (Heavy Duty) ---
    // Priority: 1. Custom Text Parsing (Payment: ...), 2. Selected Dropdown Items, 3. Default

    // Get Payment Terms with Descriptions
    const paymentTermsItems = quote.selectedTerms['paymentTerms'];
    let paymentScheduleText = '';

    if (paymentTermsItems && Array.isArray(paymentTermsItems) && paymentTermsItems.length > 0) {
        // If we have actual objects (which we should if the store is working correctly)
        if (typeof paymentTermsItems[0] !== 'string') {
            paymentScheduleText = paymentTermsItems.map((item: any) => {
                return `• ${item.name}${item.description ? `\n  (${item.description})` : ''}`;
            }).join('\n');
        } else {
            // Fallback if we only have IDs (shouldn't happen with current logic but safe to have)
            paymentScheduleText = getTerms('paymentTerms', '50% Deposit, 50% Before Delivery');
        }
    } else {
        // Fallback to smart parsing or default
        const paymentTermsSmart = extractDuration(userTerms, 'Payment', '');
        paymentScheduleText = paymentTermsSmart || '50% Deposit upon signing, 40% Prior to Delivery, 10% Upon Completion';
    }

    const paymentText = `PAYMENT TERMS & FINANCIAL CONDITIONS:

Production is strictly contingent upon receipt of the Deposit and signed Shop Drawings.

    SCHEDULE:
${paymentScheduleText}

    * Interest: Overdue accounts bear interest at 2% per month (24% per annum).
    * Suspension of Work: The Supplier reserves the right to suspend work or delivery if any payment is overdue.
    * No Holdback: Unless explicitly agreed in writing, no statutory holdback applies to the supply of materials.
    * Collection Costs: The Client agrees to pay all costs of collection, including reasonable legal fees, in the event of default.`;

    // --- 8. WARRANTY (Heavy Duty) ---
    const glassWarranty = extractDuration(userTerms, 'Glass', '10 Years');
    const frameWarranty = extractDuration(userTerms, 'Frame', '10 Years');
    const hardwareWarranty = extractDuration(userTerms, 'Hardware', '2 Years');
    const installWarranty = extractDuration(userTerms, 'Installation', '1 Year');

    const warrantyText = `LIMITED WARRANTY & EXCLUSIONS:

The Supplier warrants its products to be free from defects in material and workmanship for the periods specified below:

    A) INSULATED GLASS: ${glassWarranty} (Seal failure/obstruction).
    B) FRAMING SYSTEM: ${frameWarranty} (Abnormal fading/peeling).
    C) HARDWARE: ${hardwareWarranty} (Mechanical failure).
    D) LABOR: ${installWarranty} (If installed by Supplier).

EXCLUSIONS & VOIDING OF WARRANTY:
1. THERMAL STRESS: Glass breakage due to thermal stress or spontaneous breakage is excluded.
2. CHEMICAL DAMAGE: Damage caused by brick wash, harsh solvents, or abrasive cleaners voids the finish warranty.
3. CONSTRUCTION DEBRIS (CRITICAL):
   The high-performance hardware is sensitive to dust. DAMAGE CAUSED BY DRYWALL DUST, SANDING, OR PLASTER IS STRICTLY EXCLUDED. The Client must protect hardware during construction.
4. UNAUTHORIZED MODIFICATION: Any alteration or repair attempted by non-authorized personnel voids all warranties.`;

    // --- 9. TIMELINE (Heavy Duty) ---
    const leadTimeRaw = extractDuration(userTerms, 'Lead Time', getTerms('leadTime', '8-10 Weeks'));
    const leadTimeText = `PROJECT TIMELINE & DELIVERY:

    ESTIMATED LEAD TIME: ${leadTimeRaw}

    * Commencement: Lead Time begins ONLY after: (1) Deposit Receipt, (2) Final Measurements, (3) Signed Shop Drawings.
    * Estimates Only: All dates are estimates subject to global supply chain variables. The Supplier shall not be penalized for delays beyond its control.
    * Storage Fees: If the Client is unable to accept delivery within 14 days of notification of readiness, a storage fee of 1% of the contract value per week may be charged.`;

    // --- 10. SCOPE (Heavy Duty) ---
    const inclusionsRaw = getTerms('inclusions', 'Supply of Units, Standard Glazing');
    const exclusionsRaw = getTerms('exclusions', 'Installation, Interior Trim, Final Cleaning, Permits, Structural Support');

    const inclusionsText = `SCOPE OF WORK DEFINITION:

INCLUDED:
${inclusionsRaw}

EXPLICITLY EXCLUDED (CLIENT RESPONSIBILITY):
${exclusionsRaw}
(The Supplier assumes no liability for work performed by other trades. Any item not listed in "Included" is deemed excluded.)`;

    return {
        intro: introText,
        projectInfo: projectInfoText,
        products: productSpecs,
        financials: financialText,
        clauses: [
            { id: 'technical', title: 'Site Readiness & Permits', content: technicalText },
            { id: 'changes', title: 'Drawings & Changes', content: changesText },
            { id: 'legal', title: 'Terms of Sale & Liability', content: legalText },
            { id: 'payment', title: 'Payment Schedule', content: paymentText },
            { id: 'warranty', title: 'Warranty & Exclusions', content: warrantyText },
            { id: 'leadTime', title: 'Timeline & Delivery', content: leadTimeText },
            { id: 'inclusions', title: 'Scope of Work', content: inclusionsText },
        ],
        totals: { subtotal, taxAmount, totalContractPrice }
    };
};
