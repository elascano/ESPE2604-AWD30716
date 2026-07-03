<?php
declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

final class Branch extends Model
{
    protected $table = 'branches';
    protected $guarded = ['id'];
}
