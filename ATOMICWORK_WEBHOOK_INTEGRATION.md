# Atomicwork Webhook Integration Guide

## Overview

The Sage HR system automatically posts formatted HTML responses back to Atomicwork tickets after processing any HR request.

---

## 🎯 How It Works

```
Employee (Teams) → Atomicwork → Sage HR API → Response posted back to Atomicwork Ticket
```

1. Employee submits request via Teams/Atomicwork
2. Atomicwork sends webhook to Sage HR
3. Sage HR processes the request
4. **Sage HR automatically posts HTML response to Atomicwork ticket**
5. Employee sees formatted response in their ticket

---

## 📡 Webhook Configuration

### Atomicwork → Sage HR Webhook

**URL:** `https://esm-demo.onrender.com/api/webhook/nlp`

**Method:** POST

**Headers:**
```
Content-Type: application/json
```

**Payload:**
```json
{
  "text": "I need my February payslip",
  "employeeId": "john.tan@atombank.co",
  "ticketId": "DWINC-7933",
  "metadata": {
    "requester": {
      "first_name": "John",
      "last_name": "Tan",
      "email": "john.tan@atombank.co"
    }
  }
}
```

**Key Parameters:**
- `text` - Employee's natural language request (required)
- `employeeId` - Employee email or ID (required)
- `ticketId` - Atomicwork ticket ID (e.g., "DWINC-7933") - **IMPORTANT for auto-reply**
- `metadata` - Additional context (optional)

---

## 🔐 Configuration

### Environment Variables

Set these in Render dashboard:

```bash
ATOMICWORK_URL=https://atombanking.atomicwork.com
ATOMICWORK_API_KEY=aw_b2d3cda25daa4790b460edd9162616advkwta0
BASE_URL=https://esm-demo.onrender.com
```

### Atomicwork API Key

The system uses Atomicwork's API to post responses:

**Endpoint:** `POST https://atombanking.atomicwork.com/api/v1/requests/{ticketId}/activity-notes`

**Headers:**
```
x-api-key: aw_b2d3cda25daa4790b460edd9162616advkwta0
Content-Type: application/json
```

---

## 📋 Supported Use Cases

### 1. Leave Application

**Employee Request:**
```
"Apply for 3 days annual leave from 2026-02-20 to 2026-02-22"
```

**Atomicwork Webhook:**
```json
{
  "text": "Apply for 3 days annual leave from 2026-02-20 to 2026-02-22",
  "employeeId": "john.tan@atombank.co",
  "ticketId": "DWINC-7933"
}
```

**HTML Response Posted to Ticket:**
```html
<div style="padding: 20px; background-color: #f8f9fa; border-left: 4px solid #28a745;">
  <h2 style="color: #28a745;">✅ Leave Request Approved</h2>
  <table>
    <tr><td><strong>Request ID</strong></td><td>LV-abc123</td></tr>
    <tr><td><strong>Employee</strong></td><td>John Tan</td></tr>
    <tr><td><strong>Leave Type</strong></td><td>Annual</td></tr>
    <tr><td><strong>Duration</strong></td><td>3 day(s)</td></tr>
    <tr><td><strong>Start Date</strong></td><td>2026-02-20</td></tr>
    <tr><td><strong>End Date</strong></td><td>2026-02-22</td></tr>
    <tr><td><strong>Status</strong></td><td>APPROVED</td></tr>
  </table>
  <div>Updated Leave Balance: Annual: 12 | Sick: 10 | Personal: 5</div>
</div>
```

---

### 2. Check Leave Balance

**Employee Request:**
```
"What is my leave balance?"
```

**HTML Response:**
```html
<div style="padding: 20px;">
  <h2>📊 Leave Balance - John Tan</h2>
  <div style="display: grid;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
      <div style="font-size: 32px;">15</div>
      <div>Annual Leave</div>
    </div>
    <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
      <div style="font-size: 32px;">10</div>
      <div>Sick Leave</div>
    </div>
    <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
      <div style="font-size: 32px;">5</div>
      <div>Personal Leave</div>
    </div>
  </div>
  <div><strong>Total Available:</strong> 30 days</div>
</div>
```

---

### 3. Submit Reimbursement

**Employee Request:**
```
"Submit reimbursement for SGD 150 for travel"
```

**HTML Response:**
```html
<div style="padding: 20px; border-left: 4px solid #28a745;">
  <h2>✅ Reimbursement Approved</h2>
  <table>
    <tr><td><strong>Request ID</strong></td><td>REIMB-xyz789</td></tr>
    <tr><td><strong>Amount</strong></td><td style="font-size: 18px; color: #28a745;">S$ 150.00</td></tr>
    <tr><td><strong>Category</strong></td><td>Travel</td></tr>
    <tr><td><strong>Status</strong></td><td>APPROVED</td></tr>
  </table>
</div>
```

---

### 4. Generate Payslip

**Employee Request:**
```
"I need my February 2026 payslip"
```

**HTML Response:**
```html
<div style="padding: 20px; border-left: 4px solid #17a2b8;">
  <h2>📄 Payslip - February 2026 Generated</h2>
  <table>
    <tr><td><strong>Document Type</strong></td><td>Payslip</td></tr>
    <tr><td><strong>Employee</strong></td><td>John Tan</td></tr>
    <tr><td><strong>Country</strong></td><td>🇸🇬 Singapore</td></tr>
    <tr><td><strong>Generated At</strong></td><td>2026-02-12 18:30:00</td></tr>
  </table>
  <a href="https://esm-demo.onrender.com/documents/payslip-sg-EMP001-February-2026.html"
     style="background-color: #17a2b8; color: white; padding: 12px 24px; text-decoration: none;">
    📥 Download Payslip - February 2026
  </a>
  <p>Click the link above to view and download your document.</p>
</div>
```

---

### 5. Mark Attendance

**Employee Request:**
```
"Mark my attendance"
```

**HTML Response:**
```html
<div style="padding: 20px; border-left: 4px solid #28a745;">
  <h2>✅ Attendance Marked</h2>
  <table>
    <tr><td><strong>Employee</strong></td><td>John Tan</td></tr>
    <tr><td><strong>Date</strong></td><td>2026-02-12</td></tr>
    <tr><td><strong>Check-in Time</strong></td><td>9:00 AM</td></tr>
    <tr><td><strong>Status</strong></td><td>PRESENT</td></tr>
  </table>
</div>
```

---

### 6. Create Purchase Order

**Employee Request:**
```
"Create purchase order for SGD 5000 for office equipment"
```

**HTML Response:**
```html
<div style="padding: 20px; border-left: 4px solid #ffc107;">
  <h2>📦 Purchase Order Submitted</h2>
  <table>
    <tr><td><strong>PO Number</strong></td><td>PO-abc123</td></tr>
    <tr><td><strong>Amount</strong></td><td style="font-size: 18px; color: #2196F3;">S$ 5,000.00</td></tr>
    <tr><td><strong>Vendor</strong></td><td>Tech Supplies Pte Ltd</td></tr>
    <tr><td><strong>Description</strong></td><td>Office equipment</td></tr>
    <tr><td><strong>Status</strong></td><td>PENDING</td></tr>
  </table>
</div>
```

---

## 🧪 Testing the Integration

### Test with cURL

```bash
curl -X POST https://esm-demo.onrender.com/api/webhook/nlp \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Apply for 2 days leave from 2026-02-15 to 2026-02-16",
    "employeeId": "test@company.com",
    "ticketId": "DWINC-TEST"
  }'
```

**Expected:**
1. ✅ Sage HR processes leave request
2. ✅ Sage HR posts HTML response to ticket DWINC-TEST
3. ✅ You can see the formatted response in Atomicwork

---

## 📊 Response Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Atomicwork Webhook                                       │
│    POST /api/webhook/nlp                                    │
│    {                                                         │
│      "text": "I need leave",                                │
│      "employeeId": "john@company.com",                      │
│      "ticketId": "DWINC-7933"                               │
│    }                                                         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Sage HR Processes Request                                │
│    - Parse NLP intent                                       │
│    - Execute action (leave, reimbursement, etc.)            │
│    - Generate HTML response                                 │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Post to Atomicwork                                       │
│    POST /api/v1/requests/DWINC-7933/activity-notes          │
│    {                                                         │
│      "is_private": "false",                                 │
│      "description": "<HTML formatted response>",            │
│      "source": "PORTAL"                                     │
│    }                                                         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Employee Sees Response                                   │
│    - Formatted HTML in Atomicwork ticket                    │
│    - Download links for documents                           │
│    - Status updates                                         │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 HTML Response Features

All responses include:
- ✅ **Color-coded status** (green for approved, yellow for pending)
- ✅ **Formatted tables** with employee details
- ✅ **Download links** for documents
- ✅ **Responsive design** works on mobile/desktop
- ✅ **Professional styling** with gradients and icons
- ✅ **SGD currency** for Singapore context
- ✅ **Timestamp** and system attribution

---

## 🔍 Debugging

### Check Logs

```bash
# View Render logs
https://dashboard.render.com → Your Service → Logs

# Look for these messages:
✅ Posted to Atomicwork ticket DWINC-7933
❌ Failed to post to Atomicwork ticket DWINC-7933: <error>
```

### Test Without Atomicwork

```bash
# Test without ticketId - no auto-post
curl -X POST https://esm-demo.onrender.com/api/webhook/nlp \
  -H "Content-Type: application/json" \
  -d '{
    "text": "What is my leave balance?",
    "employeeId": "EMP001"
  }'

# Response includes htmlResponse field but doesn't post to Atomicwork
```

---

## 🚨 Error Handling

If posting to Atomicwork fails:
1. ✅ Error is logged in Render logs
2. ✅ Error HTML is posted to ticket (if ticket ID exists)
3. ✅ API still returns success response
4. ✅ Request is processed successfully

**Error Response Posted to Ticket:**
```html
<div style="padding: 15px; background-color: #fee; border-left: 4px solid #f44;">
  <h3 style="color: #f44;">❌ Error Processing Request</h3>
  <p><strong>Error:</strong> Employee not found</p>
  <p>Please try again or contact HR support.</p>
</div>
```

---

## 📝 Example Atomicwork Webhook Setup

### 1. Create Workflow in Atomicwork

**Trigger:** New ticket in HR category

**Action:** HTTP Request

**URL:** `https://esm-demo.onrender.com/api/webhook/nlp`

**Method:** POST

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "text": "{{ticket.description}}",
  "employeeId": "{{requester.email}}",
  "ticketId": "{{ticket.display_id}}",
  "metadata": {
    "requester": {
      "first_name": "{{requester.first_name}}",
      "last_name": "{{requester.last_name}}",
      "email": "{{requester.email}}"
    }
  }
}
```

---

## ✅ Success Indicators

When integration works correctly:

1. ✅ Employee submits request via Teams
2. ✅ Atomicwork webhook fires
3. ✅ Sage HR processes request
4. ✅ HTML response appears in ticket within 2-3 seconds
5. ✅ Employee can download documents or see status
6. ✅ No manual intervention needed

---

## 🎯 Key Benefits

- **Automated Responses** - No manual HR intervention needed
- **Rich Formatting** - Beautiful HTML responses
- **Document Links** - Direct download for payslips, tax forms, etc.
- **Real-time Updates** - Instant feedback to employees
- **Singapore Compliant** - All documents in SGD with proper formats
- **Scalable** - Handles unlimited requests

---

**Live System:** https://esm-demo.onrender.com

**API Documentation:** See `API_ENDPOINTS.md`

**GitHub:** https://github.com/shankvijaybackup/ESM-Demo
