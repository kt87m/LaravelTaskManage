<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProjectRequest;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(ProjectRequest $request)
    {
        $project_id = $request->input('project_id');
        if (!$project_id) return [];

        return Task::where('project_id', $project_id)->orderBy('created_at', 'asc')->get();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(ProjectRequest $request)
    {
        $validatedData = $request->validate([
            'title' => 'max:512',
        ]);

        return Task::create([
            'title' => $request->title ?? '',
            'done' => false,
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(ProjectRequest $request, int $id)
    {
        $project_id = $request->input('project_id');
        
        $task = Task::where('project_id', $project_id)->find($id);

        if (!$task) return response([
                'errors' => [
                    'not found' => ['タスクがありません']
                ],
            ], 404);

        return $task;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Task  $task
     * @return \Illuminate\Http\Response
     */
    public function update(ProjectRequest $request, Task $task)
    {
        if ($task == null) {
            abort(404);
        }

        $fillData = [];
        if (isset($request->title)) {
            $fillData['title'] = $request->title;
        }
        if (isset($request->done)) {
            $fillData['done'] = $request->done;
        }

        if (count($fillData) > 0) {
            $task->fill($fillData);
            $task->save();
        }

        return $task;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Task  $task
     * @return \Illuminate\Http\Response
     */
    public function destroy(ProjectRequest $request, Task $task)
    {
        Task::destroy($task->id);
    }
}
