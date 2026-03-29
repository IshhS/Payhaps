import Navbar from '../Navbar.js';

export default function Director() {
  return `
    <div class="admin-layout">
      ${Navbar()}
      <div class="dashboard-wrapper with-navbar" style="justify-content: center; align-items:flex-start; padding-top: 50px; background: #f8fafc; color: #0f172a;">
         <div class="white-panel shadow-sm" style="width: 80%; max-width: 900px; margin: 0 auto;">
            <header class="dash-header">
               <div>
                  <h2>Director Portal</h2>
                  <p class="text-muted-dark">Master overview and escalated approval resolution.</p>
               </div>
            </header>
            <div class="dash-body">
               <h4 class="mb-3">Escalated Approvals</h4>
               <ul id="pending-approvals-list" class="approval-list">
                 <p class="text-muted-dark" style="font-size:0.9rem;">Loading escalations...</p>
               </ul>
            </div>
         </div>
      </div>
    </div>
  `;
}
