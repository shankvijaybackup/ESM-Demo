# 🎯 Bodynits ESM Demo Script - Agentic Use Cases

**Meeting**: Friday 13th Feb, 11 AM SGT
**Attendees**: Ryan & Glen (Owners), Paul (IT Head)
**Objective**: Show AI-native ESM capabilities with Atomicwork

---

## Demo Architecture

```
Employee Request (Natural Language)
         ↓
Atomicwork Service Catalog
         ↓
AI Agent processes intent
         ↓
Webhook → Sage HR Mock API
         ↓
Action executed (Leave/Expense/PO/Invoice)
         ↓
Result returned to employee
```

---

## 🎬 Demo Flow (20 minutes)

### **Act 1: Business Operations Automation** (7 mins)

#### Scenario 1: Facilities - Employee Workspace Setup
**Context**: New production supervisor joining next week

**Show in Atomicwork**:
```
Employee request: "Set up workspace for new hire Maria starting Feb 20"

Agent orchestration:
✓ Checks desk availability
✓ Reserves equipment (laptop, monitor)
✓ Creates access card request
✓ Schedules setup with facilities team
✓ All done in seconds, no manual routing
```

**API Call** (behind the scenes):
```bash
curl -X POST http://localhost:3000/api/webhook/nlp \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Set up workspace for new employee starting 2026-02-20",
    "employeeId": "EMP005"
  }'
```

**Key Message**: "Atomicwork doesn't just route requests - it completes work autonomously across departments"

---

#### Scenario 2: Finance - Expense Reimbursement with Auto-Approval
**Context**: Floor supervisor submits travel expense

**Show in Atomicwork**:
```
Employee (Maria): "Submit reimbursement for $450 travel expense"

Agent decision-making:
✓ Validates amount against policy ($450 < $500 threshold)
✓ Checks budget availability
✓ Auto-approves (no manager delay)
✓ Schedules payment in next payroll
✓ Notifies employee immediately
```

**API Call**:
```bash
curl -X POST http://localhost:3000/api/webhook/nlp \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Submit reimbursement for $450 travel expense",
    "employeeId": "EMP003"
  }'
```

**Result**:
```json
{
  "success": true,
  "message": "Reimbursement auto-approved! $450 will be processed in the next payroll cycle.",
  "data": {
    "id": "REIMB-xxx",
    "amount": 450,
    "status": "approved",
    "approver": "AUTO"
  }
}
```

**Key Message**: "Business policies are enforced consistently by AI - no exceptions, no delays, no manual approvals for routine requests"

---

#### Scenario 3: HR - Leave Application with Balance Check
**Context**: Employee wants to take time off

**Show in Atomicwork**:
```
Employee (Sarah): "Apply for 2 days annual leave from Feb 20 to Feb 21"

Agent intelligence:
✓ Checks available leave balance (15 days available)
✓ Validates dates against team schedule
✓ Auto-approves (≤ 2 days policy)
✓ Updates calendar and balance immediately
✓ Notifies manager and team
```

**API Call**:
```bash
curl -X POST http://localhost:3000/api/webhook/nlp \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Apply for 2 days annual leave from 2026-02-20 to 2026-02-21",
    "employeeId": "EMP001"
  }'
```

**Result**:
```json
{
  "success": true,
  "message": "Leave request auto-approved! 2 day(s) of annual leave from 2026-02-20 to 2026-02-21",
  "data": {
    "status": "approved",
    "approver": "AUTO"
  },
  "updatedBalance": {
    "annual": 13,
    "sick": 10,
    "personal": 5
  }
}
```

**Key Message**: "Employees get instant decisions, not 'your request has been submitted' messages"

---

### **Act 2: Smart Policy Enforcement** (5 mins)

#### Scenario 4: Expense Requiring Manual Approval
**Context**: Finance director submits larger expense

**Show in Atomicwork**:
```
Employee (John): "Claim $850 for client entertainment expenses"

Agent policy decision:
✓ Detects amount exceeds threshold ($850 > $500)
✓ Routes to manager with context
✓ Flags for review (not just blind approval)
✓ Explains why manual review needed
```

**API Call**:
```bash
curl -X POST http://localhost:3000/api/webhook/nlp \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Claim $850 for meal expenses",
    "employeeId": "EMP002"
  }'
```

**Result**:
```json
{
  "success": true,
  "message": "Reimbursement submitted for approval. Request ID: REIMB-xxx",
  "data": {
    "amount": 850,
    "category": "meals",
    "status": "pending",
    "approver": "EMP002"
  }
}
```

**Key Message**: "AI knows when to act autonomously and when to involve humans - it's smart governance, not blind automation"

---

### **Act 3: Cross-System Orchestration** (8 mins)

#### Scenario 5: Purchase Order + Invoice Matching (Manufacturing Focus)
**Context**: Procurement for cotton fabric (core business)

**Step 1: Create Purchase Order**
```
Finance (John): "Create purchase order for $2500 vendor: ABC Textiles items: Cotton fabric, buttons"

Agent action:
✓ Creates PO with unique number
✓ Records vendor and items
✓ Sets up 3-way match expectation
✓ Notifies procurement and finance
```

**API Call**:
```bash
curl -X POST http://localhost:3000/api/webhook/nlp \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Create purchase order for $2500 vendor: ABC Textiles items: Cotton fabric, buttons",
    "employeeId": "EMP002"
  }'
```

**Result**:
```json
{
  "success": true,
  "message": "Purchase Order created successfully. PO Number: PO-1770878012928",
  "data": {
    "poNumber": "PO-1770878012928",
    "vendor": "ABC Textiles",
    "amount": 2500,
    "status": "pending_approval"
  }
}
```

---

**Step 2: Submit Matching Invoice**
```
AP Clerk: "Submit invoice INV-2026-001 vendor: ABC Textiles $2500"

Agent intelligence:
✓ Extracts invoice details
✓ Searches for matching PO (vendor + amount)
✓ Performs 3-way match
✓ If matched: Auto-approves payment
✓ If discrepancy: Flags for review with details
```

**API Call**:
```bash
curl -X POST http://localhost:3000/api/webhook/nlp \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Submit invoice INV-2026-001 vendor: ABC Textiles $2500",
    "employeeId": "EMP002"
  }'
```

**Result**:
```json
{
  "success": true,
  "message": "Invoice matched with PO PO-1770878012928 and ready for payment processing.",
  "data": {
    "invoiceNumber": "INV-2026-001",
    "vendor": "ABC Textiles",
    "amount": 2500,
    "status": "matched",
    "matchedPO": "PO-1770878012928"
  }
}
```

**Key Message**: "This is where traditional ITSM fails - Atomicwork understands business processes, not just tickets. It matches invoices with POs, validates amounts, and processes payments autonomously."

---

#### Scenario 6: Attendance Tracking
**Context**: Daily production floor check-in

**Show in Atomicwork**:
```
Employee (Maria): "Mark my attendance"

Agent action:
✓ Records timestamp
✓ Validates against schedule
✓ Updates attendance system
✓ Tracks for payroll
```

**API Call**:
```bash
curl -X POST http://localhost:3000/api/webhook/nlp \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Mark my attendance",
    "employeeId": "EMP003"
  }'
```

**Result**:
```json
{
  "success": true,
  "message": "Attendance marked successfully for Maria Rodriguez",
  "data": {
    "id": "ATT-xxx",
    "employeeId": "EMP003",
    "date": "2026-02-12",
    "checkIn": "2026-02-12T06:33:32.823Z",
    "status": "present"
  }
}
```

---

## 💡 Key Differentiators vs. Freshservice

| Feature | Freshservice | Atomicwork |
|---|---|---|
| **Request Processing** | Routes tickets to queues | Completes work autonomously |
| **Approval Logic** | Manual routing rules | AI-driven policy decisions |
| **Cross-Department** | Separate ITSM instances | Unified ESM platform |
| **Business Context** | Generic ticket fields | Understands manufacturing, finance, HR |
| **Integration** | Manual API configuration | Agent-driven orchestration |
| **Employee Experience** | "Ticket submitted" | "Task completed" |

---

## 🎯 Talking Points for Each Persona

### For Ryan & Glen (Business Owners):
- "Reduce approval delays from 2-3 days to 2-3 minutes"
- "Enforce policies consistently across 400 employees"
- "Free up managers from routine approvals"
- "Real-time visibility into all service requests"
- "Built for manufacturing operations, not just IT helpdesk"

### For Paul (IT Head):
- "Integrate with your existing systems - SAP, Workday, whatever you use"
- "IT enables the platform, doesn't own every workflow"
- "Webhook-based architecture - easy to connect"
- "Your team focuses on strategic work, not ticket routing"
- "Single pane of glass for HR, Finance, Facilities, IT"

---

## 🚀 Next Steps After Demo

1. **Pilot Scope Discussion**:
   - Start with Facilities + one more function (HR or Finance)
   - 2-week pilot with 20-30 employees
   - Measure approval time reduction

2. **Technical Discovery**:
   - Current systems (ERP, HRIS, Finance)
   - Integration requirements
   - SSO setup

3. **Success Metrics**:
   - Approval time: Target <4 hours (from current 2-3 days)
   - Auto-resolution rate: Target 60%+
   - Employee satisfaction: Target NPS 40+

---

## 📊 Demo Metrics to Show

**Before Atomicwork** (Traditional ITSM):
- Average expense approval time: 48-72 hours
- Manual handoffs per request: 5-7
- Policy violations: ~15% slip through
- Employee frustration: High

**After Atomicwork** (Agentic ESM):
- Average approval time: <2 hours
- Manual handoffs: 0-1
- Policy violations: 0% (enforced by AI)
- Employee satisfaction: High

---

## 🎥 Demo Preparation Checklist

- [ ] Server running: `npm start`
- [ ] Test all API endpoints: `./test-api.sh`
- [ ] Open Web UI: http://localhost:3000
- [ ] Have Postman collection ready for live testing
- [ ] Prepare screen sharing (show both UI and API calls)
- [ ] Have backup examples ready if questions arise

---

## 🔧 Live Demo Commands (Copy-Paste Ready)

All commands are in the `QUICK_START.md` file for easy reference during the demo.

---

**Remember**: This is not a full product demo - it's a teaser to show the "art of the possible" with AI-native ESM. Focus on business value, not technical features.

**Good luck! 🚀**
