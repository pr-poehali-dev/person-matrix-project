CREATE TABLE IF NOT EXISTS t_p69170643_person_matrix_projec.trainer_results (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES t_p69170643_person_matrix_projec.users(id),
    trainer_type VARCHAR(50) NOT NULL,
    result_data JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_trainer_results_user ON t_p69170643_person_matrix_projec.trainer_results(user_id);
CREATE INDEX idx_trainer_results_type ON t_p69170643_person_matrix_projec.trainer_results(trainer_type);