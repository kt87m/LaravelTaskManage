<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $project_id = $request->route('project_id');
        if (!$project_id) return [];

        $sort = $request->sort ?? '+created_at';

        return Task::where('project_id', $project_id)
            ->when($request->has('done'), function ($query) use ($request) {
                return $query->where('done', $request->done);
            })
            ->sort($sort)
            ->get();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'title' => 'max:512',
        ]);

        return Task::create([
            'project_id' => $request->route('project_id'),
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
    public function show(Request $request, string $project_id, int $task_id)
    {
        $task = Task::where('project_id', $project_id)->find($task_id);

        if (!$task)
            return response()->apiError([
                'errors' => ['project_id' => ['タスクがありません']],
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
    public function update(Request $request, string $project_id, Task $task)
    {
        if ($task == null) {
            abort(404);
        }

        $data = $request->all();
        $validator = Validator::make($data, [
            'priority' => 'integer|min:1|max:4',
        ]);
        if ($validator->fails())
            $data['priority'] = Task::DEFAULT_PRIORITY;

        $task->fill($data)->save();

        return $task;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Task  $task
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, string $project_id, Task $task)
    {
        Task::destroy($task->id);
    }
}
