import Navbar from '../Navbar.js';

export default function Employee() {
  return `
    <div class="admin-layout">
      ${Navbar()}
      <div class="dashboard-wrapper with-navbar" style="justify-content: center; align-items:flex-start; padding-top: 50px; background: #f8fafc; color: #0f172a;">
         <div class="white-panel shadow-sm" style="width: 80%; max-width: 900px; margin: 0 auto;">
            <header class="dash-header">
               <div>
                  <h2>Employee Portal</h2>
                  <p class="text-muted-dark">Welcome back. Manage your expense reports here.</p>
               </div>
            </header>
            <div class="dash-body">
               <button class="btn btn-primary btn-glow">Submit New Expense</button>
               <h4 class="mt-5 mb-3">Your Recent Expenses</h4>
               <p class="text-muted-dark">No expenses submitted yet.</p>
            </div>
         </div>
      </div>
    </div>
  `;
}
