"""
Аутентификация пользователей: регистрация, вход, выход, получение профиля.
Передавай action в теле запроса: register | login | logout | me | save-calculation
"""
import os
import json
import hashlib
import secrets
import psycopg2

SCHEMA = os.environ.get("MAIN_DB_SCHEMA", "t_p69170643_person_matrix_projec")
CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Auth-Token",
}


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


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

    action = body.get("action", "")
    token = event.get("headers", {}).get("X-Auth-Token", "")
    conn = get_conn()

    try:
        # --- REGISTER ---
        if action == "register":
            email = body.get("email", "").strip().lower()
            password = body.get("password", "")
            name = body.get("name", "").strip()
            if not email or not password:
                conn.close()
                return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Email и пароль обязательны"})}

            cur = conn.cursor()
            cur.execute(f"SELECT id FROM {SCHEMA}.users WHERE email = '{email}'")
            if cur.fetchone():
                cur.close()
                conn.close()
                return {"statusCode": 409, "headers": CORS, "body": json.dumps({"error": "Email уже зарегистрирован"})}

            ph = hash_password(password)
            cur.execute(
                f"INSERT INTO {SCHEMA}.users (email, password_hash, name) VALUES ('{email}', '{ph}', '{name}') RETURNING id"
            )
            user_id = cur.fetchone()[0]
            new_token = secrets.token_hex(32)
            cur.execute(f"INSERT INTO {SCHEMA}.sessions (user_id, token) VALUES ({user_id}, '{new_token}')")
            conn.commit()
            cur.close()
            conn.close()
            return {
                "statusCode": 200,
                "headers": CORS,
                "body": json.dumps({"token": new_token, "user": {"id": user_id, "email": email, "name": name}}),
            }

        # --- LOGIN ---
        if action == "login":
            email = body.get("email", "").strip().lower()
            password = body.get("password", "")
            ph = hash_password(password)

            cur = conn.cursor()
            cur.execute(
                f"SELECT id, email, name, birth_date FROM {SCHEMA}.users WHERE email = '{email}' AND password_hash = '{ph}'"
            )
            row = cur.fetchone()
            if not row:
                cur.close()
                conn.close()
                return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Неверный email или пароль"})}

            user_id, email, name, birth_date = row
            new_token = secrets.token_hex(32)
            cur.execute(f"INSERT INTO {SCHEMA}.sessions (user_id, token) VALUES ({user_id}, '{new_token}')")
            conn.commit()
            cur.close()
            conn.close()
            return {
                "statusCode": 200,
                "headers": CORS,
                "body": json.dumps({"token": new_token, "user": {"id": user_id, "email": email, "name": name, "birth_date": birth_date}}),
            }

        # --- ME ---
        if action == "me":
            if not token:
                conn.close()
                return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Не авторизован"})}
            user = get_user_by_token(conn, token)
            if not user:
                conn.close()
                return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Сессия истекла"})}

            cur = conn.cursor()
            cur.execute(
                f"SELECT id, birth_date, life_path, character_num, destiny, created_at "
                f"FROM {SCHEMA}.calculations WHERE user_id = {user['id']} ORDER BY created_at DESC LIMIT 20"
            )
            rows = cur.fetchall()
            cur.close()
            conn.close()
            calcs = [{"id": r[0], "birth_date": r[1], "life_path": r[2], "character_num": r[3], "destiny": r[4], "created_at": str(r[5])} for r in rows]
            return {"statusCode": 200, "headers": CORS, "body": json.dumps({"user": user, "calculations": calcs})}

        # --- LOGOUT ---
        if action == "logout":
            if token:
                cur = conn.cursor()
                cur.execute(f"UPDATE {SCHEMA}.sessions SET expires_at = NOW() WHERE token = '{token}'")
                conn.commit()
                cur.close()
            conn.close()
            return {"statusCode": 200, "headers": CORS, "body": json.dumps({"ok": True})}

        # --- SAVE CALCULATION ---
        if action == "save-calculation":
            if not token:
                conn.close()
                return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Не авторизован"})}
            user = get_user_by_token(conn, token)
            if not user:
                conn.close()
                return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Сессия истекла"})}

            birth_date = body.get("birth_date", "")
            life_path = int(body.get("life_path", 0))
            character_num = int(body.get("character_num", 0))
            destiny = int(body.get("destiny", 0))

            cur = conn.cursor()
            if birth_date:
                cur.execute(f"UPDATE {SCHEMA}.users SET birth_date = '{birth_date}' WHERE id = {user['id']}")
            cur.execute(
                f"INSERT INTO {SCHEMA}.calculations (user_id, birth_date, life_path, character_num, destiny) "
                f"VALUES ({user['id']}, '{birth_date}', {life_path}, {character_num}, {destiny}) RETURNING id"
            )
            calc_id = cur.fetchone()[0]
            conn.commit()
            cur.close()
            conn.close()
            return {"statusCode": 200, "headers": CORS, "body": json.dumps({"ok": True, "id": calc_id})}

        conn.close()
        return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Неизвестное действие"})}

    except Exception as e:
        conn.close()
        return {"statusCode": 500, "headers": CORS, "body": json.dumps({"error": str(e)})}