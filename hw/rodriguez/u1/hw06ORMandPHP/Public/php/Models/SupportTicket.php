<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SupportTicket extends Model
{
    protected $table      = 'support_tickets';
    protected $primaryKey = 'id';
    public    $timestamps = true;

    protected $fillable = [
        'full_name',
        'ruc',
        'email',
        'category',
        'subject',
        'message',
        'priority',
    ];
}
