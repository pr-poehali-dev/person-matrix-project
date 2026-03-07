"""
PDF-отчёт «Детский нумерологический профиль».
action: generate — проверяет покупку и возвращает base64 PDF.
"""
import os
import io
import json
import base64
from datetime import datetime

import psycopg2
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak,
)

SCHEMA = os.environ.get("MAIN_DB_SCHEMA", "t_p69170643_person_matrix_projec")
CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Auth-Token",
}

PURPLE_DARK = colors.HexColor("#6b21a8")
PURPLE = colors.HexColor("#9333ea")
PURPLE_LIGHT = colors.HexColor("#f3e8ff")
AMBER = colors.HexColor("#f59e0b")
AMBER_LIGHT = colors.HexColor("#fef3c7")
GREEN = colors.HexColor("#22c55e")
RED = colors.HexColor("#ef4444")
ROSE = colors.HexColor("#f43f5e")
SKY = colors.HexColor("#0ea5e9")
GRAY = colors.HexColor("#374151")
GRAY_LIGHT = colors.HexColor("#f3f4f6")
WHITE = colors.white

NUMBER_TITLES = {
    1: "Лидер", 2: "Дипломат", 3: "Творец", 4: "Архитектор",
    5: "Исследователь", 6: "Хранитель", 7: "Мудрец", 8: "Стратег",
    9: "Мечтатель", 11: "Мастер интуиции", 22: "Мастер-строитель",
}

MATRIX_LABELS = {
    1: "Воля", 2: "Эмоции", 3: "Творчество", 4: "Практичность",
    5: "Мышление", 6: "Ответственность", 7: "Интуиция", 8: "Амбиции", 9: "Интеллект",
}

RISK_DATA = {
    1: {"label": "Нет инициативы", "desc": "Ребёнку сложно начинать дела самому", "tip": "Давайте выбор из 2-3 вариантов, поощряйте любую инициативу"},
    2: {"label": "Трудности общения", "desc": "Сложно считывать эмоции и строить дружбу", "tip": "Ролевые игры, совместные занятия с другими детьми"},
    3: {"label": "Нет креативности", "desc": "Мыслит шаблонно, не любит фантазировать", "tip": "Рисование, лепка, сочинение историй"},
    4: {"label": "Неорганизованность", "desc": "Трудно планировать, теряет вещи", "tip": "Визуальное расписание, помощь в организации дня"},
    5: {"label": "Сложности обучения", "desc": "Трудно усваивать новую информацию", "tip": "Обучение через игру и практику, а не зубрёжку"},
    6: {"label": "Безответственность", "desc": "Не чувствует ответственности за поступки", "tip": "Простые обязанности по дому, уход за питомцем"},
    7: {"label": "Нет аналитики", "desc": "Не задаёт вопросов «почему?»", "tip": "Задавайте ребёнку вопросы, а не давайте готовые ответы"},
    8: {"label": "Нет амбиций", "desc": "Не стремится к целям", "tip": "Спортивные соревнования, настольные игры на стратегию"},
    9: {"label": "Низкая концентрация", "desc": "Быстро отвлекается", "tip": "Техника помодоро для детей: 10 мин работы + 5 мин отдыха"},
}

CAREER_DB = [
    {"title": "Учёный / исследователь", "digits": [5, 7, 9]},
    {"title": "Программист / инженер", "digits": [5, 7, 9]},
    {"title": "Руководитель / менеджер", "digits": [1, 8]},
    {"title": "Художник / дизайнер", "digits": [3, 6]},
    {"title": "Предприниматель", "digits": [4, 8]},
    {"title": "Врач / психолог", "digits": [2, 6, 9]},
    {"title": "Писатель / журналист", "digits": [3, 5, 9]},
    {"title": "Музыкант / артист", "digits": [2, 3, 6]},
    {"title": "Спортсмен / тренер", "digits": [1, 4, 8]},
    {"title": "Педагог / наставник", "digits": [2, 6, 7]},
    {"title": "Юрист / дипломат", "digits": [1, 7, 9]},
    {"title": "Архитектор / строитель", "digits": [4, 7, 8]},
]

CYCLE_DESC = {
    1: "Период развития самостоятельности и лидерских качеств",
    2: "Время обучения сотрудничеству и эмоциональной чуткости",
    3: "Расцвет творческого самовыражения и коммуникации",
    4: "Формирование дисциплины, трудолюбия и ответственности",
    5: "Этап перемен, поиска себя и расширения горизонтов",
    6: "Время заботы о близких и обретения гармонии",
    7: "Период погружения в знания, анализ и самопознание",
    8: "Этап амбиций, достижений и финансового роста",
    9: "Время мудрости, завершения циклов и отдачи миру",
    11: "Период духовного развития и интуитивных прозрений",
    22: "Масштабные свершения и реализация большой миссии",
}

THINKING_LABELS = {
    "logical": "Логический",
    "emotional": "Эмоциональный",
    "managerial": "Управленческий",
    "creative": "Творческий",
}

THINKING_DESC = {
    "logical": "Ребёнок анализирует мир через факты, схемы и закономерности. Любит задавать вопросы «почему?» и строить причинно-следственные связи.",
    "emotional": "Ребёнок воспринимает мир через чувства и эмоции. Решения принимает «сердцем», обладает развитой интуицией.",
    "managerial": "Ребёнок — прирождённый организатор. Умеет распределять роли, принимать решения и вести за собой.",
    "creative": "Ребёнок мыслит образами и метафорами. Придумывает нестандартные решения, обладает богатой фантазией.",
}

LEARNING_STYLES = {
    5: {"name": "Через логику", "desc": "Лучше всего усваивает информацию через анализ, схемы и пошаговые объяснения."},
    3: {"name": "Через творчество", "desc": "Запоминает через рисунки, истории и образы."},
    2: {"name": "Через общение", "desc": "Лучше учится в паре или группе."},
    7: {"name": "Через анализ", "desc": "Предпочитает разбираться сам."},
}

CHILD_PROFILES = {
    1: {"title": "Маленький лидер", "desc": "С ранних лет хочет командовать. Самостоятельный и своевольный ребёнок с яркими амбициями."},
    2: {"title": "Тихий чуткий ребёнок", "desc": "Тонко чувствует настроение родителей. Может замыкаться в напряжённой атмосфере."},
    3: {"title": "Яркий артист", "desc": "Обожает выступать и фантазировать. Много говорит, рисует и выдумывает истории."},
    4: {"title": "Маленький строитель", "desc": "Любит порядок и систему. Практичный ребёнок с конструкторским мышлением."},
    5: {"title": "Непоседа-исследователь", "desc": "Всё хочет попробовать и потрогать. Не может усидеть на месте, жаждет новых впечатлений."},
    6: {"title": "Маленький заботливый", "desc": "С раннего возраста проявляет заботу о других. Любит помогать и ухаживать."},
    7: {"title": "Тихий мыслитель", "desc": "Много времени проводит в размышлениях. Задаёт глубокие вопросы не по возрасту."},
    8: {"title": "Маленький бизнесмен", "desc": "Уже в детстве проявляет деловую хватку. Любит организовывать и управлять."},
    9: {"title": "Маленький мечтатель", "desc": "Живёт в мире фантазий. Очень эмпатичный и сострадательный ребёнок."},
    11: {"title": "Ребёнок с особой интуицией", "desc": "Чувствует то, что скрыто от других. Обладает необычной мудростью."},
    22: {"title": "Ребёнок с большой миссией", "desc": "Уже в детстве проявляет масштабное мышление и стремление изменить мир."},
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


def check_purchase(conn, user_id, child_date):
    cur = conn.cursor()
    cur.execute(
        f"SELECT id FROM {SCHEMA}.purchases "
        f"WHERE user_id = {user_id} AND product = 'child_analysis' "
        f"AND birth_date = '{child_date}'"
    )
    row = cur.fetchone()
    cur.close()
    return row is not None


def reduce(n):
    if n == 11 or n == 22:
        return n
    if n <= 9:
        return n
    s = sum(int(d) for d in str(n))
    return reduce(s)


def calc_life_path(date_str):
    y, m, d = date_str.split("-")
    digits = [int(c) for c in f"{d}{m}{y}"]
    return reduce(sum(digits))


def calc_character(date_str):
    day = int(date_str.split("-")[2])
    return reduce(day)


def calc_destiny(date_str):
    y, m, d = [int(x) for x in date_str.split("-")]
    return reduce(reduce(d) + reduce(m) + reduce(y))


def calc_soul_urge(date_str):
    m = int(date_str.split("-")[1])
    return reduce(m)


def calc_talent(date_str):
    y, m, d = [int(x) for x in date_str.split("-")]
    return reduce(reduce(m) + reduce(d))


def calc_thinking(date_str):
    y = int(date_str.split("-")[0])
    lp = calc_life_path(date_str)
    return reduce(reduce(y) + lp)


def calc_energy(date_str):
    return sum(int(c) for c in date_str.replace("-", ""))


def calc_matrix(date_str):
    digits = [int(c) for c in date_str.replace("-", "") if c != "0"]
    matrix = {i: 0 for i in range(1, 10)}
    for d in digits:
        if 1 <= d <= 9:
            matrix[d] += 1
    return matrix


def clamp(v, lo, hi):
    return max(lo, min(hi, round(v)))


def calc_mind_index(matrix):
    return clamp((matrix[3] + matrix[5] + matrix[7] + matrix[9]) * 25, 0, 100)


def calc_emotion_index(matrix):
    return clamp((matrix[2] + matrix[6] + matrix[9]) * 30, 0, 100)


def calc_leader_index(matrix):
    return clamp((matrix[1] + matrix[8]) * 40, 0, 100)


def calc_learning_index(matrix):
    return clamp((matrix[5] + matrix[7] + matrix[9]) * 30, 0, 100)


def determine_thinking_type(mind, emotion, leader, matrix):
    if matrix[3] >= 2:
        return "creative"
    if leader >= 80:
        return "managerial"
    if emotion > mind:
        return "emotional"
    return "logical"


def determine_learning_style(matrix):
    candidates = [5, 3, 2, 7]
    best = max(candidates, key=lambda c: matrix[c])
    return LEARNING_STYLES.get(best, LEARNING_STYLES[5])


def calc_career_scores(matrix):
    results = []
    for c in CAREER_DB:
        score = clamp(sum(matrix[d] for d in c["digits"]) * (100 / len(c["digits"]) / 2), 0, 100)
        results.append({"title": c["title"], "score": score})
    results.sort(key=lambda x: -x["score"])
    return results[:8]


def calc_risks(matrix):
    risks = []
    for d in range(1, 10):
        if matrix[d] == 0:
            r = RISK_DATA[d]
            risks.append({"digit": d, "label": r["label"], "desc": r["desc"], "tip": r["tip"]})
    return risks


def calc_cycles(date_str):
    y, m, d = [int(x) for x in date_str.split("-")]
    rdm, rdd, rdy = reduce(m), reduce(d), reduce(y)
    c1 = reduce(rdm + rdd)
    c2 = reduce(rdd + rdy)
    c3 = reduce(c1 + c2)
    return [
        {"period": "Детство и юность", "number": c1, "ages": "0–27", "desc": CYCLE_DESC.get(c1, "")},
        {"period": "Зрелость", "number": c2, "ages": "28–54", "desc": CYCLE_DESC.get(c2, "")},
        {"period": "Мудрость", "number": c3, "ages": "55+", "desc": CYCLE_DESC.get(c3, "")},
    ]


def calc_turning_age(lp):
    base = reduce(lp) if lp > 9 else lp
    return base * 4


def calc_parent_compat(child_lp, parent_date):
    if not parent_date:
        return None
    plp = calc_life_path(parent_date)
    score = clamp(100 - abs(plp - child_lp) * 10, 10, 100)
    diff = abs(plp - child_lp)
    if diff <= 2:
        insight = "Интуитивное взаимопонимание, лёгкость в общении."
    elif diff <= 4:
        insight = "Родитель и ребёнок дополняют друг друга. Различия создают баланс."
    elif diff <= 6:
        insight = "Есть зоны непонимания. Важно учиться принимать различия."
    else:
        insight = "Энергии существенно различаются. Нужно особое терпение."
    return {"score": score, "insight": insight}


def register_fonts():
    try:
        pdfmetrics.getFont("DejaVu")
        return
    except:
        pass
    font_paths = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/dejavu/DejaVuSans.ttf",
        "/usr/local/share/fonts/DejaVuSans.ttf",
    ]
    for fp in font_paths:
        if os.path.exists(fp):
            pdfmetrics.registerFont(TTFont("DejaVu", fp))
            bold_fp = fp.replace("DejaVuSans.ttf", "DejaVuSans-Bold.ttf")
            if os.path.exists(bold_fp):
                pdfmetrics.registerFont(TTFont("DejaVu-Bold", bold_fp))
            return
    pdfmetrics.registerFont(TTFont("DejaVu", "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"))


def build_pdf(child_date, child_name, mother_date, father_date):
    register_fonts()
    font_name = "DejaVu"
    font_bold = "DejaVu-Bold"

    buf = io.BytesIO()
    doc = SimpleDocTemplate(buf, pagesize=A4, topMargin=20*mm, bottomMargin=15*mm, leftMargin=18*mm, rightMargin=18*mm)
    W = A4[0] - 36*mm
    story = []

    s_title = ParagraphStyle("title", fontName=font_bold, fontSize=22, leading=28, textColor=PURPLE_DARK, alignment=1)
    s_subtitle = ParagraphStyle("subtitle", fontName=font_name, fontSize=11, leading=16, textColor=GRAY, alignment=1)
    s_h2 = ParagraphStyle("h2", fontName=font_bold, fontSize=15, leading=20, textColor=PURPLE_DARK, spaceBefore=12, spaceAfter=6)
    s_h3 = ParagraphStyle("h3", fontName=font_bold, fontSize=12, leading=16, textColor=GRAY, spaceBefore=8, spaceAfter=4)
    s_body = ParagraphStyle("body", fontName=font_name, fontSize=10, leading=15, textColor=GRAY)
    s_small = ParagraphStyle("small", fontName=font_name, fontSize=9, leading=13, textColor=colors.HexColor("#6b7280"))
    s_number = ParagraphStyle("number", fontName=font_bold, fontSize=28, leading=32, textColor=PURPLE, alignment=1)
    s_center = ParagraphStyle("center", fontName=font_name, fontSize=10, leading=15, textColor=GRAY, alignment=1)

    lp = calc_life_path(child_date)
    ch = calc_character(child_date)
    ds = calc_destiny(child_date)
    talent = calc_talent(child_date)
    thinking_num = calc_thinking(child_date)
    energy = calc_energy(child_date)
    matrix = calc_matrix(child_date)

    mind_idx = calc_mind_index(matrix)
    emotion_idx = calc_emotion_index(matrix)
    leader_idx = calc_leader_index(matrix)
    learning_idx = calc_learning_index(matrix)
    energy_idx = clamp(energy * 3, 0, 100)
    success_idx = clamp(round((leader_idx + mind_idx + energy_idx) / 3), 0, 100)
    future_idx = clamp(round((success_idx + learning_idx + leader_idx) / 3), 0, 100)

    thinking_type = determine_thinking_type(mind_idx, emotion_idx, leader_idx, matrix)
    learning_style = determine_learning_style(matrix)
    careers = calc_career_scores(matrix)
    risks = calc_risks(matrix)
    cycles = calc_cycles(child_date)
    turning_age = calc_turning_age(lp)

    display_name = child_name or "ребёнка"
    profile = CHILD_PROFILES.get(lp, CHILD_PROFILES.get(reduce(lp), {"title": "Уникальная личность", "desc": "Обладает индивидуальным набором качеств."}))
    formatted_date = child_date

    # ═══ PAGE 1: COVER ═══
    story.append(Spacer(1, 40*mm))
    story.append(Paragraph("✦ Детский нумерологический профиль ✦", s_title))
    story.append(Spacer(1, 8*mm))
    story.append(Paragraph(f"Профиль {display_name}", ParagraphStyle("name", fontName=font_bold, fontSize=18, leading=24, textColor=GRAY, alignment=1)))
    story.append(Spacer(1, 4*mm))
    story.append(Paragraph(f"Дата рождения: {formatted_date}", s_subtitle))
    story.append(Spacer(1, 3*mm))
    story.append(Paragraph(f"Число жизненного пути: {lp} — {NUMBER_TITLES.get(lp, '')}", s_subtitle))
    story.append(Spacer(1, 15*mm))

    cover_data = [
        ["Характер", str(ch), "Судьба", str(ds)],
        ["Талант", str(talent), "Мышление", str(thinking_num)],
    ]
    cover_table = Table(cover_data, colWidths=[W*0.3, W*0.2, W*0.3, W*0.2])
    cover_table.setStyle(TableStyle([
        ("FONTNAME", (0, 0), (-1, -1), font_name),
        ("FONTNAME", (1, 0), (1, -1), font_bold),
        ("FONTNAME", (3, 0), (3, -1), font_bold),
        ("FONTSIZE", (0, 0), (-1, -1), 11),
        ("FONTSIZE", (1, 0), (1, -1), 18),
        ("FONTSIZE", (3, 0), (3, -1), 18),
        ("TEXTCOLOR", (0, 0), (0, -1), GRAY),
        ("TEXTCOLOR", (2, 0), (2, -1), GRAY),
        ("TEXTCOLOR", (1, 0), (1, -1), PURPLE),
        ("TEXTCOLOR", (3, 0), (3, -1), PURPLE),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("BACKGROUND", (0, 0), (-1, -1), PURPLE_LIGHT),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#e9d5ff")),
        ("TOPPADDING", (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
    ]))
    story.append(cover_table)
    story.append(Spacer(1, 20*mm))
    story.append(Paragraph(f"Отчёт сгенерирован: {datetime.now().strftime('%d.%m.%Y')}", s_small))
    story.append(Paragraph("personmatrix.ru — Матрица личности", s_small))
    story.append(PageBreak())

    # ═══ PAGE 2: PROFILE ═══
    story.append(Paragraph(f"Профиль личности: {profile['title']}", s_h2))
    story.append(Paragraph(profile["desc"], s_body))
    story.append(Spacer(1, 6*mm))

    story.append(Paragraph("6 ключевых чисел", s_h2))
    nums_data = [
        ["Жизненный путь", str(lp), NUMBER_TITLES.get(lp, "")],
        ["Характер", str(ch), NUMBER_TITLES.get(ch, "")],
        ["Судьба", str(ds), NUMBER_TITLES.get(ds, "")],
        ["Талант", str(talent), NUMBER_TITLES.get(talent, "")],
        ["Мышление", str(thinking_num), NUMBER_TITLES.get(thinking_num, "")],
        ["Энергия", str(energy), f"{'Высокая' if energy > 20 else 'Средняя' if energy > 10 else 'Низкая'}"],
    ]
    nums_table = Table(nums_data, colWidths=[W*0.35, W*0.15, W*0.50])
    nums_table.setStyle(TableStyle([
        ("FONTNAME", (0, 0), (0, -1), font_name),
        ("FONTNAME", (1, 0), (1, -1), font_bold),
        ("FONTNAME", (2, 0), (2, -1), font_name),
        ("FONTSIZE", (0, 0), (-1, -1), 10),
        ("FONTSIZE", (1, 0), (1, -1), 14),
        ("TEXTCOLOR", (0, 0), (0, -1), GRAY),
        ("TEXTCOLOR", (1, 0), (1, -1), PURPLE),
        ("TEXTCOLOR", (2, 0), (2, -1), GRAY),
        ("ALIGN", (1, 0), (1, -1), "CENTER"),
        ("BACKGROUND", (0, 0), (-1, -1), PURPLE_LIGHT),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#e9d5ff")),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
    ]))
    story.append(nums_table)
    story.append(PageBreak())

    # ═══ PAGE 3: MATRIX ═══
    story.append(Paragraph("Матрица Пифагора", s_h2))
    story.append(Paragraph("Распределение энергий по 9 аспектам личности.", s_body))
    story.append(Spacer(1, 4*mm))

    matrix_data = []
    for row_start in [1, 4, 7]:
        row = []
        for d in range(row_start, row_start + 3):
            count = matrix[d]
            val = str(d) * count if count > 0 else "—"
            row.append(f"{MATRIX_LABELS[d]}\n{val}")
        matrix_data.append(row)

    matrix_table = Table(matrix_data, colWidths=[W/3]*3, rowHeights=[25*mm]*3)
    matrix_table.setStyle(TableStyle([
        ("FONTNAME", (0, 0), (-1, -1), font_name),
        ("FONTSIZE", (0, 0), (-1, -1), 12),
        ("TEXTCOLOR", (0, 0), (-1, -1), PURPLE_DARK),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("BACKGROUND", (0, 0), (-1, -1), PURPLE_LIGHT),
        ("GRID", (0, 0), (-1, -1), 1, colors.HexColor("#d8b4fe")),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
    ]))
    story.append(matrix_table)
    story.append(Spacer(1, 8*mm))

    # ═══ INDICES ═══
    story.append(Paragraph("Индексы развития", s_h2))
    idx_data = [
        ["Показатель", "Значение", "Уровень"],
        ["Энергия", f"{energy_idx}%", "Высокая" if energy_idx > 60 else "Средняя" if energy_idx > 30 else "Низкая"],
        ["Интеллект", f"{mind_idx}%", "Высокий" if mind_idx > 60 else "Средний" if mind_idx > 30 else "Низкий"],
        ["Эмоциональность", f"{emotion_idx}%", "Высокая" if emotion_idx > 60 else "Средняя" if emotion_idx > 30 else "Низкая"],
        ["Лидерство", f"{leader_idx}%", "Высокое" if leader_idx > 60 else "Среднее" if leader_idx > 30 else "Низкое"],
        ["Обучаемость", f"{learning_idx}%", "Высокая" if learning_idx > 60 else "Средняя" if learning_idx > 30 else "Низкая"],
    ]
    idx_table = Table(idx_data, colWidths=[W*0.40, W*0.25, W*0.35])
    idx_table.setStyle(TableStyle([
        ("FONTNAME", (0, 0), (-1, 0), font_bold),
        ("FONTNAME", (0, 1), (-1, -1), font_name),
        ("FONTNAME", (1, 1), (1, -1), font_bold),
        ("FONTSIZE", (0, 0), (-1, -1), 10),
        ("TEXTCOLOR", (0, 0), (-1, 0), WHITE),
        ("TEXTCOLOR", (0, 1), (0, -1), GRAY),
        ("TEXTCOLOR", (1, 1), (1, -1), PURPLE),
        ("BACKGROUND", (0, 0), (-1, 0), PURPLE),
        ("BACKGROUND", (0, 1), (-1, -1), PURPLE_LIGHT),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#d8b4fe")),
        ("ALIGN", (1, 0), (1, -1), "CENTER"),
        ("TOPPADDING", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
    ]))
    story.append(idx_table)
    story.append(PageBreak())

    # ═══ PAGE 4: THINKING + LEARNING ═══
    story.append(Paragraph(f"Тип мышления: {THINKING_LABELS.get(thinking_type, '')}", s_h2))
    story.append(Paragraph(THINKING_DESC.get(thinking_type, ""), s_body))
    story.append(Spacer(1, 6*mm))

    story.append(Paragraph("Стиль обучения", s_h2))
    story.append(Paragraph(f"Основной: {learning_style['name']}", s_h3))
    story.append(Paragraph(learning_style["desc"], s_body))
    story.append(Spacer(1, 8*mm))

    # ═══ CAREERS ═══
    story.append(Paragraph("Карьерные склонности", s_h2))
    story.append(Paragraph("Направления с наибольшим потенциалом по матрице ребёнка.", s_body))
    story.append(Spacer(1, 3*mm))

    career_data = [["Направление", "Потенциал"]]
    for c in careers:
        bar = "█" * (c["score"] // 10) + "░" * (10 - c["score"] // 10)
        career_data.append([c["title"], f"{bar} {c['score']}%"])
    career_table = Table(career_data, colWidths=[W*0.45, W*0.55])
    career_table.setStyle(TableStyle([
        ("FONTNAME", (0, 0), (-1, 0), font_bold),
        ("FONTNAME", (0, 1), (-1, -1), font_name),
        ("FONTSIZE", (0, 0), (-1, -1), 10),
        ("TEXTCOLOR", (0, 0), (-1, 0), WHITE),
        ("TEXTCOLOR", (0, 1), (0, -1), GRAY),
        ("TEXTCOLOR", (1, 1), (1, -1), PURPLE_DARK),
        ("BACKGROUND", (0, 0), (-1, 0), PURPLE),
        ("BACKGROUND", (0, 1), (-1, -1), GRAY_LIGHT),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#e5e7eb")),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
    ]))
    story.append(career_table)
    story.append(PageBreak())

    # ═══ PAGE 5: RISKS ═══
    if risks:
        story.append(Paragraph("Зоны риска в развитии", s_h2))
        story.append(Paragraph("Отсутствующие цифры в матрице и рекомендации.", s_body))
        story.append(Spacer(1, 3*mm))

        risk_data = [["Цифра", "Риск", "Рекомендация"]]
        for r in risks:
            risk_data.append([str(r["digit"]), r["label"], r["tip"]])
        risk_table = Table(risk_data, colWidths=[W*0.10, W*0.30, W*0.60])
        risk_table.setStyle(TableStyle([
            ("FONTNAME", (0, 0), (-1, 0), font_bold),
            ("FONTNAME", (0, 1), (-1, -1), font_name),
            ("FONTSIZE", (0, 0), (-1, -1), 9),
            ("TEXTCOLOR", (0, 0), (-1, 0), WHITE),
            ("TEXTCOLOR", (0, 1), (0, -1), ROSE),
            ("TEXTCOLOR", (1, 1), (1, -1), GRAY),
            ("TEXTCOLOR", (2, 1), (2, -1), GRAY),
            ("BACKGROUND", (0, 0), (-1, 0), ROSE),
            ("BACKGROUND", (0, 1), (-1, -1), colors.HexColor("#fff1f2")),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#fecdd3")),
            ("ALIGN", (0, 0), (0, -1), "CENTER"),
            ("TOPPADDING", (0, 0), (-1, -1), 6),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ]))
        story.append(risk_table)
        story.append(Spacer(1, 8*mm))

    # ═══ POTENTIAL ═══
    story.append(Paragraph("Потенциал будущего", s_h2))
    pot_data = [
        ["Индекс успешности", f"{success_idx}%"],
        ["Индекс обучаемости", f"{learning_idx}%"],
        ["Потенциал будущего", f"{future_idx}%"],
    ]
    pot_table = Table(pot_data, colWidths=[W*0.6, W*0.4])
    pot_table.setStyle(TableStyle([
        ("FONTNAME", (0, 0), (-1, -1), font_name),
        ("FONTNAME", (1, 0), (1, -1), font_bold),
        ("FONTSIZE", (0, 0), (-1, -1), 12),
        ("TEXTCOLOR", (0, 0), (0, -1), GRAY),
        ("TEXTCOLOR", (1, 0), (1, -1), PURPLE),
        ("ALIGN", (1, 0), (1, -1), "CENTER"),
        ("BACKGROUND", (0, 0), (-1, -1), PURPLE_LIGHT),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#e9d5ff")),
        ("TOPPADDING", (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
    ]))
    story.append(pot_table)

    potential_text = []
    if leader_idx >= 60:
        potential_text.append("Высокий потенциал лидерства и управления.")
    if mind_idx >= 60:
        potential_text.append("Склонность к научной и аналитической карьере.")
    if matrix[3] >= 2:
        potential_text.append("Яркий творческий потенциал.")
    if leader_idx >= 40 and matrix[4] >= 1:
        potential_text.append("Задатки предпринимателя.")
    if not potential_text:
        potential_text.append("Сбалансированный потенциал для различных направлений.")
    for t in potential_text:
        story.append(Paragraph(f"• {t}", s_body))
    story.append(PageBreak())

    # ═══ PAGE 6: LIFE CYCLES ═══
    story.append(Paragraph("Жизненные циклы", s_h2))
    story.append(Paragraph("Три ключевых периода развития ребёнка.", s_body))
    story.append(Spacer(1, 3*mm))

    cycle_data = [["Период", "Число", "Возраст", "Описание"]]
    for c in cycles:
        cycle_data.append([c["period"], str(c["number"]), c["ages"], c["desc"]])
    cycle_table = Table(cycle_data, colWidths=[W*0.22, W*0.10, W*0.13, W*0.55])
    cycle_table.setStyle(TableStyle([
        ("FONTNAME", (0, 0), (-1, 0), font_bold),
        ("FONTNAME", (0, 1), (-1, -1), font_name),
        ("FONTNAME", (1, 1), (1, -1), font_bold),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("TEXTCOLOR", (0, 0), (-1, 0), WHITE),
        ("TEXTCOLOR", (1, 1), (1, -1), PURPLE),
        ("BACKGROUND", (0, 0), (-1, 0), SKY),
        ("BACKGROUND", (0, 1), (-1, -1), colors.HexColor("#f0f9ff")),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#bae6fd")),
        ("ALIGN", (1, 0), (2, -1), "CENTER"),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
    ]))
    story.append(cycle_table)
    story.append(Spacer(1, 6*mm))

    story.append(Paragraph("Переломный возраст", s_h2))
    story.append(Paragraph(f"В возрасте {turning_age} лет ребёнок пройдёт через значимую трансформацию — период переосмысления приоритетов и выхода на новый уровень самосознания.", s_body))
    story.append(Spacer(1, 8*mm))

    # ═══ PARENT COMPATIBILITY ═══
    mother_compat = calc_parent_compat(lp, mother_date)
    father_compat = calc_parent_compat(lp, father_date)

    if mother_compat or father_compat:
        story.append(PageBreak())
        story.append(Paragraph("Совместимость с родителями", s_h2))

        scores = []
        if mother_compat:
            scores.append(mother_compat["score"])
        if father_compat:
            scores.append(father_compat["score"])
        family_balance = round(sum(scores) / len(scores)) if scores else 0

        story.append(Paragraph(f"Семейный баланс: {family_balance}%", s_h3))
        story.append(Spacer(1, 3*mm))

        if mother_compat:
            story.append(Paragraph(f"Мама — совместимость {mother_compat['score']}%", s_h3))
            story.append(Paragraph(mother_compat["insight"], s_body))
            story.append(Spacer(1, 3*mm))

        if father_compat:
            story.append(Paragraph(f"Папа — совместимость {father_compat['score']}%", s_h3))
            story.append(Paragraph(father_compat["insight"], s_body))
            story.append(Spacer(1, 3*mm))

    # ═══ RECOMMENDATIONS ═══
    story.append(PageBreak())
    story.append(Paragraph("Рекомендации по развитию", s_h2))

    tips = [
        "Учитывайте природный тип мышления при выборе занятий и кружков.",
        "Развивайте слабые стороны через игру, а не принуждение.",
        "Подбирайте стиль обучения, соответствующий индивидуальности ребёнка.",
        "Используйте сильные качества как опору для роста.",
        "Помните о переломном возрасте — подготовьте ребёнка к переменам.",
    ]

    if leader_idx < 30:
        tips.append("Развивайте уверенность: поручайте ребёнку ответственные задачи.")
    if mind_idx < 30:
        tips.append("Стимулируйте любознательность: задавайте открытые вопросы.")
    if emotion_idx > 70:
        tips.append("Научите управлять эмоциями: дыхательные упражнения, дневник чувств.")
    if learning_idx < 30:
        tips.append("Подбирайте альтернативные методы обучения: видео, проекты, эксперименты.")

    for i, tip in enumerate(tips):
        story.append(Paragraph(f"{i+1}. {tip}", s_body))
        story.append(Spacer(1, 2*mm))

    story.append(Spacer(1, 10*mm))
    story.append(Paragraph("Данный отчёт основан на классической нумерологии Пифагора.", s_small))
    story.append(Paragraph("personmatrix.ru — Матрица личности", s_small))

    doc.build(story)
    return buf.getvalue()


def handler(event: dict, context) -> dict:
    """Генерация PDF-отчёта «Детский нумерологический профиль»."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    body = {}
    if event.get("body"):
        body = json.loads(event["body"])

    action = body.get("action", "")
    token = event.get("headers", {}).get("X-Auth-Token", "")

    if action != "generate":
        return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Используй action=generate"})}

    if not token:
        return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Не авторизован"})}

    conn = get_conn()
    user = get_user_by_token(conn, token)
    if not user:
        conn.close()
        return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Сессия истекла"})}

    child_date = body.get("child_date", "")
    if not child_date:
        conn.close()
        return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "child_date обязательна"})}

    if not check_purchase(conn, user["id"], child_date):
        conn.close()
        return {"statusCode": 403, "headers": CORS, "body": json.dumps({"error": "Отчёт не оплачен"})}

    conn.close()

    child_name = body.get("child_name", "")
    mother_date = body.get("mother_date", "")
    father_date = body.get("father_date", "")

    pdf_bytes = build_pdf(child_date, child_name, mother_date or None, father_date or None)
    pdf_b64 = base64.b64encode(pdf_bytes).decode("utf-8")

    safe_name = (child_name or "child").replace(" ", "_")
    filename = f"child_profile_{safe_name}_{child_date}.pdf"

    return {
        "statusCode": 200,
        "headers": CORS,
        "body": json.dumps({"pdf": pdf_b64, "filename": filename}),
    }
