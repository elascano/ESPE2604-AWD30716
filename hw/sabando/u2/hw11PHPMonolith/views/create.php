<div class="container mt-4 animate-fade-in">
    <div class="row justify-content-center">
        <div class="col-lg-10">
            <div class="glass-card p-5">
                <div class="text-center mb-5 border-bottom border-secondary pb-4">
                    <h2 class="display-5 fw-bold text-white mb-0">Register New Employee</h2>
                    <p class="text-white-50 mt-2">Enter the details to add a new member to the company payroll.</p>
                </div>
                
                <form action="index.php?action=create" method="POST">
                    
                    <h4 class="text-info fw-light mb-4"><i class="bi bi-person-badge"></i> Personal Information</h4>
                    <div class="row g-4 mb-5">
                        <div class="col-md-6">
                            <label class="form-label text-white-50">First Name</label>
                            <input type="text" name="first_name" class="form-control form-control-lg" placeholder="e.g. John" required />
                        </div>
                        <div class="col-md-6">
                            <label class="form-label text-white-50">Last Name</label>
                            <input type="text" name="last_name" class="form-control form-control-lg" placeholder="e.g. Doe" required />
                        </div>
                        <div class="col-md-4">
                            <label class="form-label text-white-50">National ID</label>
                            <input type="text" name="national_id" class="form-control" placeholder="ID Number" required />
                        </div>
                        <div class="col-md-4">
                            <label class="form-label text-white-50">Date of Birth</label>
                            <input type="date" name="date_of_birth" class="form-control" required />
                        </div>
                        <div class="col-md-4">
                            <label class="form-label text-white-50">Email Address</label>
                            <input type="email" name="email" class="form-control" placeholder="john@example.com" required />
                        </div>
                        <div class="col-md-4">
                            <label class="form-label text-white-50">Phone Number</label>
                            <input type="text" name="phone_number" class="form-control" placeholder="+1 234 567 8900" />
                        </div>
                    </div>

                    <h4 class="text-info fw-light mb-4"><i class="bi bi-briefcase"></i> Payroll & Job Details</h4>
                    <div class="row g-4 mb-5">
                        <div class="col-md-6">
                            <label class="form-label text-white-50">Job Title</label>
                            <input type="text" name="job_title" class="form-control form-control-lg" placeholder="e.g. Software Engineer" required />
                        </div>
                        <div class="col-md-6">
                            <label class="form-label text-white-50">Department</label>
                            <select name="department" class="form-select form-select-lg" required>
                                <option value="">Select a department...</option>
                                <option value="IT">IT & Engineering</option>
                                <option value="Sales">Sales & Marketing</option>
                                <option value="HR">Human Resources</option>
                                <option value="Finance">Finance</option>
                                <option value="Operations">Operations</option>
                            </select>
                        </div>
                        
                        <div class="col-md-4">
                            <label class="form-label text-white fw-bold">Base Salary</label>
                            <div class="input-group input-group-lg">
                                <span class="input-group-text bg-dark text-white border-0">$</span>
                                <input type="number" step="0.01" name="base_salary" class="form-control" required />
                            </div>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label text-success">Bonuses</label>
                            <div class="input-group input-group-lg">
                                <span class="input-group-text bg-dark text-success border-0">+$</span>
                                <input type="number" step="0.01" name="bonuses" class="form-control text-success" value="0.00" />
                            </div>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label text-danger">Deductions</label>
                            <div class="input-group input-group-lg">
                                <span class="input-group-text bg-dark text-danger border-0">-$</span>
                                <input type="number" step="0.01" name="deductions" class="form-control text-danger" value="0.00" />
                            </div>
                        </div>
                    </div>

                    <div class="d-flex justify-content-between align-items-center mt-5 pt-3 border-top border-secondary">
                        <a href="index.php" class="btn btn-outline-light px-4 py-2 rounded-pill">Cancel & Go Back</a>
                        <button type="submit" class="btn btn-glass btn-lg px-5 shadow-lg rounded-pill">Save Employee Record</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>