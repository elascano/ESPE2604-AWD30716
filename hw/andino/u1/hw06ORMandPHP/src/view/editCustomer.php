<?php /** @var \App\model\Customer $customer */ ?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Customer - ESPE</title>
    <link rel="stylesheet" href="../public/css/styleForm.css">
</head>
<body>
    <nav class="navbar">
        <div class="navbar__container">
            <span class="navbar__logo">Customer System</span>
            <ul class="navbar__menu">
                <li><a href="../view/index.html">Add Customer</a></li>
                <li><a href="../controller/viewCustomers.php">View Customers</a></li>
            </ul>
        </div>
    </nav>

    <main class="page">
        <section class="card">
            <div class="card__header">
                <h1>Edit Customer</h1>
                <p class="subtitle">Update the selected record and save the changes.</p>
            </div>

            <form action="../controller/updateCustomer.php" method="POST" class="customer-form">
                <input type="hidden" name="id" value="<?= htmlspecialchars($customer->id) ?>">

                <div class="field">
                    <label for="names">Names</label>
                    <input type="text" id="names" name="names" value="<?= htmlspecialchars($customer->names) ?>" required>
                </div>

                <div class="field">
                    <label for="surnames">Surnames</label>
                    <input type="text" id="surnames" name="surnames" value="<?= htmlspecialchars($customer->surnames) ?>" required>
                </div>

                <div class="field">
                    <label for="birth_date">Birth Date</label>
                    <input type="date" id="birth_date" name="birth_date" value="<?= htmlspecialchars($customer->birth_date) ?>" required>
                </div>

                <div class="field">
                    <label for="age">Age</label>
                    <input type="number" id="age" name="age" value="<?= htmlspecialchars($customer->age) ?>" readonly>
                </div>

                <div class="field">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" value="<?= htmlspecialchars($customer->email) ?>" required>
                </div>

                <div class="field">
                    <label for="cellphone">Cellphone</label>
                    <input type="text" id="cellphone" name="cellphone" value="<?= htmlspecialchars($customer->cellphone) ?>" required>
                </div>

                <div class="actions field--full">
                    <a href="../controller/viewCustomers.php" class="button button--ghost" style="text-decoration:none; display:inline-flex; align-items:center;">Cancel</a>
                    <button type="submit" class="button button--primary">Update</button>
                </div>
            </form>
        </section>
    </main>
</body>
</html>