<?php

require_once __DIR__ . '/database.php';

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    protected $table = 'users';

    protected $fillable = [
        'first_name',
        'last_name',
        'id_number',
        'birth_date',
        'age',
        'address',
        'phone',
        'created_at',
    ];

    const UPDATED_AT = null;
}
