<?php

use Illuminate\Database\Eloquent\Model;

class Professor extends Model
{
    protected $table = 'professors';

    public $timestamps = false;

    protected $fillable = [
        'fullname',
        'age',
        'email',
        'phone',
        'salary',
        'department',
        'hiredate',
        'officelocation',
    ];
}