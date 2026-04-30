<?php

namespace Models;

use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Uuid;

class Post extends Model
{
    protected $table = 'posts';
    protected $keyType = 'string';
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'title',
        'content',
        'user_id'
    ];

    protected static function booted()
    {
        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = Uuid::uuid4()->toString();
            }
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
