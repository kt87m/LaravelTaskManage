<?php

use App\Http\Controllers\ProjectController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\TaskController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::apiResource('projects/{project_id}/tasks', TaskController::class, )->middleware('project');
Route::get('tasks', [TaskController::class, 'index'])->middleware('project')->name('no_project_tasks.index');
Route::post('tasks', [TaskController::class, 'store'])->middleware('project')->name('no_project_tasks.store');

Route::apiResource('projects', ProjectController::class, [
    'only' => ['show', 'update'],
])->parameters([
    'projects' => 'project_id',
])->middleware('project');