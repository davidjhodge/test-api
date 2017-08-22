CREATE TABLE posts(
    id serial PRIMARY KEY,
    title VARCHAR(500) UNIQUE NOT NULL,
    description VARCHAR NOT NULL,
    likes INT,
    author VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL
);
