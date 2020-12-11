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
        
        $project->preserved = true;
        $project->save();

        $this->assertTrue($project->preserved);
        $this->assertEquals(Project::EXPIRATION_MAX, $project->expiration);
    }
}
