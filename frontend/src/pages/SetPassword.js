export default function SetPassword() {
  return `
    <div class="set-password-page">
      <div class="set-password-bg">
        <div class="bg-glow glow-1"></div>
        <div class="bg-glow glow-2"></div>
      </div>
      <div class="glass-modal set-password-modal">
        <div class="modal-header">
          <div class="lock-icon">🔐</div>
          <h2>Set Your Password</h2>
          <p>You've been invited to join Payhaps. Create a secure password to activate your account.</p>
        </div>
        <form id="set-password-form" class="auth-form">
          <div class="input-group">
            <input type="password" placeholder="New Password" id="new-password" required minlength="6" />
          </div>
          <div class="input-group">
            <input type="password" placeholder="Confirm Password" id="confirm-password" required minlength="6" />
          </div>
          <div id="set-password-status" style="font-size:0.9rem; min-height:20px;"></div>
          <button type="submit" class="btn btn-primary btn-glow w-100 mt-3">Activate Account</button>
        </form>
        <p class="auth-switch" style="margin-top:20px;">
          Already set your password? 
          <span id="go-login-from-setpw" class="switch-link">Log in</span>
        </p>
      </div>
    </div>
  `;
}
