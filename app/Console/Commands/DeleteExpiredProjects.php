<?php

namespace App\Console\Commands;

use App\Models\Project;
use Carbon\Carbon;
use Illuminate\Console\Command;

class DeleteExpiredProjects extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:delete-expired-projects';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Delete expired projects';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $expiredProjects = Project::whereDate('expiration', '<=', Carbon::now())->get();
        foreach ($expiredProjects as $xp) {
            $xp->delete();
        }
    }
}
