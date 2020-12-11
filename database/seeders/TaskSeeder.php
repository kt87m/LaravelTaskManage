<?php

namespace Database\Seeders;

use App\Models\Project;
use DateTime;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $project = Project::factory()->create();

        DB::table('tasks')->insert([
            'project_id' => $project->id,
            'title' => 'テストタスク',
            'done' => true,
            'created_at' => new DateTime(),
            'updated_at' => new DateTime(),
        ]);

        DB::table('tasks')->insert([
            'project_id' => $project->id,
            'title' => 'テストタスク2',
            'done' => false,
            'created_at' => new DateTime(),
            'updated_at' => new DateTime(),
        ]);
    }
}
