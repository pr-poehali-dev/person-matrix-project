"""
Платежи и баланс: пополнение через ЮKassa, вебхук, баланс, списание за услуги.
action: create-payment | webhook | balance | spend | history
"""
import os
import json
import uuid
import base64
import urllib.request
import psycopg2

SCHEMA = os.environ.get("MAIN_DB_SCHEMA", "t_p69170643_person_matrix_projec")
CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Auth-Token",
}

PRICES = {
    "full_analysis": 490,
    "compatibility": 690,
    "child_analysis": 990,
    "destiny_map": 1490,
    "family_matrix": 1990,
    "barriers_anxiety": 290,
}

PRODUCT_NAMES = {
    "full_analysis": "Полный анализ личности",
    "compatibility": "Анализ совместимости пары",
    "child_analysis": "Анализ ребёнка",
    "destiny_map": "Полная карта судьбы",
    "family_matrix": "Матрица судьбы семьи",
    "barriers_anxiety": "Барьеры, тревоги и стресс",
}


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def get_user_by_token(conn, token):
    cur = conn.cursor()
    cur.execute(
        f"SELECT u.id, u.email, u.name "
        f"FROM {SCHEMA}.sessions s "
        f"JOIN {SCHEMA}.users u ON u.id = s.user_id "
        f"WHERE s.token = '{token}' AND s.expires_at > NOW()"
    )
    row = cur.fetchone()
    cur.close()
    if not row:
        return None
    return {"id": row[0], "email": row[1], "name": row[2]}


def get_balance(conn, user_id):
    cur = conn.cursor()
    cur.execute(f"SELECT amount FROM {SCHEMA}.balances WHERE user_id = {user_id}")
    row = cur.fetchone()
    cur.close()
    return row[0] if row else 0


def ensure_balance(conn, user_id):
    cur = conn.cursor()
    cur.execute(f"SELECT user_id FROM {SCHEMA}.balances WHERE user_id = {user_id}")
    if not cur.fetchone():
        cur.execute(f"INSERT INTO {SCHEMA}.balances (user_id, amount) VALUES ({user_id}, 0)")
        conn.commit()
    cur.close()


def create_yookassa_payment(amount_rub, description, return_url, metadata):
    shop_id = os.environ.get("YOOKASSA_SHOP_ID", "")
    secret_key = os.environ.get("YOOKASSA_SECRET_KEY", "")

    payload = {
        "amount": {"value": f"{amount_rub}.00", "currency": "RUB"},
        "confirmation": {"type": "redirect", "return_url": return_url},
        "capture": True,
        "description": description,
        "metadata": metadata,
    }

    data = json.dumps(payload).encode("utf-8")
    credentials = base64.b64encode(f"{shop_id}:{secret_key}".encode()).decode()
    idempotence_key = str(uuid.uuid4())

    req = urllib.request.Request(
        "https://api.yookassa.ru/v3/payments",
        data=data,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Basic {credentials}",
            "Idempotence-Key": idempotence_key,
        },
        method="POST",
    )

    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode())


def handler(event, context):
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    body = {}
    if event.get("body"):
        body = json.loads(event["body"])

    action = body.get("action", "")
    token = event.get("headers", {}).get("X-Auth-Token", "")
    conn = get_conn()

    try:
        # --- CREATE PAYMENT (пополнение баланса) ---
        if action == "create-payment":
            if not token:
                conn.close()
                return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Не авторизован"})}
            user = get_user_by_token(conn, token)
            if not user:
                conn.close()
                return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Сессия истекла"})}

            amount = int(body.get("amount", 0))
            if amount < 100 or amount > 50000:
                conn.close()
                return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Сумма от 100 до 50 000 руб."})}

            return_url = body.get("return_url", "https://poehali.dev")
            ensure_balance(conn, user["id"])

            cur = conn.cursor()
            cur.execute(
                f"INSERT INTO {SCHEMA}.transactions (user_id, type, amount, description, status) "
                f"VALUES ({user['id']}, 'topup', {amount}, 'Пополнение баланса', 'pending') RETURNING id"
            )
            tx_id = cur.fetchone()[0]
            conn.commit()
            cur.close()

            payment = create_yookassa_payment(
                amount,
                f"Пополнение баланса — {amount} руб.",
                return_url,
                {"user_id": str(user["id"]), "tx_id": str(tx_id)},
            )

            cur = conn.cursor()
            cur.execute(
                f"UPDATE {SCHEMA}.transactions SET payment_id = '{payment['id']}' WHERE id = {tx_id}"
            )
            conn.commit()
            cur.close()
            conn.close()

            confirmation_url = payment.get("confirmation", {}).get("confirmation_url", "")
            return {
                "statusCode": 200,
                "headers": CORS,
                "body": json.dumps({"url": confirmation_url, "payment_id": payment["id"]}),
            }

        # --- WEBHOOK (от ЮKassa) ---
        if action == "webhook":
            event_type = body.get("event", "")
            obj = body.get("object", {})
            payment_id = obj.get("id", "")
            status = obj.get("status", "")

            if event_type == "payment.succeeded" and status == "succeeded":
                metadata = obj.get("metadata", {})
                user_id = int(metadata.get("user_id", 0))
                tx_id = int(metadata.get("tx_id", 0))
                amount_val = obj.get("amount", {}).get("value", "0")
                amount = int(float(amount_val))

                if user_id and tx_id and amount:
                    cur = conn.cursor()
                    cur.execute(
                        f"SELECT status FROM {SCHEMA}.transactions WHERE id = {tx_id}"
                    )
                    row = cur.fetchone()
                    if row and row[0] == "pending":
                        cur.execute(f"UPDATE {SCHEMA}.transactions SET status = 'completed' WHERE id = {tx_id}")
                        ensure_balance(conn, user_id)
                        cur.execute(
                            f"UPDATE {SCHEMA}.balances SET amount = amount + {amount}, updated_at = NOW() WHERE user_id = {user_id}"
                        )
                        conn.commit()
                    cur.close()

            conn.close()
            return {"statusCode": 200, "headers": CORS, "body": json.dumps({"ok": True})}

        # --- BALANCE ---
        if action == "balance":
            if not token:
                conn.close()
                return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Не авторизован"})}
            user = get_user_by_token(conn, token)
            if not user:
                conn.close()
                return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Сессия истекла"})}

            ensure_balance(conn, user["id"])
            balance = get_balance(conn, user["id"])
            conn.close()
            return {"statusCode": 200, "headers": CORS, "body": json.dumps({"balance": balance})}

        # --- SPEND (списание за услугу) ---
        if action == "spend":
            if not token:
                conn.close()
                return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Не авторизован"})}
            user = get_user_by_token(conn, token)
            if not user:
                conn.close()
                return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Сессия истекла"})}

            product = body.get("product", "")
            if product not in PRICES:
                conn.close()
                return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Неизвестная услуга"})}

            price = PRICES[product]
            ensure_balance(conn, user["id"])
            balance = get_balance(conn, user["id"])

            if balance < price:
                conn.close()
                return {
                    "statusCode": 402,
                    "headers": CORS,
                    "body": json.dumps({"error": "Недостаточно средств", "balance": balance, "price": price}),
                }

            birth_date = body.get("birth_date", "")
            birth_date2 = body.get("birth_date2", "")
            child_name = body.get("child_name", "")
            product_name = PRODUCT_NAMES.get(product, product)

            cur = conn.cursor()
            cur.execute(
                f"UPDATE {SCHEMA}.balances SET amount = amount - {price}, updated_at = NOW() WHERE user_id = {user['id']}"
            )
            cur.execute(
                f"INSERT INTO {SCHEMA}.transactions (user_id, type, amount, description, status) "
                f"VALUES ({user['id']}, 'spend', {price}, '{product_name}', 'completed')"
            )
            bd2_val = f"'{birth_date2}'" if birth_date2 else "NULL"
            cn_val = f"'{child_name}'" if child_name else "NULL"
            cur.execute(
                f"INSERT INTO {SCHEMA}.purchases (user_id, product, birth_date, birth_date2, child_name, amount) "
                f"VALUES ({user['id']}, '{product}', '{birth_date}', {bd2_val}, {cn_val}, {price}) RETURNING id"
            )
            purchase_id = cur.fetchone()[0]
            conn.commit()
            cur.close()

            new_balance = get_balance(conn, user["id"])
            conn.close()
            return {
                "statusCode": 200,
                "headers": CORS,
                "body": json.dumps({"ok": True, "purchase_id": purchase_id, "balance": new_balance}),
            }

        # --- CHECK PURCHASE (проверка покупки) ---
        if action == "check-purchase":
            if not token:
                conn.close()
                return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Не авторизован"})}
            user = get_user_by_token(conn, token)
            if not user:
                conn.close()
                return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Сессия истекла"})}

            product = body.get("product", "")
            birth_date = body.get("birth_date", "")
            birth_date2 = body.get("birth_date2", "")

            cur = conn.cursor()
            if product == "compatibility" and birth_date and birth_date2:
                cur.execute(
                    f"SELECT id FROM {SCHEMA}.purchases "
                    f"WHERE user_id = {user['id']} AND product = '{product}' "
                    f"AND birth_date = '{birth_date}' AND birth_date2 = '{birth_date2}'"
                )
            elif birth_date:
                cur.execute(
                    f"SELECT id FROM {SCHEMA}.purchases "
                    f"WHERE user_id = {user['id']} AND product = '{product}' AND birth_date = '{birth_date}'"
                )
            else:
                cur.close()
                conn.close()
                return {"statusCode": 200, "headers": CORS, "body": json.dumps({"purchased": False})}

            row = cur.fetchone()
            cur.close()
            conn.close()
            return {"statusCode": 200, "headers": CORS, "body": json.dumps({"purchased": bool(row)})}

        # --- HISTORY ---
        if action == "history":
            if not token:
                conn.close()
                return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Не авторизован"})}
            user = get_user_by_token(conn, token)
            if not user:
                conn.close()
                return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Сессия истекла"})}

            cur = conn.cursor()
            cur.execute(
                f"SELECT id, type, amount, description, status, created_at "
                f"FROM {SCHEMA}.transactions WHERE user_id = {user['id']} AND status = 'completed' "
                f"ORDER BY created_at DESC LIMIT 50"
            )
            rows = cur.fetchall()
            cur.close()
            conn.close()
            txs = [
                {"id": r[0], "type": r[1], "amount": r[2], "description": r[3], "status": r[4], "created_at": str(r[5])}
                for r in rows
            ]
            return {"statusCode": 200, "headers": CORS, "body": json.dumps({"transactions": txs})}

        # --- PRICES ---
        if action == "prices":
            conn.close()
            return {
                "statusCode": 200,
                "headers": CORS,
                "body": json.dumps({"prices": PRICES, "names": PRODUCT_NAMES}),
            }

        conn.close()
        return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Неизвестное действие"})}

    except Exception as e:
        conn.close()
        return {"statusCode": 500, "headers": CORS, "body": json.dumps({"error": str(e)})}