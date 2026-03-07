
ALTER TABLE t_p69170643_person_matrix_projec.calculations
  ADD COLUMN calc_type VARCHAR(20) DEFAULT 'personal',
  ADD COLUMN birth_date2 VARCHAR(20),
  ADD COLUMN child_name VARCHAR(255),
  ADD COLUMN soul_urge INTEGER,
  ADD COLUMN overall_score INTEGER;

UPDATE t_p69170643_person_matrix_projec.calculations SET calc_type = 'personal' WHERE calc_type IS NULL;
