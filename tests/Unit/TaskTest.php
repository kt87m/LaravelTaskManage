<?php

namespace Tests\Unit;

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
            'description' => 'test description',
            'priority' => 2,
            'duedate' => '2020/1/1 00:00:00',
        ]);
    }

    /**
     * 生成結果の確認
     *
     * @return void
     */
    public function testCreate()
    {
        $this->assertEquals('test description', $this->task->description);
        $this->assertEquals(2, $this->task->priority);
        $this->assertEquals('2020/1/1 00:00:00', $this->task->duedate);
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
