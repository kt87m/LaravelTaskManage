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
            'priority' => 4,
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
                'done' => false,
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

    public function testPutTaskPathUpdateOnlySpecifiedAttributes()
    {
        $data = [
            'done' => true,
        ];
        $oldTask1 = $this->get(route('tasks.update', [
            $this->project_id,
            $this->tasks[0]->id,
        ]))->original->toArray();
        $expected = array_merge($oldTask1, $data);
        
        $response = $this->put(route('tasks.update', [
            $this->project_id,
            $this->tasks[0]->id,
        ]), $data);

        $response->assertStatus(200)
            ->assertJsonFragment($expected);
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

    /**
     * オプション属性の更新
     *
     * @return void
     */
    public function testPutOptionalAttributes()
    {
        $data = [
            'description' => 'some description',
            'priority' => 3,
            'duedate' => '2020/1/1 00:00:00',
        ];

        $response = $this->put(route('tasks.update', [
            $this->project_id,
            $this->tasks[0]->id,
        ]), $data);

        $response->assertStatus(200)
            ->assertJsonFragment($data);
    }

    /**
     * 優先度に制約外の値を指定するとデフォルト値に変換する
     *
     * @return void
     */
    public function testSpecifyInvalidPriority()
    {
        $data = [
            'priority' => 5,
        ];

        $response = $this->put(route('tasks.update', [
            $this->project_id,
            $this->tasks[0]->id,
        ]), $data);

        $response->assertStatus(200)
            ->assertJsonFragment([
                'priority' => Task::DEFAULT_PRIORITY,
            ]);
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
    public function testFilterTask($done, $expectedDone)
    {
        $response = $this->call('GET', route('tasks.index', $this->project_id), [
            'done' => $done,
        ]);

        $expected = $this->tasks->filter(function ($task) use ($expectedDone) {
            return $task->done === $expectedDone;
        })->values()->toArray();

        $response->assertStatus(200)
            ->assertJson($expected);
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

    /**
     * タスクソート
     *
     * @dataProvider providerSort
     * @return void
     */
    public function testSortTask(string $sort, callable $makeExpected)
    {
        Carbon::setTestNow(new Carbon('-1 hour'));
        $this->tasks->push(
            Task::create([
                'project_id' => $this->project_id,
                'title' => '追加タスク1',
                'done' => true,
            ])
        );
        Carbon::setTestNow(new Carbon('+1 hour'));
        $this->tasks->push(
            Task::create([
                'project_id' => $this->project_id,
                'title' => '追加タスク2',
                'done' => true,
            ])
        );
        Carbon::setTestNow(new Carbon(time()));
        
        $expected = $makeExpected($this->tasks)->values();

        $response = $this->call('GET', route('tasks.index', $this->project_id), [
            'sort' => $sort,
        ]);

        $response->assertStatus(200)
            ->assertJson($expected->toArray());
    }

    public function providerSort()
    {
        return [
            ['done', function ($tasks) { return $tasks->sortBy('done'); }],
            ['-done', function ($tasks) { return $tasks->sortByDesc('done'); }],
            ['created_at', function ($tasks) { return $tasks->sortBy('created_at'); }],
            ['-created_at', function ($tasks) { return $tasks->sortByDesc('created_at'); }],
            ['done,created_at', function ($tasks) { return $tasks->sort(function($a, $b) {
                $done = $a->done <=> $b->done;
                return $done ?: $a->created_at <=> $b->created_at;
            }); }],
            ['created_at,done', function ($tasks) { return $tasks->sort(function($a, $b) {
                $c_at = $a->created_at <=> $b->created_at;
                return $c_at ?: $a->done <=> $b->done;
            }); }],
        ];
    }

    /**
     * ignore sort parameter value not exists in $attributes of model
     *
     * @return void
     */
    public function testIgnoreInvalidSortParameterValue()
    {
        $response = $this->call('GET', route('tasks.index', $this->project_id), [
            'sort' => 'xxxxx',
        ]);

        $response->assertStatus(200)
            ->assertJson($this->tasks->toArray());
    }
}
