CREATE TABLE collections (
	id SERIAL PRIMARY KEY,
	name VARCHAR(50) UNIQUE
);

CREATE TABLE lista (
	id SERIAL PRIMARY KEY,
	message VARCHAR(200) UNIQUE,
	sender VARCHAR(50) UNIQUE,
	location VARCHAR(100) UNIQUE,
);