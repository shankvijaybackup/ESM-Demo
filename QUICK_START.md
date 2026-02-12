# 🚀 Sage HR Mock - Quick Start Guide

## Start the Server

```bash
cd ~/sage-hr-mock
npm start
```

Server runs on: **http://localhost:3000**

## Access Points

1. **Web UI**: http://localhost:3000
2. **API Base**: http://localhost:3000/api
3. **Health Check**: http://localhost:3000/api/health

## Quick Test Commands

### 1. Apply for Leave (Auto-approved)
```bash
curl -X POST http://localhost:3000/api/webhook/nlp \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Apply for 2 days annual leave from 2026-02-20 to 2026-02-21",
    "employeeId": "EMP001"
  }'
```

**Result**: ✅ Auto-approved (≤ 2 days)

---

### 2. Submit Reimbursement (Auto-approved)
```bash
curl -X POST http://localhost:3000/api/webhook/nlp \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Submit reimbursement for $450 travel expense",
    "employeeId": "EMP003"
  }'
```

**Result**: ✅ Auto-approved ($450 < $500 threshold)

---

### 3. Submit Reimbursement (Manual Approval Required)
```bash
curl -X POST http://localhost:3000/api/webhook/nlp \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Claim $850 for meal expenses",
    "employeeId": "EMP002"
  }'
```

**Result**: ⏳ Pending approval ($850 > $500 threshold)

---

### 4. Mark Attendance
```bash
curl -X POST http://localhost:3000/api/webhook/nlp \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Mark my attendance",
    "employeeId": "EMP004"
  }'
```

**Result**: ✅ Attendance recorded

---

### 5. Create Purchase Order
```bash
curl -X POST http://localhost:3000/api/webhook/nlp \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Create purchase order for $2500 vendor: ABC Textiles items: Cotton fabric, buttons",
    "employeeId": "EMP002"
  }'
```

**Result**: ✅ PO created with unique PO number

---

### 6. Submit Invoice (3-way Matching)
```bash
curl -X POST http://localhost:3000/api/webhook/nlp \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Submit invoice INV-2026-001 vendor: ABC Textiles $2500",
    "employeeId": "EMP002"
  }'
```

**Result**: ✅ Invoice submitted (will match with PO if vendor and amount match)

---

## Run All Tests

```bash
./test-api.sh
```

## View Data

### Get all employees
```bash
curl http://localhost:3000/api/employees | python3 -m json.tool
```

### Get all leave requests
```bash
curl http://localhost:3000/api/leave-requests | python3 -m json.tool
```

### Get all reimbursements
```bash
curl http://localhost:3000/api/reimbursements | python3 -m json.tool
```

### Get all purchase orders
```bash
curl http://localhost:3000/api/purchase-orders | python3 -m json.tool
```

### Get all invoices
```bash
curl http://localhost:3000/api/invoices | python3 -m json.tool
```

## Sample Employees

| ID | Name | Department | Position |
|---|---|---|---|
| EMP001 | Sarah Chen | HR | HR Manager |
| EMP002 | John Williams | Finance | Finance Director |
| EMP003 | Maria Rodriguez | Production | Floor Supervisor |
| EMP004 | David Kumar | IT | IT Support |
| EMP005 | Lisa Anderson | Facilities | Facilities Manager |

## Key Features

✅ **NLP-Driven**: Natural language input for all actions
✅ **Auto-Approval**: Smart approval based on thresholds
✅ **3-Way Matching**: Automatic PO-Invoice matching
✅ **Policy Enforcement**: Leave balance validation
✅ **Webhook Ready**: Perfect for Atomicwork integration

## Atomicwork Integration Example

```javascript
// Atomicwork Service Catalog Item
{
  "name": "Apply for Leave",
  "webhook": {
    "url": "http://localhost:3000/api/webhook/nlp",
    "method": "POST",
    "body": {
      "text": "{{user_input}}",
      "employeeId": "{{employee_id}}"
    }
  }
}
```

## NLP Patterns Supported

### Leave Management
- "Apply for 3 days annual leave from 2026-02-20 to 2026-02-22"
- "Request 2 days sick leave starting 2026-03-01"
- "Take 5 days vacation from 2026-04-10 to 2026-04-14"
- "Check my leave balance"

### Attendance
- "Mark my attendance"
- "Clock in"
- "Check in for today"

### Reimbursements
- "Submit reimbursement for $450 travel expense"
- "Claim $125 for meal expenses"
- "Reimburse me $300 for office supplies"

### Purchase Orders
- "Create purchase order for $2500 vendor: ABC Textiles items: Cotton fabric"
- "PO for $5000 from XYZ Suppliers for sewing machines"

### Invoices
- "Submit invoice #INV-2026-001 vendor: ABC Textiles $2500"
- "Invoice INV-123 from XYZ Corp for $3000"

## Business Rules

| Feature | Auto-Approval Threshold | Manual Approval |
|---|---|---|
| Leave | ≤ 2 days | > 2 days |
| Reimbursement | ≤ $500 | > $500 |
| Purchase Orders | - | All require approval |
| Invoices | Matched with PO | No PO match |

## Troubleshooting

**Server not starting?**
```bash
# Check if port 3000 is in use
lsof -i :3000

# Kill any process using port 3000
kill -9 $(lsof -t -i:3000)

# Start again
npm start
```

**API not responding?**
```bash
# Check server logs
tail -f /tmp/sage-hr.log

# Test health endpoint
curl http://localhost:3000/api/health
```

---

**Ready for Bodynits Demo! 🎉**
