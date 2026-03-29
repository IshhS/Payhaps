import Navbar from './Navbar.js';
import * as THREE from 'three';

// 1. Export your UI / HTML structure
export default function App() {
  return `
    <div class="app-container">
      ${Navbar()}
      <main class="landing-page">
        <div class="hero-background">
          <canvas id="hero-3d-canvas" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; pointer-events: none;"></canvas>
        </div>
        
        <section class="hero-section">
          <div class="hero-content">
            <h1 class="hero-title">REIMAGINE<br/>REIMBURSEMENT<br/>CHAOS.</h1>
            <p class="hero-subtitle">The Smarter Way to Track, Approve, and Get Paid. Automated expense flows for modern teams.</p>
            <button class="btn btn-primary btn-glow">GET STARTED</button>
            
            <div class="features-row">
              <div class="glass-card feature-mini">
                <div class="icon-header">
                  <span class="icon">👨‍💼</span>
                  <h5>Multi-Level Approvals</h5>
                </div>
                <p>Centralize and modern workflow-stacked stacked workflow.</p>
                <div class="approval-dots">
                  <div class="dot-row"><span>Manager</span><div class="dots"><i class="active"></i><i></i><i></i></div></div>
                  <div class="dot-row"><span>Finance</span><div class="dots"><i class="active"></i><i class="active"></i><i></i></div></div>
                  <div class="dot-row"><span>Director</span><div class="dots"><i class="active"></i><i class="active"></i><i class="active"></i></div></div>
                </div>
              </div>
              <div class="glass-card feature-mini secondary">
                <div class="icon-header">
                   <span class="icon">📋</span>
                   <h5>Flexible Approval Rules</h5>
                </div>
                <p>Flexible in cards to enhance and approaches to situations.</p>
              </div>
              <div class="glass-card feature-mini secondary">
                <div class="icon-header">
                   <span class="icon">⏱️</span>
                   <h5>Real-time Status Tracking</h5>
                </div>
                <p>Real-time status tracking for the status entities.</p>
              </div>
            </div>
          </div>
          
          <div class="hero-visuals">
            <div class="floating-group">
               <div class="glass-card dark-card cc-card">
                  <div class="cc-header">
                    <span>PAYHAPS SMARTER CARD</span>
                    <span class="logo-small">🔁</span>
                  </div>
                  <div class="cc-chip"></div>
                  <div class="cc-footer">SMART REIMBURSEMENT</div>
               </div>
               
               <div class="glass-card light-overlay velocity-chart">
                  <div class="card-top">
                     <h5>REIMBURSEMENT VELOCITY</h5>
                     <span class="icon-badge">↗</span>
                  </div>
                  <div class="chart-stats">
                     <div class="stat-left">
                        <span class="stat-label">Faster Approvals</span>
                        <span class="stat-value">$4,449.30</span>
                     </div>
                     <div class="stat-right bg-green">
                        $4,449.30
                     </div>
                  </div>
                  <div class="chart-area">
                     <svg viewBox="0 0 200 60" preserveAspectRatio="none">
                       <path d="M0,40 Q20,40 30,30 T60,50 T90,20 T110,60 T140,40 T170,50 T200,30 L200,60 L0,60 Z" fill="url(#grad-green)" opacity="0.3"/>
                       <path d="M0,40 Q20,40 30,30 T60,50 T90,20 T110,60 T140,40 T170,50 T200,30" fill="none" stroke="#34D399" stroke-width="3" stroke-linecap="round"/>
                       <circle cx="90" cy="20" r="4" fill="#10B981" stroke="#fff" stroke-width="2"/>
                       <defs>
                         <linearGradient id="grad-green" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="0%" stop-color="#34D399"/>
                           <stop offset="100%" stop-color="transparent"/>
                         </linearGradient>
                       </defs>
                     </svg>
                     <div class="x-axis"><span>Full</span><span>Sun</span><span>Mon</span><span class="active">Wed</span><span>Wed</span><span>Tue</span></div>
                  </div>
               </div>
               
               <div class="mini-stats-group">
                 <div class="glass-card mini-stat-card">
                   <div class="stat-top">
                      <span>TRAVEL</span>
                   </div>
                   <div class="stat-mid">$4,058.00</div>
                   <div class="stat-bot trend-up">
                      <svg viewBox="0 0 50 15"><path d="M0,10 Q10,5 20,10 T40,2 T50,5" fill="none" stroke="#34D399" stroke-width="2"/></svg>
                      <span>+1.6X</span>
                   </div>
                 </div>
                 <div class="glass-card mini-stat-card">
                   <div class="stat-top">
                      <span>MEALS</span>
                   </div>
                   <div class="stat-mid">$150.00</div>
                   <div class="stat-bot trend-up">
                      <svg viewBox="0 0 50 15"><path d="M0,10 Q10,5 20,10 T40,2 T50,5" fill="none" stroke="#34D399" stroke-width="2"/></svg>
                      <span>+1.6X</span>
                   </div>
                 </div>
               </div>
               
               <div class="glass-card light-overlay recent-expenses">
                  <div class="card-top">
                     <h5>RECENT EXPENSES</h5>
                     <a href="#" class="view-all">View all</a>
                  </div>
                  <ul class="expense-list">
                    <li>
                      <div class="item-left">
                        <div class="icon-circle">✈️</div>
                        <div class="item-text">
                           <strong>Airfare</strong>
                           <span>20 mins ago</span>
                        </div>
                      </div>
                      <div class="item-right">
                        <strong>$49.99</strong>
                        <span class="badge badge-success">Approved</span>
                      </div>
                    </li>
                    <li>
                      <div class="item-left">
                        <div class="icon-circle">💻</div>
                        <div class="item-text">
                           <strong>Software</strong>
                           <span>20 mins ago</span>
                        </div>
                      </div>
                      <div class="item-right">
                        <strong>$19.99</strong>
                        <span class="badge badge-success">Approved</span>
                      </div>
                    </li>
                    <li>
                      <div class="item-left">
                        <div class="icon-circle">☕</div>
                        <div class="item-text">
                           <strong>Starbucks</strong>
                           <span>20 mins ago</span>
                        </div>
                      </div>
                      <div class="item-right">
                        <strong>$10.90</strong>
                        <span class="badge badge-success">Approved</span>
                      </div>
                    </li>
                  </ul>
               </div>
            </div>
          </div>
        </section>
        
        <section class="info-section">
           <div class="right-pane-content">
              <div class="glass-card dark-card transparency-card">
                 <div class="card-text">
                    <h2>Workflow Transparency</h2>
                    <p class="subtitle">Advanced stacked workflow with connected workflow and accessibilities.</p>
                    <p class="highlight">Accelerate your cash flow and keep employees happy.</p>
                 </div>
                 <div class="mockup-diagram">
                    <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'><rect width='400' height='200' rx='10' fill='%23112A22'/><circle cx='80' cy='60' r='20' fill='%23064E3B'/><circle cx='200' cy='60' r='20' fill='%23059669'/><circle cx='320' cy='60' r='25' fill='%2310B981'/><path d='M100 60 L180 60 M220 60 L295 60' stroke='%2334D399' stroke-width='2' stroke-dasharray='4'/></svg>" class="diagram-img" alt="Workflow Diagram"/>
                 </div>
              </div>

              <div class="how-it-works">
                 <h2>How It Works</h2>
                 <div class="steps">
                    <div class="step">
                       <div class="step-icon">🧾</div>
                       <div class="step-num">Step 1</div>
                       <h4>Scan & Submit</h4>
                       <p>(Scan receipts with OCR)</p>
                    </div>
                    <div class="step-line"></div>
                    <div class="step">
                       <div class="step-icon">🔄</div>
                       <div class="step-num">Step 2</div>
                       <h4>Sequence Approvals</h4>
                       <p>(Sequential workflows)</p>
                    </div>
                    <div class="step-line"></div>
                    <div class="step">
                       <div class="step-icon">💸</div>
                       <div class="step-num">Step 3</div>
                       <h4>Fast Reimbursement</h4>
                       <p>(Payouts in days, not weeks)</p>
                    </div>
                 </div>
              </div>

              <div class="bottom-cards-grid">
                 <div class="glass-card dark-card smart-features">
                    <div class="card-top-header">
                       <h2>Smart Features Section</h2>
                       <span class="badge badge-outline">USP</span>
                    </div>
                    <div class="features-grid-inner">
                       <div class="f-box full-width">
                          <h4>Dynamic Approval Logic</h4>
                          <p>Tailored approval rules for any situation.</p>
                          <div class="logic-flow">
                             <span class="pill">10k</span> → <span class="pill">IF ROI > 80%</span> → <span class="pill outline">IF CFO approves</span>
                          </div>
                       </div>
                       <div class="f-box half">
                          <span class="icon-small">📷</span>
                          <h4>OCR Automation</h4>
                          <p>Take photo of receipts for setup.</p>
                       </div>
                       <div class="f-box half">
                          <span class="icon-small">💱</span>
                          <h4>Live Currency Conversion</h4>
                          <p>Real rates provision and conversion.</p>
                       </div>
                    </div>
                 </div>

                 <div class="right-column-cards">
                    <div class="glass-card dark-card testimonials">
                       <h2>Testimonials</h2>
                       <div class="testi-carousel">
                          <div class="t-card">
                            <p>"Saved our finance team 10+ hours a week."</p>
                            <span>- Tech Startup CFO</span>
                          </div>
                          <div class="t-card active">
                            <p>"No more chaotic emails. Everything is tracked."</p>
                            <span>- Finance Manager</span>
                          </div>
                          <div class="t-card">
                            <p>"We completely scaled operations."</p>
                            <span>- Finance Manager</span>
                          </div>
                       </div>
                       <div class="carousel-dots">
                          <i></i><i class="active"></i><i></i><i></i>
                       </div>
                    </div>
                    
                    <div class="glass-card dark-card cta-card">
                       <h3>STOP CHASING APPROVALS. START AUTOMATING.</h3>
                       <button class="btn btn-primary btn-outline-glow">REQUEST A DEMO</button>
                    </div>
                 </div>
              </div>
              
              <footer class="footer">
                 <div class="footer-left">
                    <span class="logo">🔁 PAYHAPS</span>
                 </div>
                 <div class="footer-links">
                    <a href="#">Features</a>
                    <a href="#">Pricing</a>
                    <a href="#">How it Works</a>
                    <a href="#">FAQ</a>
                    <a href="#">Blog</a>
                 </div>
                 <div class="footer-social">
                    <a href="#">📸</a><a href="#">🐦</a><a href="#">💼</a>
                 </div>
                 <div class="footer-copy">
                    Copyright Payhaps Inc.
                 </div>
              </footer>
           </div>
        </section>
      </main>
    </div>
  `;
}

// 2. Export the Highly Enhanced Three.js Logic
export function init3DBackground() {
  const canvas = document.getElementById('hero-3d-canvas');
  if (!canvas) {
    console.warn("3D Canvas not found. Make sure App() is rendered first!");
    return;
  }

  // Scene & Camera setup
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x022c22, 0.04); // Adds depth to the background

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 8;

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Optimizes for retina displays

  // --- LIGHTING (Crucial for a premium 3D look) ---
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  const dirLight1 = new THREE.DirectionalLight(0x34D399, 2); // Bright emerald light
  dirLight1.position.set(5, 5, 5);
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0x064E3B, 2); // Deep dark green from below
  dirLight2.position.set(-5, -5, -5);
  scene.add(dirLight2);

  // --- PRIMARY OBJECT: Glossy Data Knot ---
  const geometry = new THREE.TorusKnotGeometry(2.5, 0.6, 200, 32);
  const material = new THREE.MeshPhysicalMaterial({
    color: 0x10B981,
    metalness: 0.7,
    roughness: 0.2,
    transparent: true,
    opacity: 0.85,
    clearcoat: 1.0,           // Gives it a glassy/plastic shine
    clearcoatRoughness: 0.1,
  });
  
  const mainObject = new THREE.Mesh(geometry, material);
  mainObject.position.set(4, 0, -2); // Positioned slightly right and back
  scene.add(mainObject);

  // Add a glowing wireframe shell to the knot
  const wireMaterial = new THREE.MeshBasicMaterial({
    color: 0x34D399,
    wireframe: true,
    transparent: true,
    opacity: 0.15
  });
  const wireObject = new THREE.Mesh(geometry, wireMaterial);
  wireObject.scale.set(1.02, 1.02, 1.02); // Slightly larger to envelop the solid shape
  mainObject.add(wireObject);

  // --- BACKGROUND PARTICLES (Data Field) ---
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 1500;
  const posArray = new Float32Array(particlesCount * 3);

  for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 30; // Spread widely across the screen
  }
  
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.04,
    color: 0x34D399,
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending // Makes particles glow when they overlap
  });
  
  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particlesMesh);

  // --- MOUSE PARALLAX EFFECT ---
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;
  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);
  });

  // --- ANIMATION LOOP ---
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Smooth Parallax movement based on mouse position
    targetX = mouseX * 0.001;
    targetY = mouseY * 0.001;
    mainObject.rotation.y += 0.05 * (targetX - mainObject.rotation.y);
    mainObject.rotation.x += 0.05 * (targetY - mainObject.rotation.x);

    // Continuous slow rotation and floating effect
    mainObject.rotation.z += 0.002;
    mainObject.position.y = Math.sin(elapsedTime * 0.5) * 0.4; // Gentle up/down bobbing

    // Slowly rotate the background particles
    particlesMesh.rotation.y = elapsedTime * 0.03;
    particlesMesh.rotation.x = elapsedTime * 0.01;

    renderer.render(scene, camera);
  }

  animate();

  // --- RESPONSIVE RESIZING ---
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}