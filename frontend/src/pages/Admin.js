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
                    <form class="admin-form light-form mt-4">
                       <div class="row">
                          <div class="input-group half">
                             <label>Full Name</label>
                             <input type="text" placeholder="e.g. John Doe" required>
                          </div>
                          <div class="input-group half">
                             <label>Email Address</label>
                             <input type="email" placeholder="john@example.com" required>
                          </div>
                       </div>
                       <div class="input-group mt-3">
                          <label>Assign System Role</label>
                          <select required>
                             <option value="" disabled selected>Select Role</option>
                             <option value="employee">Employee</option>
                             <option value="manager">Manager</option>
                             <option value="finance">Finance</option>
                             <option value="director">Director</option>
                          </select>
                       </div>
                       <button type="submit" class="btn btn-primary mt-4">Invite User</button>
                    </form>
                 </div>
              </section>

              <!-- Tab: Hierarchy -->
              <section id="tab-hierarchy" class="tab-pane">
                 <div class="white-panel shadow-sm">
                    <h3>Company Hierarchy Configuration</h3>
                    <p class="text-muted-dark">Map roles to establish the approval chain.</p>
                    
                    <form class="admin-form light-form mt-4 border-bottom pb-4 mb-4">
                       <div class="row align-items-end">
                          <div class="input-group half">
                             <label>Mapping Type</label>
                             <select required>
                                <option value="emp_mgr">Employee → Manager</option>
                                <option value="mgr_fin">Manager → Finance</option>
                                <option value="fin_dir">Finance → Director</option>
                             </select>
                          </div>
                          <div class="input-group half">
                             <label>Select User</label>
                             <select required>
                                <option>Alice (Employee)</option>
                                <option>Bob (Employee)</option>
                             </select>
                          </div>
                          <div class="input-group half">
                             <label>Assign To</label>
                             <select required>
                                <option>Charlie (Manager)</option>
                                <option>Dave (Manager)</option>
                             </select>
                          </div>
                       </div>
                       <button type="submit" class="btn btn-primary mt-3">Save Mapping</button>
                    </form>

                    <div class="hierarchy-tree-visual mt-4">
                       <h4>Organization Tree</h4>
                       <div class="tree">
                          <ul>
                             <li>
                                <div class="node director-node">👑 Director: Elena</div>
                                <ul>
                                   <li>
                                      <div class="node finance-node">💰 Finance: Frank</div>
                                      <ul>
                                         <li>
                                            <div class="node manager-node">👔 Manager: Charlie</div>
                                            <ul>
                                               <li><div class="node employee-node">👤 Emp: Alice</div></li>
                                               <li><div class="node employee-node">👤 Emp: Bob</div></li>
                                            </ul>
                                         </li>
                                         <li>
                                            <div class="node manager-node">👔 Manager: Dave</div>
                                            <ul>
                                               <li><div class="node employee-node">👤 Emp: Sam</div></li>
                                            </ul>
                                         </li>
                                      </ul>
                                   </li>
                                </ul>
                             </li>
                          </ul>
                       </div>
                    </div>
                 </div>
              </section>

              <!-- Tab: Approvals Config / List -->
              <section id="tab-approvals" class="tab-pane">
                 <div class="white-panel shadow-sm" style="display:flex; gap:30px;">
                    <div style="flex:1;">
                       <h3>All Expense Approvals</h3>
                       <p class="text-muted-dark mb-4">View and audit all submitted employee expenses.</p>
                       
                       <ul class="approval-list">
                          <li class="approval-item active">
                             <div class="app-left">
                                <strong>Software Subscription</strong>
                                <span class="app-meta">Alice • $49.99</span>
                             </div>
                             <div class="app-right">
                                <span class="badge badge-pending">Pending</span>
                             </div>
                          </li>
                          <li class="approval-item">
                             <div class="app-left">
                                <strong>Client Dinner</strong>
                                <span class="app-meta">Bob • $150.00</span>
                             </div>
                             <div class="app-right">
                                <span class="badge badge-success">Approved</span>
                             </div>
                          </li>
                       </ul>
                    </div>
                    
                    <div class="approval-details" style="flex:1; border-left: 1px solid #e2e8f0; padding-left: 30px;">
                       <h4>Receipt & Details</h4>
                       <div class="receipt-box mt-3 mb-4">
                          <img src="https://via.placeholder.com/300x200?text=Receipt+Image" alt="Receipt" style="width:100%; border-radius:8px;">
                       </div>
                       
                       <div class="info-grid">
                          <p><strong>Submitter:</strong> Alice (Employee)</p>
                          <p><strong>Amount:</strong> $49.99</p>
                          <p><strong>Category:</strong> Software</p>
                          <p><strong>Date:</strong> 29 Oct 2026</p>
                       </div>

                       <h4 class="mt-4 mb-3">Approval Chain</h4>
                       <div class="workflow-chain">
                          <div class="chain-step completed">
                             <div class="step-dot">✓</div>
                             <div class="step-info">
                                <strong>Manager (Charlie)</strong>
                                <span>Approved on Oct 29</span>
                             </div>
                          </div>
                          <div class="chain-step pending">
                             <div class="step-dot">⏳</div>
                             <div class="step-info">
                                <strong>Finance (Frank)</strong>
                                <span>Awaiting Approval</span>
                             </div>
                          </div>
                          <div class="chain-step locked">
                             <div class="step-dot">🔒</div>
                             <div class="step-info">
                                <strong>Director (Elena)</strong>
                                <span>Escalation Only</span>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              </section>
           </div>
        </main>
      </div>
    </div>
  `;
}
