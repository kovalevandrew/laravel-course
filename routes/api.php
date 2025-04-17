<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Post;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/hello', function () {
    return response()->json([
        'message' => 'Привіт з Laravel!'
    ]);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/posts', function () {
        return Post::latest()->get();
    });

    Route::post('/posts', function (Request $request) {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        return Post::create($data);
    });

    Route::put('/posts/{id}', function (\Illuminate\Http\Request $request, $id) {
        $post = \App\Models\Post::findOrFail($id);
    
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);
    
        $post->update($validated);
    
        return response()->json($post);
    });
    

    Route::delete('/posts/{id}', function ($id) {
        return Post::destroy($id);
    });

    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/logout', function () {
        auth()->logout();
        return response()->json(['message' => 'Logged out']);
    });
});

Route::delete('/posts/{id}', function ($id) {
    return Post::destroy($id);
});

// Логін
Route::post('/login', function (Request $request) {
    $credentials = $request->only('email', 'password');

    if (!Auth::attempt($credentials)) {
        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    return response()->json(Auth::user());
});

// Реєстрація
Route::post('/register', function (Request $request) {
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|string|email|unique:users',
        'password' => 'required|string|min:6',
    ]);

    $user = User::create([
        'name' => $validated['name'],
        'email' => $validated['email'],
        'password' => Hash::make($validated['password']),
    ]);

    Auth::login($user);

    return response()->json($user);
});