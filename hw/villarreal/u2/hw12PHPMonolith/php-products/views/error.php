<h1 class="text-danger">Error</h1>
<p class="text-danger">An error occurred while processing your request.</p>

<?php if (isset($error) && $error !== ''): ?>
    <p><strong>Details:</strong> <code><?= htmlspecialchars($error) ?></code></p>
<?php endif; ?>

<p><a href="/" class="btn btn-primary">Return to Home</a></p>
