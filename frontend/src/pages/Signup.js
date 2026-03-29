export default function Signup() {
  return `
    <div class="auth-container">
      <h2>Signup</h2>
      <form id="signup-form">
        <input placeholder="Name" id="name" required />
        <input type="email" placeholder="Email" id="email" required />
        <input type="password" placeholder="Password" id="password" required />
        <input placeholder="Company" id="companyName" required />
        <input placeholder="Country" id="country" required />
        <button type="submit">Signup</button>
      </form>

      <p>Already have an account? 
        <span id="go-login" style="color:blue;cursor:pointer;">Login</span>
      </p>
    </div>
  `;
}