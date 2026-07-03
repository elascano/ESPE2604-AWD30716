<?php
declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

final class DanceStyle extends Model
{
    protected $table = 'dance_styles';
    protected $guarded = ['id'];
    public $timestamps = false;
}
