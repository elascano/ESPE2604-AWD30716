<?php

declare(strict_types=1);

namespace App\Models;

use App\Core\ORM\Model;

final class Song extends Model
{
    protected static string $table = 'songs';

    protected static array $fillable = [
        'title',
        'artist',
        'album',
        'genre',
        'duration_seconds',
        'release_year',
        'streams',
        'likes',
        'rating',
        'explicit_content',
        'royalty_per_stream',
    ];
}
