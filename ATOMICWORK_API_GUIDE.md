# 🔌 Atomicwork Integration - Complete API Guide

## Overview

Your Sage HR system has **ONE main endpoint** for document generation. You parse the employee's request in Atomicwork, then call this single API with different parameters.

---

## 🎯 Single API Endpoint Approach

### The One Endpoint to Rule Them All:

```
POST https://YOUR_RENDER_URL.onrender.com/api/documents/generate
```

**This single endpoint handles ALL 4 document types:**
- Tax Statements (IR8A)
- Payslips
- Insurance Cards
- Employment Letters

You control which document is generated using the `type` parameter.

---

## 📋 API Structure

### Base URL (After Render Deployment)
```
https://sage-hr-singapore.onrender.com
```

### Document Generation Endpoint
```
POST /api/documents/generate
```

### Request Headers
```
Content-Type: application/json
```

### Request Body Format
```json
{
  "employeeId": "john.tan@company.com.sg",
  "type": "payslip",
  "country": "Singapore",
  "params": {
    "month": "February",
    "year": 2026
  }
}
```

### Response Format
```json
{
  "success": true,
  "data": {
    "id": "DOC-1770890330211-wce7x23cs",
    "employeeId": 55600,
    "employeeName": "311 AI",
    "type": "payslip_sg",
    "title": "Payslip - February 2026",
    "fileName": "payslip-sg-EMP055600-February-2026.html",
    "filePath": "/documents/payslip-sg-EMP055600-February-2026.html",
    "generatedAt": "2026-02-12T09:58:50.211Z",
    "country": "Singapore"
  }
}
```

---

## 🔀 Atomicwork Flow

### Step 1: Employee Sends Request via Teams

```
Employee Message: "I need my February 2026 payslip"
```

### Step 2: Atomicwork Webhook to Your Bridge

Atomicwork sends you:
```json
{
  "request_id": "DWINC-1234",
  "requester_email": "john.tan@company.com.sg",
  "message": "I need my February 2026 payslip",
  "category": "Payroll"
}
```

### Step 3: Parse Request (Your Bridge Logic)

```python
def parse_employee_request(message, requester_email):
    message_lower = message.lower()

    # Detect document type
    if 'payslip' in message_lower or 'salary slip' in message_lower:
        doc_type = 'payslip'
        params = extract_payslip_params(message)

    elif 'tax' in message_lower or 'ir8a' in message_lower:
        doc_type = 'tax_statement'
        params = extract_tax_params(message)

    elif 'insurance' in message_lower or 'medishield' in message_lower:
        doc_type = 'insurance_card'
        params = {}

    elif 'employment letter' in message_lower or 'verification' in message_lower:
        doc_type = 'employment_letter'
        params = extract_letter_params(message)

    return {
        'employeeId': requester_email,  # Use email directly!
        'type': doc_type,
        'country': 'Singapore',
        'params': params
    }
```

### Step 4: Call Sage HR API

```python
import requests

def generate_document(payload):
    response = requests.post(
        'https://sage-hr-singapore.onrender.com/api/documents/generate',
        json=payload,
        headers={'Content-Type': 'application/json'}
    )
    return response.json()

# Call it
result = generate_document({
    'employeeId': 'john.tan@company.com.sg',
    'type': 'payslip',
    'country': 'Singapore',
    'params': {'month': 'February', 'year': 2026}
})
```

### Step 5: Post Response to Atomicwork

```python
if result['success']:
    doc = result['data']
    download_url = f"https://sage-hr-singapore.onrender.com{doc['filePath']}"

    # Format response
    response_html = f"""
    <h3>✅ {doc['title']} Generated</h3>
    <p>Your document is ready for download.</p>
    <p><a href="{download_url}" target="_blank">📥 Download {doc['title']}</a></p>
    <p><em>Click the link above to view/download your document.</em></p>
    """

    # Post to Atomicwork ticket
    post_to_atomicwork_ticket(request_id, response_html)
```

---

## 📚 Document Types & Parameters

### 1. Tax Statement (IR8A)

**Employee Request:**
- "I need my tax statement"
- "Generate my IR8A for 2025"
- "I need Form IR8A"

**API Call:**
```json
{
  "employeeId": "employee@company.com.sg",
  "type": "tax_statement",
  "country": "Singapore",
  "params": {
    "year": 2025
  }
}
```

**Required Params:**
- `year` - Tax year (e.g., 2025)

**Response:**
```json
{
  "success": true,
  "data": {
    "type": "tax_statement_sg",
    "title": "IR8A Tax Statement 2025",
    "filePath": "/documents/tax-ir8a-EMP055600-2025.html"
  }
}
```

---

### 2. Payslip

**Employee Request:**
- "I need my February payslip"
- "Generate salary slip for January 2026"
- "I need my current month payslip"

**API Call:**
```json
{
  "employeeId": "employee@company.com.sg",
  "type": "payslip",
  "country": "Singapore",
  "params": {
    "month": "February",
    "year": 2026
  }
}
```

**Required Params:**
- `month` - Month name (e.g., "February", "January")
- `year` - Year (e.g., 2026)

**Response:**
```json
{
  "success": true,
  "data": {
    "type": "payslip_sg",
    "title": "Payslip - February 2026",
    "filePath": "/documents/payslip-sg-EMP055600-February-2026.html"
  }
}
```

---

### 3. Insurance Card (MediShield Life)

**Employee Request:**
- "I need my insurance card"
- "Generate my MediShield card"
- "I need my health insurance details"

**API Call:**
```json
{
  "employeeId": "employee@company.com.sg",
  "type": "insurance_card",
  "country": "Singapore"
}
```

**Required Params:**
- None

**Response:**
```json
{
  "success": true,
  "data": {
    "type": "insurance_card_sg",
    "title": "MediShield Life Insurance Card",
    "filePath": "/documents/insurance-medishield-EMP055600.html",
    "policyNumber": "MSEMP0556002026"
  }
}
```

---

### 4. Employment Letter

**Employee Request:**
- "I need an employment letter for bank loan"
- "Generate employment verification for visa"
- "I need a letter confirming my employment"

**API Call:**
```json
{
  "employeeId": "employee@company.com.sg",
  "type": "employment_letter",
  "country": "Singapore",
  "params": {
    "purpose": "Bank Loan"
  }
}
```

**Required Params:**
- `purpose` - Optional, defaults to "General"
  - Common values: "Bank Loan", "Visa Application", "HDB Application", "General"

**Response:**
```json
{
  "success": true,
  "data": {
    "type": "employment_letter_sg",
    "title": "Employment Letter - Bank Loan",
    "filePath": "/documents/employment-letter-sg-EMP055600-xxx.html"
  }
}
```

---

## 🧠 NLP Parsing Examples

### Python Example: Parse Employee Messages

```python
import re
from datetime import datetime

class HRDocumentParser:

    def parse_request(self, message, requester_email):
        """Main parsing function"""
        message_lower = message.lower()

        # Determine document type
        doc_type = self._detect_document_type(message_lower)

        # Extract parameters based on type
        params = self._extract_parameters(doc_type, message)

        # Build API payload
        return {
            'employeeId': requester_email,
            'type': doc_type,
            'country': 'Singapore',
            'params': params
        }

    def _detect_document_type(self, message):
        """Detect which document is requested"""

        # Payslip keywords
        if any(word in message for word in ['payslip', 'salary slip', 'pay slip', 'wage slip']):
            return 'payslip'

        # Tax statement keywords
        if any(word in message for word in ['tax', 'ir8a', 'ir8', 'tax statement', 'form 16']):
            return 'tax_statement'

        # Insurance keywords
        if any(word in message for word in ['insurance', 'medishield', 'health card', 'insurance card']):
            return 'insurance_card'

        # Employment letter keywords
        if any(word in message for word in ['employment letter', 'employment verification', 'confirm employment', 'certify']):
            return 'employment_letter'

        # Default to payslip if unclear
        return 'payslip'

    def _extract_parameters(self, doc_type, message):
        """Extract parameters based on document type"""

        if doc_type == 'payslip':
            return self._extract_payslip_params(message)

        elif doc_type == 'tax_statement':
            return self._extract_tax_params(message)

        elif doc_type == 'employment_letter':
            return self._extract_letter_params(message)

        return {}

    def _extract_payslip_params(self, message):
        """Extract month and year from payslip request"""

        # Extract year
        year_match = re.search(r'20\d{2}', message)
        year = int(year_match.group()) if year_match else datetime.now().year

        # Extract month
        months = ['january', 'february', 'march', 'april', 'may', 'june',
                  'july', 'august', 'september', 'october', 'november', 'december']

        message_lower = message.lower()
        month = None

        for m in months:
            if m in message_lower:
                month = m.capitalize()
                break

        # Default to current month if not specified
        if not month:
            month = datetime.now().strftime('%B')

        # Handle "current month", "this month", "last month"
        if 'current month' in message_lower or 'this month' in message_lower:
            month = datetime.now().strftime('%B')
        elif 'last month' in message_lower:
            last_month = datetime.now().month - 1 if datetime.now().month > 1 else 12
            month = datetime(2000, last_month, 1).strftime('%B')

        return {
            'month': month,
            'year': year
        }

    def _extract_tax_params(self, message):
        """Extract year from tax statement request"""

        # Extract year
        year_match = re.search(r'20\d{2}', message)
        year = int(year_match.group()) if year_match else datetime.now().year - 1  # Default to last year

        return {
            'year': year
        }

    def _extract_letter_params(self, message):
        """Extract purpose from employment letter request"""

        message_lower = message.lower()

        # Detect purpose
        if 'bank' in message_lower or 'loan' in message_lower:
            purpose = 'Bank Loan'
        elif 'visa' in message_lower:
            purpose = 'Visa Application'
        elif 'hdb' in message_lower:
            purpose = 'HDB Application'
        else:
            purpose = 'General'

        return {
            'purpose': purpose
        }


# Usage Example
parser = HRDocumentParser()

# Example 1: Payslip request
request1 = parser.parse_request(
    "I need my February 2026 payslip",
    "john.tan@company.com.sg"
)
# Returns: {'employeeId': 'john.tan@company.com.sg', 'type': 'payslip', 'country': 'Singapore', 'params': {'month': 'February', 'year': 2026}}

# Example 2: Tax statement
request2 = parser.parse_request(
    "Generate my IR8A for 2025",
    "sarah.lim@company.com.sg"
)
# Returns: {'employeeId': 'sarah.lim@company.com.sg', 'type': 'tax_statement', 'country': 'Singapore', 'params': {'year': 2025}}

# Example 3: Insurance card
request3 = parser.parse_request(
    "I need my MediShield insurance card",
    "raj.kumar@company.com.sg"
)
# Returns: {'employeeId': 'raj.kumar@company.com.sg', 'type': 'insurance_card', 'country': 'Singapore', 'params': {}}

# Example 4: Employment letter
request4 = parser.parse_request(
    "I need employment verification for bank loan",
    "mary.wong@company.com.sg"
)
# Returns: {'employeeId': 'mary.wong@company.com.sg', 'type': 'employment_letter', 'country': 'Singapore', 'params': {'purpose': 'Bank Loan'}}
```

---

## 🔄 Complete Integration Example

### Full Python Bridge Service

```python
import requests
from flask import Flask, request, jsonify

app = Flask(__name__)

# Configuration
SAGE_HR_API = "https://sage-hr-singapore.onrender.com/api/documents/generate"
ATOMICWORK_API = "https://your-atomicwork-instance.com/api"

@app.route('/webhook/atomicwork', methods=['POST'])
def handle_atomicwork_webhook():
    """
    Receives webhook from Atomicwork when employee requests document
    """

    # Parse Atomicwork webhook
    data = request.json
    request_id = data.get('request_id')
    requester_email = data.get('requester_email')
    message = data.get('message')

    try:
        # Parse employee request
        parser = HRDocumentParser()
        payload = parser.parse_request(message, requester_email)

        # Call Sage HR API
        response = requests.post(
            SAGE_HR_API,
            json=payload,
            headers={'Content-Type': 'application/json'}
        )

        result = response.json()

        if result['success']:
            doc = result['data']
            download_url = f"https://sage-hr-singapore.onrender.com{doc['filePath']}"

            # Format success response
            response_html = f"""
            <h3>✅ {doc['title']} Generated</h3>
            <p>Your document is ready for download.</p>
            <p><strong>Employee:</strong> {doc['employeeName']}</p>
            <p><strong>Generated:</strong> {doc['generatedAt']}</p>
            <p><a href="{download_url}" target="_blank">📥 Download {doc['title']}</a></p>
            <p><em>Click the link above to view/download your document. You can print to PDF from your browser.</em></p>
            """

            # Post to Atomicwork ticket
            post_to_atomicwork(request_id, response_html, 'success')

            return jsonify({'success': True})
        else:
            # Handle error
            error_message = f"""
            <h3>❌ Unable to Generate Document</h3>
            <p>Error: {result.get('error', 'Unknown error')}</p>
            <p>Please contact HR at hr@company.com.sg</p>
            """
            post_to_atomicwork(request_id, error_message, 'error')
            return jsonify({'success': False, 'error': result.get('error')})

    except Exception as e:
        # Handle unexpected errors
        error_message = f"""
        <h3>❌ System Error</h3>
        <p>An unexpected error occurred: {str(e)}</p>
        <p>Please contact IT support.</p>
        """
        post_to_atomicwork(request_id, error_message, 'error')
        return jsonify({'success': False, 'error': str(e)})


def post_to_atomicwork(request_id, message, status):
    """
    Post response back to Atomicwork ticket
    """
    # Implementation depends on your Atomicwork API
    # Example:
    requests.post(
        f"{ATOMICWORK_API}/tickets/{request_id}/comments",
        json={
            'body': message,
            'status': status
        },
        headers={'Authorization': f'Bearer {ATOMICWORK_API_KEY}'}
    )


if __name__ == '__main__':
    app.run(port=5000)
```

---

## 📊 Employee Request Examples & Expected API Calls

| Employee Message | Detected Type | API Payload |
|-----------------|---------------|-------------|
| "I need my February payslip" | `payslip` | `{type: "payslip", params: {month: "February", year: 2026}}` |
| "Generate my tax statement for 2025" | `tax_statement` | `{type: "tax_statement", params: {year: 2025}}` |
| "I need my insurance card" | `insurance_card` | `{type: "insurance_card", params: {}}` |
| "Employment letter for bank loan" | `employment_letter` | `{type: "employment_letter", params: {purpose: "Bank Loan"}}` |
| "Show me my January 2026 salary slip" | `payslip` | `{type: "payslip", params: {month: "January", year: 2026}}` |
| "I need IR8A" | `tax_statement` | `{type: "tax_statement", params: {year: 2025}}` |
| "MediShield card please" | `insurance_card` | `{type: "insurance_card", params: {}}` |
| "Employment verification for visa" | `employment_letter` | `{type: "employment_letter", params: {purpose: "Visa Application"}}` |

---

## 🧪 Testing Your Integration

### Test with cURL

```bash
# Test 1: Generate Payslip
curl -X POST https://sage-hr-singapore.onrender.com/api/documents/generate \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "test@company.com.sg",
    "type": "payslip",
    "country": "Singapore",
    "params": {"month": "February", "year": 2026}
  }'

# Test 2: Generate Tax Statement
curl -X POST https://sage-hr-singapore.onrender.com/api/documents/generate \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "test@company.com.sg",
    "type": "tax_statement",
    "country": "Singapore",
    "params": {"year": 2025}
  }'

# Test 3: Generate Insurance Card
curl -X POST https://sage-hr-singapore.onrender.com/api/documents/generate \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "test@company.com.sg",
    "type": "insurance_card",
    "country": "Singapore"
  }'

# Test 4: Generate Employment Letter
curl -X POST https://sage-hr-singapore.onrender.com/api/documents/generate \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "test@company.com.sg",
    "type": "employment_letter",
    "country": "Singapore",
    "params": {"purpose": "Bank Loan"}
  }'
```

---

## 🎯 Summary

### ✅ Single Endpoint Approach
- **ONE API endpoint** handles all document types
- Use `type` parameter to specify document
- Use `params` to pass document-specific details

### 🔑 Key Parameters

**Always Required:**
- `employeeId` - Employee email from Atomicwork
- `type` - Document type (`payslip`, `tax_statement`, `insurance_card`, `employment_letter`)
- `country` - Always "Singapore"

**Document-Specific:**
- Payslip: `month`, `year`
- Tax Statement: `year`
- Insurance Card: None
- Employment Letter: `purpose` (optional)

### 🚀 Integration Steps
1. Receive webhook from Atomicwork
2. Parse employee message (NLP)
3. Call Sage HR API with one payload
4. Get download URL from response
5. Post formatted response to Atomicwork ticket

---

**Ready to integrate!** 🎉

Next: Deploy to Render and I'll give you exact URLs to use.
