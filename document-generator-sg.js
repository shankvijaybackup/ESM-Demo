/**
 * Document Generator for HR System - SINGAPORE VERSION
 * Generates tax statements (IR8A), payslips, insurance cards, employment letters
 * All amounts in SGD, compliant with Singapore regulations
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
 * Generate Singapore Tax Statement (IR8A Form)
 */
function generateTaxStatementSG(employee, taxYear = 2025) {
    const fileName = `tax-ir8a-${employee.employee_id}-${taxYear}.html`;
    const filePath = path.join(DOCS_DIR, fileName);

    // Calculate sample tax data (Singapore)
    const annualSalary = 80000; // SGD
    const cpfEmployee = annualSalary * 0.20; // 20% CPF employee contribution
    const cpfEmployer = annualSalary * 0.17; // 17% CPF employer contribution
    const taxableIncome = annualSalary;

    const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>IR8A Form - ${employee.full_name}</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; }
        .header { text-align: center; border-bottom: 3px solid #dc143c; padding-bottom: 20px; margin-bottom: 30px; }
        .header h1 { color: #dc143c; margin: 0; }
        .header p { color: #666; margin: 5px 0; }
        .iras-logo { color: #dc143c; font-weight: bold; font-size: 24px; }
        .section { margin: 30px 0; }
        .section h2 { color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px; }
        .info-grid { display: grid; grid-template-columns: 250px 1fr; gap: 15px; margin: 20px 0; }
        .info-label { font-weight: bold; color: #666; }
        .info-value { color: #333; }
        .amount { font-size: 18px; font-weight: bold; color: #dc143c; }
        .footer { margin-top: 50px; padding-top: 20px; border-top: 2px solid #eee; text-align: center; color: #666; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #eee; }
        th { background: #f5f7fa; font-weight: bold; }
        .print-btn { background: #dc143c; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; }
        .highlight { background: #fff3cd; padding: 10px; border-left: 4px solid #ffc107; margin: 20px 0; }
        @media print { .print-btn { display: none; } }
    </style>
</head>
<body>
    <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>

    <div class="header">
        <div class="iras-logo">IRAS</div>
        <h1>Form IR8A</h1>
        <p>Statement of Employee's Remuneration</p>
        <p>Year of Assessment ${taxYear}</p>
    </div>

    <div class="highlight">
        <strong>⚠️ Important:</strong> This document is for employment verification purposes.
        Please submit the official IR8A form to IRAS through your employer's Auto-Inclusion Scheme (AIS).
    </div>

    <div class="section">
        <h2>Part 1: Employer's Particulars</h2>
        <div class="info-grid">
            <div class="info-label">Company Name:</div>
            <div class="info-value">Company Name Pte Ltd</div>

            <div class="info-label">Company UEN:</div>
            <div class="info-value">201234567G</div>

            <div class="info-label">Address:</div>
            <div class="info-value">1 Marina Boulevard, #20-01, Singapore 018989</div>

            <div class="info-label">Contact Number:</div>
            <div class="info-value">+65 6123 4567</div>
        </div>
    </div>

    <div class="section">
        <h2>Part 2: Employee's Particulars</h2>
        <div class="info-grid">
            <div class="info-label">Name:</div>
            <div class="info-value">${employee.full_name}</div>

            <div class="info-label">Employee ID:</div>
            <div class="info-value">${employee.employee_id}</div>

            <div class="info-label">NRIC/FIN:</div>
            <div class="info-value">S1234567A</div>

            <div class="info-label">Designation:</div>
            <div class="info-value">${employee.position}</div>

            <div class="info-label">Department:</div>
            <div class="info-value">${employee.department}</div>

            <div class="info-label">Period of Employment:</div>
            <div class="info-value">${employee.joinDate} to Present</div>
        </div>
    </div>

    <div class="section">
        <h2>Part 3: Income Details (Year ${taxYear-1})</h2>
        <table>
            <thead>
                <tr>
                    <th>Description</th>
                    <th style="text-align: right;">Amount (S$)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>Gross Salary</strong></td>
                    <td style="text-align: right;"><strong>${annualSalary.toLocaleString()}</strong></td>
                </tr>
                <tr>
                    <td>Basic Salary</td>
                    <td style="text-align: right;">${(annualSalary * 0.6).toLocaleString()}</td>
                </tr>
                <tr>
                    <td>Allowances (Transport, Meal, etc.)</td>
                    <td style="text-align: right;">${(annualSalary * 0.2).toLocaleString()}</td>
                </tr>
                <tr>
                    <td>Annual Bonus</td>
                    <td style="text-align: right;">${(annualSalary * 0.2).toLocaleString()}</td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="section">
        <h2>Part 4: CPF Contributions</h2>
        <table>
            <thead>
                <tr>
                    <th>Type</th>
                    <th style="text-align: right;">Amount (S$)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Employee's CPF Contribution (20%)</td>
                    <td style="text-align: right;">${cpfEmployee.toLocaleString()}</td>
                </tr>
                <tr>
                    <td>Employer's CPF Contribution (17%)</td>
                    <td style="text-align: right;">${cpfEmployer.toLocaleString()}</td>
                </tr>
                <tr style="font-weight: bold; background: #f5f7fa;">
                    <td>Total CPF Contributions</td>
                    <td style="text-align: right;">${(cpfEmployee + cpfEmployer).toLocaleString()}</td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="section">
        <h2>Part 5: Benefits-in-Kind</h2>
        <table>
            <thead>
                <tr>
                    <th>Description</th>
                    <th style="text-align: right;">Value (S$)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Company Car Benefit</td>
                    <td style="text-align: right;">0</td>
                </tr>
                <tr>
                    <td>Housing Accommodation</td>
                    <td style="text-align: right;">0</td>
                </tr>
                <tr>
                    <td>Others</td>
                    <td style="text-align: right;">0</td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="section">
        <h2>Part 6: Summary</h2>
        <div class="info-grid">
            <div class="info-label">Total Income (Box 11):</div>
            <div class="info-value amount">S$ ${taxableIncome.toLocaleString()}</div>

            <div class="info-label">Total CPF Contributions:</div>
            <div class="info-value amount">S$ ${(cpfEmployee + cpfEmployer).toLocaleString()}</div>

            <div class="info-label">Tax Clearance Status:</div>
            <div class="info-value">No Outstanding Tax</div>
        </div>
    </div>

    <div class="footer">
        <p><strong>This is a computer-generated document. No signature is required.</strong></p>
        <p>Generated on: ${new Date().toLocaleDateString('en-SG')}</p>
        <p>For official tax filing, please refer to your IRAS Notice of Assessment</p>
        <p style="margin-top: 15px; font-size: 11px;">
            IRAS Contact: 1800 356 8300 | Website: www.iras.gov.sg
        </p>
    </div>
</body>
</html>`;

    fs.writeFileSync(filePath, html);

    const doc = {
        id: `DOC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        employeeId: employee.id,
        employeeName: employee.full_name,
        type: 'tax_statement_sg',
        title: `IR8A Tax Statement ${taxYear}`,
        fileName: fileName,
        filePath: `/documents/${fileName}`,
        generatedAt: new Date().toISOString(),
        year: taxYear,
        country: 'Singapore'
    };

    generatedDocuments.push(doc);
    return doc;
}

/**
 * Generate Singapore Payslip
 */
function generatePayslipSG(employee, month = 'January', year = 2026) {
    const fileName = `payslip-sg-${employee.employee_id}-${month}-${year}.html`;
    const filePath = path.join(DOCS_DIR, fileName);

    const basicSalary = 5000; // SGD per month
    const allowances = 1000; // Transport + meal allowances
    const grossSalary = basicSalary + allowances;
    const cpfEmployee = grossSalary * 0.20; // 20% CPF
    const netSalary = grossSalary - cpfEmployee;

    const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Payslip - ${employee.full_name}</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; background: #f5f7fa; }
        .payslip { background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; border-bottom: 3px solid #dc143c; padding-bottom: 20px; margin-bottom: 30px; }
        .header h1 { color: #dc143c; margin: 0; }
        .singapore-flag { font-size: 32px; }
        .period { text-align: center; font-size: 18px; color: #666; margin: 10px 0; }
        .section { margin: 30px 0; }
        .section h2 { color: #333; font-size: 16px; margin-bottom: 15px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 30px; }
        .info-row { display: flex; justify-content: space-between; padding: 8px 0; }
        .info-label { color: #666; }
        .info-value { font-weight: bold; color: #333; }
        .earnings, .deductions { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .earnings h3 { color: #dc143c; margin: 0 0 15px 0; }
        .deductions h3 { color: #ef4444; margin: 0 0 15px 0; }
        .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
        .total-row { font-weight: bold; font-size: 18px; background: #fef2f2; padding: 15px; border-radius: 5px; margin-top: 10px; }
        .net-salary { text-align: center; background: #dc143c; color: white; padding: 20px; border-radius: 8px; margin: 30px 0; }
        .net-salary .amount { font-size: 32px; font-weight: bold; }
        .cpf-notice { background: #e0f2fe; border-left: 4px solid #0284c7; padding: 15px; margin: 20px 0; font-size: 13px; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 2px solid #eee; text-align: center; color: #666; font-size: 12px; }
        .print-btn { background: #dc143c; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin-bottom: 20px; }
        @media print { .print-btn { display: none; } }
    </style>
</head>
<body>
    <div class="payslip">
        <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>

        <div class="header">
            <div class="singapore-flag">🇸🇬</div>
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
                    <span class="info-label">NRIC/FIN:</span>
                    <span class="info-value">S1234567A</span>
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
                    <span class="info-value">${new Date().toLocaleDateString('en-SG')}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Payment Method:</span>
                    <span class="info-value">GIRO Transfer</span>
                </div>
            </div>
        </div>

        <div class="earnings">
            <h3>EARNINGS</h3>
            <div class="row">
                <span>Basic Salary</span>
                <span>S$ ${basicSalary.toLocaleString()}</span>
            </div>
            <div class="row">
                <span>Transport Allowance</span>
                <span>S$ 500.00</span>
            </div>
            <div class="row">
                <span>Meal Allowance</span>
                <span>S$ 500.00</span>
            </div>
            <div class="row total-row">
                <span>GROSS EARNINGS</span>
                <span>S$ ${grossSalary.toLocaleString()}</span>
            </div>
        </div>

        <div class="deductions">
            <h3>DEDUCTIONS</h3>
            <div class="row">
                <span>CPF Contribution (20%)</span>
                <span>S$ ${cpfEmployee.toLocaleString()}</span>
            </div>
            <div class="row total-row">
                <span>TOTAL DEDUCTIONS</span>
                <span>S$ ${cpfEmployee.toLocaleString()}</span>
            </div>
        </div>

        <div class="cpf-notice">
            <strong>📊 CPF Breakdown:</strong><br>
            Employee CPF (20%): S$ ${cpfEmployee.toLocaleString()}<br>
            Employer CPF (17%): S$ ${(grossSalary * 0.17).toLocaleString()}<br>
            <em>Note: Employer's CPF contribution is paid separately to your CPF account</em>
        </div>

        <div class="net-salary">
            <div style="font-size: 16px; margin-bottom: 10px;">NET SALARY</div>
            <div class="amount">S$ ${netSalary.toLocaleString()}</div>
            <div style="font-size: 14px; margin-top: 10px;">Amount in words: ${numberToWords(netSalary)} Singapore Dollars Only</div>
        </div>

        <div class="footer">
            <p><strong>This is a computer-generated payslip. No signature is required.</strong></p>
            <p>For CPF queries, contact CPF Board: 1800 227 1188 | www.cpf.gov.sg</p>
            <p>For HR queries, contact: hr@company.com.sg</p>
        </div>
    </div>
</body>
</html>`;

    fs.writeFileSync(filePath, html);

    const doc = {
        id: `DOC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        employeeId: employee.id,
        employeeName: employee.full_name,
        type: 'payslip_sg',
        title: `Payslip - ${month} ${year}`,
        fileName: fileName,
        filePath: `/documents/${fileName}`,
        generatedAt: new Date().toISOString(),
        month: month,
        year: year,
        country: 'Singapore'
    };

    generatedDocuments.push(doc);
    return doc;
}

/**
 * Generate Singapore Medical Insurance Card
 */
function generateInsuranceCardSG(employee) {
    const fileName = `insurance-medishield-${employee.employee_id}.html`;
    const filePath = path.join(DOCS_DIR, fileName);

    const policyNumber = `MS${employee.employee_id}2026`;
    const validFrom = '2026-01-01';
    const validUntil = '2026-12-31';

    const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>MediShield Life Card - ${employee.full_name}</title>
    <style>
        body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #f0f0f0; margin: 0; flex-direction: column; }
        .card-container { perspective: 1000px; margin: 20px; }
        .insurance-card { width: 350px; height: 220px; background: linear-gradient(135deg, #dc143c 0%, #8b0000 100%); border-radius: 15px; padding: 25px; color: white; box-shadow: 0 10px 30px rgba(0,0,0,0.3); position: relative; }
        .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .logo { font-size: 18px; font-weight: bold; }
        .sg-flag { font-size: 32px; }
        .card-number { font-size: 20px; font-weight: bold; letter-spacing: 2px; margin: 15px 0; }
        .card-info { margin-top: 20px; }
        .info-row { display: flex; justify-content: space-between; margin: 8px 0; }
        .label { font-size: 10px; opacity: 0.8; text-transform: uppercase; }
        .value { font-size: 14px; font-weight: 600; }
        .validity { position: absolute; bottom: 15px; right: 25px; font-size: 11px; }
        .print-btn { background: #dc143c; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin-bottom: 20px; }
        @media print { .print-btn { display: none; } body { background: white; } }
    </style>
</head>
<body>
    <button class="print-btn" onclick="window.print()">Print Card</button>

    <div class="card-container">
        <div class="insurance-card">
            <div class="card-header">
                <div class="logo">🏥 MediShield Life</div>
                <div class="sg-flag">🇸🇬</div>
            </div>

            <div class="card-number">${policyNumber}</div>

            <div class="card-info">
                <div class="info-row">
                    <div>
                        <div class="label">Cardholder</div>
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
                        <div class="value">S$ 100,000</div>
                    </div>
                    <div>
                        <div class="label">Type</div>
                        <div class="value">Group Plan</div>
                    </div>
                </div>
            </div>

            <div class="validity">
                Valid: ${validFrom} to ${validUntil}
            </div>
        </div>
    </div>

    <div style="max-width: 600px; margin: 40px auto; padding: 30px; background: white; border-radius: 10px;">
        <h2>🇸🇬 Singapore Medical Insurance Policy Details</h2>
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
                <td style="padding: 12px;">S$ 100,000</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 12px; font-weight: bold;">Policy Period:</td>
                <td style="padding: 12px;">${validFrom} to ${validUntil}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 12px; font-weight: bold;">Annual Premium:</td>
                <td style="padding: 12px;">S$ 2,400 (Employer Paid)</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 12px; font-weight: bold;">Panel Clinics:</td>
                <td style="padding: 12px;">All Restructured Hospitals</td>
            </tr>
            <tr>
                <td style="padding: 12px; font-weight: bold;">Helpline:</td>
                <td style="padding: 12px;">1800 222 3333</td>
            </tr>
        </table>

        <div style="margin-top: 30px; padding: 20px; background: #f0fdf4; border-left: 4px solid #10b981; border-radius: 5px;">
            <h3 style="margin-top: 0; color: #10b981;">Coverage Includes:</h3>
            <ul style="margin: 10px 0; padding-left: 20px;">
                <li>Hospitalization at Restructured Hospitals (Class B2/C)</li>
                <li>Pre and post hospitalization (90 days)</li>
                <li>Day surgery procedures</li>
                <li>Emergency ambulance services</li>
                <li>COVID-19 treatment covered</li>
                <li>Maternity coverage (S$ 10,000)</li>
            </ul>
        </div>

        <div style="margin-top: 20px; padding: 15px; background: #e0f2fe; border-left: 4px solid #0284c7; border-radius: 5px; font-size: 13px;">
            <strong>📋 How to Use:</strong><br>
            1. Present this card at any panel clinic/hospital<br>
            2. For cashless claims, show your NRIC + this insurance card<br>
            3. For reimbursement claims, submit original receipts within 30 days<br>
            4. Emergency hotline: 1800 222 3333 (24/7)
        </div>
    </div>
</body>
</html>`;

    fs.writeFileSync(filePath, html);

    const doc = {
        id: `DOC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        employeeId: employee.id,
        employeeName: employee.full_name,
        type: 'insurance_card_sg',
        title: 'MediShield Life Insurance Card',
        fileName: fileName,
        filePath: `/documents/${fileName}`,
        generatedAt: new Date().toISOString(),
        policyNumber: policyNumber,
        country: 'Singapore'
    };

    generatedDocuments.push(doc);
    return doc;
}

/**
 * Generate Singapore Employment Letter
 */
function generateEmploymentLetterSG(employee, purpose = 'General') {
    const fileName = `employment-letter-sg-${employee.employee_id}-${Date.now()}.html`;
    const filePath = path.join(DOCS_DIR, fileName);

    const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Employment Letter - ${employee.full_name}</title>
    <style>
        body { font-family: 'Times New Roman', serif; max-width: 800px; margin: 40px auto; padding: 40px; background: white; }
        .letterhead { text-align: center; border-bottom: 3px solid #dc143c; padding-bottom: 20px; margin-bottom: 30px; }
        .letterhead h1 { color: #dc143c; margin: 0; font-size: 28px; }
        .letterhead p { color: #666; margin: 5px 0; font-size: 14px; }
        .sg-flag { font-size: 24px; }
        .date { text-align: right; margin: 20px 0; }
        .content { line-height: 1.8; text-align: justify; }
        .content p { margin: 15px 0; }
        .signature { margin-top: 60px; }
        .signature-line { border-top: 1px solid #333; width: 200px; margin-top: 60px; }
        .print-btn { background: #dc143c; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin-bottom: 20px; }
        @media print { .print-btn { display: none; } }
    </style>
</head>
<body>
    <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>

    <div class="letterhead">
        <div class="sg-flag">🇸🇬</div>
        <h1>COMPANY NAME PTE LTD</h1>
        <p>UEN: 201234567G</p>
        <p>1 Marina Boulevard, #20-01, Singapore 018989</p>
        <p>Phone: +65 6123 4567 | Email: hr@company.com.sg</p>
    </div>

    <div class="date">
        Date: ${new Date().toLocaleDateString('en-SG', { day: '2-digit', month: 'long', year: 'numeric' })}
    </div>

    <div class="content">
        <p><strong>To Whom It May Concern</strong></p>

        <p>This is to certify that <strong>${employee.full_name}</strong>, holding NRIC/FIN: <strong>S1234567A</strong>,
        Employee ID: <strong>${employee.employee_id}</strong>, has been employed with our company since
        <strong>${new Date(employee.joinDate).toLocaleDateString('en-SG', { day: '2-digit', month: 'long', year: 'numeric' })}</strong>.</p>

        <p>${employee.full_name.split(' ')[0]} is currently working with us as <strong>${employee.position}</strong>
        in the <strong>${employee.department}</strong> department on a full-time basis.</p>

        <p><strong>Employment Details:</strong></p>
        <ul>
            <li>Designation: ${employee.position}</li>
            <li>Department: ${employee.department}</li>
            <li>Employment Type: Full-time Permanent</li>
            <li>Date of Commencement: ${new Date(employee.joinDate).toLocaleDateString('en-SG')}</li>
            <li>Monthly Basic Salary: S$ 5,000.00</li>
        </ul>

        <p>During the tenure with our organization, ${employee.full_name.split(' ')[0]} has demonstrated excellent
        work performance, professionalism, and dedication. ${employee.full_name.split(' ')[0]} is a valued member
        of our team and has consistently met all job requirements and responsibilities.</p>

        <p>This letter is being issued at the request of the employee for <strong>${purpose}</strong> purposes.</p>

        <p>Should you require any further information or clarification, please do not hesitate to contact the
        undersigned at +65 6123 4567 or hr@company.com.sg.</p>

        <p>We wish ${employee.full_name.split(' ')[0]} all the best in all future endeavors.</p>

        <div class="signature">
            <p><strong>Yours Sincerely,</strong></p>
            <div class="signature-line"></div>
            <p><strong>HR Manager</strong><br>
            Human Resources Department<br>
            Company Name Pte Ltd<br>
            UEN: 201234567G</p>
        </div>
    </div>

    <div style="margin-top: 40px; padding: 15px; background: #f5f5f5; border-radius: 5px; font-size: 12px;">
        <strong>Note:</strong> This letter is issued in good faith and for the stated purpose only.
        The company shall not be held liable for any misuse or misrepresentation of this document.
    </div>
</body>
</html>`;

    fs.writeFileSync(filePath, html);

    const doc = {
        id: `DOC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        employeeId: employee.id,
        employeeName: employee.full_name,
        type: 'employment_letter_sg',
        title: `Employment Letter - ${purpose}`,
        fileName: fileName,
        filePath: `/documents/${fileName}`,
        generatedAt: new Date().toISOString(),
        purpose: purpose,
        country: 'Singapore'
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
    generateTaxStatementSG,
    generatePayslipSG,
    generateInsuranceCardSG,
    generateEmploymentLetterSG,
    generatedDocuments
};
