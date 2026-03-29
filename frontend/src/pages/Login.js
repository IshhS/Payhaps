export default function Login() {
  return `
    <div class="auth-container">
      <h2>Login</h2>
      <form id="login-form">
        <input type="email" placeholder="Email" id="email" required />
        <input type="password" placeholder="Password" id="password" required />
        <button type="submit">Login</button>
      </form>

      <p>Don't have an account? 
        <span id="go-signup" style="color:blue;cursor:pointer;">Signup</span>
      </p>
    </div>
  `;
}