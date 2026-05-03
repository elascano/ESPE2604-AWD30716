<?php

class Supply {
    public $productName;
    public $productCode;
    public $productInitialQuantity;
    public $productUnitCost;
    public $productPurchaseDate;
    public $productExpirationDate;
    public $creado_en;

    public function __construct($data) {
        $this->productName = $data['productName'] ?? '';
        $this->productCode = $data['productCode'] ?? '';
        
        $rawQuantity = trim((string) ($data['productInitialQuantity'] ?? ''));
        $validatedQuantity = filter_var(
            $rawQuantity,
            FILTER_VALIDATE_INT,
            ['options' => ['min_range' => 1]]
        );
        $this->productInitialQuantity = $validatedQuantity !== false ? $validatedQuantity : 0;
        
        $this->productUnitCost = (float) ($data['productUnitCost'] ?? 0);
        $this->productPurchaseDate = $data['productPurchaseDate'] ?? '';
        $this->productExpirationDate = $data['productExpirationDate'] ?? '';
        $this->creado_en = new MongoDB\BSON\UTCDateTime();
    }

    public function isValidQuantity() {
        return $this->productInitialQuantity > 0;
    }

    public function toArray() {
        return [
            'productName' => $this->productName,
            'productCode' => $this->productCode,
            'productInitialQuantity' => $this->productInitialQuantity,
            'productUnitCost' => $this->productUnitCost,
            'productPurchaseDate' => $this->productPurchaseDate,
            'productExpirationDate' => $this->productExpirationDate,
            'creado_en' => $this->creado_en
        ];
    }
}
