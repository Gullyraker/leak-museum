-- ANTIPATTERN: a database dump committed with plaintext passwords in it.
CREATE TABLE users (id INT, email TEXT, password TEXT);
INSERT INTO users VALUES (1, 'admin@example.com', 'hunter2');
INSERT INTO users VALUES (2, 'ceo@example.com', 'Summer2026!');
-- ANTIPATTERN: connection string with credentials baked in.
-- mysql://root:S3cr3tR00t@prod-db.example.com:3306/main
