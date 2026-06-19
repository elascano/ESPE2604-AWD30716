<?php
declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

final class ClassPlan extends Model
{
    protected $table = 'class_plans';
    protected $guarded = ['id'];
}
