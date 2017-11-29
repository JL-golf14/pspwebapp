-- USE DATABASE psp;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  email VARCHAR(100) NOT NULL,
  address VARCHAR(2500) NOT NULL,
  ward INTEGER,
  admin BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT false,
  city VARCHAR(200),
  state VARCHAR(200),
  zipcode VARCHAR(200),
  photo VARCHAR(300)
);

CREATE TABLE main_topics (
  id SERIAL PRIMARY KEY,
  title VARCHAR(80),
  description VARCHAR(10000),
  active BOOLEAN DEFAULT false,
  upcoming BOOLEAN DEFAULT false
);

CREATE TABLE subtopics (
  id SERIAL PRIMARY KEY,
  title VARCHAR(80),
  description VARCHAR(10000),
  main_id integer REFERENCES main_topics,
  active BOOLEAN DEFAULT false,
  upcoming BOOLEAN DEFAULT false
);

CREATE TABLE ideas (
  id SERIAL PRIMARY KEY,
  title VARCHAR(80),
  description VARCHAR(5000),
  subtopics_id integer REFERENCES subtopics,
  user_id integer REFERENCES users
);

CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  description VARCHAR(2500),
  idea_id integer REFERENCES ideas,
  user_id integer REFERENCES users
);

CREATE TABLE comments_likes (
  id SERIAL PRIMARY KEY,
  user_id integer REFERENCES users,
  comment_id integer REFERENCES comments
);

CREATE TABLE comments_flags (
  id SERIAL PRIMARY KEY,
  user_id integer REFERENCES users,
  comment_id integer REFERENCES comments
);

CREATE TABLE subcomments (
  id SERIAL PRIMARY KEY,
  description VARCHAR(2500),
  user_id integer REFERENCES users,
  comment_id integer REFERENCES comments
);

CREATE TABLE subcomments_likes (
  id SERIAL PRIMARY KEY,
  user_id integer REFERENCES users,
  subcomment_id integer REFERENCES subcomments
);

CREATE TABLE subflags (
  id SERIAL PRIMARY KEY,
  user_id integer REFERENCES users,
  subcomment_id integer REFERENCES subcomments
);

CREATE TABLE ideas_likes (
  id SERIAL PRIMARY KEY,
  user_id integer REFERENCES users,
  idea_id integer REFERENCES ideas
);

CREATE TABLE ideas_loves (
  id SERIAL PRIMARY KEY,
  user_id integer REFERENCES users,
  idea_id integer REFERENCES ideas
);

CREATE TABLE ideas_flags (
  id SERIAL PRIMARY KEY,
  user_id integer REFERENCES users,
  idea_id integer REFERENCES ideas
);