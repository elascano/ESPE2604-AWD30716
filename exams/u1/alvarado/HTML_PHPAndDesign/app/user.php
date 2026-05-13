<?php

require_once __DIR__ . '/database.php';

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    protected $table = 'computers';

    protected $fillable = [
        'Model',
        'Year',
        'Battery',
        'Company',
        'GPU',
        'CPU',
        'Price',
        'Color',
        'created_at',
    ];

    const UPDATED_AT = null;
}
