#!/bin/bash
# Comprehensive Document Generation Test
# Tests all 4 document types for multiple employees and verifies downloads

echo "========================================"
echo "📋 SAGE HR DOCUMENT GENERATION TEST"
echo "========================================"
echo ""

API_BASE="http://localhost:3000/api"

# Test employee
EMPLOYEE_ID="EMP055600"
echo "Testing with Employee ID: $EMPLOYEE_ID"
echo ""

# Clean up old documents
echo "🧹 Cleaning up old test documents..."
rm -f /Users/vijayshankar/sage-hr-mock/public/documents/test-*.html 2>/dev/null
echo ""

echo "========================================"
echo "TEST 1: Generate Tax Statement"
echo "========================================"
curl -s -X POST ${API_BASE}/documents/generate \
  -H "Content-Type: application/json" \
  -d "{\"employeeId\":\"${EMPLOYEE_ID}\",\"type\":\"tax_statement\",\"params\":{\"year\":2025}}" | jq '.'

TAX_FILE=$(ls -t /Users/vijayshankar/sage-hr-mock/public/documents/tax-statement-*.html 2>/dev/null | head -1)
if [ -f "$TAX_FILE" ]; then
    echo "✅ Tax Statement Generated: $TAX_FILE"
    echo "   File size: $(ls -lh "$TAX_FILE" | awk '{print $5}')"
    echo "   Preview:"
    head -20 "$TAX_FILE" | grep -E "(Tax Statement|Employee|Salary)" | head -5
else
    echo "❌ Tax Statement NOT generated"
fi
echo ""

echo "========================================"
echo "TEST 2: Generate Payslip"
echo "========================================"
curl -s -X POST ${API_BASE}/documents/generate \
  -H "Content-Type: application/json" \
  -d "{\"employeeId\":\"${EMPLOYEE_ID}\",\"type\":\"payslip\",\"params\":{\"month\":\"February\",\"year\":2026}}" | jq '.'

PAYSLIP_FILE=$(ls -t /Users/vijayshankar/sage-hr-mock/public/documents/payslip-*.html 2>/dev/null | head -1)
if [ -f "$PAYSLIP_FILE" ]; then
    echo "✅ Payslip Generated: $PAYSLIP_FILE"
    echo "   File size: $(ls -lh "$PAYSLIP_FILE" | awk '{print $5}')"
    echo "   Preview:"
    grep -E "(PAYSLIP|NET SALARY|Earnings)" "$PAYSLIP_FILE" | head -5
else
    echo "❌ Payslip NOT generated"
fi
echo ""

echo "========================================"
echo "TEST 3: Generate Insurance Card"
echo "========================================"
curl -s -X POST ${API_BASE}/documents/generate \
  -H "Content-Type: application/json" \
  -d "{\"employeeId\":\"${EMPLOYEE_ID}\",\"type\":\"insurance_card\"}" | jq '.'

INSURANCE_FILE=$(ls -t /Users/vijayshankar/sage-hr-mock/public/documents/insurance-card-*.html 2>/dev/null | head -1)
if [ -f "$INSURANCE_FILE" ]; then
    echo "✅ Insurance Card Generated: $INSURANCE_FILE"
    echo "   File size: $(ls -lh "$INSURANCE_FILE" | awk '{print $5}')"
    echo "   Preview:"
    grep -E "(HealthCare|Policy|Coverage)" "$INSURANCE_FILE" | head -5
else
    echo "❌ Insurance Card NOT generated"
fi
echo ""

echo "========================================"
echo "TEST 4: Generate Employment Letter"
echo "========================================"
curl -s -X POST ${API_BASE}/documents/generate \
  -H "Content-Type: application/json" \
  -d "{\"employeeId\":\"${EMPLOYEE_ID}\",\"type\":\"employment_letter\",\"params\":{\"purpose\":\"Bank Loan\"}}" | jq '.'

LETTER_FILE=$(ls -t /Users/vijayshankar/sage-hr-mock/public/documents/employment-letter-*.html 2>/dev/null | head -1)
if [ -f "$LETTER_FILE" ]; then
    echo "✅ Employment Letter Generated: $LETTER_FILE"
    echo "   File size: $(ls -lh "$LETTER_FILE" | awk '{print $5}')"
    echo "   Preview:"
    grep -E "(Employment|certify|working)" "$LETTER_FILE" | head -5
else
    echo "❌ Employment Letter NOT generated"
fi
echo ""

echo "========================================"
echo "TEST 5: List All Documents for Employee"
echo "========================================"
curl -s "${API_BASE}/documents?employeeId=55600" | jq '.data[] | {type, title, filePath, generatedAt}'
echo ""

echo "========================================"
echo "TEST 6: Verify Download URLs"
echo "========================================"
DOCS=$(curl -s "${API_BASE}/documents?employeeId=55600" | jq -r '.data[].filePath')

for doc in $DOCS; do
    URL="http://localhost:3000${doc}"
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$URL")
    if [ "$HTTP_CODE" = "200" ]; then
        echo "✅ $URL - Accessible (HTTP $HTTP_CODE)"
    else
        echo "❌ $URL - Failed (HTTP $HTTP_CODE)"
    fi
done
echo ""

echo "========================================"
echo "TEST 7: Generate Documents for Another Employee"
echo "========================================"
EMPLOYEE_2="EMP054521"
echo "Testing with Employee ID: $EMPLOYEE_2"

curl -s -X POST ${API_BASE}/documents/generate \
  -H "Content-Type: application/json" \
  -d "{\"employeeId\":\"${EMPLOYEE_2}\",\"type\":\"payslip\",\"params\":{\"month\":\"February\",\"year\":2026}}" | jq '.data | {employeeName, type, title}'
echo ""

echo "========================================"
echo "📊 SUMMARY"
echo "========================================"
TOTAL_DOCS=$(ls -1 /Users/vijayshankar/sage-hr-mock/public/documents/*.html 2>/dev/null | wc -l)
echo "Total documents generated: $TOTAL_DOCS"
echo ""
echo "Document breakdown:"
echo "  Tax Statements:     $(ls -1 /Users/vijayshankar/sage-hr-mock/public/documents/tax-statement-*.html 2>/dev/null | wc -l)"
echo "  Payslips:           $(ls -1 /Users/vijayshankar/sage-hr-mock/public/documents/payslip-*.html 2>/dev/null | wc -l)"
echo "  Insurance Cards:    $(ls -1 /Users/vijayshankar/sage-hr-mock/public/documents/insurance-card-*.html 2>/dev/null | wc -l)"
echo "  Employment Letters: $(ls -1 /Users/vijayshankar/sage-hr-mock/public/documents/employment-letter-*.html 2>/dev/null | wc -l)"
echo ""

echo "========================================"
echo "🌐 UI Access"
echo "========================================"
echo "Open in browser: http://localhost:3000"
echo "1. Click on any employee (e.g., '311 AI')"
echo "2. Click on 'Documents' tab"
echo "3. Click 'Generate' buttons to create documents"
echo "4. Click 'View/Download' to open documents"
echo ""

echo "========================================"
echo "✅ ALL TESTS COMPLETE!"
echo "========================================"
