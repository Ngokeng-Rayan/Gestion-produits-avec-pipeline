<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductTest extends TestCase
{
    use RefreshDatabase;

    private function authenticatedUser(): array
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;

        return [$user, $token];
    }

    public function test_can_list_all_products(): void
    {
        [$user, $token] = $this->authenticatedUser();
        Product::factory()->count(5)->create();

        $response = $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson('/api/products');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'name', 'price', 'quantity', 'user', 'category'],
                ],
            ]);
    }

    public function test_can_search_products_by_name(): void
    {
        [$user, $token] = $this->authenticatedUser();
        Product::factory()->create(['name' => 'iPhone 15']);
        Product::factory()->create(['name' => 'Samsung Galaxy']);

        $response = $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson('/api/products?search=iPhone');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonFragment(['name' => 'iPhone 15']);
    }

    public function test_can_filter_products_by_category(): void
    {
        [$user, $token] = $this->authenticatedUser();
        $category = Category::factory()->create();
        Product::factory()->count(3)->create(['category_id' => $category->id]);
        Product::factory()->count(2)->create();

        $response = $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson('/api/products?category_id='.$category->id);

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data');
    }

    public function test_can_filter_products_by_price_range(): void
    {
        [$user, $token] = $this->authenticatedUser();
        Product::factory()->create(['price' => 50]);
        Product::factory()->create(['price' => 150]);
        Product::factory()->create(['price' => 250]);

        $response = $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson('/api/products?min_price=100&max_price=200');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data');
    }

    public function test_can_filter_in_stock_products(): void
    {
        [$user, $token] = $this->authenticatedUser();
        Product::factory()->create(['quantity' => 10]);
        Product::factory()->create(['quantity' => 0]);

        $response = $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson('/api/products?in_stock=1');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data');
    }

    public function test_authenticated_user_can_create_product(): void
    {
        [$user, $token] = $this->authenticatedUser();
        $category = Category::factory()->create();

        $response = $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/products', [
                'name' => 'New Product',
                'description' => 'Product description',
                'price' => 99.99,
                'quantity' => 10,
                'category_id' => $category->id,
            ]);

        $response->assertStatus(201)
            ->assertJsonFragment([
                'name' => 'New Product',
                'price' => '99.99',
            ]);

        $this->assertDatabaseHas('products', [
            'name' => 'New Product',
            'user_id' => $user->id,
        ]);
    }

    public function test_unauthenticated_user_cannot_create_product(): void
    {
        $response = $this->postJson('/api/products', [
            'name' => 'New Product',
            'price' => 99.99,
            'quantity' => 10,
        ]);

        $response->assertStatus(401);
    }

    public function test_cannot_create_product_with_invalid_data(): void
    {
        [$user, $token] = $this->authenticatedUser();

        $response = $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/products', [
                'name' => '',
                'price' => -10,
                'quantity' => -5,
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'price', 'quantity']);
    }

    public function test_can_show_single_product(): void
    {
        [$user, $token] = $this->authenticatedUser();
        $product = Product::factory()->create();

        $response = $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson('/api/products/'.$product->id);

        $response->assertStatus(200)
            ->assertJsonFragment([
                'id' => $product->id,
                'name' => $product->name,
            ]);
    }

    public function test_owner_can_update_their_product(): void
    {
        [$user, $token] = $this->authenticatedUser();
        $product = Product::factory()->create(['user_id' => $user->id]);

        $response = $this->withHeader('Authorization', 'Bearer '.$token)
            ->putJson('/api/products/'.$product->id, [
                'name' => 'Updated Product',
                'price' => 149.99,
            ]);

        $response->assertStatus(200)
            ->assertJsonFragment([
                'name' => 'Updated Product',
                'price' => '149.99',
            ]);

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'name' => 'Updated Product',
        ]);
    }

    public function test_non_owner_cannot_update_product(): void
    {
        [$user, $token] = $this->authenticatedUser();
        $otherUser = User::factory()->create();
        $product = Product::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->withHeader('Authorization', 'Bearer '.$token)
            ->putJson('/api/products/'.$product->id, [
                'name' => 'Updated Product',
            ]);

        $response->assertStatus(403);
    }

    public function test_owner_can_delete_their_product(): void
    {
        [$user, $token] = $this->authenticatedUser();
        $product = Product::factory()->create(['user_id' => $user->id]);

        $response = $this->withHeader('Authorization', 'Bearer '.$token)
            ->deleteJson('/api/products/'.$product->id);

        $response->assertStatus(200)
            ->assertJson(['message' => 'Product deleted successfully']);

        $this->assertDatabaseMissing('products', [
            'id' => $product->id,
        ]);
    }

    public function test_non_owner_cannot_delete_product(): void
    {
        [$user, $token] = $this->authenticatedUser();
        $otherUser = User::factory()->create();
        $product = Product::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->withHeader('Authorization', 'Bearer '.$token)
            ->deleteJson('/api/products/'.$product->id);

        $response->assertStatus(403);
    }
}
