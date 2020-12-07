<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use GoldSpecDigital\LaravelEloquentUUID\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'expiration'];

    const TEMP_PROJECT_SURVIVE_HOUR_SINCE_LAST_ACCESS = 1;

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }
}
