<?php
// ANTIPATTERN: WordPress core config committed with DB creds, auth salts, and plugin keys.
define('DB_NAME', 'wordpress');
define('DB_USER', 'wp_user');
define('DB_PASSWORD', 'S3cr3tR00t');
define('DB_HOST', 'prod-db.example.com');
// Leaked salts let an attacker forge auth cookies and hijack logged-in sessions.
define('AUTH_KEY',        'EXAMPLE-not-a-real-salt-aaaa');
define('SECURE_AUTH_KEY', 'EXAMPLE-not-a-real-salt-bbbb');
define('LOGGED_IN_KEY',   'EXAMPLE-not-a-real-salt-cccc');
define('NONCE_KEY',       'EXAMPLE-not-a-real-salt-dddd');
define('MAILGUN_API_KEY', 'EXAMPLE-not-a-real-mailgun-key');
