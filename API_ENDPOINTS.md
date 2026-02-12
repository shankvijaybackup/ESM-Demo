# API Endpoints - Sage HR System

**Base URL:** https://esm-demo.onrender.com

---

## 🎯 Main Endpoint (Use This for Atomicwork)

### POST /api/webhook/nlp

Natural language webhook - handles ALL HR requests automatically.

**Request:**
```json
{
  "text": "Apply for 3 days leave from 2026-02-20 to 2026-02-22",
  "employeeId": "EMP001"
}
```

**cURL:**
```bash
curl -X POST https://esm-demo.onrender.com/api/webhook/nlp \
  -H "Content-Type: application/json" \
  -d '{"text": "What is my leave balance?", "employeeId": "EMP001"}'
```

**Supports:**
- Apply for leave
- Check leave balance
- View attendance
- Submit reimbursements
- Create purchase orders
- Check invoices
- Generate documents (payslip, tax, insurance, employment letter)

---

## 📋 Employees

### GET /api/employees
Get all employees

```bash
curl https://esm-demo.onrender.com/api/employees
```

### GET /api/employees/:id
Get specific employee

```bash
curl https://esm-demo.onrender.com/api/employees/EMP001
```

---

## 🏖️ Leave Management

### GET /api/leave-requests
Get all leave requests

```bash
curl https://esm-demo.onrender.com/api/leave-requests
```

### GET /api/leave-requests?employeeId=EMP001
Get leave requests for specific employee

```bash
curl https://esm-demo.onrender.com/api/leave-requests?employeeId=EMP001
```

### POST /api/leave-requests
Apply for leave

```bash
curl -X POST https://esm-demo.onrender.com/api/leave-requests \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "EMP001",
    "type": "annual",
    "startDate": "2026-02-20",
    "endDate": "2026-02-22",
    "days": 3,
    "reason": "Personal"
  }'
```

### PUT /api/leave-requests/:id
Update leave request status

```bash
curl -X PUT https://esm-demo.onrender.com/api/leave-requests/LV-123 \
  -H "Content-Type: application/json" \
  -d '{"status": "approved"}'
```

### GET /api/leave-balance/:employeeId
Get leave balance for employee

```bash
curl https://esm-demo.onrender.com/api/leave-balance/EMP001
```

---

## 📅 Attendance

### GET /api/attendance
Get all attendance records

```bash
curl https://esm-demo.onrender.com/api/attendance
```

### GET /api/attendance?employeeId=EMP001
Get attendance for specific employee

```bash
curl https://esm-demo.onrender.com/api/attendance?employeeId=EMP001
```

### POST /api/attendance/clock-in
Clock in

```bash
curl -X POST https://esm-demo.onrender.com/api/attendance/clock-in \
  -H "Content-Type: application/json" \
  -d '{"employeeId": "EMP001"}'
```

### POST /api/attendance/clock-out
Clock out

```bash
curl -X POST https://esm-demo.onrender.com/api/attendance/clock-out \
  -H "Content-Type: application/json" \
  -d '{"employeeId": "EMP001"}'
```

---

## 💰 Reimbursements

### GET /api/reimbursements
Get all reimbursements

```bash
curl https://esm-demo.onrender.com/api/reimbursements
```

### GET /api/reimbursements?employeeId=EMP001
Get reimbursements for specific employee

```bash
curl https://esm-demo.onrender.com/api/reimbursements?employeeId=EMP001
```

### POST /api/reimbursements
Submit reimbursement

```bash
curl -X POST https://esm-demo.onrender.com/api/reimbursements \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "EMP001",
    "amount": 150,
    "currency": "SGD",
    "category": "Travel",
    "description": "Client meeting transportation"
  }'
```

### PUT /api/reimbursements/:id
Update reimbursement status

```bash
curl -X PUT https://esm-demo.onrender.com/api/reimbursements/RB-123 \
  -H "Content-Type: application/json" \
  -d '{"status": "approved"}'
```

---

## 📦 Purchase Orders

### GET /api/purchase-orders
Get all purchase orders

```bash
curl https://esm-demo.onrender.com/api/purchase-orders
```

### GET /api/purchase-orders?employeeId=EMP001
Get purchase orders for specific employee

```bash
curl https://esm-demo.onrender.com/api/purchase-orders?employeeId=EMP001
```

### POST /api/purchase-orders
Create purchase order

```bash
curl -X POST https://esm-demo.onrender.com/api/purchase-orders \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "EMP001",
    "amount": 5000,
    "currency": "SGD",
    "vendor": "Tech Supplies Pte Ltd",
    "description": "Office equipment"
  }'
```

### PUT /api/purchase-orders/:id
Update purchase order status

```bash
curl -X PUT https://esm-demo.onrender.com/api/purchase-orders/PO-123 \
  -H "Content-Type: application/json" \
  -d '{"status": "approved"}'
```

---

## 🧾 Invoices

### GET /api/invoices
Get all invoices

```bash
curl https://esm-demo.onrender.com/api/invoices
```

### GET /api/invoices?employeeId=EMP001
Get invoices for specific employee

```bash
curl https://esm-demo.onrender.com/api/invoices?employeeId=EMP001
```

### POST /api/invoices
Create invoice

```bash
curl -X POST https://esm-demo.onrender.com/api/invoices \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "EMP001",
    "amount": 2500,
    "currency": "SGD",
    "vendor": "Software Co Pte Ltd",
    "description": "License renewal"
  }'
```

### PUT /api/invoices/:id
Update invoice status

```bash
curl -X PUT https://esm-demo.onrender.com/api/invoices/INV-123 \
  -H "Content-Type: application/json" \
  -d '{"status": "paid"}'
```

---

## 📄 Documents (Singapore Format)

### POST /api/documents/generate
Generate HR document

**1. Payslip:**
```bash
curl -X POST https://esm-demo.onrender.com/api/documents/generate \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "EMP001",
    "type": "payslip",
    "country": "Singapore",
    "params": {"month": "February", "year": 2026}
  }'
```

**2. Tax Statement (IR8A):**
```bash
curl -X POST https://esm-demo.onrender.com/api/documents/generate \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "EMP001",
    "type": "tax_statement",
    "country": "Singapore",
    "params": {"year": 2025}
  }'
```

**3. Insurance Card (MediShield):**
```bash
curl -X POST https://esm-demo.onrender.com/api/documents/generate \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "EMP001",
    "type": "insurance_card",
    "country": "Singapore"
  }'
```

**4. Employment Letter:**
```bash
curl -X POST https://esm-demo.onrender.com/api/documents/generate \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "EMP001",
    "type": "employment_letter",
    "country": "Singapore",
    "params": {"purpose": "Bank Loan"}
  }'
```

**Document Types:**
- `payslip` - Monthly payslip with CPF (params: month, year)
- `tax_statement` - IR8A tax statement (params: year)
- `insurance_card` - MediShield Life card (params: none)
- `employment_letter` - Employment verification (params: purpose)

### GET /api/documents?employeeId=EMP001
List all documents for employee

```bash
curl https://esm-demo.onrender.com/api/documents?employeeId=EMP001
```

---

## ❤️ Health Check

### GET /api/health
Check system health

```bash
curl https://esm-demo.onrender.com/api/health
```

**Response:**
```json
{
  "success": true,
  "message": "Sage HR Mock API is running",
  "stats": {
    "employees": 301,
    "leaveRequests": 1040,
    "reimbursements": 236,
    "purchaseOrders": 7,
    "invoices": 5
  }
}
```

---

## 🔌 Atomicwork Integration

**Recommended:** Use the NLP endpoint for all requests

```python
import requests

# Receive webhook from Atomicwork
atomicwork_payload = {
    "requester_email": "john.tan@company.com.sg",
    "message": "I need my February payslip"
}

# Forward to Sage HR
response = requests.post(
    'https://esm-demo.onrender.com/api/webhook/nlp',
    json={
        'text': atomicwork_payload['message'],
        'employeeId': atomicwork_payload['requester_email']
    }
)

result = response.json()
# Returns: {"success": true, "intent": "generate_payslip", "message": "...", "data": {...}}
```

---

## 📊 Response Format

All endpoints return:

```json
{
  "success": true,
  "data": { ... },
  "message": "Success message"
}
```

Or on error:

```json
{
  "success": false,
  "error": "Error message"
}
```

---

## 🇸🇬 Singapore Features

All documents are Singapore-compliant:
- ✅ Currency: SGD (S$)
- ✅ Tax: IR8A format (IRAS)
- ✅ CPF: 20% employee, 17% employer
- ✅ Insurance: MediShield Life
- ✅ Company UEN: 201234567G
- ✅ Singapore addresses and phone numbers

---

**Live URL:** https://esm-demo.onrender.com

**GitHub:** https://github.com/shankvijaybackup/ESM-Demo
