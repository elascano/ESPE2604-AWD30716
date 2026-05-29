<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class User extends Model {
    protected $table = 'users';
    protected $primaryKey = 'user_id';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'user_id',   
        'name',
        'email',
        'role'
    ];

    public static function findOrCreateFromGoogle(array $googleData): array {
        $user = self::find($googleData['sub']);

        if (!$user) {
            // Primera vez que este usuario inicia sesión → lo registramos
            $user = self::create([
                'user_id' => $googleData['sub'],
                'name'    => $googleData['name'],
                'email'   => $googleData['email'],
                'role'    => 'customer'
            ]);
        }

        return $user->toArray();
    }
}
