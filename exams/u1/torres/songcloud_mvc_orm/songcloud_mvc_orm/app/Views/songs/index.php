<?php

use App\Core\Security;
?>
<section class="hero">
    <div>
        <span class="eyebrow">Sistema de gestión musical</span>
        <h1>Panel dinámico de canciones</h1>
        <p>Administre canciones almacenadas en una base de datos cloud usando MVC, ORM, PHP y JavaScript.</p>
    </div>
    <a class="button hero-button" href="/songs/create">+ Registrar canción</a>
</section>

<?php if ($success): ?>
    <div class="alert success">
        <?php if ($success === 'created'): ?>Canción registrada correctamente.<?php endif; ?>
        <?php if ($success === 'updated'): ?>Canción actualizada correctamente.<?php endif; ?>
        <?php if ($success === 'deleted'): ?>Canción eliminada correctamente.<?php endif; ?>
    </div>
<?php endif; ?>

<section class="stats-grid">
    <article class="stat-card">
        <span>Total canciones</span>
        <strong><?= number_format((int) $stats['count']) ?></strong>
    </article>
    <article class="stat-card">
        <span>Streams acumulados</span>
        <strong><?= number_format((int) $stats['streams']) ?></strong>
    </article>
    <article class="stat-card">
        <span>Ganancia estimada</span>
        <strong>$<?= number_format((float) $stats['revenue'], 2) ?></strong>
    </article>
    <article class="stat-card">
        <span>Rating promedio</span>
        <strong><?= number_format((float) $stats['average_rating'], 2) ?>/5</strong>
    </article>
</section>

<section class="panel">
    <div class="panel-header">
        <div>
            <h2>Buscar / leer canciones</h2>
            <p>Consulta por título, artista, álbum o género. Si deja el campo vacío, se muestran todos los registros.</p>
        </div>
    </div>

    <form class="search-bar" method="get" action="/">
        <input type="search" name="q" value="<?= Security::e($q) ?>" placeholder="Ejemplo: salsa, Bad Bunny, bachata, álbum...">
        <button type="submit">Buscar</button>
        <?php if ($q !== ''): ?>
            <a class="ghost" href="/">Limpiar</a>
        <?php endif; ?>
    </form>

    <div class="table-wrap">
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Canción</th>
                    <th>Género</th>
                    <th>Duración</th>
                    <th>Streams</th>
                    <th>Rating</th>
                    <th>Ganancia</th>
                    <th>Popularidad</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <?php if (!$items): ?>
                    <tr>
                        <td colspan="9" class="empty">No hay canciones registradas o no existen coincidencias.</td>
                    </tr>
                <?php endif; ?>

                <?php foreach ($items as $item): ?>
                    <?php $song = $item['model']; ?>
                    <tr>
                        <td>#<?= (int) $song->id ?></td>
                        <td>
                            <strong><?= Security::e($song->title) ?></strong>
                            <small><?= Security::e($song->artist) ?> · <?= Security::e($song->album) ?></small>
                        </td>
                        <td><span class="badge"><?= Security::e($song->genre) ?></span></td>
                        <td><?= Security::e($item['duration_label']) ?></td>
                        <td><?= number_format((int) $song->streams) ?></td>
                        <td><?= number_format((float) $song->rating, 1) ?>/5</td>
                        <td>$<?= number_format((float) $item['estimated_revenue'], 2) ?></td>
                        <td>
                            <div class="score">
                                <span style="width: <?= min(100, (float) $item['popularity_score']) ?>%"></span>
                            </div>
                            <small><?= number_format((float) $item['popularity_score'], 1) ?>/100</small>
                        </td>
                        <td class="actions">
                            <a href="/songs/show?id=<?= (int) $song->id ?>">Ver</a>
                            <a href="/songs/edit?id=<?= (int) $song->id ?>">Editar</a>
                            <form method="post" action="/songs/delete" onsubmit="return confirm('¿Eliminar esta canción?')">
                                <?= Security::csrfField() ?>
                                <input type="hidden" name="id" value="<?= (int) $song->id ?>">
                                <button type="submit" class="danger-link">Eliminar</button>
                            </form>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
</section>
