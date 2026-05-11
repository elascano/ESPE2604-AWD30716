<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CellPhone extends Model
{
    protected $table = 'cellPhone'; 
    public $timestamps = false; 
    protected $fillable = ['brand', 'model', 'price', 'screen', 'ram', 'storage', 'camera', 'battery']; 
}