<?php

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    protected $table = 'users';

    protected $fillable = [
        'name',
        'email',
        'password',
        'lastname',
        'username',
        'ruc',
    ];

    public $timestamps = false;

    protected $hidden = [
        'password',
    ];

    public function setPasswordAttribute($value)
    {
        if ($value) {
            $this->attributes['password'] = password_hash($value, PASSWORD_DEFAULT);
        }
    }
}
?>