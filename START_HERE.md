# 🚀 START HERE - Sage HR Mock System

## ⚡ Quick Start (3 Steps)

### 1. Start the Server
```bash
cd ~/sage-hr-mock
npm start
```

### 2. Open Web UI
Visit: **http://localhost:3000**

### 3. Test APIs
```bash
./demo-test.sh
```

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| **START_HERE.md** | ← You are here! Quick orientation |
| **README.md** | Complete API documentation |
| **QUICK_START.md** | Quick reference guide for testing |
| **BODYNITS_DEMO.md** | Full demo script for Friday meeting |
| **DEMO_COMMANDS.txt** | Copy-paste commands for demo |
| **SUMMARY.md** | Implementation summary |

---

## 🎯 What This System Does

**A complete NLP-driven HR/ESM platform** that demonstrates:

1. ✅ **Leave Management** - Auto-approve based on duration
2. 💰 **Expense Reimbursement** - Auto-approve based on amount
3. ⏰ **Attendance Tracking** - Clock in/out with timestamp
4. 🛒 **Purchase Orders** - Create POs with vendor tracking
5. 📄 **Invoice Processing** - 3-way matching with POs
6. 🤖 **NLP Webhook** - Natural language request processing

---

## 🎬 For Bodynits Demo (Friday 13th Feb)

1. **Read**: `BODYNITS_DEMO.md` for full demo script
2. **Use**: `DEMO_COMMANDS.txt` for copy-paste commands
3. **Show**: Web UI at http://localhost:3000
4. **Test**: Run `./demo-test.sh` before meeting

---

## 🔧 Quick Commands

```bash
# Start server
npm start

# Test all endpoints
./test-api.sh

# Quick demo test (6 use cases)
./demo-test.sh

# View API health
curl http://localhost:3000/api/health

# Stop server
pkill -f "node server.js"
```

---

## 🌐 Access Points

- **Web UI**: http://localhost:3000
- **API Base**: http://localhost:3000/api
- **NLP Webhook**: http://localhost:3000/api/webhook/nlp
- **Health Check**: http://localhost:3000/api/health

---

## 📊 Sample Request

```bash
curl -X POST http://localhost:3000/api/webhook/nlp \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Apply for 2 days annual leave from 2026-02-20 to 2026-02-21",
    "employeeId": "EMP001"
  }'
```

**Response:**
```json
{
  "success": true,
  "intent": "apply_leave",
  "message": "Leave request auto-approved! 2 day(s) of annual leave...",
  "data": {
    "id": "LV-xxx",
    "status": "approved",
    "approver": "AUTO"
  }
}
```

---

## 🎯 6 ESM Use Cases Ready

1. **Leave Application** - Auto-approved ≤ 2 days
2. **Expense Auto-Approval** - Auto-approved ≤ $500
3. **Expense Manual Approval** - Pending > $500
4. **Attendance Tracking** - Clock in/out
5. **Purchase Order** - Create with vendor tracking
6. **Invoice Matching** - 3-way PO matching

---

## ✅ Pre-Demo Checklist

- [ ] Server running: `npm start`
- [ ] Web UI accessible: http://localhost:3000
- [ ] APIs tested: `./demo-test.sh`
- [ ] Demo script reviewed: `BODYNITS_DEMO.md`
- [ ] Commands ready: `DEMO_COMMANDS.txt`

---

## 🆘 Troubleshooting

**Server won't start?**
```bash
kill -9 $(lsof -t -i:3000)
npm start
```

**API not responding?**
```bash
curl http://localhost:3000/api/health
```

**Need to reset data?**
```bash
# Just restart the server (data is in-memory)
pkill -f "node server.js"
npm start
```

---

## 🎉 You're Ready!

The system is **fully functional** and **demo-ready**.

**Next Steps:**
1. Review `BODYNITS_DEMO.md` for the meeting script
2. Practice with `DEMO_COMMANDS.txt`
3. Test everything with `./demo-test.sh`

**Good luck with the demo! 🚀**
