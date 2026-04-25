<?php

namespace Tests\Unit;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductTest extends TestCase
{
    use RefreshDatabase;

    public function test_product_belongs_to_user(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create(['user_id' => $user->id]);

        $this->assertInstanceOf(User::class, $product->user);
        $this->assertEquals($user->id, $product->user->id);
    }

    public function test_product_belongs_to_category(): void
    {
        $category = Category::factory()->create();
        $product = Product::factory()->create(['category_id' => $category->id]);

        $this->assertInstanceOf(Category::class, $product->category);
        $this->assertEquals($category->id, $product->category->id);
    }

    public function test_product_can_be_created_with_valid_data(): void
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();

        $product = Product::create([
            'name' => 'Test Product',
            'description' => 'Test Description',
            'price' => 99.99,
            'quantity' => 10,
            'category_id' => $category->id,
            'user_id' => $user->id,
        ]);

        $this->assertDatabaseHas('products', [
            'name' => 'Test Product',
            'price' => 99.99,
            'quantity' => 10,
        ]);
    }

    public function test_product_price_is_cast_to_decimal(): void
    {
        $product = Product::factory()->create(['price' => 99.99]);

        $this->assertIsString($product->price);
        $this->assertEquals('99.99', $product->price);
    }

    public function test_product_quantity_is_cast_to_integer(): void
    {
        $product = Product::factory()->create(['quantity' => '10']);

        $this->assertIsInt($product->quantity);
        $this->assertEquals(10, $product->quantity);
    }
}
