<?php

use App\Core\Security;

function old_value(object|null $song, string $field, mixed $default = ''): string
{
    return Security::e($song->{$field} ?? $default);
}
?>
<section class="hero compact">
    <div>
        <span class="eyebrow">Formulario dinámico</span>
        <h1><?= Security::e($methodLabel) ?></h1>
        <p>Complete los campos. El cálculo de ganancia y popularidad se actualiza automáticamente con JavaScript.</p>
    </div>
</section>

<?php if ($errors): ?>
    <div class="alert error">
        <strong>Revise los siguientes campos:</strong>
        <ul>
            <?php foreach ($errors as $error): ?>
                <li><?= Security::e($error) ?></li>
            <?php endforeach; ?>
        </ul>
    </div>
<?php endif; ?>

<section class="form-layout">
    <form class="panel form-card" method="post" action="<?= Security::e($action) ?>" data-song-form>
        <?= Security::csrfField() ?>

        <div class="form-grid">
            <label>
                Título
                <input name="title" required value="<?= old_value($song, 'title') ?>" placeholder="Ej. Blinding Lights">
            </label>

            <label>
                Artista
                <input name="artist" required value="<?= old_value($song, 'artist') ?>" placeholder="Ej. The Weeknd">
            </label>

            <label>
                Álbum
                <input name="album" value="<?= old_value($song, 'album') ?>" placeholder="Ej. After Hours">
            </label>

            <label>
                Género
                <input name="genre" required value="<?= old_value($song, 'genre') ?>" placeholder="Ej. Pop">
            </label>

            <label>
                Duración en segundos
                <input type="number" min="1" name="duration_seconds" required value="<?= old_value($song, 'duration_seconds', 210) ?>">
            </label>

            <label>
                Año de lanzamiento
                <input type="number" min="1900" max="<?= (int) date('Y') + 1 ?>" name="release_year" required value="<?= old_value($song, 'release_year', date('Y')) ?>">
            </label>

            <label>
                Reproducciones / streams
                <input type="number" min="0" name="streams" required value="<?= old_value($song, 'streams', 0) ?>">
            </label>

            <label>
                Likes
                <input type="number" min="0" name="likes" required value="<?= old_value($song, 'likes', 0) ?>">
            </label>

            <label>
                Rating de 0 a 5
                <input type="number" min="0" max="5" step="0.1" name="rating" required value="<?= old_value($song, 'rating', 4.5) ?>">
            </label>

            <label>
                Pago por reproducción
                <input type="number" min="0" step="0.000001" name="royalty_per_stream" required value="<?= old_value($song, 'royalty_per_stream', '0.003500') ?>">
            </label>
        </div>

        <label class="check-row">
            <input type="checkbox" name="explicit_content" value="1" <?= ((int) ($song->explicit_content ?? 0)) === 1 ? 'checked' : '' ?>>
            Contiene contenido explícito
        </label>

        <div class="form-actions">
            <button type="submit" class="button"><?= Security::e($methodLabel) ?></button>
            <a href="/" class="ghost">Cancelar</a>
        </div>
    </form>

    <aside class="calculation-card" data-calculation-preview>
        <span class="eyebrow">Cálculo automático</span>
        <h2>Resultado estimado</h2>
        <div class="calc-line">
            <span>Ganancia estimada</span>
            <strong data-revenue>$0.00</strong>
        </div>
        <div class="calc-line">
            <span>Puntaje de popularidad</span>
            <strong data-score>0/100</strong>
        </div>
        <div class="calc-line">
            <span>Duración formateada</span>
            <strong data-duration>0:00</strong>
        </div>
        <p>Fórmula principal: <strong>ganancia = streams × pago por reproducción</strong>.</p>
    </aside>
</section>
