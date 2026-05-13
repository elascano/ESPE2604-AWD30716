<?php

use App\Core\Security;
?>
<section class="hero compact">
    <div>
        <span class="eyebrow">404</span>
        <h1>No se encontró el recurso</h1>
        <p>La ruta o elemento solicitado no existe: <?= Security::e($path ?? '') ?></p>
        <a class="button" href="/">Volver al inicio</a>
    </div>
</section>
