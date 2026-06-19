<?php
declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

final class BranchFinanceReport extends Model
{
    protected $table = 'branch_finance_reports';
    protected $guarded = ['id'];
}
