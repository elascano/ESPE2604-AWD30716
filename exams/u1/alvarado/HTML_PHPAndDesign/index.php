<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Management System</title>
    <link rel="stylesheet" href="public/css/style_forms.css">
</head>

<body>
	
<div class="form-container">

    <header>
        <h1>User Portal</h1>
        <p>Computers register</p>
    </header>

    <nav class="tabs" role="tablist">
        <div class="tab active" data-tab="formTab" role="tab">
            <strong>Register New Computer</strong>
        </div>
        <div class="tab" data-tab="tableTab" role="tab">
            <strong>View Database</strong>
        </div>
    </nav>

    <main id="formTab" class="tab-content active">
        <div class="form-box">
            <header>
                <h2>User Registration</h2>
                <p>Please fill out the form below to create a new computer.</p>
            </header>

            <form id="registrationForm">
                
                <fieldset class="form-section">
                    <legend>Basic Information</legend>
                    
                    <div class="form-group">
                        <label for="Model">Model:</label>
                        <input type="text" name="Model" id="Model" 
                               placeholder="e.g. DELL" required>
                    </div>

                    <div class="form-group">
                        <label for="Year">Year:</label>
                        <input type="text" name="Year" id="Year" 
                               placeholder="e.g. 2020" required>
                    </div>

                    <div class="form-group">
                        <label for="Battery">Battery:</label>
                        <input type="text" name="Battery" id="Battery" 
                               placeholder="Description" required>
                    </div>

                    <div class="form-group">
                        <label for="Company">Company:</label>
                        <input type="text" name="Company" id="Company" required>
                    </div>

                    <div class="form-group">
                        <label for="GPU">GPU:</label>
                        <input type="text" name="GPU" id="GPU" readonly 
                               placeholder="Nvidia">
                    </div>

                    <div class="form-group">
                        <label for="CPU">CPU:</label>
                        <input type="text" name="CPU" id="CPU" 
                               placeholder="Street, City, and ZIP code">
                    </div>

                    <div class="form-group">
                        <label for="Price">Price:</label>
                        <input type="tel" name="Price" id="Price" 
                               maxlength="10" placeholder="e.g. 0987654321">
                    </div>
                    <div class="form-group">
                        <label for="Color">Color:</label>
                        <input type="tel" name="Color" id="Color" 
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
                    <th>Model</th>
                    <th>Year</th>
                    <th>Battery</th>
                    <th>GPU</th>
                    <th>CPU</th>
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

<script src="public/js/users.js"></script>

</body>
</html>