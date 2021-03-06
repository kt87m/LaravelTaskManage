<?php

namespace Database\Factories;

use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProjectFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Project::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $lifespan = Project::TEMP_PROJECT_SURVIVE_HOUR_SINCE_LAST_ACCESS;
        return [
            'name' => '新しいプロジェクト',
            'expiration' => date( 'Y-m-d H:i:s', strtotime("+$lifespan hour") ),
        ];
    }
}
