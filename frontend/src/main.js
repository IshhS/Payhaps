import './style.css';
import App, { init3DBackground } from './App.js';
import Login from './pages/Login.js';
import Signup from './pages/Signup.js';
import SetPassword from './pages/SetPassword.js';
import Admin from './pages/Admin.js';
import Employee from './pages/Employee.js';
import Manager from './pages/Manager.js';
import Finance from './pages/Finance.js';
import Director from './pages/Director.js';

const API_BASE = 'http://localhost:5000/api';
const root = document.querySelector('#app');

// ── Helper: get auth headers ────────────────────────────────────
function authHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
  };
}

// ──────────────────────────────────────────────────────────────────
// 🔥 PAGE LOADERS
// ──────────────────────────────────────────────────────────────────

function loadLanding() {
  root.innerHTML = App();
  init3DBackground();
}

function loadDashboard(Component, role) {
  root.innerHTML = Component();
  if (role === 'admin') attachAdminEvents();
  if (role === 'employee') attachEmployeeEvents();
  if (role === 'manager' || role === 'finance' || role === 'director') attachApproverEvents(role);
  
  setTimeout(() => {
     document.getElementById('logout-btn')?.addEventListener('click', () => {
       localStorage.removeItem('token');
       navigateTo('/');
     });
  }, 100);
}

function loadAdminDashboard() {
  loadDashboard(Admin, 'admin');
}

function loadSetPasswordPage() {
  // Render the set-password page as a full page (not a modal)
  root.innerHTML = SetPassword();
  attachSetPasswordEvents();
}

// ──────────────────────────────────────────────────────────────────
// 🧭 SIMPLE CLIENT-SIDE ROUTER
// ──────────────────────────────────────────────────────────────────

function navigateTo(path) {
  window.history.pushState({}, '', path);
  handleRoute();
}

function handleRoute() {
  const path = window.location.pathname;
  const params = new URLSearchParams(window.location.search);

  if (path === '/set-password' && params.get('token')) {
    loadSetPasswordPage();
  } else {
    loadLanding();
  }
}

// Handle browser back/forward
window.addEventListener('popstate', handleRoute);

// 🚀 Initial load — check current URL
handleRoute();


// ──────────────────────────────────────────────────────────────────
// 🔥 AUTH MODAL LOGIC
// ──────────────────────────────────────────────────────────────────

function openAuthModal(type) {
  let overlay = document.getElementById('auth-modal-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'auth-modal-overlay';
    document.body.appendChild(overlay);
    
    overlay.addEventListener('mousedown', (e) => {
      if (e.target === overlay) closeAuthModal();
    });
  }

  const landing = document.querySelector('.landing-page');
  const nav = document.querySelector('.navbar');
  if (landing) landing.classList.add('blur-background');
  if (nav) nav.classList.add('blur-background');

  overlay.innerHTML = type === 'login' ? Login() : Signup();
  overlay.classList.add('show');

  if (type === 'login') attachLoginEvents();
  else attachSignupEvents();
}

function closeAuthModal() {
  const overlay = document.getElementById('auth-modal-overlay');
  if (overlay) overlay.classList.remove('show');
  
  const landing = document.querySelector('.landing-page');
  const nav = document.querySelector('.navbar');
  if (landing) landing.classList.remove('blur-background');
  if (nav) nav.classList.remove('blur-background');
}


// ──────────────────────────────────────────────────────────────────
// 🔥 GLOBAL CLICK HANDLER
// ──────────────────────────────────────────────────────────────────

document.addEventListener("click", (e) => {
  const getStartedBtn = e.target.closest('#get-started-btn');
  const primaryBtn = e.target.closest('.btn-primary');

  if (getStartedBtn) {
    e.preventDefault();
    openAuthModal('login');
    return;
  }

  if (primaryBtn) {
    const text = (primaryBtn.innerText || primaryBtn.textContent || "").toUpperCase();
    if (text.includes('GET STARTED') || text.includes('REQUEST A DEMO')) {
      e.preventDefault();
      openAuthModal('login');
      return;
    }
  }

  if (e.target.id === "go-signup" || e.target.closest('#go-signup')) {
    openAuthModal('signup');
  }

  if (e.target.id === "go-login" || e.target.closest('#go-login')) {
    openAuthModal('login');
  }

  // "Log in" link from set-password page
  if (e.target.id === "go-login-from-setpw" || e.target.closest('#go-login-from-setpw')) {
    navigateTo('/');
    setTimeout(() => openAuthModal('login'), 300);
  }
});


// ──────────────────────────────────────────────────────────────────
// 🔐 LOGIN LOGIC
// ──────────────────────────────────────────────────────────────────

function attachLoginEvents() {
  const form = document.getElementById("login-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Login failed");

      alert("Login successful 🚀");
      localStorage.setItem("token", data.token);

      closeAuthModal();

      if (role === "admin") {
        loadAdminDashboard();
      } else if (role === "employee") {
        loadDashboard(Employee, role);
      } else if (role === "manager") {
        loadDashboard(Manager, role);
      } else if (role === "finance") {
        loadDashboard(Finance, role);
      } else if (role === "director") {
        loadDashboard(Director, role);
      } else {
        alert("Unknown role.");
      }
    } catch (err) {
      alert(err.message);
    }
  });
}


// ──────────────────────────────────────────────────────────────────
// 📝 SIGNUP LOGIC
// ──────────────────────────────────────────────────────────────────

function attachSignupEvents() {
  const form = document.getElementById("signup-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const body = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
      companyName: document.getElementById("companyName").value,
      country: document.getElementById("country").value,
    };

    try {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Signup failed");

      alert("Signup successful 🎉");
      openAuthModal('login');
    } catch (err) {
      alert(err.message);
    }
  });
}


// ──────────────────────────────────────────────────────────────────
// 🔑 SET PASSWORD LOGIC
// ──────────────────────────────────────────────────────────────────

function attachSetPasswordEvents() {
  const form = document.getElementById("set-password-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const password = document.getElementById("new-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    const statusDiv = document.getElementById("set-password-status");
    const token = new URLSearchParams(window.location.search).get("token");

    // Validation
    if (!token) {
      statusDiv.innerHTML = '<span style="color:#ef4444;">❌ Invalid or missing invite token.</span>';
      return;
    }

    if (password.length < 6) {
      statusDiv.innerHTML = '<span style="color:#ef4444;">❌ Password must be at least 6 characters.</span>';
      return;
    }

    if (password !== confirmPassword) {
      statusDiv.innerHTML = '<span style="color:#ef4444;">❌ Passwords do not match.</span>';
      return;
    }

    statusDiv.innerHTML = '<span style="color:#94a3b8;">Setting your password...</span>';

    try {
      const res = await fetch(`${API_BASE}/auth/set-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.msg || data.error || "Failed to set password");
      }

      statusDiv.innerHTML = '<span style="color:#10b981;">✅ Password set successfully! Redirecting to login...</span>';
      
      // Disable the form
      form.querySelectorAll('input, button').forEach(el => el.disabled = true);

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigateTo('/');
        setTimeout(() => openAuthModal('login'), 300);
      }, 2000);

    } catch (err) {
      statusDiv.innerHTML = `<span style="color:#ef4444;">❌ ${err.message}</span>`;
    }
  });
}


// ──────────────────────────────────────────────────────────────────
// ⚙️ ADMIN EVENTS
// ──────────────────────────────────────────────────────────────────

function attachAdminEvents() {
  // ── Tab switching ──────────────────────────────────────────────
  const tabs = document.querySelectorAll('.sidebar-nav li');
  const panes = document.querySelectorAll('.tab-pane');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
       tabs.forEach(t => t.classList.remove('active'));
       panes.forEach(p => p.classList.remove('active'));
       
       tab.classList.add('active');
       const targetId = 'tab-' + tab.dataset.tab;
       document.getElementById(targetId).classList.add('active');

       // Lazy load data for tabs
       if (tab.dataset.tab === 'hierarchy') loadHierarchyOptions();
       if (tab.dataset.tab === 'approvals') loadAdminExpenses();
       if (tab.dataset.tab === 'workflows') loadWorkflowSteps();
    });
  });

  // ── Logout ─────────────────────────────────────────────────────
  document.getElementById('logout-btn')?.addEventListener('click', () => {
    localStorage.removeItem('token');
    navigateTo('/');
  });

  // ── Invite User form ──────────────────────────────────────────
  const inviteForm = document.getElementById('invite-user-form');
  if (inviteForm) {
    inviteForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('invite-name').value.trim();
      const email = document.getElementById('invite-email').value.trim();
      const role = document.getElementById('invite-role').value;
      const statusDiv = document.getElementById('invite-status');

      if (!name || !email || !role) {
        statusDiv.innerHTML = '<span style="color:#ef4444;">Please fill all fields.</span>';
        return;
      }

      statusDiv.innerHTML = '<span style="color:#94a3b8;">Sending invite...</span>';

      try {
        const res = await fetch(`${API_BASE}/users/invite`, {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify({ name, email, role }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.msg || data.error || 'Failed to invite user');
        }

        statusDiv.innerHTML = `<span style="color:#10b981;">✅ ${data.message}</span>`;
        inviteForm.reset();

        // Refresh the user list
        loadInvitedUsers();
      } catch (err) {
        statusDiv.innerHTML = `<span style="color:#ef4444;">❌ ${err.message}</span>`;
      }
    });
  }

  // ── Hierarchy User Assignment form ────────────────────────────
  const hierarchyForm = document.getElementById('hierarchy-form');
  if (hierarchyForm) {
    hierarchyForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const userId = document.getElementById('hierarchy-user').value;
      const managerId = document.getElementById('hierarchy-manager').value;
      
      if (!userId || !managerId) return alert('Please select both a user and a manager/approver');
      
      try {
        const res = await fetch(`${API_BASE}/users/${userId}`, {
          method: 'PUT',
          headers: authHeaders(),
          body: JSON.stringify({ manager_id: managerId })
        });
        if (!res.ok) throw new Error('Failed to update user assigned manager');
        
        alert('Hierarchy mapping saved successfully!');
        loadHierarchyOptions(); // Refresh the dropdowns and tree
      } catch (err) {
        alert(err.message);
      }
    });
  }

  // ── Workflow Configuration form ────────────────────────────
  const workflowForm = document.getElementById('workflow-form');
  if (workflowForm) {
    workflowForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const rawRole = document.getElementById('workflow-role').value;
      const role = rawRole;
      const is_manager_approver = (rawRole === 'MANAGER');

      try {
        // Fetch existing first to find order
        const res = await fetch(`${API_BASE}/workflow-steps`, { headers: authHeaders() });
        const existing = await res.json();
        
        const newStep = {
          step_order: existing.length + 1,
          role: role,
          is_manager_approver
        };
        
        const payload = { steps: [...existing, newStep] };

        const saveRes = await fetch(`${API_BASE}/workflow-steps`, {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify(payload)
        });

        if (!saveRes.ok) throw new Error('Failed to append workflow step');
        
        loadWorkflowSteps();
      } catch (err) {
        alert(err.message);
      }
    });

    document.getElementById('preset-workflow-btn')?.addEventListener('click', async () => {
       if(!confirm('Reset to Manager -> Finance -> Director?')) return;
       try {
         const payload = {
            steps: [
              { step_order: 1, role: 'MANAGER', is_manager_approver: true },
              { step_order: 2, role: 'FINANCE', is_manager_approver: false },
              { step_order: 3, role: 'DIRECTOR', is_manager_approver: false }
            ]
         };
         await fetch(`${API_BASE}/workflow-steps`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify(payload)
         });
         loadWorkflowSteps();
       } catch(e) { alert(e.message); }
    });
  }

  // ── Load invited users on page load ────────────────────────────
  loadInvitedUsers();
}

async function loadWorkflowSteps() {
  const list = document.getElementById('workflow-steps-list');
  if (!list) return;

  try {
    const res = await fetch(`${API_BASE}/workflow-steps`, { headers: authHeaders() });
    const steps = await res.json();
    
    if (steps.length === 0) {
      list.innerHTML = '<span style="color:#ef4444; font-weight:500;">❌ No Workflow Configured. Expenses cannot be submitted.</span>';
      return;
    }

    list.innerHTML = steps.map((s, i) => `
      <div style="background:white; padding:12px 18px; border-radius:6px; box-shadow:0 1px 3px rgba(0,0,0,0.1); display:flex; align-items:center;">
         <div style="background:#3b82f6; color:white; border-radius:50%; width:28px; height:28px; display:flex; align-items:center; justify-content:center; font-weight:bold; margin-right:15px;">${i+1}</div>
         <strong style="font-size:1rem; color:#0f172a;">${s.is_manager_approver ? 'Direct Manager' : s.role}</strong>
      </div>
    `).join('<div style="color:#94a3b8; font-size:1.2rem; text-align:center;">↓</div>');
  } catch (err) {
    list.innerHTML = `<span style="color:red">Failed to load workflows: ${err.message}</span>`;
  }
}


// ──────────────────────────────────────────────────────────────────
// 📋 LOAD INVITED USERS
// ──────────────────────────────────────────────────────────────────

async function loadInvitedUsers() {
  const container = document.getElementById('invited-users-list');
  if (!container) return;

  try {
    const res = await fetch(`${API_BASE}/users`, {
      headers: authHeaders(),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || data.error || 'Failed to load users');

    const users = Array.isArray(data) ? data : (data.users || []);

    if (users.length === 0) {
      container.innerHTML = '<p style="color:#94a3b8; font-style:italic;">No users invited yet.</p>';
      return;
    }

    const roleColors = {
      ADMIN: '#8b5cf6',
      MANAGER: '#3b82f6',
      EMPLOYEE: '#10b981',
      FINANCE: '#f59e0b',
      DIRECTOR: '#ef4444',
    };

    container.innerHTML = `
      <table style="width:100%; border-collapse:collapse; font-size:0.9rem;">
        <thead>
          <tr style="border-bottom: 2px solid #e2e8f0; text-align:left;">
            <th style="padding:10px 8px;">Name</th>
            <th style="padding:10px 8px;">Email</th>
            <th style="padding:10px 8px;">Role</th>
            <th style="padding:10px 8px;">Status</th>
          </tr>
        </thead>
        <tbody>
          ${users.map(u => `
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding:10px 8px; font-weight:500;">${u.name}</td>
              <td style="padding:10px 8px; color:#64748b;">${u.email}</td>
              <td style="padding:10px 8px;">
                <span style="background:${roleColors[u.role] || '#94a3b8'}; color:white; padding:2px 10px; border-radius:12px; font-size:0.78rem;">
                  ${u.role}
                </span>
              </td>
              <td style="padding:10px 8px;">
                <span style="color: ${u.status === 'ACTIVE' ? '#10b981' : '#f59e0b'}; font-weight:500;">
                  ${u.status === 'ACTIVE' ? '● Active' : '◌ Pending'}
                </span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  } catch (err) {
    container.innerHTML = `<p style="color:#ef4444;">Error: ${err.message}</p>`;
  }
}

// ──────────────────────────────────────────────────────────────────
// 🏢 ADMIN: HIERARCHY & EXPENSES
// ──────────────────────────────────────────────────────────────────

async function loadHierarchyOptions() {
  try {
    const res = await fetch(`${API_BASE}/users`, { headers: authHeaders() });
    const users = await res.json();
    
    const userSelect = document.getElementById('hierarchy-user');
    const managerSelect = document.getElementById('hierarchy-manager');
    if (!userSelect || !managerSelect) return;

    let options = '<option value="" disabled selected>Select...</option>';
    let managerOptions = '<option value="" disabled selected>Select Approver...</option>';
    
    users.forEach(u => {
      const label = `${u.name} (${u.role})`;
      options += `<option value="${u.id}">${label}</option>`;
      if (u.role === 'MANAGER' || u.role === 'FINANCE' || u.role === 'DIRECTOR' || u.role === 'ADMIN') {
        managerOptions += `<option value="${u.id}">${label}</option>`;
      }
    });

    userSelect.innerHTML = options;
    managerSelect.innerHTML = managerOptions;

    buildHierarchyTree(users);
  } catch (err) {
    console.error("Failed to load hierarchy options", err);
  }
}

function buildHierarchyTree(users) {
  const treeContainer = document.getElementById('hierarchy-tree');
  if (!treeContainer) return;

  const roleEmoji = {
    ADMIN: '👑', DIRECTOR: '👑', FINANCE: '💰', MANAGER: '👔', EMPLOYEE: '👤'
  };

  const userMap = {};
  users.forEach(u => userMap[u.id] = { ...u, children: [] });
  
  const roots = [];
  users.forEach(u => {
    if (u.manager_id && userMap[u.manager_id]) {
      userMap[u.manager_id].children.push(userMap[u.id]);
    } else {
      roots.push(userMap[u.id]);
    }
  });

  function renderNode(node) {
    let html = `<li><div class="node ${node.role.toLowerCase()}-node">${roleEmoji[node.role] || '👤'} ${node.role}: ${node.name}</div>`;
    if (node.children.length > 0) {
      html += `<ul>${node.children.map(renderNode).join('')}</ul>`;
    }
    html += `</li>`;
    return html;
  }

  const companyName = users.length > 0 && users[0].Company ? users[0].Company.name : 'Organization';

  if (roots.length === 0) {
    treeContainer.innerHTML = '<p>No users found in company.</p>';
  } else {
    treeContainer.innerHTML = `<ul><li><div class="node admin-node" style="background:#f1f5f9; border-color:#94a3b8; color:#0f172a;">🏢 Organization: ${companyName}</div><ul>${roots.map(renderNode).join('')}</ul></li></ul>`;
  }
}

async function loadAdminExpenses() {
  const list = document.getElementById('admin-expenses-list');
  const details = document.getElementById('admin-expense-details');
  if (!list) return;

  list.innerHTML = '<p class="text-muted-dark" style="font-style:italic;">Loading expenses...</p>';

  try {
    const res = await fetch(`${API_BASE}/expenses/all`, { headers: authHeaders() });
    const expenses = await res.json();
    
    if (expenses.length === 0) {
      list.innerHTML = '<p class="text-muted-dark">No expenses submitted in this company.</p>';
      return;
    }

    list.innerHTML = expenses.map(exp => `
      <li class="approval-item" onclick="showAdminExpenseDetails(${exp.id})" style="cursor:pointer;">
         <div class="app-left">
            <strong>${exp.category}</strong>
            <span class="app-meta">${exp.submitter ? exp.submitter.name : 'Unknown'} • $${exp.amount}</span>
         </div>
         <div class="app-right">
            <span class="badge ${exp.status === 'APPROVED' ? 'badge-success' : exp.status === 'REJECTED' ? 'badge-danger' : 'badge-pending'}">${exp.status}</span>
         </div>
      </li>
    `).join('');

    // store for details click
    window.adminExpensesData = expenses;
  } catch(err) {
    list.innerHTML = `<p style="color:red">Error loading expenses: ${err.message}</p>`;
  }
}

window.showAdminExpenseDetails = function(expId) {
  const exp = window.adminExpensesData?.find(e => e.id === expId);
  const details = document.getElementById('admin-expense-details');
  if (!exp || !details) return;

  const dateStr = new Date(exp.date).toLocaleDateString();

  let chainHtml = '';
  if (exp.approvals && exp.approvals.length > 0) {
    chainHtml = exp.approvals.map(app => {
      let icon = '⏳';
      let cls = 'pending';
      let text = 'Awaiting Approval';
      if (app.status === 'APPROVED') { icon = '✓'; cls = 'completed'; text = 'Approved on ' + new Date(app.acted_at).toLocaleDateString(); }
      else if (app.status === 'REJECTED') { icon = '❌'; cls = 'locked'; text = 'Rejected'; }
      else if (!app.is_active) { icon = '🔒'; cls = 'locked'; text = 'Pending previous step'; }

      return `
        <div class="chain-step ${cls}">
           <div class="step-dot">${icon}</div>
           <div class="step-info">
              <strong>${app.approver ? app.approver.name : 'Approver'} (${app.approver?.role})</strong>
              <span>${text}</span>
           </div>
        </div>
      `;
    }).join('');
  } else {
    chainHtml = '<p style="color:#64748b; font-size:0.9rem;">No dynamic approval chain generated.</p>';
  }

  details.innerHTML = `
    <h4>Receipt & Details</h4>
    <div class="receipt-box mt-3 mb-4">
       <div style="width:100%; height:150px; background:#f1f5f9; display:flex; align-items:center; justify-content:center; border-radius:8px; color:#94a3b8; font-style:italic; border: 1px dashed #cbd5e1;">(No Receipt Image Attached)</div>
    </div>
    <div class="info-grid">
       <p><strong>Submitter:</strong> ${exp.submitter?.name} (${exp.submitter?.role})</p>
       <p><strong>Amount:</strong> $${exp.amount} ${exp.original_currency || 'USD'}</p>
       <p><strong>Category:</strong> ${exp.category}</p>
       <p><strong>Date:</strong> ${dateStr}</p>
       <p><strong>Description:</strong> ${exp.description || 'N/A'}</p>
    </div>
    <h4 class="mt-4 mb-3">Approval Chain Workflow</h4>
    <div class="workflow-chain">
      ${chainHtml}
    </div>
  `;
}

// ──────────────────────────────────────────────────────────────────
// 💼 EMPLOYEE EVENTS
// ──────────────────────────────────────────────────────────────────

function attachEmployeeEvents() {
  const ocrInput = document.getElementById('receipt-upload');
  if (ocrInput) {
    ocrInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const loadingBlock = document.getElementById('ocr-loading');
      const errorBlock = document.getElementById('ocr-error');
      loadingBlock.style.display = 'block';
      errorBlock.style.display = 'none';
      
      const formData = new FormData();
      formData.append('receipt', file);

      try {
        const res = await fetch(`${API_BASE}/expenses/ocr`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: formData
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to scan receipt');

        const { parsed } = data;
        
        // Auto-fill the form
        if (parsed.amount > 0) document.getElementById('exp-amount').value = parsed.amount;
        
        // Find matching currency in select dropdown
        const currencySelect = document.getElementById('exp-currency');
        Array.from(currencySelect.options).forEach(opt => {
          if (opt.value === parsed.companyCurrency) opt.selected = true;
        });

        // Try to match category
        if (parsed.category) {
          const catSelect = document.getElementById('exp-category');
          Array.from(catSelect.options).forEach(opt => {
            if (opt.value === parsed.category) opt.selected = true;
          });
        }
        
        if (parsed.date) document.getElementById('exp-date').value = parsed.date;
        if (parsed.description) document.getElementById('exp-desc').value = parsed.description;

        // Reset file input
        ocrInput.value = '';
        alert('✨ Receipt scanned! Please review the auto-filled details.');
        
      } catch (err) {
        errorBlock.style.display = 'block';
        errorBlock.innerText = `❌ ${err.message}`;
      } finally {
        loadingBlock.style.display = 'none';
      }
    });
  }

  const form = document.getElementById('employee-expense-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const amount = document.getElementById('exp-amount').value;
      const currency = document.getElementById('exp-currency').value;
      const category = document.getElementById('exp-category').value;
      const date = document.getElementById('exp-date').value;
      const description = document.getElementById('exp-desc').value;

      try {
        const res = await fetch(`${API_BASE}/expenses`, {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify({ amount, currency, category, date, description })
        });
        const data = await res.json();
        
        // Handle specifically no workflow error
        if(!res.ok) {
           throw new Error(data.error || 'Failed to submit expense');
        }

        alert('Expense submitted successfully! Approval chain automatically generated.');
        form.reset();
        loadEmployeeExpenses();
      } catch (err) {
        alert(err.message + "\\n\\nPlease make sure Admin has assigned you to a manager and updated the Approval Workflow steps.");
      }
    });
  }
  loadEmployeeExpenses();
}

async function loadEmployeeExpenses() {
  const list = document.getElementById('employee-expenses-list');
  if (!list) return;

  try {
    const res = await fetch(`${API_BASE}/expenses/my`, { headers: authHeaders() });
    const expenses = await res.json();

    if (expenses.length === 0) {
      list.innerHTML = '<p class="text-muted-dark" style="font-size:0.9rem;">No expenses submitted yet. Fill out the form above to submit your first receipt.</p>';
      return;
    }

    list.innerHTML = expenses.map(exp => `
      <li class="approval-item">
         <div class="app-left">
            <strong>${exp.category}</strong>
            <span class="app-meta">$${exp.amount} • ${new Date(exp.date).toLocaleDateString()}</span>
         </div>
         <div class="app-right">
            <span class="badge ${exp.status === 'APPROVED' ? 'badge-success' : exp.status === 'REJECTED' ? 'badge-danger' : 'badge-pending'}">${exp.status}</span>
         </div>
      </li>
    `).join('');
  } catch (err) {
    list.innerHTML = `<p style="color:red">Failed to load your expenses</p>`;
  }
}

// ──────────────────────────────────────────────────────────────────
// 👔 APPROVER EVENTS (MANAGER, FINANCE, DIRECTOR)
// ──────────────────────────────────────────────────────────────────

function attachApproverEvents(role) {
  loadPendingApprovals();
}

async function loadPendingApprovals() {
  const list = document.getElementById('pending-approvals-list');
  if (!list) return;

  try {
    const res = await fetch(`${API_BASE}/expenses/pending-approvals`, { headers: authHeaders() });
    const approvals = await res.json();

    if (approvals.length === 0) {
      list.innerHTML = '<p class="text-muted-dark" style="font-style:italic;">You currently have no expenses awaiting your review.</p>';
      return;
    }

    list.innerHTML = approvals.map(app => {
      const exp = app.Expense;
      const submitterName = exp?.submitter ? exp.submitter.name : 'Unknown User';
      const category = exp?.category || 'General';
      const amount = exp?.amount || '0.00';
      const desc = exp?.description || 'No description provided';
      const expId = exp?.id;
      
      return `
      <li class="approval-item" style="flex-direction:column; align-items:flex-start; padding: 20px;">
         <div style="display:flex; justify-content:space-between; width:100%; border-bottom:1px solid #e2e8f0; padding-bottom:12px; margin-bottom:12px;">
           <div class="app-left">
              <strong style="font-size:1.1rem;">${category}</strong>
              <span class="app-meta" style="margin-top:5px; display:block;">Submitted by <strong>${submitterName}</strong> • $${amount}</span>
           </div>
           <div class="app-right" style="display:flex; gap:10px;">
              <button class="btn btn-primary" onclick="actOnExpense(${expId}, 'approve')" style="padding: 8px 18px; font-size:0.85rem; border-radius:8px;">Approve ✓</button>
              <button class="btn btn-danger" onclick="actOnExpense(${expId}, 'reject')" style="padding: 8px 18px; background:#ef4444; color:white; border:none; border-radius:8px; font-size:0.85rem; cursor:pointer;">Reject ❌</button>
           </div>
         </div>
         <div style="font-size:0.9rem; color:#64748b; line-height:1.5;">
           <p><strong>Description:</strong> ${desc}</p>
         </div>
      </li>
    `}).join('');
  } catch (err) {
    list.innerHTML = `<p style="color:#ef4444">Failed to load pending approvals: ${err.message}</p>`;
  }
}

window.actOnExpense = async function(expenseId, action) {
  if (!confirm(`Are you sure you want to ${action.toUpperCase()} this expense?`)) return;
  
  try {
    const res = await fetch(`${API_BASE}/expenses/${expenseId}/${action}`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ comments: `Action auto-submitted: ${action}` })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Action failed');
    
    alert(`Success: ${data.message || 'Expense updated'}`);
    loadPendingApprovals();
  } catch (err) {
    alert(err.message);
  }
}