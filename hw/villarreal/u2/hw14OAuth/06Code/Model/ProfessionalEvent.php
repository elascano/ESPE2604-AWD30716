<?php
declare(strict_types=1);

namespace App\Model;

use Illuminate\Database\Eloquent\Relations\HasMany;

final class ProfessionalEvent extends BaseModel
{
    protected $table = 'professional_events';

    /**
     * A professional event can have one or more dancer assignments.
     */
    public function assignments(): HasMany
    {
        return $this->hasMany(DancerEventAssignment::class, 'professional_event_id');
    }
}
