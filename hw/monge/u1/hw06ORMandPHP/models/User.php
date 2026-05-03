<?php

namespace Models;

use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Uuid;

class User extends Model
{
    protected $table = 'users';
    protected $keyType = 'string';
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'name',
        'email',
    ];

    protected static function booted()
    {
        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = Uuid::uuid4()->toString();
            }
        });
    }

    public function posts()
    {
        return $this->hasMany(Post::class, 'user_id');
    }
}
