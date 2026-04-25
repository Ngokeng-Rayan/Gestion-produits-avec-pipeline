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
            $ttl = now()->addYear();

            Cache::put('metrics_request_total', Cache::get('metrics_request_total', 0) + 1, $ttl);

            if ($status >= 500) {
                Cache::put('metrics_errors_5xx', Cache::get('metrics_errors_5xx', 0) + 1, $ttl);
            } elseif ($status >= 400) {
                Cache::put('metrics_errors_4xx', Cache::get('metrics_errors_4xx', 0) + 1, $ttl);
            }

            $times   = Cache::get('metrics_response_times', []);
            $times[] = round($duration, 4);
            if (count($times) > 200) {
                $times = array_slice($times, -200);
            }
            Cache::put('metrics_response_times', $times, $ttl);
        } catch (\Exception $e) {
            // Silencieux
        }

        return $response;
    }
}
