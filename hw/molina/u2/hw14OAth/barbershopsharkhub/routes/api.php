<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BarberAppointmentController;
use App\Http\Controllers\Api\CustomerAppointmentController;
use App\Http\Controllers\Api\OwnerController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ServiceController;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\Support\Facades\Route;

$sessionMiddleware = [
    EncryptCookies::class,
    AddQueuedCookiesToResponse::class,
    StartSession::class,
];

Route::middleware($sessionMiddleware)->group(function () {
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::get('/auth/supabase-config', function () {
        return response()->json([
            'url' => rtrim(config('services.supabase.url'), '/'),
            'anonKey' => config('services.supabase.anon_key'),
        ]);
    });

    Route::post('/auth/google/session', [AuthController::class, 'googleSession']);

    Route::apiResource('barber/services', ServiceController::class);
    Route::apiResource('barber/products', ProductController::class);

    Route::prefix('barber')->group(function () {
        Route::get('/appointments', [BarberAppointmentController::class, 'index']);
        Route::patch('/appointments/{appointment}/confirm', [BarberAppointmentController::class, 'confirm']);
        Route::patch('/appointments/{appointment}/cancel', [BarberAppointmentController::class, 'cancel']);
    });



    Route::prefix('owner')->group(function () {
        Route::get('/overview', [OwnerController::class, 'overview']);
        Route::get('/barbershop', [OwnerController::class, 'showBarbershop']);
        Route::put('/barbershop', [OwnerController::class, 'updateBarbershop']);

        Route::get('/barbers', [OwnerController::class, 'barbers']);
        Route::post('/barbers', [OwnerController::class, 'storeBarber']);
        Route::patch('/barbers/{member}/status', [OwnerController::class, 'updateBarberStatus']);

        Route::get('/appointments', [OwnerController::class, 'appointments']);
        Route::patch('/appointments/{appointment}/status', [OwnerController::class, 'updateAppointmentStatus']);
    });
    Route::prefix('customer')->group(function () {
        Route::get('/barbers', [CustomerAppointmentController::class, 'barbers']);
        Route::get('/services', [CustomerAppointmentController::class, 'services']);
        Route::get('/available-times', [CustomerAppointmentController::class, 'availableTimes']);
        Route::get('/appointments', [CustomerAppointmentController::class, 'index']);
        Route::post('/appointments', [CustomerAppointmentController::class, 'store']);
        Route::patch('/appointments/{appointment}/cancel', [CustomerAppointmentController::class, 'cancel']);
    });
});
