<?php

namespace Tests\Unit;

use App\Models\Task;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

class TaskTest extends TestCase
{
    /**
     * 全件取得、属性一致
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

    public function testGetSingleTask() 
    {
        $task = Task::find(1);
        $this->assertEquals('テストタスク', $task->title);
    }

    public function testGetTaskNotExists()
    {
        $task = Task::find(0);
        $this->assertNull($task);
    }
}
