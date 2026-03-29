export default function Navbar() {
  return `
    <nav class="navbar">
      <div class="nav-container">
        <div class="logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="logo-icon">
            <path d="M12 2L2 7L12 12V22L22 17V7L12 2Z" fill="url(#paint0_linear)"/>
            <path d="M12 12L2 7V17L12 22V12Z" fill="url(#paint1_linear)"/>
            <defs>
              <linearGradient id="paint0_linear" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
                <stop stop-color="#4ADE80"/>
                <stop offset="1" stop-color="#22D3EE"/>
              </linearGradient>
              <linearGradient id="paint1_linear" x1="12" y1="12" x2="12" y2="22" gradientUnits="userSpaceOnUse">
                <stop stop-color="#0F766E"/>
                <stop offset="1" stop-color="#064E3B"/>
              </linearGradient>
            </defs>
          </svg>
          PAYHAPS
        </div>
        <ul class="nav-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="#how">How it Works</a></li>
          <li><a href="#faq">FAQ</a></li>
        </ul>
        <div class="nav-actions">
          <button id="get-started-btn" class="btn btn-primary btn-glow">
            GET STARTED
          </button>
        </div>
      </div>
    </nav>
  `;
}
