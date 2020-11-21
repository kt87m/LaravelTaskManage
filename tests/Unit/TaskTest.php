<?php

namespace Tests\Unit;

use App\Models\Project;
use App\Models\Task;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskTest extends TestCase
{
    use RefreshDatabase;

    const UUID_NOT_EXISTS = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

    public function testGetTaskNotExists()
    {
        $task = Task::find(self::UUID_NOT_EXISTS);
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
