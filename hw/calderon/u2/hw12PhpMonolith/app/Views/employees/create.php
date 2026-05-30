<?php
$title = 'Register employee';
require dirname(__DIR__) . '/layout/header.php';
?>

<section id="employee-form" class="panel">
    <div class="section-heading">
        <p class="eyebrow">Registration</p>
        <h1>New employee</h1>
    </div>

    <?php if ($errors !== []): ?>
        <div class="alert">Please review the highlighted fields before saving.</div>
    <?php endif; ?>

    <form method="post" action="/employees" class="form" @submit="submitting = true">
        <label>
            <span>ID</span>
            <input v-model.trim="form.employee_id" name="employee_id" value="<?= htmlspecialchars((string) ($old['employee_id'] ?? ''), ENT_QUOTES, 'UTF-8') ?>" required>
            <?php if (isset($errors['employee_id'])): ?><small><?= htmlspecialchars($errors['employee_id'], ENT_QUOTES, 'UTF-8') ?></small><?php endif; ?>
        </label>

        <label>
            <span>Name</span>
            <input v-model.trim="form.name" name="name" value="<?= htmlspecialchars((string) ($old['name'] ?? ''), ENT_QUOTES, 'UTF-8') ?>" required>
            <?php if (isset($errors['name'])): ?><small><?= htmlspecialchars($errors['name'], ENT_QUOTES, 'UTF-8') ?></small><?php endif; ?>
        </label>

        <label>
            <span>Address</span>
            <input v-model.trim="form.address" name="address" value="<?= htmlspecialchars((string) ($old['address'] ?? ''), ENT_QUOTES, 'UTF-8') ?>" required>
            <?php if (isset($errors['address'])): ?><small><?= htmlspecialchars($errors['address'], ENT_QUOTES, 'UTF-8') ?></small><?php endif; ?>
        </label>

        <label>
            <span>Cellphone</span>
            <input v-model.trim="form.cellphone" name="cellphone" value="<?= htmlspecialchars((string) ($old['cellphone'] ?? ''), ENT_QUOTES, 'UTF-8') ?>" required>
            <?php if (isset($errors['cellphone'])): ?><small><?= htmlspecialchars($errors['cellphone'], ENT_QUOTES, 'UTF-8') ?></small><?php endif; ?>
        </label>

        <label>
            <span>Email</span>
            <input v-model.trim="form.email" type="email" name="email" value="<?= htmlspecialchars((string) ($old['email'] ?? ''), ENT_QUOTES, 'UTF-8') ?>" required>
            <?php if (isset($errors['email'])): ?><small><?= htmlspecialchars($errors['email'], ENT_QUOTES, 'UTF-8') ?></small><?php endif; ?>
        </label>

        <label>
            <span>Salary</span>
            <input v-model.number="form.salary" type="number" step="0.01" min="0" name="salary" value="<?= htmlspecialchars((string) ($old['salary'] ?? ''), ENT_QUOTES, 'UTF-8') ?>" required>
            <?php if (isset($errors['salary'])): ?><small><?= htmlspecialchars($errors['salary'], ENT_QUOTES, 'UTF-8') ?></small><?php endif; ?>
        </label>

        <div class="actions">
            <a class="button secondary" href="/employees">Cancel</a>
            <button class="button" type="submit" :disabled="submitting">
                {{ submitting ? 'Saving...' : 'Save employee' }}
            </button>
        </div>
    </form>
</section>

<script>
document.addEventListener('DOMContentLoaded', () => {
    Vue.createApp({
        data() {
            return {
                submitting: false,
                form: {
                    employee_id: <?= json_encode((string) ($old['employee_id'] ?? '')) ?>,
                    name: <?= json_encode((string) ($old['name'] ?? '')) ?>,
                    address: <?= json_encode((string) ($old['address'] ?? '')) ?>,
                    cellphone: <?= json_encode((string) ($old['cellphone'] ?? '')) ?>,
                    email: <?= json_encode((string) ($old['email'] ?? '')) ?>,
                    salary: <?= json_encode((string) ($old['salary'] ?? '')) ?>
                }
            };
        }
    }).mount('#employee-form');
});
</script>

<?php require dirname(__DIR__) . '/layout/footer.php'; ?>
