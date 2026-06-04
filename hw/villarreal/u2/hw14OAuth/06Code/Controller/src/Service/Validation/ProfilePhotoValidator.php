<?php
declare(strict_types=1);

namespace App\Service\Validation;

/**
 * Validates profile photo payloads stored as a URL or compact data URI.
 */
final class ProfilePhotoValidator
{
    private const MAX_IMAGE_BYTES = 900000;

    /**
     * @param array<string, mixed> $data
     * @return array<string, string>
     */
    public function validate(array $data): array
    {
        $errors = [];
        $photoUrl = trim((string) ($data['photo_url'] ?? ''));

        if ($photoUrl === '') {
            $errors['photo_url'] = 'Profile photo is required.';
            return $errors;
        }

        if ($this->isAllowedDataUri($photoUrl, $errors) || $this->isAllowedRemoteUrl($photoUrl)) {
            return $errors;
        }

        if (!isset($errors['photo_url'])) {
            $errors['photo_url'] = 'Profile photo must be a PNG, JPEG, WEBP data image, or a valid image URL.';
        }

        return $errors;
    }

    /**
     * @param array<string, string> $errors
     */
    private function isAllowedDataUri(string $photoUrl, array &$errors): bool
    {
        if (!preg_match('/^data:image\/(?:png|jpeg|jpg|webp);base64,([A-Za-z0-9+\/=]+)$/', $photoUrl, $matches)) {
            return false;
        }

        $decoded = base64_decode($matches[1], true);
        if ($decoded === false) {
            $errors['photo_url'] = 'Profile photo image data is not valid Base64.';
            return false;
        }

        if (strlen($decoded) > self::MAX_IMAGE_BYTES) {
            $errors['photo_url'] = 'Profile photo must be smaller than 900 KB.';
            return false;
        }

        return true;
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
