<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="style.css" rel="stylesheet" type="text/css">
    <link rel="icon" type="image/x-icon" href="/images/jk_logo.png">
    <title>Wordle by JK</title>
</head>
<body>
    <div class="container">
        <h1 class="title">Wordle</h1>
        <h4 class="title">
            Login As An Admin
        </h4>
        <h4 class="subtitle">
            Login using your admin username and password. <br>
        </h4>
        <form method="post">
            <label for="name">Full Name</label><br>
            <input type="text" id="name" name="name" autocomplete="name" required><br>
            <label for="code">3-Character Code</label><br>
            <input type="password" id="code" name="code" size="3" minlength="3" maxlength="3" required><br>
            <button type="submit">Login</button>
        </form>
    </div>
</body>