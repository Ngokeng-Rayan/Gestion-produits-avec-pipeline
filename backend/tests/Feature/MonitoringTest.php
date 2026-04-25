<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Log;
use Tests\TestCase;

/**
 * @group monitoring
 */
class MonitoringTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test que l'endpoint /metrics est accessible
     */
    public function test_metrics_endpoint_is_accessible(): void
    {
        $response = $this->get('/metrics');

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'text/plain; version=0.0.4; charset=UTF-8');
    }

    /**
     * Test que les métriques contiennent les données attendues
     */
    public function test_metrics_contain_expected_data(): void
    {
        // Créer des données de test
        User::factory()->count(5)->create();
        Category::factory()->count(3)->create();
        Product::factory()->count(10)->create();

        $response = $this->get('/metrics');

        $content = $response->getContent();

        // Vérifier que les métriques sont présentes
        $this->assertStringContainsString('laravel_users_total', $content);
        $this->assertStringContainsString('laravel_products_total', $content);
        $this->assertStringContainsString('laravel_categories_total', $content);
        $this->assertStringContainsString('laravel_products_in_stock', $content);
        $this->assertStringContainsString('laravel_products_out_of_stock', $content);
        $this->assertStringContainsString('laravel_stock_value_total', $content);
    }

    /**
     * Test que les logs sont générés correctement
     */
    public function test_logs_are_generated(): void
    {
        // Générer différents niveaux de logs
        Log::info('Test info log from monitoring test');
        Log::warning('Test warning log from monitoring test');
        Log::error('Test error log from monitoring test');

        // Vérifier que les logs sont écrits
        $logFile = storage_path('logs/laravel.log');
        $this->assertFileExists($logFile);

        $logContent = file_get_contents($logFile);
        $this->assertStringContainsString('Test info log from monitoring test', $logContent);
    }

    /**
     * Test que les métriques de performance sont collectées
     */
    public function test_performance_metrics_are_collected(): void
    {
        $response = $this->get('/metrics');

        $content = $response->getContent();

        // Vérifier les métriques de performance
        $this->assertStringContainsString('laravel_request_duration_seconds', $content);
        $this->assertStringContainsString('laravel_memory_usage_bytes', $content);
        $this->assertStringContainsString('laravel_memory_peak_bytes', $content);
    }

    /**
     * Test que les métriques métier sont correctes
     */
    public function test_business_metrics_are_accurate(): void
    {
        // Créer des produits avec des prix et quantités spécifiques
        Product::factory()->create(['price' => 100, 'quantity' => 10]);
        Product::factory()->create(['price' => 200, 'quantity' => 0]);
        Product::factory()->create(['price' => 150, 'quantity' => 5]);

        $response = $this->get('/metrics');
        $content = $response->getContent();

        // Vérifier que les métriques reflètent les données
        $this->assertStringContainsString('laravel_products_total 3', $content);
        $this->assertStringContainsString('laravel_products_in_stock 2', $content);
        $this->assertStringContainsString('laravel_products_out_of_stock 1', $content);

        // Valeur du stock : (100*10) + (200*0) + (150*5) = 1750
        $this->assertStringContainsString('laravel_stock_value_total 1750', $content);
    }

    /**
     * Test que les métriques système sont présentes
     */
    public function test_system_metrics_are_present(): void
    {
        $response = $this->get('/metrics');
        $content = $response->getContent();

        // Vérifier les métriques système
        $this->assertStringContainsString('laravel_version', $content);
        $this->assertStringContainsString('laravel_environment', $content);
        $this->assertStringContainsString('laravel_debug_mode', $content);
    }

    /**
     * Test de génération de logs pour différents scénarios
     */
    public function test_generate_various_logs_for_monitoring(): void
    {
        // Logs d'information
        Log::info('User logged in', ['user_id' => 1, 'ip' => '127.0.0.1']);
        Log::info('Product created', ['product_id' => 1, 'name' => 'Test Product']);

        // Logs d'avertissement
        Log::warning('Low stock detected', ['product_id' => 1, 'quantity' => 2]);
        Log::warning('Slow query detected', ['duration' => 2.5, 'query' => 'SELECT * FROM products']);

        // Logs d'erreur
        Log::error('Database connection failed', ['error' => 'Connection timeout']);
        Log::error('Payment processing failed', ['order_id' => 123, 'amount' => 99.99]);

        // Vérifier que les logs sont écrits
        $logFile = storage_path('logs/laravel.log');
        $this->assertFileExists($logFile);
    }

    /**
     * Test de simulation de charge pour le monitoring
     */
    public function test_simulate_load_for_monitoring(): void
    {
        // Créer beaucoup de données pour simuler une charge
        User::factory()->count(50)->create();
        Category::factory()->count(10)->create();
        Product::factory()->count(100)->create();

        // Effectuer plusieurs requêtes
        for ($i = 0; $i < 10; $i++) {
            $this->get('/metrics');
            Log::info("Load test iteration $i");
        }

        // Vérifier que les métriques reflètent la charge
        $response = $this->get('/metrics');
        $content = $response->getContent();

        $this->assertStringContainsString('laravel_users_total 50', $content);
        $this->assertStringContainsString('laravel_products_total 100', $content);
    }
}
