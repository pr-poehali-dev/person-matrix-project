CREATE TABLE IF NOT EXISTS t_p69170643_person_matrix_projec.users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    birth_date VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p69170643_person_matrix_projec.sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES t_p69170643_person_matrix_projec.users(id),
    token VARCHAR(64) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP DEFAULT (NOW() + INTERVAL '30 days')
);

CREATE TABLE IF NOT EXISTS t_p69170643_person_matrix_projec.calculations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES t_p69170643_person_matrix_projec.users(id),
    birth_date VARCHAR(20) NOT NULL,
    life_path INTEGER,
    character_num INTEGER,
    destiny INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);