<?php
declare(strict_types=1);

namespace App\Model;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class AttendanceRecord extends BaseModel
{
    protected $table = 'attendance_records';

    /**
     * A record may point to a registered student, or be a manual teacher entry.
     */
    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class, 'student_id');
    }
}
