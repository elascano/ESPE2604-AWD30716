<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\Security;
use App\Core\View;
use App\Models\Song;
use App\Services\SongCalculator;

final class SongController
{
    public function index(): void
    {
        $q = trim((string) ($_GET['q'] ?? ''));

        $songs = $q !== ''
            ? Song::whereLike(['title', 'artist', 'album', 'genre'], $q, 'created_at DESC')
            : Song::all('created_at DESC');

        $items = array_map(fn (Song $song) => SongCalculator::enrich($song), $songs);
        $stats = SongCalculator::stats($songs);

        View::render('songs/index', [
            'items' => $items,
            'stats' => $stats,
            'q' => $q,
            'success' => $_GET['success'] ?? null,
        ]);
    }

    public function create(): void
    {
        View::render('songs/form', [
            'song' => null,
            'action' => '/songs',
            'methodLabel' => 'Registrar canción',
            'errors' => [],
        ]);
    }

    public function store(): void
    {
        Security::verifyCsrf();
        [$data, $errors] = $this->validate($_POST);

        if ($errors) {
            View::render('songs/form', [
                'song' => (object) $data,
                'action' => '/songs',
                'methodLabel' => 'Registrar canción',
                'errors' => $errors,
            ]);
            return;
        }

        Song::create($data);
        $this->redirect('/?success=created');
    }

    public function show(): void
    {
        $song = Song::find((int) ($_GET['id'] ?? 0));

        if (!$song) {
            http_response_code(404);
            View::render('not-found', ['path' => 'Canción no encontrada']);
            return;
        }

        View::render('songs/show', [
            'item' => SongCalculator::enrich($song),
        ]);
    }

    public function edit(): void
    {
        $song = Song::find((int) ($_GET['id'] ?? 0));

        if (!$song) {
            http_response_code(404);
            View::render('not-found', ['path' => 'Canción no encontrada']);
            return;
        }

        View::render('songs/form', [
            'song' => $song,
            'action' => '/songs/update?id=' . (int) $song->id,
            'methodLabel' => 'Actualizar canción',
            'errors' => [],
        ]);
    }

    public function update(): void
    {
        Security::verifyCsrf();
        $id = (int) ($_GET['id'] ?? 0);
        [$data, $errors] = $this->validate($_POST);

        if ($errors) {
            $song = (object) array_merge(['id' => $id], $data);
            View::render('songs/form', [
                'song' => $song,
                'action' => '/songs/update?id=' . $id,
                'methodLabel' => 'Actualizar canción',
                'errors' => $errors,
            ]);
            return;
        }

        Song::updateById($id, $data);
        $this->redirect('/?success=updated');
    }

    public function destroy(): void
    {
        Security::verifyCsrf();
        Song::deleteById((int) ($_POST['id'] ?? 0));
        $this->redirect('/?success=deleted');
    }

    private function validate(array $input): array
    {
        $data = [
            'title' => trim((string) ($input['title'] ?? '')),
            'artist' => trim((string) ($input['artist'] ?? '')),
            'album' => trim((string) ($input['album'] ?? '')),
            'genre' => trim((string) ($input['genre'] ?? '')),
            'duration_seconds' => (int) ($input['duration_seconds'] ?? 0),
            'release_year' => (int) ($input['release_year'] ?? 0),
            'streams' => (int) ($input['streams'] ?? 0),
            'likes' => (int) ($input['likes'] ?? 0),
            'rating' => (float) ($input['rating'] ?? 0),
            'explicit_content' => isset($input['explicit_content']) ? 1 : 0,
            'royalty_per_stream' => (float) ($input['royalty_per_stream'] ?? 0),
        ];

        $errors = [];

        if ($data['title'] === '') {
            $errors[] = 'El título es obligatorio.';
        }

        if ($data['artist'] === '') {
            $errors[] = 'El artista es obligatorio.';
        }

        if ($data['genre'] === '') {
            $errors[] = 'El género es obligatorio.';
        }

        if ($data['duration_seconds'] < 1) {
            $errors[] = 'La duración debe ser mayor a 0 segundos.';
        }

        if ($data['release_year'] < 1900 || $data['release_year'] > ((int) date('Y') + 1)) {
            $errors[] = 'El año de lanzamiento no es válido.';
        }

        if ($data['streams'] < 0 || $data['likes'] < 0) {
            $errors[] = 'Streams y likes no pueden ser negativos.';
        }

        if ($data['rating'] < 0 || $data['rating'] > 5) {
            $errors[] = 'El rating debe estar entre 0 y 5.';
        }

        if ($data['royalty_per_stream'] < 0) {
            $errors[] = 'El pago por reproducción no puede ser negativo.';
        }

        return [$data, $errors];
    }

    private function redirect(string $path): void
    {
        header('Location: ' . $path);
        exit;
    }
}
