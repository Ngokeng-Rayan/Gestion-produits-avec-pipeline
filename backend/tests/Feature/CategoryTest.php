<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CategoryTest extends TestCase
{
    use RefreshDatabase;

    private function authenticatedUser(): array
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;

        return [$user, $token];
    }

    public function test_can_list_all_categories(): void
    {
        [$user, $token] = $this->authenticatedUser();
        Category::factory()->count(5)->create();

        $response = $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson('/api/categories');

        $response->assertStatus(200)
            ->assertJsonCount(5)
            ->assertJsonStructure([
                '*' => ['id', 'name', 'slug', 'products_count'],
            ]);
    }

    public function test_authenticated_user_can_create_category(): void
    {
        [$user, $token] = $this->authenticatedUser();

        $response = $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/categories', [
                'name' => 'Electronics',
                'slug' => 'electronics',
                'description' => 'Electronic products',
            ]);

        $response->assertStatus(201)
            ->assertJsonFragment([
                'name' => 'Electronics',
                'slug' => 'electronics',
            ]);

        $this->assertDatabaseHas('categories', [
            'name' => 'Electronics',
        ]);
    }

    public function test_cannot_create_category_with_duplicate_slug(): void
    {
        [$user, $token] = $this->authenticatedUser();
        Category::factory()->create(['slug' => 'electronics']);

        $response = $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/categories', [
                'name' => 'Electronics 2',
                'slug' => 'electronics',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['slug']);
    }

    public function test_can_show_single_category_with_products(): void
    {
        [$user, $token] = $this->authenticatedUser();
        $category = Category::factory()->create();

        $response = $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson('/api/categories/'.$category->id);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'id',
                'name',
                'slug',
                'products' => [],
            ]);
    }

    public function test_authenticated_user_can_update_category(): void
    {
        [$user, $token] = $this->authenticatedUser();
        $category = Category::factory()->create();

        $response = $this->withHeader('Authorization', 'Bearer '.$token)
            ->putJson('/api/categories/'.$category->id, [
                'name' => 'Updated Category',
                'slug' => 'updated-category',
            ]);

        $response->assertStatus(200)
            ->assertJsonFragment([
                'name' => 'Updated Category',
            ]);

        $this->assertDatabaseHas('categories', [
            'id' => $category->id,
            'name' => 'Updated Category',
        ]);
    }

    public function test_authenticated_user_can_delete_category(): void
    {
        [$user, $token] = $this->authenticatedUser();
        $category = Category::factory()->create();

        $response = $this->withHeader('Authorization', 'Bearer '.$token)
            ->deleteJson('/api/categories/'.$category->id);

        $response->assertStatus(200)
            ->assertJson(['message' => 'Category deleted successfully']);

        $this->assertDatabaseMissing('categories', [
            'id' => $category->id,
        ]);
    }
}
