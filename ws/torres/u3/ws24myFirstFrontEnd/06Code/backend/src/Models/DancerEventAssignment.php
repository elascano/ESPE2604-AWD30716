<?php
declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class DancerEventAssignment extends Model
{
    protected $table = 'dancer_event_assignments';
    protected $guarded = ['id'];

    public function event(): BelongsTo
    {
        return $this->belongsTo(ProfessionalEvent::class, 'professional_event_id');
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class, 'student_id');
    }
}
