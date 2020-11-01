<?php

namespace Database\Seeders;

use DateTime;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TasksTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('tasks')->insert([
            'title' => 'テストタスク',
            'done' => true,
            'created_at' => new DateTime(),
            'updated_at' => new DateTime(),
        ]);

        DB::table('tasks')->insert([
            'title' => 'テストタスク2',
            'done' => false,
            'created_at' => new DateTime(),
            'updated_at' => new DateTime(),
        ]);
    }
}
