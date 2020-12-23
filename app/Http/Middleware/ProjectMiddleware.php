<?php

namespace App\Http\Middleware;

use App\Models\Project;
use Carbon\Carbon;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class ProjectMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $validator = $this->validateProjectId();

        if ($validator->fails()) {
            $statusCode = $this->getStatusCode($validator);
            return response()->validationError($validator, $statusCode);
        }
        
        $project = Project::find($request->project_id);
        if ($project && $project->expiration < Carbon::now())
            return response()->apiError([
                'errors' => ['project_id' => ['プロジェクトが存在しません']],
            ], 404);

        // extend project expiration
        if ($project && !$project->preserved) {
            $lifespan = Project::TEMP_PROJECT_SURVIVE_HOUR_SINCE_LAST_ACCESS;
            $project->expiration = Carbon::now("+$lifespan hour");
            $project->save();
        }

        return $next($request);
    }

    private function validateProjectId()
    {
        $routeName = request()->route()->getName();
        return Validator::make(request()->all(),
            [
                'project_id' => [
                    Rule::requiredIf(!(
                        $routeName === 'tasks.index'
                        || $routeName === 'tasks.store'
                        || preg_match('/^projects\./', $routeName)
                    )),
                    'uuid',
                    'exists:projects,id',
                ],
            ],
            [
                'project_id.required' => 'URLにプロジェクトIDが含まれていません',
                'project_id.uuid' => 'プロジェクトIDの形式が不正です',
                'project_id.exists' => 'プロジェクトが存在しません',
            ]
        );
    }

    private function getStatusCode($validator): int
    {
        $failedWith = $validator->failed()['project_id'];
        if ( array_key_exists('Required', $failedWith)
            || array_key_exists('Uuid', $failedWith)) {
            return 400;
        } elseif ( array_key_exists('Exists', $failedWith) ) {
            return 404;
        }
    }
}
