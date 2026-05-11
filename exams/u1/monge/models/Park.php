<?php

namespace Models;

use Illuminate\Database\Eloquent\Model;

class Park extends Model
{
    protected $table = 'park';
    protected $primaryKey = 'park_id';
    public $timestamps = false;

    protected $fillable = [
        'park_name',
        'city',
        'province',
        'capacity',
        'kids_allowed',
        'pets_allowed',
        'manager_name',
        'manager_id'
    ];

    protected $casts = [
        'kids_allowed' => 'boolean',
        'pets_allowed' => 'boolean',
        'capacity' => 'integer',
        'manager_id' => 'integer'
    ];
}