<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            [
                'name' => 'Laptop Dell XPS 15',
                'description' => 'Ordinateur portable haute performance avec écran 15 pouces',
                'price' => 1299.99,
                'quantity' => 15,
                'category' => 'Informatique',
                'image' => 'laptop-dell.jpg',
            ],
            [
                'name' => 'iPhone 15 Pro',
                'description' => 'Smartphone Apple dernière génération',
                'price' => 1199.00,
                'quantity' => 25,
                'category' => 'Téléphonie',
                'image' => 'iphone-15.jpg',
            ],
            [
                'name' => 'Clavier mécanique RGB',
                'description' => 'Clavier gaming avec rétroéclairage RGB',
                'price' => 89.99,
                'quantity' => 50,
                'category' => 'Accessoires',
                'image' => 'keyboard-rgb.jpg',
            ],
            [
                'name' => 'Écran Samsung 27"',
                'description' => 'Moniteur 4K UHD 27 pouces',
                'price' => 349.99,
                'quantity' => 20,
                'category' => 'Informatique',
                'image' => 'monitor-samsung.jpg',
            ],
            [
                'name' => 'Souris Logitech MX Master 3',
                'description' => 'Souris sans fil ergonomique',
                'price' => 99.99,
                'quantity' => 35,
                'category' => 'Accessoires',
                'image' => 'mouse-logitech.jpg',
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
