<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| Public information pages
|--------------------------------------------------------------------------
| Visible URLs such as /about, /service or /contact render the main layout.
| JavaScript then loads the corresponding partial content from /info/content.
*/

Route::get('/', function () {
    return view('info.index');
});

Route::get('/info/content/{section}', function (string $section) {
    $views = [
        'about' => 'info.about',
        'service' => 'info.service',
        'price' => 'info.price',
        'team' => 'info.team',
        'open' => 'info.open',
        'testimonial' => 'info.testimonial',
        'contact' => 'info.contact',
        'not-found' => 'info.404',
    ];

    abort_unless(array_key_exists($section, $views), 404);

    return view($views[$section]);
});

Route::get('/{page}', function () {
    return view('info.index');
})->where('page', 'about|service|price|team|open|testimonial|contact|404');

Route::get('/auth/logout', function (Request $request) {
    $request->session()->flush();
    $request->session()->invalidate();
    $request->session()->regenerateToken();

    return redirect('/customer/login')
        ->withHeaders([
            'Cache-Control' => 'no-store, no-cache, must-revalidate, max-age=0',
            'Pragma' => 'no-cache',
            'Expires' => '0',
        ]);
});

/*
|--------------------------------------------------------------------------
| Protected dashboard helpers
|--------------------------------------------------------------------------
| The dashboard views must not be served after logout or without a valid
| Laravel session. If the user opens a saved dashboard URL, a temporary
| access-denied page is shown for the activity and then returns to login.
*/

$sessionExpiredResponse = function (string $message = 'La sesión no está activa o ya fue cerrada.', string $redirectUrl = '/customer/login') {
    return response()
        ->view('errors.session-expired', [
            'message' => $message,
            'redirectUrl' => $redirectUrl,
            'seconds' => 7,
        ], 401)
        ->header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        ->header('Pragma', 'no-cache')
        ->header('Expires', '0');
};

$protectedDashboard = function (string $view, string $requiredRole, string $loginUrl = '/customer/login') use ($sessionExpiredResponse) {
    if (!session('user_id')) {
        return $sessionExpiredResponse(
            'No se puede acceder al panel porque la sesión fue cerrada o no existe una sesión activa.',
            $loginUrl
        );
    }

    $currentRole = session('role') ?: 'customer';

    if ($currentRole !== $requiredRole) {
        return $sessionExpiredResponse(
            'La sesión actual no tiene permisos para acceder a este panel.',
            $loginUrl
        );
    }

    return response()
        ->view($view)
        ->header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        ->header('Pragma', 'no-cache')
        ->header('Expires', '0');
};

/*
|--------------------------------------------------------------------------
| Dashboards
|--------------------------------------------------------------------------
*/

Route::get('/barber/dashboard/{tab?}', function ($tab = 'agenda') use ($protectedDashboard) {
    return $protectedDashboard('barber.dashboard', 'barber', '/customer/login');
})->where('tab', 'agenda|services|products');

Route::get('/customer/dashboard/{tab?}', function ($tab = 'my-appointments') use ($protectedDashboard) {
    return $protectedDashboard('customer.dashboard', 'customer', '/customer/login');
})->where('tab', 'my-appointments|book-appointment|profile');

Route::get('/owner/dashboard/{tab?}', function ($tab = 'dashboard') use ($protectedDashboard) {
    return $protectedDashboard('owner.dashboard', 'owner', '/customer/login');
})->where('tab', 'dashboard|barbershop-info|manage-barbers|global-agenda');

/*
|--------------------------------------------------------------------------
| Customer authentication views
|--------------------------------------------------------------------------
*/

Route::get('/customer/login', function () {
    return view('customer.auth.login');
});

Route::get('/customer/register', function () {
    return view('customer.auth.register');
});

/*
|--------------------------------------------------------------------------
| Google callback
|--------------------------------------------------------------------------
*/

Route::get('/auth/google/callback', function () {
    return view('customer.auth.google-callback');
});
