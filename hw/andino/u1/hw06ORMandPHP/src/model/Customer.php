<?php
namespace App\model;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model {
    protected $table = 'customers';
    
    public $timestamps = true; 

    protected $fillable = [
        'names', 
        'surnames', 
        'birth_date', 
        'age', 
        'email',
        'cellphone'
    ];
}