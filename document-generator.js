/**
 * Document Generator for HR System
 * Generates tax statements, payslips, insurance cards, employment letters
 */

const fs = require('fs');
const path = require('path');

// Ensure documents directory exists
const DOCS_DIR = path.join(__dirname, 'public', 'documents');
if (!fs.existsSync(DOCS_DIR)) {
    fs.mkdirSync(DOCS_DIR, { recursive: true });
}

// Document storage (in-memory for now)
const generatedDocuments = [];

/**
 * Generate Tax Statement (Form 16)
 */
function generateTaxStatement(employee, taxYear = 2025) {
    const fileName = `tax-statement-${employee.employee_id}-${taxYear}.html`;
    const filePath = path.join(DOCS_DIR, fileName);

    // Calculate sample tax data
    const annualSalary = 80000; // Sample
    const taxDeducted = annualSalary * 0.15; // 15% tax
    const netSalary = annualSalary - taxDeducted;

    const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Tax Statement - ${employee.full_name}</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; }
        .header { text-align: center; border-bottom: 3px solid #0066cc; padding-bottom: 20px; margin-bottom: 30px; }
        .header h1 { color: #0066cc; margin: 0; }
        .header p { color: #666; margin: 5px 0; }
        .section { margin: 30px 0; }
        .section h2 { color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px; }
        .info-grid { display: grid; grid-template-columns: 200px 1fr; gap: 15px; margin: 20px 0; }
        .info-label { font-weight: bold; color: #666; }
        .info-value { color: #333; }
        .amount { font-size: 18px; font-weight: bold; color: #0066cc; }
        .footer { margin-top: 50px; padding-top: 20px; border-top: 2px solid #eee; text-align: center; color: #666; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #eee; }
        th { background: #f5f7fa; font-weight: bold; }
        .print-btn { background: #0066cc; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; }
        @media print { .print-btn { display: none; } }
    </style>
</head>
<body>
    <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>

    <div class="header">
        <h1>Income Tax Statement</h1>
        <p>Form 16 - Financial Year ${taxYear-1}-${taxYear}</p>
        <p>Assessment Year ${taxYear}-${taxYear+1}</p>
    </div>

    <div class="section">
        <h2>Employee Details</h2>
        <div class="info-grid">
            <div class="info-label">Name:</div>
            <div class="info-value">${employee.full_name}</div>

            <div class="info-label">Employee ID:</div>
            <div class="info-value">${employee.employee_id}</div>

            <div class="info-label">Department:</div>
            <div class="info-value">${employee.department}</div>

            <div class="info-label">Designation:</div>
            <div class="info-value">${employee.position}</div>

            <div class="info-label">PAN Number:</div>
            <div class="info-value">ABCDE1234F</div>
        </div>
    </div>

    <div class="section">
        <h2>Income Summary</h2>
        <table>
            <thead>
                <tr>
                    <th>Particulars</th>
                    <th style="text-align: right;">Amount (₹)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Gross Salary</td>
                    <td style="text-align: right;">${annualSalary.toLocaleString()}</td>
                </tr>
                <tr>
                    <td>Professional Tax</td>
                    <td style="text-align: right;">2,500</td>
                </tr>
                <tr>
                    <td>Standard Deduction</td>
                    <td style="text-align: right;">50,000</td>
                </tr>
                <tr style="font-weight: bold; background: #f5f7fa;">
                    <td>Net Taxable Income</td>
                    <td style="text-align: right;">${(annualSalary - 52500).toLocaleString()}</td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="section">
        <h2>Tax Deductions</h2>
        <table>
            <thead>
                <tr>
                    <th>Section</th>
                    <th>Description</th>
                    <th style="text-align: right;">Amount (₹)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>80C</td>
                    <td>PPF, ELSS, Life Insurance</td>
                    <td style="text-align: right;">1,50,000</td>
                </tr>
                <tr>
                    <td>80D</td>
                    <td>Health Insurance Premium</td>
                    <td style="text-align: right;">25,000</td>
                </tr>
                <tr>
                    <td>HRA</td>
                    <td>House Rent Allowance</td>
                    <td style="text-align: right;">60,000</td>
                </tr>
                <tr style="font-weight: bold; background: #f5f7fa;">
                    <td colspan="2">Total Deductions</td>
                    <td style="text-align: right;">2,35,000</td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="section">
        <h2>Tax Computation</h2>
        <div class="info-grid">
            <div class="info-label">Taxable Income:</div>
            <div class="info-value amount">₹ ${(annualSalary - 287500).toLocaleString()}</div>

            <div class="info-label">Income Tax:</div>
            <div class="info-value amount">₹ ${taxDeducted.toLocaleString()}</div>

            <div class="info-label">Cess (4%):</div>
            <div class="info-value amount">₹ ${(taxDeducted * 0.04).toLocaleString()}</div>

            <div class="info-label">Total Tax Deducted:</div>
            <div class="info-value amount">₹ ${(taxDeducted * 1.04).toLocaleString()}</div>
        </div>
    </div>

    <div class="footer">
        <p><strong>This is a computer-generated document. No signature is required.</strong></p>
        <p>Generated on: ${new Date().toLocaleDateString()}</p>
        <p>Company Name | Address | Contact Details</p>
    </div>
</body>
</html>`;

    fs.writeFileSync(filePath, html);

    const doc = {
        id: `DOC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        employeeId: employee.id,
        employeeName: employee.full_name,
        type: 'tax_statement',
        title: `Tax Statement ${taxYear}`,
        fileName: fileName,
        filePath: `/documents/${fileName}`,
        generatedAt: new Date().toISOString(),
        year: taxYear
    };

    generatedDocuments.push(doc);
    return doc;
}

/**
 * Generate Payslip
 */
function generatePayslip(employee, month = 'January', year = 2026) {
    const fileName = `payslip-${employee.employee_id}-${month}-${year}.html`;
    const filePath = path.join(DOCS_DIR, fileName);

    const basicSalary = 50000;
    const hra = basicSalary * 0.4;
    const da = basicSalary * 0.12;
    const grossSalary = basicSalary + hra + da;
    const pf = basicSalary * 0.12;
    const tax = grossSalary * 0.1;
    const netSalary = grossSalary - pf - tax;

    const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Payslip - ${employee.full_name}</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; background: #f5f7fa; }
        .payslip { background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; border-bottom: 3px solid #10b981; padding-bottom: 20px; margin-bottom: 30px; }
        .header h1 { color: #10b981; margin: 0; }
        .period { text-align: center; font-size: 18px; color: #666; margin: 10px 0; }
        .section { margin: 30px 0; }
        .section h2 { color: #333; font-size: 16px; margin-bottom: 15px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 30px; }
        .info-row { display: flex; justify-content: space-between; padding: 8px 0; }
        .info-label { color: #666; }
        .info-value { font-weight: bold; color: #333; }
        .earnings, .deductions { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .earnings h3 { color: #10b981; margin: 0 0 15px 0; }
        .deductions h3 { color: #ef4444; margin: 0 0 15px 0; }
        .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
        .total-row { font-weight: bold; font-size: 18px; background: #f0fdf4; padding: 15px; border-radius: 5px; margin-top: 10px; }
        .net-salary { text-align: center; background: #10b981; color: white; padding: 20px; border-radius: 8px; margin: 30px 0; }
        .net-salary .amount { font-size: 32px; font-weight: bold; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 2px solid #eee; text-align: center; color: #666; font-size: 12px; }
        .print-btn { background: #10b981; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin-bottom: 20px; }
        @media print { .print-btn { display: none; } }
    </style>
</head>
<body>
    <div class="payslip">
        <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>

        <div class="header">
            <h1>PAYSLIP</h1>
        </div>

        <div class="period">
            <strong>${month} ${year}</strong>
        </div>

        <div class="section">
            <div class="info-grid">
                <div class="info-row">
                    <span class="info-label">Employee Name:</span>
                    <span class="info-value">${employee.full_name}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Employee ID:</span>
                    <span class="info-value">${employee.employee_id}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Department:</span>
                    <span class="info-value">${employee.department}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Designation:</span>
                    <span class="info-value">${employee.position}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Pay Period:</span>
                    <span class="info-value">${month} ${year}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Payment Date:</span>
                    <span class="info-value">${new Date().toLocaleDateString()}</span>
                </div>
            </div>
        </div>

        <div class="earnings">
            <h3>EARNINGS</h3>
            <div class="row">
                <span>Basic Salary</span>
                <span>₹ ${basicSalary.toLocaleString()}</span>
            </div>
            <div class="row">
                <span>House Rent Allowance (40%)</span>
                <span>₹ ${hra.toLocaleString()}</span>
            </div>
            <div class="row">
                <span>Dearness Allowance (12%)</span>
                <span>₹ ${da.toLocaleString()}</span>
            </div>
            <div class="row total-row">
                <span>GROSS EARNINGS</span>
                <span>₹ ${grossSalary.toLocaleString()}</span>
            </div>
        </div>

        <div class="deductions">
            <h3>DEDUCTIONS</h3>
            <div class="row">
                <span>Provident Fund (12%)</span>
                <span>₹ ${pf.toLocaleString()}</span>
            </div>
            <div class="row">
                <span>Income Tax (TDS)</span>
                <span>₹ ${tax.toLocaleString()}</span>
            </div>
            <div class="row">
                <span>Professional Tax</span>
                <span>₹ 200</span>
            </div>
            <div class="row total-row">
                <span>TOTAL DEDUCTIONS</span>
                <span>₹ ${(pf + tax + 200).toLocaleString()}</span>
            </div>
        </div>

        <div class="net-salary">
            <div style="font-size: 16px; margin-bottom: 10px;">NET SALARY</div>
            <div class="amount">₹ ${netSalary.toLocaleString()}</div>
            <div style="font-size: 14px; margin-top: 10px;">Amount in words: ${numberToWords(netSalary)} Rupees Only</div>
        </div>

        <div class="footer">
            <p><strong>This is a computer-generated payslip. No signature is required.</strong></p>
            <p>For queries, contact HR Department | hr@company.com</p>
        </div>
    </div>
</body>
</html>`;

    fs.writeFileSync(filePath, html);

    const doc = {
        id: `DOC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        employeeId: employee.id,
        employeeName: employee.full_name,
        type: 'payslip',
        title: `Payslip - ${month} ${year}`,
        fileName: fileName,
        filePath: `/documents/${fileName}`,
        generatedAt: new Date().toISOString(),
        month: month,
        year: year
    };

    generatedDocuments.push(doc);
    return doc;
}

/**
 * Generate Insurance Card
 */
function generateInsuranceCard(employee) {
    const fileName = `insurance-card-${employee.employee_id}.html`;
    const filePath = path.join(DOCS_DIR, fileName);

    const policyNumber = `POL${employee.employee_id}2026`;
    const validFrom = '2026-01-01';
    const validUntil = '2026-12-31';

    const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Insurance Card - ${employee.full_name}</title>
    <style>
        body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #f0f0f0; margin: 0; }
        .card-container { perspective: 1000px; }
        .insurance-card { width: 350px; height: 220px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 15px; padding: 25px; color: white; box-shadow: 0 10px 30px rgba(0,0,0,0.3); position: relative; }
        .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .logo { font-size: 24px; font-weight: bold; }
        .chip { width: 40px; height: 30px; background: gold; border-radius: 5px; }
        .card-number { font-size: 20px; font-weight: bold; letter-spacing: 2px; margin: 15px 0; }
        .card-info { margin-top: 20px; }
        .info-row { display: flex; justify-content: space-between; margin: 8px 0; }
        .label { font-size: 10px; opacity: 0.8; text-transform: uppercase; }
        .value { font-size: 14px; font-weight: 600; }
        .validity { position: absolute; bottom: 15px; right: 25px; font-size: 11px; }
        .print-btn { position: absolute; top: 20px; left: 50%; transform: translateX(-50%); background: #10b981; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; }
        @media print { .print-btn { display: none; } body { background: white; } }
    </style>
</head>
<body>
    <button class="print-btn" onclick="window.print()">Print Card</button>

    <div class="card-container">
        <div class="insurance-card">
            <div class="card-header">
                <div class="logo">🏥 HealthCare+</div>
                <div class="chip"></div>
            </div>

            <div class="card-number">${policyNumber}</div>

            <div class="card-info">
                <div class="info-row">
                    <div>
                        <div class="label">Card Holder</div>
                        <div class="value">${employee.full_name}</div>
                    </div>
                    <div>
                        <div class="label">Employee ID</div>
                        <div class="value">${employee.employee_id}</div>
                    </div>
                </div>

                <div class="info-row">
                    <div>
                        <div class="label">Coverage</div>
                        <div class="value">₹ 5,00,000</div>
                    </div>
                    <div>
                        <div class="label">Type</div>
                        <div class="value">Family Floater</div>
                    </div>
                </div>
            </div>

            <div class="validity">
                Valid: ${validFrom} to ${validUntil}
            </div>
        </div>
    </div>

    <div style="max-width: 600px; margin: 40px auto; padding: 30px; background: white; border-radius: 10px;">
        <h2>Policy Details</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 12px; font-weight: bold;">Policy Number:</td>
                <td style="padding: 12px;">${policyNumber}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 12px; font-weight: bold;">Insured Person:</td>
                <td style="padding: 12px;">${employee.full_name}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 12px; font-weight: bold;">Sum Insured:</td>
                <td style="padding: 12px;">₹ 5,00,000</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 12px; font-weight: bold;">Policy Period:</td>
                <td style="padding: 12px;">${validFrom} to ${validUntil}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 12px; font-weight: bold;">Premium:</td>
                <td style="padding: 12px;">₹ 15,000 (Annual)</td>
            </tr>
            <tr>
                <td style="padding: 12px; font-weight: bold;">Helpline:</td>
                <td style="padding: 12px;">1800-123-4567</td>
            </tr>
        </table>

        <div style="margin-top: 30px; padding: 20px; background: #f0fdf4; border-left: 4px solid #10b981; border-radius: 5px;">
            <h3 style="margin-top: 0; color: #10b981;">Coverage Includes:</h3>
            <ul style="margin: 10px 0; padding-left: 20px;">
                <li>Hospitalization expenses</li>
                <li>Pre and post hospitalization</li>
                <li>Ambulance charges</li>
                <li>Day care procedures</li>
                <li>Maternity coverage (₹ 50,000)</li>
            </ul>
        </div>
    </div>
</body>
</html>`;

    fs.writeFileSync(filePath, html);

    const doc = {
        id: `DOC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        employeeId: employee.id,
        employeeName: employee.full_name,
        type: 'insurance_card',
        title: 'Health Insurance Card',
        fileName: fileName,
        filePath: `/documents/${fileName}`,
        generatedAt: new Date().toISOString(),
        policyNumber: policyNumber
    };

    generatedDocuments.push(doc);
    return doc;
}

/**
 * Generate Employment Letter
 */
function generateEmploymentLetter(employee, purpose = 'General') {
    const fileName = `employment-letter-${employee.employee_id}-${Date.now()}.html`;
    const filePath = path.join(DOCS_DIR, fileName);

    const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Employment Letter - ${employee.full_name}</title>
    <style>
        body { font-family: 'Times New Roman', serif; max-width: 800px; margin: 40px auto; padding: 40px; background: white; }
        .letterhead { text-align: center; border-bottom: 3px solid #0066cc; padding-bottom: 20px; margin-bottom: 30px; }
        .letterhead h1 { color: #0066cc; margin: 0; font-size: 28px; }
        .letterhead p { color: #666; margin: 5px 0; font-size: 14px; }
        .date { text-align: right; margin: 20px 0; }
        .content { line-height: 1.8; text-align: justify; }
        .content p { margin: 15px 0; }
        .signature { margin-top: 60px; }
        .signature-line { border-top: 1px solid #333; width: 200px; margin-top: 60px; }
        .print-btn { background: #0066cc; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin-bottom: 20px; }
        @media print { .print-btn { display: none; } }
    </style>
</head>
<body>
    <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>

    <div class="letterhead">
        <h1>COMPANY NAME</h1>
        <p>123 Business Street, City, State - 123456</p>
        <p>Phone: +91-123-456-7890 | Email: hr@company.com</p>
    </div>

    <div class="date">
        Date: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
    </div>

    <div class="content">
        <p><strong>To Whom It May Concern</strong></p>

        <p>This is to certify that <strong>${employee.full_name}</strong>, Employee ID: <strong>${employee.employee_id}</strong>,
        is a confirmed employee of our organization since <strong>${new Date(employee.joinDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</strong>.</p>

        <p>Currently, ${employee.full_name.split(' ')[0]} is working with us as <strong>${employee.position}</strong>
        in the <strong>${employee.department}</strong> department.</p>

        <p>During the tenure with our organization, we have found ${employee.full_name.split(' ')[0]} to be sincere,
        hardworking, and dedicated to the assigned responsibilities. ${employee.full_name.split(' ')[0]} has consistently
        demonstrated professional excellence and strong work ethics.</p>

        <p>This letter is being issued at the request of the employee for <strong>${purpose}</strong> purposes.</p>

        <p>We wish ${employee.full_name.split(' ')[0]} all the best for future endeavors.</p>

        <p>For any further clarification, please feel free to contact the undersigned.</p>

        <div class="signature">
            <p><strong>Sincerely,</strong></p>
            <div class="signature-line"></div>
            <p><strong>HR Manager</strong><br>
            Human Resources Department<br>
            Company Name</p>
        </div>
    </div>
</body>
</html>`;

    fs.writeFileSync(filePath, html);

    const doc = {
        id: `DOC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        employeeId: employee.id,
        employeeName: employee.full_name,
        type: 'employment_letter',
        title: `Employment Letter - ${purpose}`,
        fileName: fileName,
        filePath: `/documents/${fileName}`,
        generatedAt: new Date().toISOString(),
        purpose: purpose
    };

    generatedDocuments.push(doc);
    return doc;
}

// Utility: Convert number to words (simplified)
function numberToWords(num) {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

    if (num === 0) return 'Zero';
    if (num < 10) return ones[num];
    if (num < 20) return teens[num - 10];
    if (num < 100) return tens[Math.floor(num / 10)] + ' ' + ones[num % 10];
    if (num < 1000) return ones[Math.floor(num / 100)] + ' Hundred ' + numberToWords(num % 100);
    if (num < 100000) return numberToWords(Math.floor(num / 1000)) + ' Thousand ' + numberToWords(num % 1000);
    return 'Number too large';
}

module.exports = {
    generateTaxStatement,
    generatePayslip,
    generateInsuranceCard,
    generateEmploymentLetter,
    generatedDocuments
};
