# 🇸🇬 Singapore HR Document API Integration Guide

## Overview

Complete API documentation for generating HR documents (Tax, Payslip, Insurance, Employment Letters) for **Singapore-based employees** with automatic employee data extraction from Atomicwork tickets.

All documents are in **SGD currency** and compliant with **Singapore regulations** (IRAS, CPF, MOM).

---

## 🎯 Key Features

- ✅ **Auto-employee detection** from email in Atomicwork ticket
- ✅ **Singapore compliance** (IR8A tax forms, CPF calculations, MediShield)
- ✅ **SGD currency** in all documents
- ✅ **4 document types** (Tax, Payslip, Insurance, Employment Letter)
- ✅ **Downloadable** PDF-ready HTML documents
- ✅ **REST API** for automation

---

## 📡 Base URL

```
http://localhost:3000/api
```

For production, replace with your actual server URL (e.g., `https://hr.yourcompany.com.sg/api`)

---

## 🔑 Authentication

Currently **no authentication** required for testing.

For production, add API key in header:
```
Authorization: Bearer YOUR_API_KEY
```

---

## 📋 API Endpoints

### 1. Generate Document (Main Endpoint)

**Endpoint:** `POST /api/documents/generate`

**Use Case:** Generate any HR document for an employee (triggered from Atomicwork)

**Request Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "employeeId": "employee@company.com.sg",
  "type": "tax_statement",
  "country": "Singapore",
  "params": {
    "year": 2025,
    "month": "February",
    "purpose": "Bank Loan Application"
  }
}
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `employeeId` | string | ✅ Yes | Employee email OR Employee ID OR numeric ID |
| `type` | string | ✅ Yes | Document type (see below) |
| `country` | string | ✅ Yes | "Singapore" or "SG" for Singapore documents |
| `params` | object | ⚠️ Optional | Additional parameters (depends on document type) |

**Document Types:**

| Type | Description | Required Params |
|------|-------------|-----------------|
| `tax_statement` | IR8A Tax Form (Singapore) | `year` (e.g., 2025) |
| `payslip` | Monthly Payslip (SGD) | `month`, `year` |
| `insurance_card` | MediShield Life Card | None |
| `employment_letter` | Employment Verification Letter | `purpose` (optional) |

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "id": "DOC-1770883851888-0u6mdbw6a",
    "employeeId": 55600,
    "employeeName": "John Tan",
    "type": "tax_statement_sg",
    "title": "IR8A Tax Statement 2025",
    "fileName": "tax-ir8a-EMP055600-2025.html",
    "filePath": "/documents/tax-ir8a-EMP055600-2025.html",
    "generatedAt": "2026-02-12T08:10:51.888Z",
    "year": 2025,
    "country": "Singapore"
  }
}
```

**Response (Error - Employee Not Found):**
```json
{
  "success": false,
  "error": "Employee not found"
}
```

**Download URL:**
```
http://localhost:3000/documents/tax-ir8a-EMP055600-2025.html
```

---

### 2. List Employee Documents

**Endpoint:** `GET /api/documents`

**Use Case:** Get all generated documents for an employee

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `employeeId` | string | ✅ Yes | Employee email OR Employee ID |

**Example Request:**
```bash
GET /api/documents?employeeId=john.tan@company.com.sg
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "DOC-1770883851888-0u6mdbw6a",
      "employeeName": "John Tan",
      "type": "tax_statement_sg",
      "title": "IR8A Tax Statement 2025",
      "filePath": "/documents/tax-ir8a-EMP055600-2025.html",
      "generatedAt": "2026-02-12T08:10:51.888Z",
      "country": "Singapore"
    },
    {
      "id": "DOC-1770883851911-jckhwneib",
      "employeeName": "John Tan",
      "type": "payslip_sg",
      "title": "Payslip - February 2026",
      "filePath": "/documents/payslip-sg-EMP055600-February-2026.html",
      "generatedAt": "2026-02-12T08:10:51.911Z",
      "country": "Singapore"
    }
  ]
}
```

---

## 🔗 Integration with Atomicwork

### Scenario: Employee Requests Payslip via Teams

**User in Teams:** "I need my February payslip"

**Atomicwork creates ticket** → **Webhook triggers** → **Your API**

**Webhook Payload from Atomicwork:**
```json
{
  "request_id": "DWINC-1234",
  "requester_email": "john.tan@company.com.sg",
  "message": "I need my February payslip",
  "description": "Employee requesting payslip for February 2026",
  "category": "Payroll inquiry"
}
```

**Your API Call to Generate Document:**
```bash
curl -X POST http://localhost:3000/api/documents/generate \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "john.tan@company.com.sg",
    "type": "payslip",
    "country": "Singapore",
    "params": {
      "month": "February",
      "year": 2026
    }
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "DOC-1770883851911-jckhwneib",
    "employeeName": "John Tan",
    "type": "payslip_sg",
    "title": "Payslip - February 2026",
    "filePath": "/documents/payslip-sg-EMP055600-February-2026.html",
    "generatedAt": "2026-02-12T08:10:51.911Z",
    "country": "Singapore"
  }
}
```

**Then post response back to Atomicwork:**
```bash
curl -X POST https://atombanking.atomicwork.com/api/v1/requests/DWINC-1234/notes \
  -H "x-api-key: YOUR_ATOMICWORK_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "<h3>✅ Payslip Generated</h3><p>Your February 2026 payslip is ready.</p><p><a href=\"http://localhost:3000/documents/payslip-sg-EMP055600-February-2026.html\" target=\"_blank\">📥 Download Payslip</a></p>",
    "is_private": "false",
    "source": "API"
  }'
```

---

## 📝 Complete Use Case Examples

### Use Case 1: Tax Statement (IR8A Form)

**Scenario:** Employee needs IR8A for tax filing

**API Call:**
```bash
curl -X POST http://localhost:3000/api/documents/generate \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "john.tan@company.com.sg",
    "type": "tax_statement",
    "country": "Singapore",
    "params": {
      "year": 2025
    }
  }'
```

**Document Generated:**
- ✅ IR8A Form (Singapore IRAS format)
- ✅ Annual salary in SGD
- ✅ CPF contributions (Employee 20%, Employer 17%)
- ✅ Benefits-in-kind
- ✅ Tax assessment details

**Download URL:**
```
http://localhost:3000/documents/tax-ir8a-EMP055600-2025.html
```

---

### Use Case 2: Monthly Payslip

**Scenario:** Employee requests current month payslip

**API Call:**
```bash
curl -X POST http://localhost:3000/api/documents/generate \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "john.tan@company.com.sg",
    "type": "payslip",
    "country": "Singapore",
    "params": {
      "month": "February",
      "year": 2026
    }
  }'
```

**Document Generated:**
- ✅ Salary in SGD
- ✅ CPF breakdown (20% employee contribution)
- ✅ Employer CPF (17%) shown separately
- ✅ Net salary after CPF
- ✅ Payment via GIRO
- ✅ Singapore flag 🇸🇬

---

### Use Case 3: Insurance Card (MediShield Life)

**Scenario:** Employee needs medical insurance card for hospital visit

**API Call:**
```bash
curl -X POST http://localhost:3000/api/documents/generate \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "john.tan@company.com.sg",
    "type": "insurance_card",
    "country": "Singapore"
  }'
```

**Document Generated:**
- ✅ MediShield Life card design
- ✅ Policy number
- ✅ Coverage: S$ 100,000
- ✅ Panel hospitals (Restructured hospitals)
- ✅ Emergency hotline: 1800 222 3333
- ✅ Cashless claim instructions

---

### Use Case 4: Employment Letter

**Scenario:** Employee needs employment verification for bank loan

**API Call:**
```bash
curl -X POST http://localhost:3000/api/documents/generate \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "john.tan@company.com.sg",
    "type": "employment_letter",
    "country": "Singapore",
    "params": {
      "purpose": "Bank Loan Application"
    }
  }'
```

**Document Generated:**
- ✅ Company letterhead with UEN
- ✅ Singapore address
- ✅ Employee NRIC/FIN
- ✅ Salary in SGD
- ✅ Full-time employment confirmation
- ✅ HR contact details (+65 number)

---

## 🔧 JSON Payload Reference

### Complete Payload Template

```json
{
  "employeeId": "<EMPLOYEE_EMAIL_OR_ID>",
  "type": "<DOCUMENT_TYPE>",
  "country": "Singapore",
  "params": {
    "year": 2025,
    "month": "February",
    "purpose": "Bank Loan Application"
  }
}
```

### Employee ID Options

You can use ANY of these to identify the employee:

1. **Email address** (Recommended for Atomicwork):
   ```json
   "employeeId": "john.tan@company.com.sg"
   ```

2. **Employee ID** (alphanumeric):
   ```json
   "employeeId": "EMP055600"
   ```

3. **Numeric ID** (internal database ID):
   ```json
   "employeeId": "55600"
   ```

**All three work!** The API will automatically find the employee.

### Document Type Values

| Value | Description |
|-------|-------------|
| `tax_statement` | IR8A Tax Form (auto-detects Singapore if country=Singapore) |
| `payslip` | Monthly payslip |
| `insurance_card` | MediShield Life insurance card |
| `employment_letter` | Employment verification letter |

### Params Object

**For Tax Statement:**
```json
"params": {
  "year": 2025
}
```

**For Payslip:**
```json
"params": {
  "month": "February",
  "year": 2026
}
```

**For Employment Letter:**
```json
"params": {
  "purpose": "Bank Loan Application"
}
```
Or:
```json
"params": {
  "purpose": "Visa Application"
}
```
Or:
```json
"params": {
  "purpose": "HDB Purchase"
}
```

**For Insurance Card:**
```json
"params": {}
```
(No parameters needed)

---

## 🚀 Quick Test Commands

### Test 1: Generate Singapore Tax Statement
```bash
curl -X POST http://localhost:3000/api/documents/generate \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "raghav@atomicwork.com",
    "type": "tax_statement",
    "country": "Singapore",
    "params": {"year": 2025}
  }'
```

### Test 2: Generate Singapore Payslip
```bash
curl -X POST http://localhost:3000/api/documents/generate \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "raghav@atomicwork.com",
    "type": "payslip",
    "country": "Singapore",
    "params": {"month": "February", "year": 2026}
  }'
```

### Test 3: List All Documents for Employee
```bash
curl "http://localhost:3000/api/documents?employeeId=raghav@atomicwork.com"
```

---

## 📊 Singapore Document Features

### IR8A Tax Statement
- ✅ IRAS-compliant format
- ✅ Company UEN
- ✅ Employee NRIC/FIN
- ✅ Annual salary (SGD)
- ✅ CPF contributions (Employee 20%, Employer 17%)
- ✅ Benefits-in-kind section
- ✅ Auto-Inclusion Scheme (AIS) notice

### Payslip
- ✅ Singapore flag 🇸🇬
- ✅ Basic salary (SGD)
- ✅ Allowances (Transport, Meal)
- ✅ CPF breakdown
- ✅ Net salary after CPF
- ✅ GIRO payment method
- ✅ CPF Board contact info

### MediShield Life Card
- ✅ Singapore medical insurance
- ✅ Coverage: S$ 100,000
- ✅ Restructured hospitals panel
- ✅ Cashless claim process
- ✅ Emergency hotline
- ✅ COVID-19 coverage included

### Employment Letter
- ✅ Singapore company format
- ✅ UEN number
- ✅ Singapore address format
- ✅ +65 phone numbers
- ✅ .com.sg email
- ✅ Salary in SGD
- ✅ NRIC/FIN mentioned

---

## 🔗 Atomicwork Webhook Integration

### Step 1: Configure Atomicwork Workflow

In Atomicwork → Settings → Workflows:

**Trigger:** Request Created (People & Culture workspace)

**Conditions:**
- Form is one of: "Payroll inquiry", "Employment letter", "Tax statement"

**Action:** HTTP Request
- **URL:** `http://your-server:3000/api/documents/generate`
- **Method:** POST
- **Headers:**
  ```json
  {
    "Content-Type": "application/json"
  }
  ```
- **Body:**
  ```json
  {
    "employeeId": "{{request.requester.email}}",
    "type": "{{form_type}}",
    "country": "Singapore",
    "params": {
      "year": 2025,
      "month": "{{current_month}}",
      "purpose": "{{request.description}}"
    }
  }
  ```

### Step 2: Map Form Types

| Atomicwork Form | Document Type | Params |
|-----------------|---------------|--------|
| Payroll inquiry | `payslip` | month, year |
| Pay Statement | `tax_statement` | year |
| Employment letter request | `employment_letter` | purpose |
| Medi Assist - Employee Insurance Card | `insurance_card` | - |

---

## ⚠️ Error Handling

### Employee Not Found
```json
{
  "success": false,
  "error": "Employee not found"
}
```
**Cause:** Email/ID doesn't match any employee in the system
**Solution:** Check if employee exists with correct email

### Invalid Document Type
```json
{
  "success": false,
  "error": "Invalid document type"
}
```
**Cause:** `type` parameter has invalid value
**Solution:** Use one of: tax_statement, payslip, insurance_card, employment_letter

### Missing Parameters
```json
{
  "success": false,
  "error": "Missing required parameter: year"
}
```
**Cause:** Required param not provided
**Solution:** Include required params in `params` object

---

## 📧 Employee Email as Key

**IMPORTANT:** The API uses the **requester email** from Atomicwork to identify the employee automatically.

**Workflow:**
1. Employee submits request in Teams/Atomicwork
2. Atomicwork knows their email (authenticated user)
3. Webhook sends email in `requester_email` field
4. API finds employee by email
5. Document generated with correct employee data
6. No manual ID needed!

**Example:**
```json
{
  "employeeId": "john.tan@company.com.sg"
}
```

The API will:
1. Search employees by email = "john.tan@company.com.sg"
2. Find: John Tan, Employee ID: EMP055600
3. Generate document with John's data
4. Return document with download link

---

## 🎯 Production Checklist

- [ ] Update base URL to production server
- [ ] Add API key authentication
- [ ] Configure HTTPS/SSL
- [ ] Set up ngrok or public URL for Atomicwork webhooks
- [ ] Test with real employee emails
- [ ] Verify Singapore compliance (IR8A, CPF rates)
- [ ] Add rate limiting
- [ ] Enable CORS for allowed domains
- [ ] Set up document retention policy
- [ ] Add audit logging

---

## 📞 Support

For API issues or questions:
- Check server logs: `tail -f /tmp/sage-hr.log`
- Test API health: `curl http://localhost:3000/api/health`
- Verify employee exists: `curl http://localhost:3000/api/employees`

---

## ✅ Summary

**Key Points:**
1. ✅ Use `employeeId` = email from Atomicwork
2. ✅ Set `country` = "Singapore" for SGD/Singapore documents
3. ✅ All amounts in **SGD**
4. ✅ CPF calculations: Employee 20%, Employer 17%
5. ✅ Singapore-compliant formats (IR8A, MediShield)
6. ✅ Documents ready to print/download as PDF

**Endpoint:**
```
POST /api/documents/generate
```

**Minimal Payload:**
```json
{
  "employeeId": "employee@company.com.sg",
  "type": "payslip",
  "country": "Singapore",
  "params": {"month": "February", "year": 2026}
}
```

**That's it!** 🎉
