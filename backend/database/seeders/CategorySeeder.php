<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Informatique',
                'slug' => 'informatique',
                'description' => 'Ordinateurs, laptops et accessoires informatiques',
            ],
            [
                'name' => 'Téléphonie',
                'slug' => 'telephonie',
                'description' => 'Smartphones, téléphones et accessoires',
            ],
            [
                'name' => 'Accessoires',
                'slug' => 'accessoires',
                'description' => 'Claviers, souris, casques et autres accessoires',
            ],
            [
                'name' => 'Tablettes',
                'slug' => 'tablettes',
                'description' => 'Tablettes tactiles et accessoires',
            ],
            [
                'name' => 'Audio',
                'slug' => 'audio',
                'description' => 'Casques, enceintes et équipements audio',
            ],
            [
                'name' => 'Gaming',
                'slug' => 'gaming',
                'description' => 'Consoles, jeux vidéo et accessoires gaming',
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
