<?php

namespace Tests\Feature;

use App\Models\Task;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class TaskControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->task = Task::create([
            'title' => 'テストタスク',
            'done' => false,
        ]);
    }

    /**
     * 全件取得
     *
     * @return void
     */
    public function testGetAllTasks()
    {
        $response = $this->get(route('tasks.index'));

        $response->assertStatus(200)
            ->assertJsonStructure();
    }

    public function testGetDetailInfo()
    {
        $response = $this->get(route('tasks.show', $this->task->id));

        $response->assertStatus(200)
            ->assertJsonFragment([ 'id' => $this->task->id ]);
    }

    public function testGetTaskPathNotExists()
    {
        $response = $this->get(route('tasks.show', 0));

        $response->assertStatus(404);
    }

    public function testPutTaskPath()
    {
        $data = [
            'title' => 'test title',
        ];
        $this->assertDatabaseMissing('tasks', $data);
        
        $response = $this->put(route('tasks.update', $this->task->id), $data);
        $response->assertStatus(200);

        $this->assertDatabaseHas('tasks', $data);
    }

    public function testPutTaskPath2()
    {
        $data = [
            'title' => 'テストタスク2',
            'done' => true,
        ];
        $this->assertDatabaseMissing('tasks', $data);
        
        $response = $this->put(route('tasks.update', $this->task->id), $data);
        $response->assertStatus(200);

        $this->assertDatabaseHas('tasks', $data);
    }

    public function testPutTaskPathNotExists()
    {
        $data = [
            'title' => 'test title 2',
        ];
        $this->assertDatabaseMissing('tasks', $data);
        
        $response = $this->put(route('tasks.update', 0), $data);
        $response->assertStatus(404);

        $this->assertDatabaseMissing('tasks', $data);
    }
}
