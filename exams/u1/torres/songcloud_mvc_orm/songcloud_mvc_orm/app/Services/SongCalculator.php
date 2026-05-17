<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Song;

final class SongCalculator
{
    public static function estimatedRevenue(Song $song): float
    {
        return round(((float) $song->streams) * ((float) $song->royalty_per_stream), 2);
    }

    public static function popularityScore(Song $song): float
    {
        $streams = max(0, (int) $song->streams);
        $likes = max(0, (int) $song->likes);
        $rating = max(0, min(5, (float) $song->rating));

        $streamScore = min(45, log10($streams + 1) * 8);
        $likeRatio = $streams > 0 ? min(25, ($likes / $streams) * 200) : 0;
        $ratingScore = $rating * 6;

        return round(min(100, $streamScore + $likeRatio + $ratingScore), 1);
    }

    public static function durationLabel(Song $song): string
    {
        $seconds = max(0, (int) $song->duration_seconds);
        $minutes = intdiv($seconds, 60);
        $remainingSeconds = $seconds % 60;

        return sprintf('%d:%02d', $minutes, $remainingSeconds);
    }

    public static function enrich(Song $song): array
    {
        return [
            'model' => $song,
            'estimated_revenue' => self::estimatedRevenue($song),
            'popularity_score' => self::popularityScore($song),
            'duration_label' => self::durationLabel($song),
        ];
    }

    public static function stats(array $songs): array
    {
        $totalStreams = 0;
        $totalRevenue = 0.0;
        $totalRating = 0.0;

        foreach ($songs as $song) {
            $totalStreams += (int) $song->streams;
            $totalRevenue += self::estimatedRevenue($song);
            $totalRating += (float) $song->rating;
        }

        $count = count($songs);

        return [
            'count' => $count,
            'streams' => $totalStreams,
            'revenue' => round($totalRevenue, 2),
            'average_rating' => $count > 0 ? round($totalRating / $count, 2) : 0,
        ];
    }
}
