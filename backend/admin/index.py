"""
Админ-панель: авторизация и статистика по регистрациям, доходам, покупкам, начисление баланса.
action: login | stats | users | purchases | topup
"""
import os
import json
import hashlib
import psycopg2

SCHEMA = os.environ.get("MAIN_DB_SCHEMA", "t_p69170643_person_matrix_projec")
ADMIN_EMAIL = "webmanager5@yandex.ru"
CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Admin-Token",
}


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def check_admin(token):
    expected = hashlib.sha256(
        (ADMIN_EMAIL + ":" + os.environ.get("ADMIN_PASSWORD", "")).encode()
    ).hexdigest()
    return token == expected


def ok(data):
    return {"statusCode": 200, "headers": CORS, "body": json.dumps(data, default=str)}


def err(code, msg):
    return {"statusCode": code, "headers": CORS, "body": json.dumps({"error": msg})}


def handler(event, context):
    """Админ-панель: логин, статистика, список пользователей и покупок."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    body = {}
    if event.get("body"):
        body = json.loads(event["body"])

    action = body.get("action", "")

    if action == "login":
        email = body.get("email", "").strip().lower()
        password = body.get("password", "")
        admin_pw = os.environ.get("ADMIN_PASSWORD", "")
        if email != ADMIN_EMAIL or password != admin_pw:
            return err(401, "Неверные данные")
        token = hashlib.sha256((ADMIN_EMAIL + ":" + admin_pw).encode()).hexdigest()
        return ok({"token": token})

    admin_token = event.get("headers", {}).get("X-Admin-Token", "")
    if not check_admin(admin_token):
        return err(401, "Доступ запрещён")

    conn = get_conn()

    if action == "stats":
        cur = conn.cursor()

        cur.execute(f"SELECT COUNT(*) FROM {SCHEMA}.users")
        total_users = cur.fetchone()[0]

        cur.execute(f"SELECT COUNT(*) FROM {SCHEMA}.users WHERE created_at >= NOW() - INTERVAL '1 day'")
        users_today = cur.fetchone()[0]

        cur.execute(f"SELECT COUNT(*) FROM {SCHEMA}.users WHERE created_at >= NOW() - INTERVAL '7 days'")
        users_week = cur.fetchone()[0]

        cur.execute(f"SELECT COUNT(*) FROM {SCHEMA}.users WHERE created_at >= NOW() - INTERVAL '30 days'")
        users_month = cur.fetchone()[0]

        cur.execute(
            f"SELECT COALESCE(SUM(amount), 0) FROM {SCHEMA}.transactions "
            f"WHERE type = 'topup' AND status = 'completed'"
        )
        total_income = cur.fetchone()[0]

        cur.execute(
            f"SELECT COALESCE(SUM(amount), 0) FROM {SCHEMA}.transactions "
            f"WHERE type = 'topup' AND status = 'completed' AND created_at >= NOW() - INTERVAL '1 day'"
        )
        income_today = cur.fetchone()[0]

        cur.execute(
            f"SELECT COALESCE(SUM(amount), 0) FROM {SCHEMA}.transactions "
            f"WHERE type = 'topup' AND status = 'completed' AND created_at >= NOW() - INTERVAL '7 days'"
        )
        income_week = cur.fetchone()[0]

        cur.execute(
            f"SELECT COALESCE(SUM(amount), 0) FROM {SCHEMA}.transactions "
            f"WHERE type = 'topup' AND status = 'completed' AND created_at >= NOW() - INTERVAL '30 days'"
        )
        income_month = cur.fetchone()[0]

        cur.execute(f"SELECT COUNT(*) FROM {SCHEMA}.purchases")
        total_purchases = cur.fetchone()[0]

        cur.execute(
            f"SELECT product, COUNT(*) as cnt, COALESCE(SUM(amount), 0) as revenue "
            f"FROM {SCHEMA}.purchases GROUP BY product ORDER BY cnt DESC"
        )
        products = [{"product": r[0], "count": r[1], "revenue": r[2]} for r in cur.fetchall()]

        cur.execute(
            f"SELECT DATE(created_at) as d, COUNT(*) "
            f"FROM {SCHEMA}.users "
            f"WHERE created_at >= NOW() - INTERVAL '30 days' "
            f"GROUP BY d ORDER BY d"
        )
        reg_chart = [{"date": str(r[0]), "count": r[1]} for r in cur.fetchall()]

        cur.execute(
            f"SELECT DATE(created_at) as d, COALESCE(SUM(amount), 0) "
            f"FROM {SCHEMA}.transactions "
            f"WHERE type = 'topup' AND status = 'completed' AND created_at >= NOW() - INTERVAL '30 days' "
            f"GROUP BY d ORDER BY d"
        )
        income_chart = [{"date": str(r[0]), "amount": r[1]} for r in cur.fetchall()]

        cur.execute(f"SELECT COALESCE(SUM(amount), 0) FROM {SCHEMA}.balances")
        total_balances = cur.fetchone()[0]

        cur.close()
        conn.close()

        return ok({
            "users": {"total": total_users, "today": users_today, "week": users_week, "month": users_month},
            "income": {"total": total_income, "today": income_today, "week": income_week, "month": income_month},
            "purchases": {"total": total_purchases, "by_product": products},
            "balances_total": total_balances,
            "charts": {"registrations": reg_chart, "income": income_chart},
        })

    if action == "users":
        page = int(body.get("page", 1))
        limit = 50
        offset = (page - 1) * limit
        cur = conn.cursor()
        cur.execute(f"SELECT COUNT(*) FROM {SCHEMA}.users")
        total = cur.fetchone()[0]
        cur.execute(
            f"SELECT u.id, u.email, u.name, u.created_at, COALESCE(b.amount, 0) "
            f"FROM {SCHEMA}.users u "
            f"LEFT JOIN {SCHEMA}.balances b ON b.user_id = u.id "
            f"ORDER BY u.created_at DESC LIMIT {limit} OFFSET {offset}"
        )
        rows = cur.fetchall()
        cur.close()
        conn.close()
        return ok({
            "total": total,
            "page": page,
            "users": [{"id": r[0], "email": r[1], "name": r[2], "created_at": r[3], "balance": r[4]} for r in rows],
        })

    if action == "purchases":
        page = int(body.get("page", 1))
        limit = 50
        offset = (page - 1) * limit
        cur = conn.cursor()
        cur.execute(f"SELECT COUNT(*) FROM {SCHEMA}.purchases")
        total = cur.fetchone()[0]
        cur.execute(
            f"SELECT p.id, u.email, p.product, p.amount, p.birth_date, p.child_name, p.created_at "
            f"FROM {SCHEMA}.purchases p "
            f"JOIN {SCHEMA}.users u ON u.id = p.user_id "
            f"ORDER BY p.created_at DESC LIMIT {limit} OFFSET {offset}"
        )
        rows = cur.fetchall()
        cur.close()
        conn.close()
        return ok({
            "total": total,
            "page": page,
            "purchases": [
                {"id": r[0], "email": r[1], "product": r[2], "amount": r[3], "birth_date": r[4], "child_name": r[5], "created_at": r[6]}
                for r in rows
            ],
        })

    if action == "topup":
        user_id = int(body.get("user_id", 0))
        amount = int(body.get("amount", 0))
        if user_id <= 0 or amount <= 0:
            conn.close()
            return err(400, "Укажите user_id и amount > 0")
        cur = conn.cursor()
        cur.execute(f"SELECT id FROM {SCHEMA}.users WHERE id = {user_id}")
        if not cur.fetchone():
            cur.close()
            conn.close()
            return err(404, "Пользователь не найден")
        cur.execute(f"SELECT user_id FROM {SCHEMA}.balances WHERE user_id = {user_id}")
        if not cur.fetchone():
            cur.execute(f"INSERT INTO {SCHEMA}.balances (user_id, amount) VALUES ({user_id}, 0)")
        cur.execute(
            f"UPDATE {SCHEMA}.balances SET amount = amount + {amount}, updated_at = NOW() WHERE user_id = {user_id}"
        )
        cur.execute(
            f"INSERT INTO {SCHEMA}.transactions (user_id, type, amount, description, status) "
            f"VALUES ({user_id}, 'topup', {amount}, 'Начисление администратором', 'completed')"
        )
        conn.commit()
        cur.execute(f"SELECT amount FROM {SCHEMA}.balances WHERE user_id = {user_id}")
        new_balance = cur.fetchone()[0]
        cur.close()
        conn.close()
        return ok({"ok": True, "user_id": user_id, "added": amount, "balance": new_balance})

    conn.close()
    return err(400, "Неизвестное действие")