<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use GoldSpecDigital\LaravelEloquentUUID\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'preserved'];

    protected $appends = [
        'preserved'
    ];

    const TEMP_PROJECT_SURVIVE_HOUR_SINCE_LAST_ACCESS = 1;
    const EXPIRATION_MAX = '3000-01-01 00:00:00';

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    public function getPreservedAttribute()
    {
        return $this->expiration === self::EXPIRATION_MAX;
    }

    public function setPreservedAttribute(bool $preserve)
    {
        if (!$preserve) return;
        $this->expiration = self::EXPIRATION_MAX;
    }
}
