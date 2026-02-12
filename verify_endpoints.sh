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

# 3. Apply for Leave with NLP Dates (e.g., March 1st)
echo ""
echo "🔍 3. Applying for leave with 'March 1st to March 5th'..."
APPLY_NLP_RESPONSE=$(curl -s -X POST "$BASE_URL/api/webhook/nlp" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Apply for annual leave from March 1st to March 5th",
    "employeeId": "'"$EMPLOYEE_ID"'"
  }')
echo "Response: $APPLY_NLP_RESPONSE"

# Verify Approval Status and Dates
if echo "$APPLY_NLP_RESPONSE" | grep -q "\"success\":true" && echo "$APPLY_NLP_RESPONSE" | grep -q "2026-03-01"; then
  echo "✅ NLP Date Parsing Success (March 1st -> 2026-03-01)"
else
  echo "❌ NLP Date Parsing FAILED"
fi

# 4. Apply for Leave WITHOUT Dates (Should Fail)
echo ""
echo "🔍 4. Applying for leave WITHOUT dates (Should FAIL)..."
APPLY_FAIL_RESPONSE=$(curl -s -X POST "$BASE_URL/api/webhook/nlp" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Apply for 5 days annual leave",
    "employeeId": "'"$EMPLOYEE_ID"'"
  }')
echo "Response: $APPLY_FAIL_RESPONSE"

if echo "$APPLY_FAIL_RESPONSE" | grep -q "\"success\":false"; then
  echo "✅ Strict Validation Success (Reference to missing dates)"
else
  echo "❌ Strict Validation FAILED (Should not have succeeded)"
fi

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

echo ""
echo "============================================="
echo "       Verification Complete"
echo "============================================="
