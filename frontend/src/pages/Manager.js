import Navbar from '../Navbar.js';

export default function Manager() {
  return `
    <div class="admin-layout">
      ${Navbar()}
      <div class="dashboard-wrapper with-navbar" style="justify-content: center; align-items:flex-start; padding-top: 50px; background: #f8fafc; color: #0f172a;">
         <div class="white-panel shadow-sm" style="width: 80%; max-width: 900px; margin: 0 auto;">
            <header class="dash-header">
               <div>
                  <h2>Manager Portal</h2>
                  <p class="text-muted-dark">Review and approve expenses from your assigned team.</p>
               </div>
            </header>
            <div class="dash-body">
               <h4 class="mb-3">Pending Approvals</h4>
               <ul class="approval-list">
                  <li class="approval-item">
                     <div class="app-left">
                        <strong>Team Lunch</strong>
                        <span class="app-meta">Alice • $120.00</span>
                     </div>
                     <div class="app-right">
                        <button class="btn btn-primary btn-glow" style="padding: 6px 15px; font-size:0.8rem;">Review</button>
                     </div>
                  </li>
               </ul>
            </div>
         </div>
      </div>
    </div>
  `;
}
