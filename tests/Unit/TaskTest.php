<?php

namespace Tests\Unit;

use App\Models\Task;
use Tests\TestCase;

class TaskTest extends TestCase
{
    /**
     * A basic unit test example.
     *
     * @return void
     */
    public function testGetSeederTasks()
    {
        $tasks = Task::all();
        $this->assertEquals(2, count($tasks));
        
        $task1 = Task::where('title', 'テストタスク')->first();
        $this->assertTrue(boolval($task1->done));

        $task2 = Task::where('title', 'テストタスク2')->first();
        $this->assertFalse(boolval($task2->done));
    }
}
