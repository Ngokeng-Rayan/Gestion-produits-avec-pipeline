<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    private function authenticatedUser(): array
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;

        return [$user, $token];
    }

    public function test_authenticated_user_can_get_dashboard_statistics(): void
    {
        [$user, $token] = $this->authenticatedUser();

        // Créer des données de test
        Product::factory()->count(10)->create(['user_id' => $user->id]);
        Category::factory()->count(5)->create();

        $response = $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson('/api/dashboard/stats');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'total_products',
                'total_value',
                'total_quantity',
                'low_stock_products',
                'out_of_stock_products',
                'categories_count',
                'products_by_category',
                'recent_products',
                'top_value_products',
            ]);
    }

    public function test_unauthenticated_user_cannot_access_dashboard(): void
    {
        $response = $this->getJson('/api/dashboard/stats');

        $response->assertStatus(401);
    }
}
