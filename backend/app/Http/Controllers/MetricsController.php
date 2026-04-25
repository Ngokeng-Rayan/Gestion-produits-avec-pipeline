<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class MetricsController extends Controller
{
    /**
     * Expose les métriques au format Prometheus
     */
    public function index()
    {
        $metrics = [];

        // ==========================================
        // MÉTRIQUES APPLICATIVES
        // ==========================================

        // Métriques applicatives (nécessitent la DB)
        try {
            $totalUsers = User::count();
            $totalProducts = Product::count();
            $totalCategories = Category::count();
            $productsInStock = Product::where('quantity', '>', 0)->count();
            $productsOutOfStock = Product::where('quantity', '=', 0)->count();
            $totalStockValue = Product::sum(DB::raw('price * quantity')) ?? 0;
            $avgPrice = Product::avg('price') ?? 0;
            $avgQuantity = Product::avg('quantity') ?? 0;

            $metrics[] = "# HELP laravel_users_total Nombre total d'utilisateurs";
            $metrics[] = "# TYPE laravel_users_total gauge";
            $metrics[] = "laravel_users_total $totalUsers";

            $metrics[] = "# HELP laravel_products_total Nombre total de produits";
            $metrics[] = "# TYPE laravel_products_total gauge";
            $metrics[] = "laravel_products_total $totalProducts";

            $metrics[] = "# HELP laravel_categories_total Nombre total de catégories";
            $metrics[] = "# TYPE laravel_categories_total gauge";
            $metrics[] = "laravel_categories_total $totalCategories";

            $metrics[] = "# HELP laravel_products_in_stock Nombre de produits en stock";
            $metrics[] = "# TYPE laravel_products_in_stock gauge";
            $metrics[] = "laravel_products_in_stock $productsInStock";

            $metrics[] = "# HELP laravel_products_out_of_stock Nombre de produits en rupture";
            $metrics[] = "# TYPE laravel_products_out_of_stock gauge";
            $metrics[] = "laravel_products_out_of_stock $productsOutOfStock";

            $metrics[] = "# HELP laravel_stock_value_total Valeur totale du stock en euros";
            $metrics[] = "# TYPE laravel_stock_value_total gauge";
            $metrics[] = "laravel_stock_value_total $totalStockValue";

            $metrics[] = "# HELP laravel_products_avg_price Prix moyen des produits";
            $metrics[] = "# TYPE laravel_products_avg_price gauge";
            $metrics[] = "laravel_products_avg_price $avgPrice";

            $metrics[] = "# HELP laravel_products_avg_quantity Quantité moyenne en stock";
            $metrics[] = "# TYPE laravel_products_avg_quantity gauge";
            $metrics[] = "laravel_products_avg_quantity $avgQuantity";

            $productsByCategory = Product::select('category_id', DB::raw('count(*) as count'))
                ->groupBy('category_id')
                ->get();
            $metrics[] = "# HELP laravel_products_by_category Nombre de produits par catégorie";
            $metrics[] = "# TYPE laravel_products_by_category gauge";
            foreach ($productsByCategory as $item) {
                $categoryId = $item->category_id ?? 'null';
                $metrics[] = "laravel_products_by_category{category_id=\"$categoryId\"} {$item->count}";
            }
        } catch (\Exception $e) {
            $metrics[] = "# DB unavailable: {$e->getMessage()}";
            $metrics[] = "laravel_db_up 0";
        }

        // ==========================================
        // MÉTRIQUES DE BASE DE DONNÉES
        // ==========================================

        // Taille de la base de données (approximative)
        try {
            $dbSize = DB::select("
                SELECT SUM(data_length + index_length) as size 
                FROM information_schema.TABLES 
                WHERE table_schema = DATABASE()
            ");
            $dbSizeBytes = $dbSize[0]->size ?? 0;
            $metrics[] = "# HELP laravel_database_size_bytes Taille de la base de données en bytes";
            $metrics[] = "# TYPE laravel_database_size_bytes gauge";
            $metrics[] = "laravel_database_size_bytes $dbSizeBytes";
        } catch (\Exception $e) {
            // Ignorer si la requête échoue
        }

        // ==========================================
        // MÉTRIQUES SYSTÈME LARAVEL
        // ==========================================

        // Version de Laravel
        $laravelVersion = app()->version();
        $metrics[] = "# HELP laravel_version Version de Laravel";
        $metrics[] = "# TYPE laravel_version gauge";
        $metrics[] = "laravel_version{version=\"$laravelVersion\"} 1";

        // Environnement
        $environment = config('app.env');
        $metrics[] = "# HELP laravel_environment Environnement de l'application";
        $metrics[] = "# TYPE laravel_environment gauge";
        $metrics[] = "laravel_environment{env=\"$environment\"} 1";

        // Mode debug
        $debugMode = config('app.debug') ? 1 : 0;
        $metrics[] = "# HELP laravel_debug_mode Mode debug activé (1) ou désactivé (0)";
        $metrics[] = "# TYPE laravel_debug_mode gauge";
        $metrics[] = "laravel_debug_mode $debugMode";

        // ==========================================
        // MÉTRIQUES DE PERFORMANCE
        // ==========================================

        // Temps de génération de la page
        $executionTime = microtime(true) - LARAVEL_START;
        $metrics[] = "# HELP laravel_request_duration_seconds Durée de la requête en secondes";
        $metrics[] = "# TYPE laravel_request_duration_seconds gauge";
        $metrics[] = "laravel_request_duration_seconds $executionTime";

        // Utilisation mémoire
        $memoryUsage = memory_get_usage(true);
        $metrics[] = "# HELP laravel_memory_usage_bytes Utilisation mémoire en bytes";
        $metrics[] = "# TYPE laravel_memory_usage_bytes gauge";
        $metrics[] = "laravel_memory_usage_bytes $memoryUsage";

        // Pic d'utilisation mémoire
        $memoryPeak = memory_get_peak_usage(true);
        $metrics[] = "# HELP laravel_memory_peak_bytes Pic d'utilisation mémoire en bytes";
        $metrics[] = "# TYPE laravel_memory_peak_bytes gauge";
        $metrics[] = "laravel_memory_peak_bytes $memoryPeak";

        // Retourner les métriques au format texte brut
        return response(implode("\n", $metrics)."\n")
            ->header('Content-Type', 'text/plain; version=0.0.4');
    }
}
