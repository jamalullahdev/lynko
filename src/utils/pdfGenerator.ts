import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { ChainOfCustodyReport } from '../store/useAppStore';

const generateHTML = (report: Partial<ChainOfCustodyReport>) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Chain of Custody Report</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 30px; color: #0F172A; background: #FFF; }
    .header { text-align: center; border-bottom: 3px solid #03C1B6; padding-bottom: 15px; margin-bottom: 20px; }
    .header h1 { color: #03C1B6; margin: 0; font-size: 26px; text-transform: uppercase; letter-spacing: 1px; }
    .header p { margin: 5px 0 0; color: #64748B; font-size: 13px; font-weight: bold; }
    
    .section-header { font-size: 14px; font-weight: bold; background: #2C1B4D; color: #FFF; padding: 8px 12px; margin-top: 20px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px; }
    
    .grid { display: flex; flex-wrap: wrap; margin-top: 10px; gap: 10px; }
    .grid-box { flex: 1; min-width: 45%; background: #F8FAFC; padding: 10px; border: 1px solid #E2E8F0; border-radius: 6px; }
    .grid-box span { font-weight: bold; color: #475569; display: block; font-size: 11px; text-transform: uppercase; margin-bottom: 3px; }
    .grid-box p { margin: 0; font-size: 13px; font-weight: 600; color: #0F172A; }

    table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 12px; }
    th { background: #03C1B6; color: #FFF; padding: 10px; text-align: left; font-size: 12px; text-transform: uppercase; }
    td { border-bottom: 1px solid #E2E8F0; padding: 10px; vertical-align: top; }
    tr:nth-child(even) { background: #F8FAFC; }
    .sample-img { max-width: 90px; max-height: 70px; border-radius: 6px; object-fit: cover; border: 1px solid #CBD5E1; }

    .signature-grid { display: flex; justify-content: space-between; margin-top: 30px; }
    .sig-card { width: 48%; border: 1px solid #CBD5E1; padding: 12px; border-radius: 6px; background: #FAF5FF; }
    .sig-card h4 { margin: 0 0 10px; font-size: 12px; color: #2C1B4D; text-transform: uppercase; }
    .sig-img { width: 100%; height: 75px; object-fit: contain; border-bottom: 1px solid #0F172A; }

    .footer { margin-top: 40px; font-size: 11px; text-align: center; color: #94A3B8; border-top: 1px solid #E2E8F0; padding-top: 15px; }
  </style>
</head>
<body>

  <!-- HEADER -->
  <div class="header">
    <h1>Lynko Chain of Custody</h1>
    <p>Official Environmental Laboratory Sample Submission Document</p>
  </div>

  <!-- SECTION 1: PROJECT & PROPERTY DETAILS -->
  <div class="section-header">Section 1: Project & Property Header</div>
  <div class="grid">
    <div class="grid-box"><span>PO # / Document ID</span><p>${report.poNumber || report.id || 'PO-99482'}</p></div>
    <div class="grid-box"><span>Sampling Date & Time</span><p>${report.samplingDate || '01/27/2026'} ${report.samplingTime || '09:49 AM'}</p></div>
    <div class="grid-box" style="flex: 100%;"><span>Property Address</span><p>${report.address || 'N/A'}</p></div>
    <div class="grid-box" style="flex: 100%;"><span>Project Description</span><p>${report.description || 'N/A'}</p></div>
  </div>

  <!-- SECTION 2: CONTACT & ACCOUNT INFO -->
  <div class="section-header">Section 2: Contact & Account Info</div>
  <div class="grid">
    <div class="grid-box"><span>Account Name</span><p>${report.accountName || 'Alpha Environmental'}</p></div>
    <div class="grid-box"><span>Contact / Sampled By</span><p>${report.sampledBy || report.contactName || 'Ali Saleh'}</p></div>
    <div class="grid-box"><span>Contact Phone</span><p>${report.phone || '214-994-9874'}</p></div>
    <div class="grid-box"><span>Zipcode</span><p>${report.zipcode || '75208'}</p></div>
  </div>

  ${report.specialInstructions ? `
  <!-- SECTION 3: SPECIAL ANALYST INSTRUCTIONS -->
  <div class="section-header">Section 3: Special Analyst Instructions</div>
  <p style="font-size: 13px; margin: 10px; color: #334155; line-height: 1.5; background: #FFFBEB; padding: 10px; border-left: 4px solid #F59E0B; border-radius: 4px;">
    ${report.specialInstructions}
  </p>
  ` : ''}

  <!-- SECTION 4: SAMPLE MANIFEST TABLE -->
  <div class="section-header">Section 4: Sample Manifest (${report.samples?.length || 0} Logged Samples)</div>
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Sample ID</th>
        <th>Analysis 1</th>
        <th>Analysis 2</th>
        <th>Description</th>
        <th>Measurement</th>
        <th>Photo</th>
      </tr>
    </thead>
    <tbody>
      ${(report.samples || []).map((s, index) => `
        <tr>
          <td><strong>${index + 1}</strong></td>
          <td><strong style="color: #03C1B6;">${s.sampleId}</strong></td>
          <td>${s.analysis1 ? '✓ ON' : 'OFF'}</td>
          <td>${s.analysis2 ? '✓ ON' : 'OFF'}</td>
          <td>${s.description}</td>
          <td>${s.measurement} ${s.measurementUnit}</td>
          <td>${s.photoUri ? `<img src="${s.photoUri}" class="sample-img" />` : 'No Photo'}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <!-- SECTION 5: CUSTODY TRANSFER SIGNATURES -->
  <div class="section-header">Section 5: Custody Transfer Signatures</div>
  <div class="signature-grid">
    <div class="sig-card">
      <h4>Relinquished By (Field Inspector)</h4>
      ${report.courierSignature ? `<img src="${report.courierSignature}" class="sig-img" />` : '<p style="height: 60px; color: #94A3B8;">Sign-Off Completed</p>'}
      <p style="font-size: 11px; margin: 6px 0 0; color: #475569;">Sign-Off Date: ${report.samplingDate || '01/27/2026'}</p>
    </div>
    <div class="sig-card" style="background: #F8FAFC;">
      <h4>Received By (Laboratory Intake)</h4>
      <div style="height: 75px; border-bottom: 1px dashed #CBD5E1;"></div>
      <p style="font-size: 11px; margin: 6px 0 0; color: #94A3B8;">Date & Time Received: [ Lab Use Only ]</p>
    </div>
  </div>

  <div class="footer">
    Document ID: ${report.id || 'COC-TEMP'} &bull; Generated via Lynko Environmental Mobile App &bull; &copy; 2026
  </div>

</body>
</html>
`;

export const generatePDFReport = async (report: Partial<ChainOfCustodyReport>) => {
  try {
    const html = generateHTML(report);
    const { uri } = await Print.printToFileAsync({
      html,
      base64: false,
    });
    return uri;
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    throw error;
  }
};

export const sharePDFReport = async (fileUri: string) => {
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(fileUri, {
      UTI: '.pdf',
      mimeType: 'application/pdf',
      dialogTitle: 'Share Chain of Custody PDF',
    });
  }
};
