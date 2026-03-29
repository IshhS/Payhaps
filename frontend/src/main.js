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

  // ── Load invited users on page load ────────────────────────────
  loadInvitedUsers();
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