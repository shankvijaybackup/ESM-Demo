const axios = require('axios');
const fs = require('fs');

const API_KEY = 'aw_b2d3cda25daa4790b460edd9162616advkwta0';
const BASE_URL = 'https://atombanking.atomicwork.com/api/v1';

async function fetchAllUsers() {
    const allUsers = [];
    let currentPage = 1;
    let totalPages = 1;

    console.log('🔄 Fetching users from Atomicwork...\n');

    // Fetch first page to get total pages
    try {
        const firstResponse = await axios.get(`${BASE_URL}/users/list?page=1`, {
            headers: {
                'x-api-key': API_KEY,
                'Content-Type': 'application/json'
            }
        });

        if (firstResponse.data && firstResponse.data.data) {
            allUsers.push(...firstResponse.data.data);
            totalPages = firstResponse.data.total_pages || 1;
            console.log(`✓ Page 1/${totalPages} - ${firstResponse.data.data.length} users`);
        }

        // Fetch remaining pages
        for (let page = 2; page <= totalPages; page++) {
            const response = await axios.get(`${BASE_URL}/users/list?page=${page}`, {
                headers: {
                    'x-api-key': API_KEY,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data && response.data.data) {
                allUsers.push(...response.data.data);
                console.log(`✓ Page ${page}/${totalPages} - ${response.data.data.length} users`);
            }

            // Add small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        console.log(`\n✅ Total users fetched: ${allUsers.length}\n`);
        return allUsers;

    } catch (error) {
        console.error('❌ Error fetching users:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
        throw error;
    }
}

function mapAtomicworkToSageHR(atomicworkUsers) {
    console.log('🔄 Mapping users to Sage HR format...\n');

    const sageHRUsers = atomicworkUsers.map((user, index) => {
        // Extract department name
        const department = user.department?.name || 'General';

        // Determine position from org_roles or default
        let position = 'Employee';
        if (user.org_roles && user.org_roles.length > 0) {
            const adminRole = user.org_roles.find(r => r.name.includes('admin'));
            if (adminRole) {
                position = adminRole.name;
            } else {
                position = user.org_roles[0].name;
            }
        }

        // Generate join date
        const joinDate = user.joined_on || '2024-01-01';

        // Generate leave balance (random for demo, in production would come from HR system)
        const leaveBalance = {
            annual: Math.floor(Math.random() * 10) + 10,  // 10-20 days
            sick: Math.floor(Math.random() * 8) + 5,      // 5-13 days
            personal: Math.floor(Math.random() * 5) + 3    // 3-8 days
        };

        // Map manager if exists
        const managerId = user.manager?.id || null;

        return {
            id: user.id,
            employee_id: user.employee_id || `EMP${String(user.id).padStart(6, '0')}`,
            first_name: user.first_name || 'Unknown',
            middle_name: user.middle_name,
            last_name: user.last_name || '',
            full_name: user.full_name || `${user.first_name || 'Unknown'} ${user.last_name || ''}`.trim(),
            email: user.email,
            personal_email: user.personal_email,
            department: department,
            position: position,
            joinDate: joinDate,
            leaveBalance: leaveBalance,
            manager: managerId,
            slack_id: user.slack_id,
            azure_id: user.azure_id,
            profile_image: user.profile_image,
            invitation_status: user.invitation_status,
            is_deleted: user.is_deleted,
            notification_enabled: user.notification_enabled
        };
    });

    console.log(`✅ Mapped ${sageHRUsers.length} users\n`);
    return sageHRUsers;
}

async function main() {
    try {
        console.log('╔══════════════════════════════════════════════════════════╗');
        console.log('║   Atomicwork → Sage HR User Import                      ║');
        console.log('╚══════════════════════════════════════════════════════════╝\n');

        // Fetch all users from Atomicwork
        const atomicworkUsers = await fetchAllUsers();

        // Map to Sage HR format
        const sageHRUsers = mapAtomicworkToSageHR(atomicworkUsers);

        // Save to file
        const outputFile = 'atomicwork-users.json';
        fs.writeFileSync(outputFile, JSON.stringify(sageHRUsers, null, 2));
        console.log(`💾 Saved users to ${outputFile}\n`);

        // Generate JavaScript code for server.js
        const employeesCode = `const employees = ${JSON.stringify(sageHRUsers, null, 2)};`;
        fs.writeFileSync('employees-data.js', employeesCode);
        console.log(`💾 Generated employees-data.js\n`);

        // Display summary
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📊 IMPORT SUMMARY');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`Total users imported: ${sageHRUsers.length}`);

        // Count by department
        const deptCounts = {};
        sageHRUsers.forEach(user => {
            deptCounts[user.department] = (deptCounts[user.department] || 0) + 1;
        });

        console.log('\nUsers by Department:');
        Object.entries(deptCounts).sort((a, b) => b[1] - a[1]).forEach(([dept, count]) => {
            console.log(`  ${dept}: ${count} users`);
        });

        // Sample users
        console.log('\n📋 Sample Users (first 5):');
        sageHRUsers.slice(0, 5).forEach((user, i) => {
            console.log(`  ${i + 1}. ${user.full_name || user.first_name} (${user.email}) - ${user.department}`);
        });

        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('✅ IMPORT COMPLETE!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        console.log('📝 Next steps:');
        console.log('  1. Review atomicwork-users.json');
        console.log('  2. Run: node update-server.js to update server.js');
        console.log('  3. Restart server: npm start\n');

    } catch (error) {
        console.error('\n❌ Import failed:', error.message);
        process.exit(1);
    }
}

main();
