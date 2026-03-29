import './style.css';
import App, { init3DBackground } from './App.js';
import Login from './pages/Login.js';
import Signup from './pages/Signup.js';

const root = document.querySelector('#app');

// 🔥 Load Landing Page
function loadLanding() {
  root.innerHTML = App();
  init3DBackground(); // only for landing
}

// 🔥 Load Login Page
function loadLogin() {
  root.innerHTML = Login();
  attachLoginEvents();
}

// 🔥 Load Signup Page
function loadSignup() {
  root.innerHTML = Signup();
  attachSignupEvents();
}

// 🚀 Initial load
loadLanding();


// =======================
// 🔥 GLOBAL CLICK HANDLER
// =======================
document.addEventListener("click", (e) => {
  if (e.target.id === "get-started-btn") {
    loadLogin();
  }

  if (e.target.id === "go-signup") {
    loadSignup();
  }

  if (e.target.id === "go-login") {
    loadLogin();
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

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.msg);

      alert("Login successful 🚀");

      localStorage.setItem("token", data.token);

      // 👉 Next: redirect to dashboard
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

      if (!res.ok) throw new Error(data.msg);

      alert("Signup successful 🎉");

      loadLogin(); // redirect to login
    } catch (err) {
      alert(err.message);
    }
  });
}