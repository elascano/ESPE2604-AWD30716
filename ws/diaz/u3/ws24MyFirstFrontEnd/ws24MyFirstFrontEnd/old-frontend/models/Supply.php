<?php

use Illuminate\Database\Eloquent\Model;

class Supply extends Model {
    protected $table = 'supplies';

    protected $fillable = [
        'supplyName',
        'quantity',
        'unitCost',
        'orderDate',
        'expirationDate',
        'status'
    ];

    public function isValidQuantity() {
        return $this->quantity > 0;
    }

    public function areDatesValid() {
        if (empty($this->orderDate) || empty($this->expirationDate)) {
            return false;
        }
        
        $order = new DateTime($this->orderDate);
        $order->setTime(0, 0, 0);
        
        $expiration = new DateTime($this->expirationDate);
        $expiration->setTime(0, 0, 0);
        
        return $expiration >= $order;
    }

    public function calculateStatus() {
        if (empty($this->expirationDate)) {
            return 'Pending';
        }

        $currentDate = new DateTime();
        $currentDate->setTime(0, 0, 0);

        $expiration = new DateTime($this->expirationDate);
        $expiration->setTime(0, 0, 0);

        $interval = $currentDate->diff($expiration);

        if ($expiration < $currentDate) {
            $this->status = 'Expired';
        } elseif ($interval->days <= 30 && $interval->invert == 0) {
            $this->status = 'NextExpiration';
        } else {
            $this->status = 'Current';
        }

        return $this->status;
    }
}