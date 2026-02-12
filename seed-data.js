const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Read the current server.js to get employee data
const serverContent = fs.readFileSync('server.js', 'utf8');

// Extract employees array from server.js
const employeesMatch = serverContent.match(/const employees = (\[[\s\S]*?\]);/);
if (!employeesMatch) {
    console.error('❌ Could not find employees array in server.js');
    process.exit(1);
}

const employees = JSON.parse(employeesMatch[1]);
console.log(`✅ Loaded ${employees.length} employees\n`);

// Seed data generators
function generateLeaveRequests() {
    const leaveRequests = [];
    const leaveTypes = ['annual', 'sick', 'personal'];
    const statuses = ['approved', 'pending', 'rejected'];

    // Generate 2-5 leave requests per employee
    employees.forEach(employee => {
        const numRequests = Math.floor(Math.random() * 4) + 2; // 2-5 requests

        for (let i = 0; i < numRequests; i++) {
            const leaveType = leaveTypes[Math.floor(Math.random() * leaveTypes.length)];
            const days = Math.floor(Math.random() * 5) + 1; // 1-5 days
            const daysAgo = Math.floor(Math.random() * 90); // Within last 90 days

            const startDate = new Date();
            startDate.setDate(startDate.getDate() - daysAgo);
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + days - 1);

            // Auto-approve if <= 2 days, otherwise random
            let status;
            if (days <= 2) {
                status = 'approved';
            } else {
                status = statuses[Math.floor(Math.random() * statuses.length)];
            }

            leaveRequests.push({
                id: `LV-${uuidv4().substring(0, 8)}`,
                employeeId: employee.id,
                employeeName: employee.full_name || `${employee.first_name} ${employee.last_name || ''}`.trim(),
                type: leaveType,
                startDate: startDate.toISOString().split('T')[0],
                endDate: endDate.toISOString().split('T')[0],
                days: days,
                status: status,
                appliedAt: new Date(startDate.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                approver: status === 'approved' ? (days <= 2 ? 'AUTO' : `EMP${String(employee.manager || 1).padStart(6, '0')}`) : 'AUTO',
                approvalNotes: status === 'approved' ? 'Approved as per policy' : (status === 'rejected' ? 'Insufficient balance' : ''),
                approvalComment: '',
                metadata: {}
            });
        }
    });

    console.log(`✅ Generated ${leaveRequests.length} leave requests`);
    return leaveRequests;
}

function generateAttendanceRecords() {
    const attendanceRecords = [];
    const statuses = ['present', 'absent', 'half-day'];

    // Generate attendance for last 30 days for all employees
    const today = new Date();
    for (let daysAgo = 0; daysAgo < 30; daysAgo++) {
        const date = new Date(today);
        date.setDate(date.getDate() - daysAgo);

        // Skip weekends
        if (date.getDay() === 0 || date.getDay() === 6) continue;

        employees.forEach(employee => {
            // 90% attendance rate
            if (Math.random() > 0.1) {
                const checkInTime = new Date(date);
                checkInTime.setHours(8 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60));

                const checkOutTime = new Date(checkInTime);
                checkOutTime.setHours(checkOutTime.getHours() + 8 + Math.floor(Math.random() * 2));

                attendanceRecords.push({
                    id: `ATT-${uuidv4().substring(0, 8)}`,
                    employeeId: employee.id,
                    employeeName: employee.full_name || `${employee.first_name} ${employee.last_name || ''}`.trim(),
                    date: date.toISOString().split('T')[0],
                    checkIn: checkInTime.toISOString(),
                    checkOut: checkOutTime.toISOString(),
                    status: 'present',
                    hoursWorked: ((checkOutTime - checkInTime) / (1000 * 60 * 60)).toFixed(2)
                });
            }
        });
    }

    console.log(`✅ Generated ${attendanceRecords.length} attendance records`);
    return attendanceRecords;
}

function generateReimbursements() {
    const reimbursements = [];
    const categories = ['travel', 'meals', 'accommodation', 'supplies', 'training'];
    const statuses = ['approved', 'pending', 'rejected'];

    // Generate 1-3 reimbursements for random 40% of employees
    const employeesWithReimb = employees.filter(() => Math.random() > 0.6);

    employeesWithReimb.forEach(employee => {
        const numReimb = Math.floor(Math.random() * 3) + 1; // 1-3 reimbursements

        for (let i = 0; i < numReimb; i++) {
            const category = categories[Math.floor(Math.random() * categories.length)];
            const amount = Math.floor(Math.random() * 900) + 100; // $100-$1000
            const daysAgo = Math.floor(Math.random() * 60);

            const submittedAt = new Date();
            submittedAt.setDate(submittedAt.getDate() - daysAgo);

            // Auto-approve if <= $500
            let status;
            if (amount <= 500) {
                status = 'approved';
            } else {
                status = statuses[Math.floor(Math.random() * statuses.length)];
            }

            reimbursements.push({
                id: `REIMB-${uuidv4().substring(0, 8)}`,
                employeeId: employee.id,
                employeeName: employee.full_name || `${employee.first_name} ${employee.last_name || ''}`.trim(),
                amount: amount,
                category: category,
                description: `${category.charAt(0).toUpperCase() + category.slice(1)} expense`,
                status: status,
                submittedAt: submittedAt.toISOString(),
                approver: status === 'approved' ? (amount <= 500 ? 'AUTO' : `EMP${String(employee.manager || 1).padStart(6, '0')}`) : 'AUTO',
                approvalNotes: status === 'approved' ? 'Approved as per policy' : (status === 'rejected' ? 'Exceeds budget' : ''),
                approvalComment: '',
                metadata: {}
            });
        }
    });

    console.log(`✅ Generated ${reimbursements.length} reimbursements`);
    return reimbursements;
}

function generatePurchaseOrders() {
    const purchaseOrders = [];
    const vendors = ['ABC Textiles', 'Global Fabrics Ltd', 'Premium Cotton Co', 'FastThread Supplies', 'Industrial Materials Inc'];
    const items = [
        ['Cotton fabric', 'Polyester thread'],
        ['Buttons', 'Zippers', 'Elastic bands'],
        ['Packaging materials', 'Labels'],
        ['Sewing machine parts', 'Needles'],
        ['Dyes', 'Finishing chemicals']
    ];
    const statuses = ['pending_approval', 'approved', 'completed'];

    // Generate 5-10 POs from finance employees
    const financeEmployees = employees.filter(emp =>
        emp.department && emp.department.toLowerCase().includes('finance')
    );

    const numPOs = Math.floor(Math.random() * 6) + 5; // 5-10 POs

    for (let i = 0; i < numPOs; i++) {
        const employee = financeEmployees[Math.floor(Math.random() * financeEmployees.length)] || employees[0];
        const vendor = vendors[Math.floor(Math.random() * vendors.length)];
        const itemList = items[Math.floor(Math.random() * items.length)];
        const amount = Math.floor(Math.random() * 5000) + 1000; // $1000-$6000
        const daysAgo = Math.floor(Math.random() * 45);

        const createdAt = new Date();
        createdAt.setDate(createdAt.getDate() - daysAgo);

        purchaseOrders.push({
            id: `PO-${Date.now()}-${i}`,
            poNumber: `PO-${Date.now()}-${i}`,
            vendor: vendor,
            items: itemList,
            amount: amount,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            createdBy: employee.id,
            createdByName: employee.full_name || `${employee.first_name} ${employee.last_name || ''}`.trim(),
            createdAt: createdAt.toISOString(),
            approver: `EMP${String(employee.manager || 1).padStart(6, '0')}`,
            metadata: {}
        });
    }

    console.log(`✅ Generated ${purchaseOrders.length} purchase orders`);
    return purchaseOrders;
}

function generateInvoices() {
    const invoices = [];
    const vendors = ['ABC Textiles', 'Global Fabrics Ltd', 'Premium Cotton Co', 'FastThread Supplies', 'Industrial Materials Inc'];
    const statuses = ['pending', 'matched', 'paid'];

    // Generate 5-8 invoices
    const numInvoices = Math.floor(Math.random() * 4) + 5; // 5-8 invoices

    for (let i = 0; i < numInvoices; i++) {
        const vendor = vendors[Math.floor(Math.random() * vendors.length)];
        const amount = Math.floor(Math.random() * 5000) + 1000; // $1000-$6000
        const daysAgo = Math.floor(Math.random() * 40);

        const submittedAt = new Date();
        submittedAt.setDate(submittedAt.getDate() - daysAgo);

        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const employee = employees.find(emp => emp.department && emp.department.toLowerCase().includes('finance')) || employees[0];

        invoices.push({
            id: `INV-${Date.now()}-${i}`,
            invoiceNumber: `INV-2026-${String(i + 1).padStart(3, '0')}`,
            vendor: vendor,
            amount: amount,
            status: status,
            submittedBy: employee.id,
            submittedByName: employee.full_name || `${employee.first_name} ${employee.last_name || ''}`.trim(),
            submittedAt: submittedAt.toISOString(),
            matchedPO: status === 'matched' || status === 'paid' ? `PO-${Date.now()}-${i}` : null,
            metadata: {}
        });
    }

    console.log(`✅ Generated ${invoices.length} invoices`);
    return invoices;
}

// Generate all seed data
console.log('╔══════════════════════════════════════════════════════════╗');
console.log('║   Sage HR Mock - Data Seeding                           ║');
console.log('╚══════════════════════════════════════════════════════════╝\n');

const leaveRequests = generateLeaveRequests();
const attendanceRecords = generateAttendanceRecords();
const reimbursements = generateReimbursements();
const purchaseOrders = generatePurchaseOrders();
const invoices = generateInvoices();

// Update server.js with seeded data
console.log('\n🔄 Updating server.js with seeded data...\n');

// Read current server.js
let updatedServerContent = fs.readFileSync('server.js', 'utf8');

// Replace empty arrays with seeded data
updatedServerContent = updatedServerContent.replace(
    /let leaveRequests = \[\];/,
    `let leaveRequests = ${JSON.stringify(leaveRequests, null, 2)};`
);

updatedServerContent = updatedServerContent.replace(
    /let attendanceRecords = \[\];/,
    `let attendanceRecords = ${JSON.stringify(attendanceRecords, null, 2)};`
);

updatedServerContent = updatedServerContent.replace(
    /let reimbursements = \[\];/,
    `let reimbursements = ${JSON.stringify(reimbursements, null, 2)};`
);

updatedServerContent = updatedServerContent.replace(
    /let purchaseOrders = \[\];/,
    `let purchaseOrders = ${JSON.stringify(purchaseOrders, null, 2)};`
);

updatedServerContent = updatedServerContent.replace(
    /let invoices = \[\];/,
    `let invoices = ${JSON.stringify(invoices, null, 2)};`
);

// Write updated server.js
fs.writeFileSync('server.js', updatedServerContent);

console.log('✅ Updated server.js successfully\n');

// Summary
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📊 SEEDING SUMMARY');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`👥 Employees:         ${employees.length}`);
console.log(`🏖️  Leave Requests:    ${leaveRequests.length}`);
console.log(`⏰ Attendance Records: ${attendanceRecords.length}`);
console.log(`💰 Reimbursements:     ${reimbursements.length}`);
console.log(`📋 Purchase Orders:    ${purchaseOrders.length}`);
console.log(`📄 Invoices:           ${invoices.length}`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Statistics
const approvedLeave = leaveRequests.filter(l => l.status === 'approved').length;
const pendingLeave = leaveRequests.filter(l => l.status === 'pending').length;
const approvedReimb = reimbursements.filter(r => r.status === 'approved').length;
const pendingReimb = reimbursements.filter(r => r.status === 'pending').length;

console.log('📈 Statistics:');
console.log(`   Leave: ${approvedLeave} approved, ${pendingLeave} pending`);
console.log(`   Reimbursements: ${approvedReimb} approved, ${pendingReimb} pending`);
console.log(`   Attendance rate: ~90% (last 30 days)`);
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('✅ SEEDING COMPLETE!');
console.log('🔄 Restart the server: npm start\n');
