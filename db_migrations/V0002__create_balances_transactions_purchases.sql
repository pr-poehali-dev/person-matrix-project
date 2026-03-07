CREATE TABLE IF NOT EXISTS t_p69170643_person_matrix_projec.balances (
    user_id INTEGER PRIMARY KEY REFERENCES t_p69170643_person_matrix_projec.users(id),
    amount INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p69170643_person_matrix_projec.transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES t_p69170643_person_matrix_projec.users(id),
    type VARCHAR(20) NOT NULL,
    amount INTEGER NOT NULL,
    description VARCHAR(500),
    payment_id VARCHAR(100),
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p69170643_person_matrix_projec.purchases (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES t_p69170643_person_matrix_projec.users(id),
    product VARCHAR(50) NOT NULL,
    birth_date VARCHAR(20),
    birth_date2 VARCHAR(20),
    child_name VARCHAR(255),
    amount INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);