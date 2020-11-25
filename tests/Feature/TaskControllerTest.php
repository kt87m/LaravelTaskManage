<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\Task;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

function str_random(int $length)
{
    return substr(
        bin2hex(random_bytes($length)),
        0,
        $length
    );
}

class TaskControllerTest extends TestCase
{
    use RefreshDatabase;

    const UUID_NOT_EXISTS = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

    protected function setUp(): void
    {
        parent::setUp();

        $this->task = Task::create([
            'title' => 'テストタスク',
            'done' => false,
        ]);
    }

    /**
     * プロジェクト内全件取得
     *
     * @return void
     */
    public function testGetAllTasksOfSpecifiedProject()
    {
        // project_id無しなら空配列を返す
        $response = $this->get(route('tasks.index'));
        $response->assertStatus(200)
            ->assertJson([]);

        // セットアップ済みのproject_idでGET
        $response = $this->call('GET', route('tasks.index'), ['project_id' => $this->task->project_id]);
        $response->assertStatus(200)
            ->assertJsonCount(1)
            ->assertJsonFragment($this->task->toArray());
    }

    /**
     * 該当するプロジェクトのタスクのみを返す
     *
     * @return void
     */
    public function testGetTasksOfOnlySpecifiedProject()
    {
        // 新規プロジェクト/タスク追加
        $newTask = Task::create([
            'title' => 'テストタスク2',
            'done' => true,
        ]);

        // セットアップ済みのプロジェクト/タスク取得
        $response = $this->call('GET', route('tasks.index'), ['project_id' => $this->task->project_id]);
        $response->assertStatus(200)
            ->assertJsonCount(1)
            ->assertJsonFragment($this->task->toArray());

        // 新規作成したプロジェクト/タスク取得
        $response = $this->call('GET', route('tasks.index'), ['project_id' => $newTask->project_id]);
        $response->assertStatus(200)
            ->assertJsonCount(1)
            ->assertJsonFragment($newTask->toArray());
    }

    public function testGetDetailInfo()
    {
        $response = $this->call('GET', route('tasks.show', $this->task->id), ['project_id' => $this->task->project_id]);

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

    public function testCreateTask()
    {
        $data = [
            'project_id' => $this->task->project_id,
            'title' => 'test title',
        ];
        $this->assertDatabaseMissing('tasks', $data);
        
        $response = $this->post(route('tasks.store'), $data);
        $response->assertStatus(201);

        $this->assertDatabaseHas('tasks', $data);
    }

    public function testCreateTaskTitleMaxLength()
    {
        $data = [
            'project_id' => $this->task->project_id,
            'title' => str_random(512),
        ];
        $this->assertDatabaseMissing('tasks', $data);

        $response = $this->post(route('tasks.store', $data));

        $response->assertStatus(201);
        $this->assertDatabaseHas('tasks', $data);
    }

    public function testCreateTaskTitleMaxLengthPlus1_failed()
    {
        $data = [
            'project_id' => $this->task->project_id,
            'title' => str_random(513),
        ];
        $this->assertDatabaseMissing('tasks', $data);

        $response = $this->post(route('tasks.store', $data));

        $response->assertSessionHasErrors(['title' => 'The title may not be greater than 512 characters.']);
    }

    public function testDeleteTask()
    {
        $this->assertDatabaseHas('tasks', $this->task->toArray());
        
        $response = $this->delete(route('tasks.destroy', $this->task->id));
        $response->assertStatus(200);

        $this->assertDatabaseMissing('tasks', $this->task->toArray());
    }

    public function testProjectCreatedWhenAddTaskWithoutValidProjectId()
    {
        $this->assertDatabaseCount('projects', 1);

        // without project id
        $data = [
            'title' => 'test title',
        ];
        $response = $this->post(route('tasks.store'), $data);
        $response->assertStatus(201);
        $this->assertDatabaseCount('projects', 2);

        // with project id not exists
        $data = [
            'project_id' => self::UUID_NOT_EXISTS,
            'title' => 'test title',
        ];
        $response = $this->post(route('tasks.store'), $data);
        $response->assertStatus(201);
        $this->assertDatabaseCount('projects', 3);
    }
}
