<?php

use Illuminate\Database\Eloquent\Model;

class Professor extends Model
{
    protected $table = 'professors';

    protected $fillable = [
        'fullName',
        'age',
        'email',
        'phone',
        'salary',
        'department',
        'hireDate',
        'officeLocation',
    ];

    public $timestamps = false;
}