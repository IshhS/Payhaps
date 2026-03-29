import Navbar from '../Navbar.js';

export default function Employee() {
  return `
    <div class="admin-layout">
      \${Navbar()}
      <div class="dashboard-wrapper with-navbar" style="justify-content: center; align-items:flex-start; padding-top: 50px; background: #f8fafc; color: #0f172a;">
         <div class="white-panel shadow-sm" style="width: 80%; max-width: 900px; margin: 0 auto;">
            <header class="dash-header">
               <div>
                  <h2>Employee Portal</h2>
                  <p class="text-muted-dark">Welcome back. Manage your expense reports here.</p>
               </div>
            </header>
            <div class="dash-body">
               <form id="employee-expense-form" class="admin-form light-form mb-5">
                  <h4>Submit New Expense</h4>
                  <div class="row mt-3">
                     <div class="input-group half">
                        <label>Amount</label>
                        <input type="number" id="exp-amount" min="0" step="0.01" required>
                     </div>
                     <div class="input-group half">
                        <label>Currency</label>
                        <select id="exp-currency" required>
                           <option value="USD">USD</option>
                           <option value="EUR">EUR</option>
                           <option value="GBP">GBP</option>
                           <option value="INR">INR</option>
                        </select>
                     </div>
                  </div>
                  <div class="row mt-3">
                     <div class="input-group half">
                        <label>Category</label>
                        <select id="exp-category" required>
                           <option value="Travel">Travel</option>
                           <option value="Meals">Meals</option>
                           <option value="Software">Software</option>
                           <option value="Office Supplies">Office Supplies</option>
                           <option value="Other">Other</option>
                        </select>
                     </div>
                     <div class="input-group half">
                        <label>Date</label>
                        <input type="date" id="exp-date" required>
                     </div>
                  </div>
                  <div class="input-group mt-3">
                     <label>Description</label>
                     <textarea id="exp-desc" rows="3" required></textarea>
                  </div>
                  <button type="submit" class="btn btn-primary mt-3">Submit Expense</button>
               </form>

               <h4 class="mt-5 mb-3">Your Recent Expenses</h4>
               <ul id="employee-expenses-list" class="approval-list">
                 <p class="text-muted-dark" style="font-style:italic;">Loading expenses...</p>
               </ul>
            </div>
         </div>
      </div>
    </div>
  `;
}
