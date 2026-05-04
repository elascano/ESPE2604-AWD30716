<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Management System</title>
    <link rel="stylesheet" href="../public/css/style_forms.css">
</head>

<body>
	
<div class="form-container">

    <header>
        <h1>User Portal</h1>
        <p>Employee records and registration database.</p>
    </header>

    <nav class="tabs" role="tablist">
        <div class="tab active" data-tab="formTab" role="tab">
            <strong>Register New User</strong>
        </div>
        <div class="tab" data-tab="tableTab" role="tab">
            <strong>View Database</strong>
        </div>
    </nav>

    <main id="formTab" class="tab-content active">
        <div class="form-box">
            <header>
                <h2>User Registration</h2>
                <p>Please fill out the form below to create a new profile.</p>
            </header>

            <form id="registrationForm">
                
                <fieldset class="form-section">
                    <legend>Personal Information</legend>
                    
                    <div class="form-group">
                        <label for="first_name">First Name:</label>
                        <input type="text" name="first_name" id="first_name" 
                               placeholder="e.g. Alexander" required>
                    </div>

                    <div class="form-group">
                        <label for="last_name">Last Name:</label>
                        <input type="text" name="last_name" id="last_name" 
                               placeholder="e.g. Hamilton" required>
                    </div>

                    <div class="form-group">
                        <label for="id_number">Identification Number:</label>
                        <input type="text" name="id_number" id="id_number" 
                               maxlength="10" placeholder="10-digit ID" required>
                        <small id="idError" class="error-text">Required: 10 numerical characters</small>
                    </div>

                    <div class="form-group">
                        <label for="birth_date">Birthdate:</label>
                        <input type="date" name="birth_date" id="birth_date" required>
                    </div>

                    <div class="form-group">
                        <label for="age">Calculated Age:</label>
                        <input type="text" name="age" id="age" readonly 
                               placeholder="Automatic" title="This field is calculated based on birth date">
                    </div>

                    <div class="form-group">
                        <label for="address">Residential Address:</label>
                        <input type="text" name="address" id="address" 
                               placeholder="Street, City, and ZIP code">
                    </div>

                    <div class="form-group">
                        <label for="phone">Phone Number:</label>
                        <input type="tel" name="phone" id="phone" 
                               maxlength="10" placeholder="e.g. 0987654321">
                    </div>
                </fieldset>

                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Create Record</button>
                    <button type="reset" class="btn btn-danger">
						Discard Changes
					</button>
                </div>
            </form>
        </div>
    </main>

    <section id="tableTab" class="tab-content">
        <header>
            <h2>Registered Users Directory</h2>
            <p>A complete list of all active users in the system.</p>
        </header>

        <table id="usersTable">
            <thead>
                <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>ID Number</th>
                    <th>Age</th>
                    <th>Phone</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
    </section>

    <footer>
        <hr>
        <p><small>&copy; 2026 User Management System. All rights reserved.</small></p>
    </footer>

</div>

<script src="../public/js/registerValidation.js"></script>
<script src="../public/js/users.js"></script>

</body>
</html>