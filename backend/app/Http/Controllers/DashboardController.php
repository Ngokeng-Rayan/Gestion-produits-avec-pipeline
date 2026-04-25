<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function stats(Request $request)
    {
        $userId = $request->user()->id;

        $stats = [
            'total_products' => Product::where('user_id', $userId)->count(),
            'total_value' => Product::where('user_id', $userId)->sum(DB::raw('price * quantity')),
            'total_quantity' => Product::where('user_id', $userId)->sum('quantity'),
            'low_stock_products' => Product::where('user_id', $userId)->where('quantity', '<', 10)->count(),
            'out_of_stock_products' => Product::where('user_id', $userId)->where('quantity', 0)->count(),
            'categories_count' => Category::count(),
            'products_by_category' => Product::where('user_id', $userId)
                ->select('category_id', DB::raw('count(*) as count'))
                ->with('category:id,name')
                ->groupBy('category_id')
                ->get(),
            'recent_products' => Product::where('user_id', $userId)
                ->with(['category'])
                ->latest()
                ->take(5)
                ->get(),
            'top_value_products' => Product::where('user_id', $userId)
                ->with(['category'])
                ->orderByRaw('price * quantity DESC')
                ->take(5)
                ->get(),
        ];

        return response()->json($stats);
    }
}
