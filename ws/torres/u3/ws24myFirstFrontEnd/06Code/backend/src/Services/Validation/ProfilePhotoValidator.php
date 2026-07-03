<?php
declare(strict_types=1);

namespace App\Services\Validation;

final class ProfilePhotoValidator
{
    /** Validates a student profile image as a safe data URI or direct image URL. */
    public function validate(array $data): array
    {
        $photoUrl = trim((string) ($data['photo_url'] ?? ''));

        if ($photoUrl === '') {
            return ['photo_url' => 'Profile photo is required.'];
        }

        if ($this->isAllowedDataUri($photoUrl) || $this->isAllowedRemoteUrl($photoUrl)) {
            return [];
        }

        return ['photo_url' => 'Profile photo must be a PNG, JPEG, WEBP data image, or a valid image URL.'];
    }

    private function isAllowedDataUri(string $photoUrl): bool
    {
        if (!preg_match('/^data:image\/(?:png|jpeg|jpg|webp);base64,([A-Za-z0-9+\/=]+)$/', $photoUrl, $matches)) {
            return false;
        }

        $decoded = base64_decode($matches[1], true);
        return $decoded !== false && strlen($decoded) <= 900000;
    }

    private function isAllowedRemoteUrl(string $photoUrl): bool
    {
        if (!filter_var($photoUrl, FILTER_VALIDATE_URL)) {
            return false;
        }

        $scheme = strtolower((string) parse_url($photoUrl, PHP_URL_SCHEME));
        $path = strtolower((string) parse_url($photoUrl, PHP_URL_PATH));

        return in_array($scheme, ['http', 'https'], true)
            && (bool) preg_match('/\.(?:png|jpe?g|webp)$/', $path);
    }
}
