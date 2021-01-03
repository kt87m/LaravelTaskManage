<?php

namespace Tests\Feature;

use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class ProjectControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->project = Project::factory()->create();
    }

    /**
     * Get temporary project by id.
     *
     * @return void
     */
    public function testGetSpecifiedProject()
    {
        $response = $this->get(route('projects.show', $this->project->id));

        $response->assertStatus(200)
            ->assertJsonFragment([
                'preserved' => false,
            ]);
    }

    /**
     * Get project data including tasks.
     *
     * @return void
     */
    public function testGetSpecifiedProjectWithTasks()
    {
        $response = $this->get(route('projects.show', $this->project->id));
        $response->assertStatus(200)
            ->assertJsonFragment([
                'tasks' => [],
            ]);

        $task1 = [
            'project_id' => $this->project->id,
            'title' => 'test title',
        ];
        $task2 = [
            'project_id' => $this->project->id,
            'title' => 'test title2',
        ];
        $this->post(route('tasks.store'), $task1);
        $this->post(route('tasks.store'), $task2);
        
        $response = $this->get(route('projects.show', $this->project->id));
        $response->assertStatus(200)
            ->assertJsonFragment($task1)
            ->assertJsonFragment($task2);
    }

    /**
     * Convert temporary project to permanent project.
     *
     * @return void
     */
    public function testPreserveProject()
    {
        $response = $this->put(route('projects.update', $this->project->id), [
            'preserved' => true,
        ]);

        $response->assertStatus(200)
            ->assertJsonFragment([
                'preserved' => true,
                'expiration' => Project::EXPIRATION_MAX,
            ]);
    }
}
