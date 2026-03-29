import Navbar from '../Navbar.js';

export default function Admin() {
  return `
    <div class="admin-layout">
      ${Navbar()}
      
      <div class="dashboard-wrapper with-navbar">
        <nav class="sidebar dark-sidebar">
           <ul class="sidebar-nav">
              <li class="active" data-tab="users">
                 <span class="icon">👥</span> Manage Users & Roles
              </li>
              <li data-tab="hierarchy">
                 <span class="icon">📊</span> Company Hierarchy
              </li>
              <li data-tab="workflows">
                 <span class="icon">⚙️</span> Approval Workflow
              </li>
              <li data-tab="approvals">
                 <span class="icon">📁</span> Expense Approvals
              </li>
           </ul>
           <div class="sidebar-bottom">
              <button id="logout-btn" class="btn btn-outline-glow w-100" style="padding:12px;">Logout</button>
           </div>
        </nav>
        
        <main class="dashboard-content light-bg">
           <header class="dash-header dark-text">
              <div>
                 <h2>Admin Control Panel</h2>
                 <p class="text-muted-dark">Configure the reimbursement management system.</p>
              </div>
              <div class="user-profile dark-text">
                 <div class="avatar">A</div>
                 <div>
                    <strong>Admin User</strong>
                    <span style="font-size:0.75rem; color: #64748b; display:block;">System Administrator</span>
                 </div>
              </div>
           </header>
           
           <div class="dash-body dark-text">
              <!-- Tab: Users -->
              <section id="tab-users" class="tab-pane active">
                 <div class="white-panel shadow-sm">
                    <h3>Add Users & Assign Roles</h3>
                    <p class="text-muted-dark mb-4">Invite users and assign their capabilities in the system.</p>
                    <form id="invite-user-form" class="admin-form light-form mt-4">
                       <div class="row">
                          <div class="input-group half">
                             <label>Full Name</label>
                             <input id="invite-name" type="text" placeholder="e.g. John Doe" required>
                          </div>
                          <div class="input-group half">
                             <label>Email Address</label>
                             <input id="invite-email" type="email" placeholder="john@example.com" required>
                          </div>
                       </div>
                       <div class="input-group mt-3">
                          <label>Assign System Role</label>
                          <select id="invite-role" required>
                             <option value="" disabled selected>Select Role</option>
                             <option value="EMPLOYEE">Employee</option>
                             <option value="MANAGER">Manager</option>
                             <option value="FINANCE">Finance</option>
                             <option value="DIRECTOR">Director</option>
                          </select>
                       </div>
                       <div id="invite-status" style="margin-top:12px; font-size:0.9rem;"></div>
                       <button type="submit" class="btn btn-primary mt-4">Invite User</button>
                    </form>
                 </div>

                 <!-- Invited Users List -->
                 <div class="white-panel shadow-sm mt-4">
                    <h3>Invited Users</h3>
                    <p class="text-muted-dark mb-4">Users that have been invited to the system.</p>
                    <div id="invited-users-list">
                       <p style="color:#94a3b8; font-style:italic;">Loading...</p>
                    </div>
                 </div>
              </section>

              <!-- Tab: Hierarchy -->
              <section id="tab-hierarchy" class="tab-pane">
                 <div class="white-panel shadow-sm">
                    <h3>Company Hierarchy Configuration</h3>
                    <p class="text-muted-dark">Map roles to establish the approval chain.</p>
                    
                    <form id="hierarchy-form" class="admin-form light-form mt-4 border-bottom pb-4 mb-4">
                       <div class="row align-items-end">
                          <!-- We rely directly on User -> Manager assignment instead of strict Role Mapping in the UI for simplicity, 
                               but we keep this layout. -->
                          <div class="input-group half">
                             <label>Select User</label>
                             <select id="hierarchy-user" required>
                                <option value="" disabled selected>Loading...</option>
                             </select>
                          </div>
                          <div class="input-group half">
                             <label>Assign To Manager/Approver</label>
                             <select id="hierarchy-manager" required>
                                <option value="" disabled selected>Loading...</option>
                             </select>
                          </div>
                       </div>
                       <button type="submit" class="btn btn-primary mt-3">Save Mapping</button>
                    </form>

                    <div class="hierarchy-tree-visual mt-4">
                       <h4>Organization Tree</h4>
                       <div id="hierarchy-tree" class="tree">
                          <p class="text-muted-dark">Loading tree...</p>
                       </div>
                    </div>
                 </div>
              </section>

              <!-- Tab: Workflows -->
              <section id="tab-workflows" class="tab-pane">
                 <div class="white-panel shadow-sm">
                    <h3>Approval Workflow Configuration</h3>
                    <p class="text-muted-dark">Define the sequence of approvers for employee expenses.</p>
                    
                    <div class="mt-4 p-4" style="background:#f1f5f9; border-radius:8px; border:1px solid #e2e8f0;">
                       <h5 class="mb-3">Current Workflow Sequence</h5>
                       <div id="workflow-steps-list" style="display:flex; flex-direction:column; gap:10px;">
                          <p class="text-muted-dark">Loading...</p>
                       </div>
                    </div>

                    <form id="workflow-form" class="admin-form light-form mt-4 border-top pt-4">
                       <h5>Add New Step</h5>
                       <div class="row align-items-end mt-3">
                          <div class="input-group half">
                             <label>Approver Role</label>
                             <select id="workflow-role" required>
                                <option value="MANAGER">Direct Manager (Reports To)</option>
                                <option value="FINANCE">Finance Team</option>
                                <option value="DIRECTOR">Director</option>
                             </select>
                          </div>
                          <div class="input-group half">
                             <button type="submit" class="btn btn-outline-primary" style="width:100%; border:2px dashed #3b82f6;">+ Append Step to Workflow</button>
                          </div>
                       </div>
                       <button type="button" id="preset-workflow-btn" class="btn btn-success mt-3 px-4 py-2" style="font-size:0.85rem;">Reset to Recommended (Manager -> Finance -> Director)</button>
                    </form>
                 </div>
              </section>

              <!-- Tab: Approvals Config / List -->
              <section id="tab-approvals" class="tab-pane">
                 <div class="white-panel shadow-sm" style="display:flex; gap:30px;">
                    <div style="flex:1;">
                       <h3>All Expense Approvals</h3>
                       <p class="text-muted-dark mb-4">View and audit all submitted employee expenses.</p>
                       
                       <ul id="admin-expenses-list" class="approval-list">
                          <p class="text-muted-dark" style="font-style:italic;">Loading expenses...</p>
                       </ul>
                    </div>
                    
                    <div id="admin-expense-details" class="approval-details" style="flex:1; border-left: 1px solid #e2e8f0; padding-left: 30px;">
                       <p class="text-muted-dark">Select an expense to view details.</p>
                    </div>
                 </div>
              </section>
           </div>
        </main>
      </div>
    </div>
  `;
}
