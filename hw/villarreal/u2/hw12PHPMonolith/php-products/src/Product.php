<?php

declare(strict_types=1);

namespace App;

use MongoDB\BSON\UTCDateTime;

final class Product
{
    private const VAT_RATE = 0.15;

    public function __construct(
        private string $id = '',
        private string $name = '',
        private string $category = '',
        private float $basePrice = 0.0,
        private int $quantity = 0,
        private string $description = '',
        private string $registrationDate = ''
    ) {
        if ($this->registrationDate === '') {
            $this->registrationDate = (new \DateTimeImmutable())->format('c');
        }
    }

    public static function fromBson(object $document): self
    {
        $regDate = $document['RegistrationDate'];

        if ($regDate instanceof UTCDateTime) {
            $regDate = $regDate->toDateTime()->format('c');
        }

        return new self(
            id: (string) $document['_id'],
            name: (string) $document['Name'],
            category: (string) $document['Category'],
            basePrice: (float) (string) $document['BasePrice'],
            quantity: (int) $document['Quantity'],
            description: (string) ($document['Description'] ?? ''),
            registrationDate: (string) $regDate
        );
    }

    public function toBson(): array
    {
        return [
            'Name' => $this->name,
            'Category' => $this->category,
            'BasePrice' => $this->basePrice,
            'Quantity' => $this->quantity,
            'Description' => $this->description,
            'RegistrationDate' => new UTCDateTime(new \DateTimeImmutable($this->registrationDate)),
        ];
    }

    public function getId(): string
    {
        return $this->id;
    }

    public function setId(string $id): void
    {
        $this->id = $id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getCategory(): string
    {
        return $this->category;
    }

    public function getBasePrice(): float
    {
        return $this->basePrice;
    }

    public function getQuantity(): int
    {
        return $this->quantity;
    }

    public function getDescription(): string
    {
        return $this->description;
    }

    public function getRegistrationDate(): string
    {
        return $this->registrationDate;
    }

    public function getTax(): float
    {
        return round($this->basePrice * self::VAT_RATE, 2);
    }

    public function getPriceWithTax(): float
    {
        return round($this->basePrice + $this->getTax(), 2);
    }

    public function getTotal(): float
    {
        return round($this->getPriceWithTax() * $this->quantity, 2);
    }

    public static function getVatRate(): float
    {
        return self::VAT_RATE;
    }
}
