#!/bin/bash

# Sage HR Mock API Test Script
# This script tests all NLP webhook endpoints

API_BASE="http://localhost:3000/api"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "=========================================="
echo "🧪 Sage HR Mock API Testing"
echo "=========================================="
echo ""

# Function to test endpoint
test_endpoint() {
    local name=$1
    local endpoint=$2
    local data=$3
    local method=${4:-POST}

    echo -e "${YELLOW}Testing: $name${NC}"
    echo "Endpoint: $method $endpoint"
    echo "Data: $data"
    echo ""

    if [ "$method" = "POST" ]; then
        response=$(curl -s -X POST "$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data")
    else
        response=$(curl -s "$endpoint")
    fi

    if echo "$response" | grep -q '"success":true'; then
        echo -e "${GREEN}✓ SUCCESS${NC}"
    else
        echo -e "${RED}✗ FAILED${NC}"
    fi

    echo "Response: $response"
    echo ""
    echo "------------------------------------------"
    echo ""
    sleep 1
}

# Health Check
echo "=== 1. HEALTH CHECK ==="
test_endpoint "System Health" "$API_BASE/health" "" "GET"

# Get Employees
echo "=== 2. GET EMPLOYEES ==="
test_endpoint "List Employees" "$API_BASE/employees" "" "GET"

# Leave Applications
echo "=== 3. LEAVE APPLICATIONS ==="

test_endpoint "Apply for 2-day leave (Auto-approve)" \
    "$API_BASE/webhook/nlp" \
    '{
        "text": "Apply for 2 days annual leave from 2026-02-20 to 2026-02-21",
        "employeeId": "EMP055600"
    }'

test_endpoint "Apply for 5-day leave (Manual approval)" \
    "$API_BASE/webhook/nlp" \
    '{
        "text": "Request 5 days sick leave from 2026-03-01 to 2026-03-05",
        "employeeId": "EMP054521"
    }'

test_endpoint "Check leave balance" \
    "$API_BASE/webhook/nlp" \
    '{
        "text": "Check my leave balance",
        "employeeId": "EMP055600"
    }'

# Attendance
echo "=== 4. ATTENDANCE ==="

test_endpoint "Mark attendance for EMP001" \
    "$API_BASE/webhook/nlp" \
    '{
        "text": "Mark my attendance",
        "employeeId": "EMP055600"
    }'

test_endpoint "Mark attendance for EMP003" \
    "$API_BASE/webhook/nlp" \
    '{
        "text": "Clock in for today",
        "employeeId": "EMP051611"
    }'

# Reimbursements
echo "=== 5. REIMBURSEMENTS ==="

test_endpoint "Submit reimbursement $450 (Auto-approve)" \
    "$API_BASE/webhook/nlp" \
    '{
        "text": "Submit reimbursement for $450 travel expense",
        "employeeId": "EMP051611"
    }'

test_endpoint "Submit reimbursement $850 (Manual approval)" \
    "$API_BASE/webhook/nlp" \
    '{
        "text": "Claim $850 for meal expenses",
        "employeeId": "EMP054521"
    }'

test_endpoint "Submit office supplies reimbursement" \
    "$API_BASE/webhook/nlp" \
    '{
        "text": "Reimburse me $120 for office supplies",
        "employeeId": "EMP054545"
    }'

# Purchase Orders
echo "=== 6. PURCHASE ORDERS ==="

test_endpoint "Create PO for textiles" \
    "$API_BASE/webhook/nlp" \
    '{
        "text": "Create purchase order for $2500 vendor: ABC Textiles items: Cotton fabric, buttons",
        "employeeId": "EMP054521"
    }'

test_endpoint "Create PO for equipment" \
    "$API_BASE/webhook/nlp" \
    '{
        "text": "PO for $5000 vendor: Machinery Inc items: Sewing machines",
        "employeeId": "EMP054524"
    }'

# Invoices
echo "=== 7. INVOICES ==="

test_endpoint "Submit invoice (should match PO)" \
    "$API_BASE/webhook/nlp" \
    '{
        "text": "Submit invoice #INV-2026-001 vendor: ABC Textiles $2500",
        "employeeId": "EMP054521"
    }'

test_endpoint "Submit invoice (no PO match)" \
    "$API_BASE/webhook/nlp" \
    '{
        "text": "Invoice INV-2026-002 from Random Vendor $999",
        "employeeId": "EMP054521"
    }'

# Unknown Intent
echo "=== 8. UNKNOWN INTENT TEST ==="

test_endpoint "Unknown request" \
    "$API_BASE/webhook/nlp" \
    '{
        "text": "This is a random request that should not match any intent",
        "employeeId": "EMP055600"
    }'

# Get all data
echo "=== 9. RETRIEVE ALL DATA ==="

test_endpoint "Get all leave requests" "$API_BASE/leave-requests" "" "GET"
test_endpoint "Get all attendance" "$API_BASE/attendance" "" "GET"
test_endpoint "Get all reimbursements" "$API_BASE/reimbursements" "" "GET"
test_endpoint "Get all purchase orders" "$API_BASE/purchase-orders" "" "GET"
test_endpoint "Get all invoices" "$API_BASE/invoices" "" "GET"

echo "=========================================="
echo "✅ Testing Complete!"
echo "=========================================="
echo ""
echo "Open http://localhost:3000 to view the web UI"
echo ""
