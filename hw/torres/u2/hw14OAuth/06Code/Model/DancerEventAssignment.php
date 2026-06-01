<?php
declare(strict_types=1);

namespace App\Model;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class DancerEventAssignment extends BaseModel
{
    protected $table = 'dancer_event_assignments';

    /**
     * The professional event that generated this dancer payment.
     */
    public function event(): BelongsTo
    {
        return $this->belongsTo(ProfessionalEvent::class, 'professional_event_id');
    }

    /**
     * The assigned B2 student/dancer.
     */
    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class, 'student_id');
    }
}
