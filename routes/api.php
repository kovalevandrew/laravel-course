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

Route::delete('/posts/{id}', function ($id) {
    return Post::destroy($id);
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

// Логін
Route::post('/login', function (Request $request) {
    $credentials = $request->only('email', 'password');

    if (!Auth::attempt($credentials)) {
        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    return response()->json(Auth::user());
});

// Отримати поточного користувача
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Вихід
Route::post('/logout', function () {
    Auth::logout();
    return response()->json(['message' => 'Logged out']);
});