<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

class MetricsMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $start = microtime(true);

        $response = $next($request);

        $duration = microtime(true) - $start;
        $status   = $response->getStatusCode();

        try {
            Cache::increment('metrics_request_total');

            if ($status >= 500) {
                Cache::increment('metrics_errors_5xx');
            } elseif ($status >= 400) {
                Cache::increment('metrics_errors_4xx');
            }

            $times   = Cache::get('metrics_response_times', []);
            $times[] = round($duration, 4);
            if (count($times) > 200) {
                $times = array_slice($times, -200);
            }
            Cache::put('metrics_response_times', $times, now()->addDay());

            Cache::put('metrics_last_status', $status, now()->addDay());
        } catch (\Exception $e) {
            // Silencieux
        }

        return $response;
    }
}
