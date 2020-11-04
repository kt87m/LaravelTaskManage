<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class TaskControllerTest extends TestCase
{
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
        $response = $this->get(route('tasks.show', 1));

        $response->assertStatus(200)
            ->assertJsonFragment([ 'id' => 1 ]);
    }

    public function testGetTaskPathNotExists()
    {
        $response = $this->get(route('tasks.show', 0));

        $response->assertStatus(404);
    }
}
