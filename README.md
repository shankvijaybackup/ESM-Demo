# Sage HR Mock - NLP-Driven HR System

A complete mock HR system that handles leave management, attendance, reimbursements, purchase orders, and invoices through NLP-driven webhooks.

## 🚀 Quick Start

```bash
npm start
```

The server will start on **http://localhost:3000**

- **Web UI**: http://localhost:3000
- **API Base**: http://localhost:3000/api

## 📚 API Documentation

### Main NLP Webhook Endpoint

**POST** `/api/webhook/nlp`

This is the primary endpoint that processes natural language requests and executes the appropriate action.

#### Request Body:
```json
{
  "text": "Apply for 3 days annual leave from 2026-02-20 to 2026-02-22",
  "employeeId": "EMP001",
  "metadata": {}
}
```

#### Response:
```json
{
  "success": true,
  "intent": "apply_leave",
  "originalText": "Apply for 3 days annual leave from 2026-02-20 to 2026-02-22",
  "message": "Leave request auto-approved! 3 day(s) of annual leave from 2026-02-20 to 2026-02-22",
  "data": {
    "id": "LV-a1b2c3d4",
    "employeeId": "EMP001",
    "type": "annual",
    "days": 3,
    "status": "approved"
  }
}
```

---

## 🤖 NLP Examples

### 1. **Apply for Leave**
```bash
curl -X POST http://localhost:3000/api/webhook/nlp \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Apply for 3 days annual leave from 2026-02-20 to 2026-02-22",
    "employeeId": "EMP001"
  }'
```

**Variations:**
- "Request 2 days sick leave starting 2026-03-01"
- "Take 5 days personal leave from 2026-04-10 to 2026-04-14"
- "Apply for vacation leave for 1 day on 2026-02-25"

**Auto-approval**: Requests ≤ 2 days are auto-approved

---

### 2. **Check Leave Balance**
```bash
curl -X POST http://localhost:3000/api/webhook/nlp \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Check my leave balance",
    "employeeId": "EMP001"
  }'
```

**Variations:**
- "Show my PTO balance"
- "How many vacation days do I have?"
- "View my leave availability"

---

### 3. **Mark Attendance**
```bash
curl -X POST http://localhost:3000/api/webhook/nlp \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Mark my attendance",
    "employeeId": "EMP001"
  }'
```

**Variations:**
- "Check in for today"
- "Clock in"
- "Mark attendance for today"

---

### 4. **Submit Reimbursement**
```bash
curl -X POST http://localhost:3000/api/webhook/nlp \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Submit reimbursement for $450 travel expense",
    "employeeId": "EMP001"
  }'
```

**Variations:**
- "Claim $125 for meal expenses"
- "Reimburse me $300 for office supplies"
- "Submit expense claim for $85 food"

**Auto-approval**: Amounts ≤ $500 are auto-approved

---

### 5. **Create Purchase Order**
```bash
curl -X POST http://localhost:3000/api/webhook/nlp \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Create purchase order for $2500 vendor: ABC Textiles items: Cotton fabric, buttons",
    "employeeId": "EMP002"
  }'
```

**Variations:**
- "PO for $5000 from XYZ Suppliers for sewing machines"
- "Buy $1200 worth of thread from Fabric Co"

---

### 6. **Submit Invoice**
```bash
curl -X POST http://localhost:3000/api/webhook/nlp \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Submit invoice #INV-2026-001 vendor: ABC Textiles $2500",
    "employeeId": "EMP002"
  }'
```

**Variations:**
- "Invoice INV-123 from XYZ Corp for $3000"
- "Bill from Fabric Co invoice number ABC-456 amount $1500"

**Note**: System automatically matches invoices with existing POs

---

## 📋 REST API Endpoints

### Employees
- **GET** `/api/employees` - List all employees
- **GET** `/api/employees/:id` - Get employee by ID

### Leave Requests
- **GET** `/api/leave-requests` - List all leave requests
- **POST** `/api/leave-requests` - Create leave request
- **PATCH** `/api/leave-requests/:id/approve` - Approve leave

### Attendance
- **GET** `/api/attendance` - List all attendance records
- **POST** `/api/attendance` - Mark attendance

### Reimbursements
- **GET** `/api/reimbursements` - List all reimbursements
- **POST** `/api/reimbursements` - Submit reimbursement

### Purchase Orders
- **GET** `/api/purchase-orders` - List all purchase orders
- **POST** `/api/purchase-orders` - Create purchase order

### Invoices
- **GET** `/api/invoices` - List all invoices
- **POST** `/api/invoices` - Submit invoice

### System
- **GET** `/api/health` - Health check and system stats

---

## 👥 Sample Employees

| ID | Name | Department | Position |
|---|---|---|---|
| EMP001 | Sarah Chen | HR | HR Manager |
| EMP002 | John Williams | Finance | Finance Director |
| EMP003 | Maria Rodriguez | Production | Floor Supervisor |
| EMP004 | David Kumar | IT | IT Support |
| EMP005 | Lisa Anderson | Facilities | Facilities Manager |

---

## 🎯 Business Rules

### Leave Management
- **Auto-approval**: ≤ 2 days automatically approved
- **Manual approval**: > 2 days requires manager approval
- Leave balance is checked before approval
- Balance is deducted immediately upon approval

### Reimbursements
- **Auto-approval threshold**: $500
- Amounts > $500 require manager approval
- Categories: travel, meals, office_supplies, other

### Invoice Processing
- Automatic 3-way matching with POs
- Status: `pending_verification` → `matched` → `approved`
- Matches based on vendor and amount

---

## 🔗 Integration with Atomicwork

This mock system is designed to integrate with Atomicwork's service catalog via webhooks:

### Atomicwork → Sage HR Flow

```
Atomicwork Service Catalog
    ↓
User submits request (e.g., "Apply for leave")
    ↓
Atomicwork Agent processes request
    ↓
POST /api/webhook/nlp with NLP text
    ↓
Sage HR processes and executes action
    ↓
Returns result to Atomicwork
    ↓
Atomicwork notifies user
```

### Example Integration

```javascript
// Atomicwork webhook configuration
const atomicworkConfig = {
  webhookUrl: 'http://localhost:3000/api/webhook/nlp',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: {
    text: '{{user_request}}',
    employeeId: '{{employee_id}}',
    metadata: {
      source: 'atomicwork',
      requestId: '{{request_id}}'
    }
  }
};
```

---

## 🧪 Testing the API

### Test Leave Application
```bash
curl -X POST http://localhost:3000/api/webhook/nlp \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Apply for 3 days annual leave from 2026-02-20 to 2026-02-22",
    "employeeId": "EMP001"
  }'
```

### Test Reimbursement (Auto-approved)
```bash
curl -X POST http://localhost:3000/api/webhook/nlp \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Submit reimbursement for $450 travel expense",
    "employeeId": "EMP003"
  }'
```

### Test Reimbursement (Requires Approval)
```bash
curl -X POST http://localhost:3000/api/webhook/nlp \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Claim $850 for meal expenses",
    "employeeId": "EMP003"
  }'
```

### Test Purchase Order + Invoice Matching
```bash
# Create PO
curl -X POST http://localhost:3000/api/webhook/nlp \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Create purchase order for $2500 vendor: ABC Textiles items: Cotton fabric",
    "employeeId": "EMP002"
  }'

# Submit matching invoice
curl -X POST http://localhost:3000/api/webhook/nlp \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Submit invoice #INV-2026-001 vendor: ABC Textiles $2500",
    "employeeId": "EMP002"
  }'
```

### Check System Health
```bash
curl http://localhost:3000/api/health
```

---

## 📊 Response Formats

### Success Response
```json
{
  "success": true,
  "intent": "apply_leave",
  "message": "Leave request auto-approved!",
  "data": { /* entity data */ }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Insufficient annual leave balance",
  "intent": "apply_leave"
}
```

### Unknown Intent Response
```json
{
  "success": false,
  "message": "Sorry, I could not understand your request",
  "intent": "unknown",
  "suggestions": [
    "Apply for leave: \"Apply for 3 days annual leave...\"",
    "Check leave balance: \"Check my leave balance\""
  ]
}
```

---

## 🎨 Features

✅ **NLP-driven requests** - Natural language processing for all actions
✅ **Auto-approval logic** - Smart approval based on amount/duration
✅ **3-way matching** - Automatic PO-Invoice matching
✅ **Real-time updates** - Web UI auto-refreshes
✅ **Policy enforcement** - Leave balance validation
✅ **Multi-department support** - HR, Finance, Facilities, IT
✅ **Webhook-ready** - Perfect for Atomicwork integration
✅ **RESTful API** - Standard REST endpoints available

---

## 🔧 Configuration

Edit `server.js` to customize:

- **Port**: Change `PORT` constant (default: 3000)
- **Auto-approval thresholds**: Modify in business logic functions
- **Sample data**: Update `employees` array
- **NLP patterns**: Enhance `parseNLPIntent()` function

---

## 📝 Notes

- All data is stored in-memory (resets on server restart)
- Designed for demo/testing purposes
- Perfect for ESM use case demonstrations
- Ready for Atomicwork service catalog integration

---

## 🚀 Next Steps for Production

1. Add database persistence (MongoDB, PostgreSQL)
2. Implement authentication/authorization
3. Add file upload for receipts/invoices
4. Email notifications
5. Advanced NLP with OpenAI/Claude
6. Approval workflows
7. Audit logging
8. Multi-tenant support

---

**Built for Bodynits ESM Demo** 🏢
