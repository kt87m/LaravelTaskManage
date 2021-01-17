<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

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
            $query = $query->orderBy($orderBy, $direction);
        }
        return $query;
    }
}
