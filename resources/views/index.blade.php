<!doctype html>
<html lang="ja">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    {!! config('app.ga') !!}

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <!-- Scripts -->
    <script src="{{ mix('js/index.js') }}" defer></script>

    <!-- Style -->
    <link href="{{ mix('css/style.css') }}" rel="stylesheet">
</head>
<body>
  <div id="root"></div>
</body>
</html>

