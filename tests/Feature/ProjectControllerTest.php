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
