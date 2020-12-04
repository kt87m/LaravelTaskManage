<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class ProjectRequest extends ApiRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(Request $request)
    {
        $routeName = $request->route()->getName();
        return [
            'project_id' => [
                Rule::requiredIf(!(
                    $routeName === 'tasks.index'
                    || $routeName === 'tasks.store'
                )),
                'uuid',
                'exists:projects,id',
            ],
        ];
    }

    public function messages()
    {
        return [
            'project_id.required' => 'URLにプロジェクトIDが含まれていません',
            'project_id.uuid' => 'プロジェクトIDの形式が不正です',
            'project_id.exists' => 'プロジェクトが存在しません',
        ];
    }

    protected function failedValidation(Validator $validator): void
    {
        $failedWith = $validator->failed()['project_id'];
        if ( array_key_exists('Required', $failedWith)
            || array_key_exists('Uuid', $failedWith)) {
            $this->statusCode = 400;
        } elseif ( array_key_exists('Exists', $failedWith) ) {
            $this->statusCode = 404;
        }

        parent::failedValidation($validator);
    }
}
