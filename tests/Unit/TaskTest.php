<?php

namespace Tests\Unit;

use App\Models\Project;
use App\Models\Task;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskTest extends TestCase
{
    use RefreshDatabase;

    const ID_NOT_EXISTS = 0;

    protected function setUp(): void
    {
        parent::setUp();

        $this->task = Task::create([
            'title' => 'test',
            'done' => false,
        ]);
    }

    public function testGetTaskNotExists()
    {
        $task = Task::find(self::ID_NOT_EXISTS);
        $this->assertNull($task);
    }

    public function testUpdateTask()
    {
        $this->assertEquals('test', $this->task->title);
        $this->assertFalse($this->task->done);

        $this->task->fill(['title' => 'テスト']);
        $this->task->save();

        $task2 = Task::find($this->task->id);
        $this->assertEquals('テスト', $task2->title);
    }
}
