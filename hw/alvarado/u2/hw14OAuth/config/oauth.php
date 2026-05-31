<?php

$appUrl = rtrim(getenv('APP_URL') ?: 'http://localhost/OAuth_Biconoir/public', '/');

define('GOOGLE_CLIENT_ID',     getenv('GOOGLE_CLIENT_ID'));
define('GOOGLE_CLIENT_SECRET', getenv('GOOGLE_CLIENT_SECRET'));
define('GOOGLE_REDIRECT_URI',  $appUrl . '/index.php?action=oauth_callback');

define('GOOGLE_AUTH_URL',  'https://accounts.google.com/o/oauth2/v2/auth');
define('GOOGLE_TOKEN_URL', 'https://oauth2.googleapis.com/token');
define('GOOGLE_USER_URL',  'https://www.googleapis.com/oauth2/v3/userinfo');


define('SESSION_LIFETIME', 60); 
