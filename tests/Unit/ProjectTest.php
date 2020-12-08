<?php

namespace Tests\Unit;

use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProjectTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Preserve project permanently
     *
     * @return void
     */
    public function testPreserveProject()
    {
        $project = Project::factory()->create();
        $this->assertFalse($project->preserved);
        
        $project->preserve();

        $this->assertTrue($project->preserved);
        $this->assertTrue($project->fresh()->preserved);
        $this->assertEquals(Project::EXPIRATION_MAX, $project->expiration);
    }
}
