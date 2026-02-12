#!/bin/bash

BASE_URL="http://localhost:3000"
EMPLOYEE_ID="E1001"

echo "============================================="
echo "       Sage HR Endpoint Verification"
echo "============================================="

# 1. Check Health
echo ""
echo "🔍 1. Checking System Health..."
curl -s "$BASE_URL/api/health" | grep "\"success\":true" && echo "✅ System is running" || echo "❌ System is DOWN"

# 2. Check Leave Balance (Initial)
echo ""
echo "🔍 2. Checking Initial Leave Balance..."
BALANCE_RESPONSE=$(curl -s "$BASE_URL/api/leave-balance/$EMPLOYEE_ID")
echo "Response: $BALANCE_RESPONSE"
if echo "$BALANCE_RESPONSE" | grep -q "\"success\":true"; then
  echo "✅ Leave balance retrieved"
else
  echo "❌ Failed to retrieve leave balance"
fi

# 3. Apply for Leave (Auto-Approved)
echo ""
echo "🔍 3. Applying for 5 days leave (Should be AUTO-APPROVED)..."
APPLY_RESPONSE=$(curl -s -X POST "$BASE_URL/api/webhook/nlp" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Apply for 5 days annual leave from 2026-05-20 to 2026-05-25",
    "employeeId": "'"$EMPLOYEE_ID"'"
  }')
echo "Response: $APPLY_RESPONSE"

# Verify Approval Status
if echo "$APPLY_RESPONSE" | grep -q "approved"; then
    echo "✅ Leave request AUTO-APPROVED as expected"
else
    echo "❌ Leave request NOT approved"
fi

# 4. Check Leave Balance (After Approval)
echo ""
echo "🔍 4. Checking Updated Leave Balance (Should be deducted)..."
curl -s "$BASE_URL/api/leave-balance/$EMPLOYEE_ID"

# 5. Generate Payslip
echo ""
echo "🔍 5. Generating Payslip (Feb 2026)..."
curl -s -X POST "$BASE_URL/api/documents/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "'"$EMPLOYEE_ID"'",
    "type": "payslip",
    "country": "Singapore",
    "params": {"month": "February", "year": 2026}
  }' | grep "\"success\":true" && echo "✅ Payslip generated" || echo "❌ Failed to generate Payslip"

# 6. Generate Tax Statement
echo ""
echo "🔍 6. Generating Tax Statement (IR8A 2025)..."
curl -s -X POST "$BASE_URL/api/documents/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "'"$EMPLOYEE_ID"'",
    "type": "tax_statement",
    "country": "Singapore",
    "params": {"year": 2025}
  }' | grep "\"success\":true" && echo "✅ Tax Statement generated" || echo "❌ Failed to generate Tax Statement"

# 7. Generate Insurance Card
echo ""
echo "🔍 7. Generating Insurance Card..."
curl -s -X POST "$BASE_URL/api/documents/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "'"$EMPLOYEE_ID"'",
    "type": "insurance_card",
    "country": "Singapore"
  }' | grep "\"success\":true" && echo "✅ Insurance Card generated" || echo "❌ Failed to generate Insurance Card"

# 8. Generate Employment Letter
echo ""
echo "🔍 8. Generating Employment Letter..."
curl -s -X POST "$BASE_URL/api/documents/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "'"$EMPLOYEE_ID"'",
    "type": "employment_letter",
    "country": "Singapore",
    "params": {"purpose": "Bank Loan"}
  }' | grep "\"success\":true" && echo "✅ Employment Letter generated" || echo "❌ Failed to generate Employment Letter"

echo ""
echo "============================================="
echo "       Verification Complete"
echo "============================================="
