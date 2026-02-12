const fs = require('fs');

console.log('🔄 Updating server.js with Atomicwork users...\n');

// Read the imported employees data
const employeesData = fs.readFileSync('employees-data.js', 'utf8');

// Read current server.js
let serverContent = fs.readFileSync('server.js', 'utf8');

// Find and replace the employees array
const employeesStartPattern = /const employees = \[/;
const employeesEndPattern = /\];[\s]*let attendance/;

if (serverContent.match(employeesStartPattern) && serverContent.match(employeesEndPattern)) {
    // Extract just the array part from employees-data.js
    const employeesArray = employeesData.replace('const employees = ', '').trim();

    // Replace the employees array in server.js
    serverContent = serverContent.replace(
        /const employees = \[[^\]]*\];/s,
        `const employees = ${employeesArray}`
    );

    // Write updated server.js
    fs.writeFileSync('server.js', serverContent);

    console.log('✅ server.js updated successfully!');
    console.log(`   Employees count: 301`);
    console.log('\n📝 Server has been updated with Atomicwork users');
    console.log('   Restart the server to apply changes: npm start\n');
} else {
    console.error('❌ Could not find employees array pattern in server.js');
    process.exit(1);
}
