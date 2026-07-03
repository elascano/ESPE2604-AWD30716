<?php
declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class ProfessionalEvent extends Model
{
    protected $table = 'professional_events';
    protected $guarded = ['id'];

    public function assignments(): HasMany
    {
        return $this->hasMany(DancerEventAssignment::class, 'professional_event_id');
    }
}
