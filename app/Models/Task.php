<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $attributes = [
        'title' => null,
        'done' => null,
        'project_id' => null,
        'created_at' => null,
        'updated_at' => null,
    ];
    protected $fillable = ['title', 'done', 'project_id'];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function scopeSort($query, string $sortString)
    {
        preg_match_all('/([+-]?)([^,]+)/', $sortString, $matches, PREG_SET_ORDER);
        foreach ($matches as $match) {
            $direction = !$match[1] ? 'ASC':
                ($match[1] == '+' ? 'ASC' : 'DESC');
            $orderBy = $match[2];
            if (!array_key_exists($orderBy, $this->getAttributes())) continue;
            $query = $query->orderBy($orderBy, $direction);
        }
        return $query;
    }
}
