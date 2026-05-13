<?php

use App\Core\Security;

$song = $item['model'];
?>
<section class="hero compact">
    <div>
        <span class="eyebrow">Detalle del registro</span>
        <h1><?= Security::e($song->title) ?></h1>
        <p><?= Security::e($song->artist) ?> · <?= Security::e($song->album) ?></p>
    </div>
    <a class="button" href="/songs/edit?id=<?= (int) $song->id ?>">Editar</a>
</section>

<section class="detail-grid">
    <article class="panel detail-card">
        <h2>Datos almacenados</h2>
        <dl>
            <dt>ID</dt><dd>#<?= (int) $song->id ?></dd>
            <dt>Género</dt><dd><?= Security::e($song->genre) ?></dd>
            <dt>Duración</dt><dd><?= Security::e($item['duration_label']) ?> minutos</dd>
            <dt>Año</dt><dd><?= (int) $song->release_year ?></dd>
            <dt>Streams</dt><dd><?= number_format((int) $song->streams) ?></dd>
            <dt>Likes</dt><dd><?= number_format((int) $song->likes) ?></dd>
            <dt>Rating</dt><dd><?= number_format((float) $song->rating, 1) ?>/5</dd>
            <dt>Contenido explícito</dt><dd><?= ((int) $song->explicit_content) === 1 ? 'Sí' : 'No' ?></dd>
            <dt>Pago por stream</dt><dd>$<?= number_format((float) $song->royalty_per_stream, 6) ?></dd>
        </dl>
    </article>

    <article class="panel result-card">
        <h2>Cálculos del sistema</h2>
        <div class="big-number">
            <span>Ganancia estimada</span>
            <strong>$<?= number_format((float) $item['estimated_revenue'], 2) ?></strong>
        </div>
        <div class="big-number">
            <span>Popularidad</span>
            <strong><?= number_format((float) $item['popularity_score'], 1) ?>/100</strong>
        </div>
        <a href="/" class="ghost">Volver al listado</a>
    </article>
</section>
