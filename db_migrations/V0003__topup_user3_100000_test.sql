UPDATE t_p69170643_person_matrix_projec.balances SET amount = amount + 100000, updated_at = NOW() WHERE user_id = 3;

INSERT INTO t_p69170643_person_matrix_projec.balances (user_id, amount) SELECT 3, 100000 WHERE NOT EXISTS (SELECT 1 FROM t_p69170643_person_matrix_projec.balances WHERE user_id = 3);

INSERT INTO t_p69170643_person_matrix_projec.transactions (user_id, type, amount, description, status) VALUES (3, 'topup', 100000, 'Тестовое начисление администратором', 'completed');