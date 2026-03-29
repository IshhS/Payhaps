export default function Login() {
  return `
    <div class="glass-modal">
      <div class="modal-header">
         <h2>Welcome Back</h2>
         <p>Log in to continue to Payhaps</p>
      </div>
      <form id="login-form" class="auth-form">
        <div class="input-group">
          <select id="role" required>
            <option value="" disabled selected>Select Role</option>
            <option value="admin">Admin</option>
            <option value="employee">Employee</option>
            <option value="manager">Manager</option>
            <option value="finance">Finance</option>
            <option value="director">Director</option>
          </select>
        </div>
        <div class="input-group">
          <input type="email" placeholder="Email Address" id="email" required />
        </div>
        <div class="input-group">
          <input type="password" placeholder="Password" id="password" required />
        </div>
        <button type="submit" class="btn btn-primary btn-glow w-100 mt-3">Login to Dashboard</button>
      </form>

      <p class="auth-switch">Don't have an account? 
        <span id="go-signup" class="switch-link">Sign up</span>
      </p>
    </div>
  `;
}