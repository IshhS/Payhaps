const fetch = require("node-fetch"); // Or use native fetch
(async () => {
    try {
        // 1. Login as Admin
        const loginRes = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "admin@payhaps.com", password: "password123", role: "admin" })
        });
        const loginData = await loginRes.json();
        
        if (!loginData.token) {
           console.log("Login Failed, cannot test workflow. Getting first user...");
           // Query DB directly
           const { User } = require("./models");
           const admin = await User.findOne({ where: { role: 'ADMIN' } });
           if(!admin) return console.log("No admin found in DB");
           const jwt = require("jsonwebtoken");
           const token = jwt.sign({ id: admin.id, role: admin.role, company_id: admin.company_id }, process.env.JWT_SECRET || 'secret');
           
           testSave(token);
           return;
        }
        testSave(loginData.token);
    } catch (e) { console.error(e) }

    async function testSave(token) {
        console.log("Testing POST /api/workflow-steps...");
        const payload = {
            steps: [
              { step_order: 1, role: 'MANAGER', is_manager_approver: true },
              { step_order: 2, role: 'FINANCE', is_manager_approver: false },
              { step_order: 3, role: 'DIRECTOR', is_manager_approver: false }
            ]
        };
        const res = await fetch("http://localhost:5000/api/workflow-steps", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        console.log("Status:", res.status);
        console.log("Response:", data);
        process.exit();
    }
})();
