<?php
$title = 'Employee list';
require dirname(__DIR__) . '/layout/header.php';
?>

<section id="employees-table" class="panel">
    <div class="section-heading split">
        <div>
            <p class="eyebrow">Database</p>
            <h1>Employees</h1>
        </div>
        <a class="button" href="/employees/create">New employee</a>
    </div>

    <?php if (isset($_GET['created'])): ?>
        <div class="success">Employee saved successfully.</div>
    <?php endif; ?>

    <div class="table-wrap">
        <table>
            <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Address</th>
                <th>Cellphone</th>
                <th>Email</th>
                <th>Salary</th>
            </tr>
            </thead>
            <tbody>
            <tr v-if="employees.length === 0">
                <td colspan="6" class="empty">No employees have been registered yet.</td>
            </tr>
            <tr v-for="employee in employees" :key="employee.id">
                <td>{{ employee.employee_id }}</td>
                <td>{{ employee.name }}</td>
                <td>{{ employee.address }}</td>
                <td>{{ employee.cellphone }}</td>
                <td>{{ employee.email }}</td>
                <td class="money">{{ money(employee.salary) }}</td>
            </tr>
            </tbody>
            <tfoot>
            <tr>
                <th colspan="5">Total salaries</th>
                <th class="money">{{ money(totalSalary) }}</th>
            </tr>
            </tfoot>
        </table>
    </div>
</section>

<script>
document.addEventListener('DOMContentLoaded', () => {
    Vue.createApp({
        data() {
            return {
                employees: <?= json_encode($employees, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) ?>,
                totalFromServer: <?= json_encode($totalSalary) ?>
            };
        },
        computed: {
            totalSalary() {
                return this.employees.reduce((sum, employee) => sum + Number(employee.salary || 0), 0);
            }
        },
        methods: {
            money(value) {
                return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                }).format(Number(value || 0));
            }
        }
    }).mount('#employees-table');
});
</script>

<?php require dirname(__DIR__) . '/layout/footer.php'; ?>
