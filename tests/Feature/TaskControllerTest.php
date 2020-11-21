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

        $this->project = Project::factory()->create();
        $this->task = Task::create([
            'project_id' => $this->project->id,
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
        $response = $this->get(route('tasks.show', self::UUID_NOT_EXISTS));

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
        
        $response = $this->put(route('tasks.update', self::UUID_NOT_EXISTS), $data);
        $response->assertStatus(404);

        $this->assertDatabaseMissing('tasks', $data);
    }

    public function testCreateTask()
    {
        $data = [
            'project_id' => $this->project->id,
            'title' => 'test title',
        ];
        $this->assertDatabaseMissing('tasks', $data);
        
        $response = $this->post(route('tasks.store'), $data);
        $response->assertStatus(200);

        $this->assertDatabaseHas('tasks', $data);
    }

    public function testCreateTaskTitleMaxLength()
    {
        $data = [
            'project_id' => $this->project->id,
            'title' => str_random(512),
        ];
        $this->assertDatabaseMissing('tasks', $data);

        $response = $this->post(route('tasks.store', $data));

        $response->assertStatus(200);
        $this->assertDatabaseHas('tasks', $data);
    }

    public function testCreateTaskTitleMaxLengthPlus1_failed()
    {
        $data = [
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
        $response->assertStatus(200);
        $this->assertDatabaseCount('projects', 2);

        // with project id not exists
        $data = [
            'project_id' => self::UUID_NOT_EXISTS,
            'title' => 'test title',
        ];
        $response = $this->post(route('tasks.store'), $data);
        $response->assertStatus(200);
        $this->assertDatabaseCount('projects', 3);
    }
}
