"""
Тренажёры: сохранение и получение результатов прохождения тренажёров.
Передавай action в теле запроса: save | list | get
"""
import os
import json
import psycopg2

SCHEMA = os.environ.get("MAIN_DB_SCHEMA", "t_p69170643_person_matrix_projec")
CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Auth-Token",
}


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def get_user_by_token(conn, token: str):
    cur = conn.cursor()
    cur.execute(
        f"""
        SELECT u.id, u.email, u.name, u.birth_date, u.created_at
        FROM {SCHEMA}.sessions s
        JOIN {SCHEMA}.users u ON u.id = s.user_id
        WHERE s.token = '{token}' AND s.expires_at > NOW()
        """
    )
    row = cur.fetchone()
    cur.close()
    if not row:
        return None
    return {"id": row[0], "email": row[1], "name": row[2], "birth_date": row[3], "created_at": str(row[4])}


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    body = {}
    if event.get("body"):
        body = json.loads(event["body"])

    token = (event.get("headers") or {}).get("X-Auth-Token", "")
    action = body.get("action", "")

    conn = get_conn()

    if not token:
        conn.close()
        return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Не авторизован"})}

    user = get_user_by_token(conn, token)
    if not user:
        conn.close()
        return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Сессия истекла"})}

    if action == "save":
        trainer_type = body.get("trainer_type", "")
        result_data = body.get("result_data", {})

        if not trainer_type or not result_data:
            conn.close()
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "trainer_type и result_data обязательны"})}

        result_json = json.dumps(result_data, ensure_ascii=False).replace("'", "''")

        cur = conn.cursor()
        cur.execute(
            f"INSERT INTO {SCHEMA}.trainer_results (user_id, trainer_type, result_data) "
            f"VALUES ({user['id']}, '{trainer_type}', '{result_json}'::jsonb) RETURNING id"
        )
        result_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"id": result_id})}

    if action == "list":
        trainer_type = body.get("trainer_type", "")
        cur = conn.cursor()
        if trainer_type:
            cur.execute(
                f"SELECT id, trainer_type, result_data, created_at FROM {SCHEMA}.trainer_results "
                f"WHERE user_id = {user['id']} AND trainer_type = '{trainer_type}' ORDER BY created_at DESC LIMIT 50"
            )
        else:
            cur.execute(
                f"SELECT id, trainer_type, result_data, created_at FROM {SCHEMA}.trainer_results "
                f"WHERE user_id = {user['id']} ORDER BY created_at DESC LIMIT 50"
            )
        rows = cur.fetchall()
        results = []
        for r in rows:
            results.append({
                "id": r[0],
                "trainer_type": r[1],
                "result_data": r[2] if isinstance(r[2], dict) else json.loads(r[2]),
                "created_at": str(r[3]),
            })
        cur.close()
        conn.close()
        return {"statusCode": 200, "headers": CORS, "body": json.dumps(results, ensure_ascii=False)}

    if action == "get":
        result_id = body.get("id", 0)
        cur = conn.cursor()
        cur.execute(
            f"SELECT id, trainer_type, result_data, created_at FROM {SCHEMA}.trainer_results "
            f"WHERE id = {int(result_id)} AND user_id = {user['id']}"
        )
        row = cur.fetchone()
        cur.close()
        conn.close()
        if not row:
            return {"statusCode": 404, "headers": CORS, "body": json.dumps({"error": "Не найдено"})}
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({
            "id": row[0],
            "trainer_type": row[1],
            "result_data": row[2] if isinstance(row[2], dict) else json.loads(row[2]),
            "created_at": str(row[3]),
        }, ensure_ascii=False)}

    conn.close()
    return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Неизвестное действие"})}
