import Navbar from '../Navbar.js';

export default function Finance() {
  return `
    <div class="admin-layout">
      ${Navbar()}
      <div class="dashboard-wrapper with-navbar" style="justify-content: center; align-items:flex-start; padding-top: 50px; background: #f8fafc; color: #0f172a;">
         <div class="white-panel shadow-sm" style="width: 80%; max-width: 1000px; margin: 0 auto;">
            <header class="dash-header">
               <div>
                  <h2>Finance Portal</h2>
                  <p class="text-muted-dark">Audit and release payouts for approved organizational expenses.</p>
               </div>
            </header>
            <div class="dash-body">
               <div style="display:flex; justify-content:space-between; margin-bottom:20px;">
                  <div style="padding: 20px; background: #f0fdf4; border-radius:12px; border:1px solid #10b981; flex:1; margin-right:15px;">
                     <h5 style="color:#10b981; margin-bottom:5px;">Pending Payouts</h5>
                     <h2 style="font-size:2rem; color:#0f172a;">$1,420.00</h2>
                  </div>
                  <div style="padding: 20px; background: #f8fafc; border-radius:12px; border:1px solid #e2e8f0; flex:1;">
                     <h5 style="color:#64748b; margin-bottom:5px;">Total Disbursed (MTD)</h5>
                     <h2 style="font-size:2rem; color:#0f172a;">$12,450.00</h2>
                  </div>
               </div>
               <h4 class="mb-3">Awaiting Finance Approval</h4>
               <ul id="pending-approvals-list" class="approval-list">
                 <p class="text-muted-dark" style="font-size:0.9rem;">Loading pending approvals...</p>
               </ul>
            </div>
         </div>
      </div>
    </div>
  `;
}
