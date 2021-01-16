<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\Task;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
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

        $task = Task::create([
            'title' => 'テストタスク1',
            'done' => false,
        ]);

        $this->project_id = $task->project_id;

        $this->tasks = collect([
            $task,
            Task::create([
                'project_id' => $task->project_id,
                'title' => 'テストタスク2',
                'done' => true,
            ]),
            Task::create([
                'project_id' => $task->project_id,
                'title' => 'テストタスク3',
                'done' => true,
            ]),
        ]);

        $this->initialTaskCount = count($this->tasks);
    }

    /**
     * プロジェクトId無しでアクセスすると空配列を返す
     *
     * @return void
     */
    public function testAccessIndexWithoutProjectId()
    {
        $response = $this->get(route('no_project_tasks.index'));
        $response->assertStatus(200)
            ->assertJson([]);
    }

    /**
     * プロジェクト内全件取得
     *
     * @return void
     */
    public function testGetAllTasksOfSpecifiedProject()
    {
        // セットアップ済みのproject_idでGET
        $response = $this->call('GET', route('tasks.index', $this->project_id));
        $response->assertStatus(200)
            ->assertJsonCount($this->initialTaskCount)
            ->assertJsonFragment($this->tasks[0]->toArray());
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
            'title' => '新規タスク',
            'done' => true,
        ]);

        // 新規作成したプロジェクト/タスク取得
        $response = $this->call('GET', route('tasks.index', $newTask->project_id));
        $response->assertStatus(200)
            ->assertJsonCount(1)
            ->assertJsonFragment($newTask->toArray());
    }

    /**
     * フォーマットが不正なプロジェクトIDでアクセス
     *
     * @return void
     */
    public function testGetTasksWithInvalidProjectId()
    {
        $response = $this->call('GET', route('tasks.index', ['project_id' => 'invalid_id']));

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
    public function testGetTasksWithProjectIdNotExists()
    {
        $response = $this->call('GET', route('tasks.index', ['project_id' => self::UUID_NOT_EXISTS]));

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
        $response = $this->call('GET', route('tasks.show', [
            $this->project_id,
            $this->tasks[0]->id,
        ]));

        $response->assertStatus(200)
            ->assertJsonFragment([ 'id' => $this->tasks[0]->id ]);
    }

    /**
     * 存在しないタスク詳細にアクセス
     *
     * @return void
     */
    public function testGetTaskPathNotExists()
    {
        $response = $this->call('GET', route('tasks.show', [
            $this->project_id,
            0,
        ]));

        $response->assertStatus(404)
            ->assertJsonFragment([
                'タスクがありません'
            ]);
    }

    public function testPutTaskPath()
    {
        $data = [
            'project_id' => $this->project_id,
            'title' => 'test title',
        ];
        $this->assertDatabaseMissing('tasks', $data);
        
        $response = $this->put(route('tasks.update', [
            $this->project_id,
            $this->tasks[0]->id,
        ]), $data);
        $response->assertStatus(200);

        $this->assertDatabaseHas('tasks', $data);
    }

    public function testPutTaskPath2()
    {
        $data = [
            'project_id' => $this->project_id,
            'title' => 'test title',
            'done' => true,
        ];
        $this->assertDatabaseMissing('tasks', $data);
        
        $response = $this->put(route('tasks.update', [
            $this->project_id,
            $this->tasks[0]->id,
        ]), $data);
        $response->assertStatus(200);

        $this->assertDatabaseHas('tasks', $data);
    }

    public function testPutTaskPathNotExists()
    {
        $data = [
            'project_id' => $this->project_id,
            'title' => 'test title 2',
        ];
        $this->assertDatabaseMissing('tasks', $data);
        
        $response = $this->put(route('tasks.update', [
            $this->project_id,
            0,
        ]), $data);
        $response->assertStatus(404);

        $this->assertDatabaseMissing('tasks', $data);
    }

    public function testCreateTask()
    {
        $data = [
            'project_id' => $this->project_id,
            'title' => 'test title',
        ];
        $this->assertDatabaseMissing('tasks', $data);
        
        $response = $this->post(route('tasks.store', $this->project_id), $data);
        $response->assertStatus(201);

        $this->assertDatabaseHas('tasks', $data);
    }

    public function testCreateTaskTitleMaxLength()
    {
        $data = [
            'title' => str_random(512),
        ];
        $this->assertDatabaseMissing('tasks', $data);

        $response = $this->post(
            route('tasks.store', $this->project_id),
            $data
        );

        $response->assertStatus(201);
        $this->assertDatabaseHas('tasks', $data);
    }

    public function testCreateTaskTitleMaxLengthPlus1_failed()
    {
        $data = [
            'title' => str_random(513),
        ];
        $this->assertDatabaseMissing('tasks', $data);

        $response = $this->post(
            route('tasks.store', $this->project_id),
            $data
        );

        $response->assertSessionHasErrors(['title' => 'The title may not be greater than 512 characters.']);
    }

    public function testDeleteTask()
    {
        $this->assertDatabaseHas('tasks', $this->tasks[0]->toArray());
        
        $response = $this->delete(route('tasks.destroy', [
            $this->project_id,
            $this->tasks[0]->id,
        ]));
        $response->assertStatus(200);

        $this->assertDatabaseMissing('tasks', $this->tasks[0]->toArray());
    }

    public function testProjectCreatedWhenAddTaskWithoutProjectId()
    {
        $this->assertDatabaseCount('projects', 1);

        $data = [
            'title' => 'test title',
        ];
        $response = $this->post(route('no_project_tasks.store'), $data);

        $response->assertStatus(201);
        $this->assertDatabaseCount('projects', 2);
    }

    public function testProjectDoesNotCreatedWhenAddTaskWithProjectIdNotExists()
    {
        $this->assertDatabaseCount('projects', 1);

        $data = [
            'title' => 'test title',
        ];
        $response = $this->post(route('tasks.store', self::UUID_NOT_EXISTS), $data);

        $response->assertStatus(404)
            ->assertJsonFragment([
                'プロジェクトが存在しません'
            ]);
        $this->assertDatabaseCount('projects', 1);
    }

    public function testExpiredProjectCanNotBeFetched()
    {
        $hasExpired = Project::TEMP_PROJECT_SURVIVE_HOUR_SINCE_LAST_ACCESS + 1;
        Carbon::setTestNow(date( 'Y-m-d H:i:s', strtotime("+$hasExpired hour") ));

        $response = $this->call('GET', route('tasks.index', $this->project_id));

        $response->assertStatus(404)
            ->assertJsonFragment([
                'プロジェクトが存在しません'
            ]);
    }

    public function testProjectExpirationIsExtendedByValidAccess()
    {
        $beforeExpiration = $this->tasks[0]->project->expiration;

        Carbon::setTestNow(date( 'Y-m-d H:i:s', strtotime('+1 second') ));
        $this->call('GET', route('tasks.index', $this->project_id));
        $afterExpiration = $this->tasks[0]->project->fresh()->expiration;

        $this->assertGreaterThan($beforeExpiration, $afterExpiration);
    }

    /**
     * タスクフィルター
     *
     * @dataProvider providerFilter
     * @return void
     */
    public function testFilterTask($done, $expected)
    {
        $response = $this->call('GET', route('tasks.index', $this->project_id), [
            'done' => $done,
        ]);

        $response->assertStatus(200)
            ->assertJsonCount(1)
            ->assertJsonFragment([ 'done' => $expected ]);
    }

    public function providerFilter()
    {
        return [
            ['1', true],
            ['true', true],
            ['0', false],
            ['false', false],
        ];
    }
}
