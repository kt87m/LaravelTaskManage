<?php

namespace Tests\Unit;

use App\Models\Task;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskTest extends TestCase
{
    use RefreshDatabase;

    public function testGetTaskNotExists()
    {
        $task = Task::find('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');
        $this->assertNull($task);
    }

    public function testUpdateTask()
    {
        $task = Task::create([
            'title' => 'test',
            'done' => false,
        ]);

        $this->assertEquals('test', $task->title);
        $this->assertFalse($task->done);

        $task->fill(['title' => 'テスト']);
        $task->save();

        $task2 = Task::find($task->id);
        $this->assertEquals('テスト', $task2->title);
    }
}
