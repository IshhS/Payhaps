import './style.css';
import App, { init3DBackground } from './App.js';
import Login from './pages/Login.js';
import Signup from './pages/Signup.js';
import Admin from './pages/Admin.js';
import Employee from './pages/Employee.js';
import Manager from './pages/Manager.js';
import Finance from './pages/Finance.js';
import Director from './pages/Director.js';

const root = document.querySelector('#app');

// 🔥 Load Landing Page
function loadLanding() {
  root.innerHTML = App();
  init3DBackground(); // only for landing
}

// 🔥 Load Admin Dashboard
// 🔥 Load Dashboard based on component
function loadDashboard(Component, role) {
  root.innerHTML = Component();
  // If it's admin, attach admin tab events
  if (role === 'admin') attachAdminEvents();
  
  // Attach general logout event if present
  setTimeout(() => {
     document.getElementById('logout-btn')?.addEventListener('click', () => {
       localStorage.removeItem('token');
       loadLanding();
     });
  }, 100);
}

// 🔥 Load Admin Dashboard (Legacy helper)
function loadAdminDashboard() {
  loadDashboard(Admin, 'admin');
}

// 🚀 Initial load
loadLanding();


// 🔥 AUTH MODAL LOGIC (Glassmorphism Modal)
function openAuthModal(type) {
  let overlay = document.getElementById('auth-modal-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'auth-modal-overlay';
    document.body.appendChild(overlay);
    
    // Close on click outside
    overlay.addEventListener('mousedown', (e) => {
      if (e.target === overlay) closeAuthModal();
    });
  }

  // Add blur to root app features
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


// =======================
// 🔥 GLOBAL CLICK HANDLER
// =======================
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
});


// =======================
// 🔐 LOGIN LOGIC
// =======================
function attachLoginEvents() {
  const form = document.getElementById("login-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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


// =======================
// 📝 SIGNUP LOGIC
// =======================
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
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Signup failed");

      alert("Signup successful 🎉");
      openAuthModal('login'); // redirect to login
    } catch (err) {
      alert(err.message);
    }
  });
}

// =======================
// ⚙️ ADMIN EVENTS
// =======================
function attachAdminEvents() {
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

  document.getElementById('logout-btn')?.addEventListener('click', () => {
    localStorage.removeItem('token');
    loadLanding();
  });
}