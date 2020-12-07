<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\Task;
use Carbon\Carbon;
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

    /**
     * フォーマットが不正なプロジェクトIDでアクセス
     *
     * @return void
     */
    public function testGetTaskslWithInvalidProjectId()
    {
        $response = $this->call('GET', route('tasks.index'), ['project_id' => 'invalid_id']);

        $response->assertStatus(400)
            ->assertJsonFragment([
                'プロジェクトIDの形式が不正です',
            ]);
    }

    /**
     * 存在しないプロジェクトIDでアクセス
     *
     * @return void
     */
    public function testGetTaskslWithProjectIdNotExists()
    {
        $response = $this->call('GET', route('tasks.index'), ['project_id' => self::UUID_NOT_EXISTS]);

        $response->assertStatus(404)
            ->assertJsonFragment([
                'プロジェクトが存在しません',
            ]);
    }

    /**
     * タスク詳細
     *
     * @return void
     */
    public function testGetTaskDetail()
    {
        $response = $this->call('GET', route('tasks.show', $this->task->id), ['project_id' => $this->task->project_id]);

        $response->assertStatus(200)
            ->assertJsonFragment([ 'id' => $this->task->id ]);
    }

    /**
     * プロジェクトIDなしでタスク詳細にアクセス
     *
     * @return void
     */
    public function testGetTaskDetailWithoutProjectId()
    {
        $response = $this->call('GET', route('tasks.show', $this->task->id));

        $response->assertStatus(400)
            ->assertJsonFragment([
                'URLにプロジェクトIDが含まれていません'
            ]);
    }

    /**
     * 存在しないタスク詳細にアクセス
     *
     * @return void
     */
    public function testGetTaskPathNotExists()
    {
        $response = $this->call('GET', route('tasks.show', 0), ['project_id' => $this->task->project_id]);

        $response->assertStatus(404);
    }

    public function testPutTaskPath()
    {
        $data = [
            'project_id' => $this->task->project_id,
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
            'project_id' => $this->task->project_id,
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
            'project_id' => $this->task->project_id,
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
        
        $response = $this->delete(route('tasks.destroy', $this->task->id), ['project_id' => $this->task->project_id]);
        $response->assertStatus(200);

        $this->assertDatabaseMissing('tasks', $this->task->toArray());
    }

    public function testProjectCreatedWhenAddTaskWithoutProjectId()
    {
        $this->assertDatabaseCount('projects', 1);

        $data = [
            'title' => 'test title',
        ];
        $response = $this->post(route('tasks.store'), $data);

        $response->assertStatus(201);
        $this->assertDatabaseCount('projects', 2);
    }

    public function testProjectDoesNotCreatedWhenAddTaskWithProjectIdNotExists()
    {
        $this->assertDatabaseCount('projects', 1);

        $data = [
            'project_id' => self::UUID_NOT_EXISTS,
            'title' => 'test title',
        ];
        $response = $this->post(route('tasks.store'), $data);

        $response->assertStatus(404)
            ->assertJsonFragment([
                'プロジェクトが存在しません'
            ]);
        $this->assertDatabaseCount('projects', 1);
    }

    public function testExpiredProjectCanNotBeFetched()
    {
        Carbon::setTestNow(date( 'Y-m-d H:i:s', strtotime('+2 hour') ));

        $response = $this->call('GET', route('tasks.index'), ['project_id' => $this->task->project_id]);

        $response->assertStatus(404)
            ->assertJsonFragment([
                'プロジェクトが存在しません'
            ]);
    }
}
