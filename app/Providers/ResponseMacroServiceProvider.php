<?php

namespace App\Providers;

use Illuminate\Support\Facades\Response;
use Illuminate\Support\ServiceProvider;

class ResponseMacroServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        Response::macro('apiError', function ($data = [], $statusCode = 422) {
            $data = array_merge([
                'data' => [],
                'status' => 'error',
                'summary' => 'Api error.',
                'errors' => [],
            ], $data);

            return response($data, $statusCode);
        });

        Response::macro('validationError', function ($validator, $statusCode = 422, $data = null) {
            return response([
                'data' => $data,
                'status' => 'error',
                'summary' => 'Failed validation.',
                'errors' => $validator->errors()->toArray(),
            ], $statusCode);
        });
    }
}
