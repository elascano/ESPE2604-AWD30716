<?php
declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

final class Level extends Model
{
    protected $table = 'levels';
    protected $guarded = ['id'];
    public $timestamps = false;
}
