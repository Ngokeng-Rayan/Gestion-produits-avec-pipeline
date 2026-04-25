<?php

use App\Http\Controllers\MetricsController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Route pour exposer les métriques Prometheus
Route::get('/metrics', [MetricsController::class, 'index']);
