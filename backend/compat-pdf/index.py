"""
PDF-отчёт совместимости пары.
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

AMBER_DARK = colors.HexColor("#92400e")
AMBER = colors.HexColor("#f59e0b")
AMBER_LIGHT = colors.HexColor("#fef3c7")
GREEN = colors.HexColor("#22c55e")
RED = colors.HexColor("#ef4444")
GRAY = colors.HexColor("#374151")
GRAY_LIGHT = colors.HexColor("#f3f4f6")
WHITE = colors.white

NUMBER_TITLES = {
    1: "Лидер", 2: "Дипломат", 3: "Творец", 4: "Архитектор",
    5: "Исследователь", 6: "Хранитель", 7: "Мудрец", 8: "Стратег",
    9: "Мечтатель", 11: "Мастер интуиции", 22: "Мастер-строитель",
}

PAIR_ARCHETYPES = {
    "1-1": "Союз двух лидеров", "1-2": "Союз лидера и дипломата",
    "1-3": "Союз первопроходца и творца", "1-4": "Союз новатора и архитектора",
    "1-5": "Союз пионера и исследователя", "1-6": "Союз лидера и хранителя",
    "1-7": "Союз лидера и мудреца", "1-8": "Союз двух генералов",
    "1-9": "Союз лидера и мечтателя", "2-2": "Союз двух дипломатов",
    "2-3": "Союз дипломата и творца", "2-4": "Союз чуткости и надёжности",
    "2-5": "Союз интуиции и свободы", "2-6": "Союз двух хранителей гармонии",
    "2-7": "Союз чуткости и мудрости", "2-8": "Союз дипломата и стратега",
    "2-9": "Союз интуиции и мечты", "3-3": "Союз двух творцов",
    "3-4": "Союз творца и архитектора", "3-5": "Союз вдохновения и приключений",
    "3-6": "Союз творца и хранителя", "3-7": "Союз творца и мудреца",
    "3-8": "Союз творца и стратега", "3-9": "Союз вдохновения и визионера",
    "4-4": "Союз двух строителей", "4-5": "Союз стабильности и перемен",
    "4-6": "Союз архитектора и хранителя", "4-7": "Союз практика и мыслителя",
    "4-8": "Союз строителей империи", "4-9": "Союз практика и визионера",
    "5-5": "Союз двух искателей приключений", "5-6": "Союз свободы и ответственности",
    "5-7": "Союз исследователя и мудреца", "5-8": "Союз авантюриста и стратега",
    "5-9": "Союз свободы и мечты", "6-6": "Союз двух хранителей очага",
    "6-7": "Союз сердца и разума", "6-8": "Союз заботы и силы",
    "6-9": "Союз гармонии и идеалов", "7-7": "Союз двух мудрецов",
    "7-8": "Союз мудреца и стратега", "7-9": "Союз мудрости и мечты",
    "8-8": "Союз двух властителей", "8-9": "Союз силы и мечты",
    "9-9": "Союз двух визионеров",
}

UNION_TYPES = {
    "80-100": ("Гармоничный союз", "Ваши энергии естественно синхронизированы. Отношения строятся легко и приносят радость обоим партнёрам."),
    "60-79": ("Развивающий союз", "Вы помогаете друг другу расти. Различия дополняют, а не разрушают. При осознанности — прекрасная пара."),
    "40-59": ("Сложный союз", "Между вами много притяжения и одновременно трения. Такие отношения — мощный катализатор личного роста."),
    "20-39": ("Испытательный союз", "Ваш союз — кармический урок. Отношения требуют огромной работы, но могут привести к глубочайшей трансформации."),
}

DIMENSION_TEXTS = {
    "psychological": {
        "high": "Вы хорошо понимаете друг друга на психологическом уровне. Ваши реакции и поведенческие паттерны совместимы, что создаёт ощущение безопасности.",
        "mid": "Психологическая совместимость на среднем уровне. Иногда вы не понимаете мотивов друг друга, но при желании можете научиться считывать партнёра.",
        "low": "Психологическая совместимость требует работы. Ваши реакции на стресс и конфликты различаются, что может создавать напряжение.",
    },
    "emotional": {
        "high": "Эмоциональная связь между вами очень сильна. Вы чувствуете настроение друг друга и умеете поддержать в трудную минуту.",
        "mid": "Эмоциональная связь присутствует, но не всегда стабильна. Важно учиться выражать свои чувства открыто и без страха.",
        "low": "Эмоциональная совместимость низкая. Вам сложно понять переживания партнёра, что может привести к ощущению одиночества в паре.",
    },
    "values": {
        "high": "Ваши жизненные ценности и приоритеты совпадают. Вы смотрите в одну сторону, что даёт прочный фундамент для отношений.",
        "mid": "Часть ценностей совпадает, часть — различается. Это нормально, но важно договариваться о принципиальных вопросах.",
        "low": "Ваши ценности существенно различаются. Это может стать источником глубинных конфликтов, если не научиться принимать позицию партнёра.",
    },
    "financial": {
        "high": "Ваше отношение к деньгам и финансовым целям совпадает. Совместный бюджет и финансовые решения даются вам легко.",
        "mid": "Есть различия в подходах к деньгам, но они преодолимы. Важно обсуждать финансовые вопросы открыто и устанавливать общие правила.",
        "low": "Финансовая совместимость низкая. Разное отношение к деньгам может стать серьёзным источником конфликтов в паре.",
    },
    "intellectual": {
        "high": "Интеллектуальная совместимость на высоком уровне. Вам интересно общаться, обсуждать идеи и учиться друг у друга.",
        "mid": "Интеллектуально вы дополняете друг друга. Разные подходы к решению задач могут обогащать, если относиться к этому с уважением.",
        "low": "Интеллектуальные интересы и стили мышления различаются. Важно находить точки пересечения и уважать подход партнёра.",
    },
    "intimacy": {
        "high": "Между вами сильное физическое притяжение и глубокая интимная связь. Вы чувствуете и понимаете потребности друг друга.",
        "mid": "Интимная совместимость на среднем уровне. Открытое обсуждение желаний и потребностей поможет углубить близость.",
        "low": "Интимная совместимость требует внимания. Различия в потребностях и темпераменте могут создавать дистанцию.",
    },
    "family": {
        "high": "У вас отличный потенциал для создания крепкой семьи. Ваши взгляды на быт, детей и семейные роли совпадают.",
        "mid": "Семейный потенциал есть, но нужно договариваться о распределении ролей и обязанностей. Компромисс — ваш друг.",
        "low": "Создание семьи потребует значительных усилий. Разные представления о семейной жизни могут создавать серьёзные разногласия.",
    },
    "cycles": {
        "high": "Ваши жизненные циклы синхронизированы. Вы проживаете похожие этапы одновременно, что укрепляет взаимопонимание.",
        "mid": "Жизненные циклы частично совпадают. Иногда один из вас будет на подъёме, а другой — в фазе отдыха. Это нормально.",
        "low": "Ваши жизненные циклы рассинхронизированы. Вам важно понимать, что партнёр может находиться на совершенно другом этапе.",
    },
}

RECS = {
    "high": {
        "strengths": ["Глубокое взаимопонимание на интуитивном уровне", "Совпадение жизненных ценностей и приоритетов", "Естественная поддержка и взаимное вдохновение"],
        "risks": ["Привыкание и снижение усилий в отношениях", "Избегание конфликтов вместо их решения", "Зависимость от партнёра"],
        "advice": ["Продолжайте развиваться как личности", "Создавайте совместные проекты и цели", "Не забывайте удивлять друг друга"],
    },
    "medium": {
        "strengths": ["Взаимное дополнение качеств", "Возможность учиться друг у друга", "Баланс между близостью и свободой"],
        "risks": ["Непонимание мотивов партнёра", "Разное отношение к деньгам или быту", "Конфликты из-за разных подходов к жизни"],
        "advice": ["Регулярно обсуждайте ожидания и чувства", "Ищите компромиссы в спорных вопросах", "Уважайте различия — они обогащают союз"],
    },
    "low": {
        "strengths": ["Мощный потенциал для личного роста", "Интенсивность эмоций и страсти", "Возможность преодолеть кармические уроки"],
        "risks": ["Частые конфликты и недопонимание", "Борьба за власть в отношениях", "Эмоциональное истощение"],
        "advice": ["Обратитесь к семейному психологу", "Установите чёткие границы и правила", "Фокусируйтесь на благодарности, а не претензиях"],
    },
}


# ── DB helpers ────────────────────────────────────────────────────────

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


def check_purchase(conn, user_id, date1, date2):
    cur = conn.cursor()
    cur.execute(
        f"SELECT id FROM {SCHEMA}.purchases "
        f"WHERE user_id = {user_id} AND product = 'compatibility' "
        f"AND birth_date = '{date1}' AND birth_date2 = '{date2}'"
    )
    row = cur.fetchone()
    cur.close()
    return row is not None


# ── Numerology ────────────────────────────────────────────────────────

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


def calc_pythagoras_matrix(date_str):
    y, m, d = date_str.split("-")
    digits = [int(c) for c in f"{d}{m}{y}" if c != "0"]
    matrix = {i: 0 for i in range(1, 10)}
    for dig in digits:
        if 1 <= dig <= 9:
            matrix[dig] += 1
    return matrix


def calc_life_cycles(date_str):
    y, m, d = [int(x) for x in date_str.split("-")]
    lp = calc_life_path(date_str)
    lp_r = reduce(lp) if lp > 9 else lp
    first_end = 36 - lp_r
    second_end = first_end + 9
    return [
        {"period": "Формирование", "number": reduce(m), "ages": f"0\u2013{first_end}"},
        {"period": "Продуктивность", "number": reduce(d), "ages": f"{first_end + 1}\u2013{second_end}"},
        {"period": "Урожай", "number": reduce(y), "ages": f"{second_end + 1}+"},
    ]


def clamp(score):
    return max(0, min(100, round(score)))


def number_match(a, b):
    ra = reduce(a) if a > 9 else a
    rb = reduce(b) if b > 9 else b
    return clamp(100 - abs(ra - rb) * 15)


def matrix_match(m1, m2):
    total = sum(abs(m1.get(i, 0) - m2.get(i, 0)) for i in range(1, 10))
    return clamp(100 - total * 5)


def emotion_score(m1, m2):
    diff = abs(m1[2] - m2[2]) + abs(m1[6] - m2[6]) + abs(m1[9] - m2[9])
    return clamp(100 - diff * 10)


def value_score(m1, m2):
    diff = abs(m1[1] - m2[1]) + abs(m1[4] - m2[4]) + abs(m1[7] - m2[7]) + abs(m1[8] - m2[8])
    return clamp(100 - diff * 8)


def money_score(m1, m2):
    diff = abs(m1[4] - m2[4]) + abs(m1[8] - m2[8]) + abs(m1[1] - m2[1])
    return clamp(100 - diff * 10)


def mind_score(m1, m2):
    diff = abs(m1[3] - m2[3]) + abs(m1[5] - m2[5]) + abs(m1[7] - m2[7])
    return clamp(100 - diff * 10)


def intimacy_score(m1, m2):
    diff = abs(m1[2] - m2[2]) + abs(m1[5] - m2[5]) + abs(m1[8] - m2[8])
    return clamp(100 - diff * 10)


def get_union_type(index):
    if index >= 80:
        return UNION_TYPES["80-100"]
    if index >= 60:
        return UNION_TYPES["60-79"]
    if index >= 40:
        return UNION_TYPES["40-59"]
    return UNION_TYPES["20-39"]


def get_pair_archetype(lp1, lp2):
    a = reduce(lp1) if lp1 > 9 else lp1
    b = reduce(lp2) if lp2 > 9 else lp2
    key = f"{a}-{b}" if a <= b else f"{b}-{a}"
    return PAIR_ARCHETYPES.get(key, "Уникальный союз")


def get_rec_level(index):
    if index >= 65:
        return "high"
    if index >= 40:
        return "medium"
    return "low"


def dim_text(key, score):
    t = DIMENSION_TEXTS[key]
    if score >= 70:
        return t["high"]
    if score >= 40:
        return t["mid"]
    return t["low"]


def calc_full(date1, date2):
    lp1, ch1, d1, su1 = calc_life_path(date1), calc_character(date1), calc_destiny(date1), calc_soul_urge(date1)
    lp2, ch2, d2, su2 = calc_life_path(date2), calc_character(date2), calc_destiny(date2), calc_soul_urge(date2)
    m1, m2 = calc_pythagoras_matrix(date1), calc_pythagoras_matrix(date2)
    lc1, lc2 = calc_life_cycles(date1), calc_life_cycles(date2)

    lp_s = number_match(lp1, lp2)
    ch_s = number_match(ch1, ch2)
    d_s = number_match(d1, d2)
    m_s = matrix_match(m1, m2)
    overall = clamp(round((lp_s + ch_s + d_s + m_s) / 4))

    emo = emotion_score(m1, m2)
    val = value_score(m1, m2)
    fin = money_score(m1, m2)
    intl = mind_score(m1, m2)
    intm = intimacy_score(m1, m2)
    psych = clamp(round((ch_s + emo) / 2))
    fam = clamp(round((emo + val + fin) / 3))
    conflict = clamp(100 - overall)

    cycle_compat = 50
    if lc1 and lc2:
        cd = sum(abs(lc1[i]["number"] - lc2[i]["number"]) for i in range(min(len(lc1), len(lc2))))
        cycle_compat = clamp(100 - cd * 10)

    karmic_reasons = []
    if d1 == d2:
        karmic_reasons.append("Совпадение чисел судьбы \u2014 глубокая кармическая связь")
    if lc1[0]["number"] == lc2[0]["number"]:
        karmic_reasons.append("Совпадение первого жизненного цикла \u2014 связь из прошлого")
    matches = sum(1 for i in range(1, 10) if m1[i] == m2[i] and m1[i] > 0)
    if matches >= 5:
        karmic_reasons.append("Зеркальные матрицы \u2014 судьбоносная встреча")

    union_name, union_desc = get_union_type(overall)
    rec_level = get_rec_level(overall)

    return {
        "p1": {"lp": lp1, "ch": ch1, "d": d1, "su": su1, "matrix": m1},
        "p2": {"lp": lp2, "ch": ch2, "d": d2, "su": su2, "matrix": m2},
        "overall": overall,
        "union_name": union_name, "union_desc": union_desc,
        "archetype": get_pair_archetype(lp1, lp2),
        "scores": {
            "lifePath": lp_s, "character": ch_s, "destiny": d_s, "matrix": m_s,
            "psychological": psych, "emotional": emo, "values": val,
            "financial": fin, "intellectual": intl, "intimacy": intm,
            "family": fam, "conflict": conflict,
        },
        "cycle_compat": cycle_compat,
        "karmic": karmic_reasons,
        "recs": RECS[rec_level],
        "rec_level": rec_level,
    }


# ── PDF generation ────────────────────────────────────────────────────

def _register_fonts():
    for name, path in [
        ("DejaVu", "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"),
        ("DejaVuBd", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"),
    ]:
        try:
            pdfmetrics.registerFont(TTFont(name, path))
        except Exception:
            pass


def _styles():
    return {
        "title": ParagraphStyle("title", fontName="DejaVuBd", fontSize=22, leading=28, textColor=AMBER_DARK, alignment=1),
        "subtitle": ParagraphStyle("subtitle", fontName="DejaVu", fontSize=13, leading=18, textColor=GRAY, alignment=1),
        "h2": ParagraphStyle("h2", fontName="DejaVuBd", fontSize=16, leading=22, textColor=AMBER_DARK, spaceBefore=8, spaceAfter=4),
        "h3": ParagraphStyle("h3", fontName="DejaVuBd", fontSize=12, leading=16, textColor=AMBER_DARK, spaceBefore=6, spaceAfter=2),
        "body": ParagraphStyle("body", fontName="DejaVu", fontSize=10, leading=14, textColor=GRAY),
        "bodyc": ParagraphStyle("bodyc", fontName="DejaVu", fontSize=10, leading=14, textColor=GRAY, alignment=1),
        "small": ParagraphStyle("small", fontName="DejaVu", fontSize=8, leading=11, textColor=colors.HexColor("#9ca3af"), alignment=1),
        "big_num": ParagraphStyle("big_num", fontName="DejaVuBd", fontSize=48, leading=52, textColor=AMBER_DARK, alignment=1),
        "cell": ParagraphStyle("cell", fontName="DejaVu", fontSize=9, leading=12, textColor=GRAY),
        "cellb": ParagraphStyle("cellb", fontName="DejaVuBd", fontSize=9, leading=12, textColor=GRAY),
        "bullet": ParagraphStyle("bullet", fontName="DejaVu", fontSize=10, leading=14, textColor=GRAY, leftIndent=12, bulletIndent=0),
    }


def _score_color(score):
    if score >= 70:
        return GREEN
    if score >= 40:
        return AMBER
    return RED


def _score_bar_table(label, score, st):
    bar_width = 120
    filled = max(1, int(bar_width * score / 100))
    color = _score_color(score)
    bar_cell = Table(
        [[""]], colWidths=[filled], rowHeights=[10],
    )
    bar_cell.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), color),
        ("LINEBELOW", (0, 0), (-1, -1), 0.5, GRAY_LIGHT),
    ]))
    bg_cell = Table(
        [[bar_cell]], colWidths=[bar_width], rowHeights=[10],
    )
    bg_cell.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), GRAY_LIGHT),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
    ]))
    return [Paragraph(label, st["cellb"]), bg_cell, Paragraph(f"{score}%", st["cell"])]


def _matrix_table(matrix, st):
    rows = []
    for row_start in (1, 4, 7):
        cells = []
        for i in range(row_start, row_start + 3):
            count = matrix.get(i, 0)
            cells.append(Paragraph(f"<b>{i}</b>: {count}", st["cell"]))
        rows.append(cells)
    t = Table(rows, colWidths=[40, 40, 40], rowHeights=[18, 18, 18])
    t.setStyle(TableStyle([
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#e5e7eb")),
        ("BACKGROUND", (0, 0), (-1, -1), AMBER_LIGHT),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 4),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4),
        ("TOPPADDING", (0, 0), (-1, -1), 2),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
    ]))
    return t


def _add_footer(canvas, doc):
    canvas.saveState()
    canvas.setFont("DejaVu", 7)
    canvas.setFillColor(colors.HexColor("#9ca3af"))
    canvas.drawCentredString(A4[0] / 2, 15 * mm, f"Матрица личности \u2014 matritsa.poehali.dev  |  Стр. {doc.page}")
    canvas.restoreState()


def generate_pdf(data, date1, date2):
    _register_fonts()
    st = _styles()
    buf = io.BytesIO()
    doc = SimpleDocTemplate(
        buf, pagesize=A4,
        topMargin=20 * mm, bottomMargin=25 * mm,
        leftMargin=20 * mm, rightMargin=20 * mm,
    )
    story = []
    pw = doc.width
    today = datetime.now().strftime("%d.%m.%Y")
    d1_fmt = _fmt_date(date1)
    d2_fmt = _fmt_date(date2)
    p1 = data["p1"]
    p2 = data["p2"]
    scores = data["scores"]

    # ── PAGE 1: Cover ─────────────────────────────────────────────────
    story.append(Spacer(1, 30 * mm))
    story.append(Paragraph("Отчёт о совместимости пары", st["title"]))
    story.append(Spacer(1, 6 * mm))
    story.append(Paragraph(f"Партнёр 1: {d1_fmt}  \u00b7  Партнёр 2: {d2_fmt}", st["subtitle"]))
    story.append(Spacer(1, 18 * mm))
    story.append(Paragraph(f"{data['overall']}%", st["big_num"]))
    story.append(Spacer(1, 3 * mm))
    story.append(Paragraph(data["union_name"], st["h2"]))
    story.append(Spacer(1, 2 * mm))
    story.append(Paragraph(data["archetype"], st["bodyc"]))
    story.append(Spacer(1, 8 * mm))
    story.append(Paragraph(data["union_desc"], st["bodyc"]))
    story.append(Spacer(1, 30 * mm))
    story.append(Paragraph(f"Дата создания отчёта: {today}", st["small"]))
    story.append(PageBreak())

    # ── PAGE 2: Numbers overview ──────────────────────────────────────
    story.append(Paragraph("Числа партнёров", st["h2"]))
    story.append(Spacer(1, 4 * mm))
    num_rows = [
        ["Показатель", "Партнёр 1", "Партнёр 2"],
        ["Жизненный путь", f"{p1['lp']} ({NUMBER_TITLES.get(p1['lp'], '')})", f"{p2['lp']} ({NUMBER_TITLES.get(p2['lp'], '')})"],
        ["Характер", f"{p1['ch']} ({NUMBER_TITLES.get(p1['ch'], '')})", f"{p2['ch']} ({NUMBER_TITLES.get(p2['ch'], '')})"],
        ["Судьба", f"{p1['d']} ({NUMBER_TITLES.get(p1['d'], '')})", f"{p2['d']} ({NUMBER_TITLES.get(p2['d'], '')})"],
        ["Душевное число", f"{p1['su']} ({NUMBER_TITLES.get(p1['su'], '')})", f"{p2['su']} ({NUMBER_TITLES.get(p2['su'], '')})"],
    ]
    num_data = [[Paragraph(c, st["cellb"] if ri == 0 else st["cell"]) for c in row] for ri, row in enumerate(num_rows)]
    nt = Table(num_data, colWidths=[pw * 0.34, pw * 0.33, pw * 0.33])
    nt.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), AMBER_LIGHT),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [WHITE, GRAY_LIGHT]),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#e5e7eb")),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
    ]))
    story.append(nt)
    story.append(Spacer(1, 8 * mm))

    story.append(Paragraph("Матрицы Пифагора", st["h3"]))
    story.append(Spacer(1, 3 * mm))
    mt1 = _matrix_table(p1["matrix"], st)
    mt2 = _matrix_table(p2["matrix"], st)
    matrix_row = Table(
        [[Paragraph("Партнёр 1", st["cellb"]), "", Paragraph("Партнёр 2", st["cellb"])],
         [mt1, "", mt2]],
        colWidths=[pw * 0.4, pw * 0.2, pw * 0.4],
    )
    matrix_row.setStyle(TableStyle([
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]))
    story.append(matrix_row)
    story.append(PageBreak())

    # ── PAGE 3: Overall analysis ──────────────────────────────────────
    story.append(Paragraph("Общий анализ совместимости", st["h2"]))
    story.append(Spacer(1, 3 * mm))
    story.append(Paragraph(f"Индекс совместимости: <b>{data['overall']}%</b> \u2014 {data['union_name']}", st["body"]))
    story.append(Spacer(1, 3 * mm))
    story.append(Paragraph(data["union_desc"], st["body"]))
    story.append(Spacer(1, 6 * mm))

    summary_level = data["rec_level"]
    dynamics = {
        "high": "Ваша пара обладает высоким потенциалом гармонии \u2014 энергии дополняют друг друга.",
        "medium": "Ваш союз \u2014 это путь взаимного обогащения через принятие различий.",
        "low": "Ваши отношения \u2014 мощный катализатор трансформации для обоих партнёров.",
    }
    strengths_t = {
        "high": "Глубокое взаимопонимание и совпадение ценностей.",
        "medium": "Взаимное дополнение \u2014 каждый привносит то, чего не хватает другому.",
        "low": "Интенсивность и страсть \u2014 вместе вы не стоите на месте.",
    }
    risks_t = {
        "high": "Слишком комфортная зона \u2014 важно не останавливаться в развитии.",
        "medium": "Разные подходы к жизни могут создавать напряжение.",
        "low": "Конфликты и борьба за лидерство могут истощать обоих.",
    }
    story.append(Paragraph("Динамика пары", st["h3"]))
    story.append(Paragraph(dynamics[summary_level], st["body"]))
    story.append(Spacer(1, 3 * mm))
    story.append(Paragraph("Главная сила", st["h3"]))
    story.append(Paragraph(strengths_t[summary_level], st["body"]))
    story.append(Spacer(1, 3 * mm))
    story.append(Paragraph("Главный риск", st["h3"]))
    story.append(Paragraph(risks_t[summary_level], st["body"]))
    story.append(Spacer(1, 6 * mm))

    story.append(Paragraph("Базовые показатели", st["h3"]))
    story.append(Spacer(1, 2 * mm))
    base_rows = [
        _score_bar_table("Жизненный путь", scores["lifePath"], st),
        _score_bar_table("Характер", scores["character"], st),
        _score_bar_table("Судьба", scores["destiny"], st),
        _score_bar_table("Матрица", scores["matrix"], st),
    ]
    bt = Table(base_rows, colWidths=[pw * 0.4, 120, pw * 0.15])
    bt.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))
    story.append(bt)
    story.append(PageBreak())

    # ── PAGES 4-6: Dimensions ─────────────────────────────────────────
    dims = [
        ("Психологическая совместимость", scores["psychological"], "psychological"),
        ("Эмоциональная совместимость", scores["emotional"], "emotional"),
        ("Совместимость ценностей", scores["values"], "values"),
        ("Финансовая совместимость", scores["financial"], "financial"),
        ("Интеллектуальная совместимость", scores["intellectual"], "intellectual"),
        ("Интимная совместимость", scores["intimacy"], "intimacy"),
        ("Семейный потенциал", scores["family"], "family"),
        ("Совместимость циклов", data["cycle_compat"], "cycles"),
    ]

    story.append(Paragraph("Детальный анализ совместимости", st["h2"]))
    story.append(Spacer(1, 4 * mm))

    for idx, (label, score, key) in enumerate(dims):
        if idx == 4:
            story.append(PageBreak())
            story.append(Paragraph("Детальный анализ совместимости (продолжение)", st["h2"]))
            story.append(Spacer(1, 4 * mm))

        color_hex = "#22c55e" if score >= 70 else "#f59e0b" if score >= 40 else "#ef4444"
        story.append(Paragraph(f'{label}  <font color="{color_hex}"><b>{score}%</b></font>', st["h3"]))
        story.append(Spacer(1, 1 * mm))

        bar_row = _score_bar_table(label, score, st)
        bar_t = Table([bar_row], colWidths=[pw * 0.4, 120, pw * 0.15])
        bar_t.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "MIDDLE")]))
        story.append(bar_t)
        story.append(Spacer(1, 2 * mm))
        story.append(Paragraph(dim_text(key, score), st["body"]))
        story.append(Spacer(1, 6 * mm))

    story.append(PageBreak())

    # ── PAGE 7: Conflict & Karmic ─────────────────────────────────────
    story.append(Paragraph("Индекс конфликтности", st["h2"]))
    story.append(Spacer(1, 3 * mm))
    c_score = scores["conflict"]
    c_hex = "#22c55e" if c_score < 30 else "#f59e0b" if c_score < 60 else "#ef4444"
    story.append(Paragraph(f'<font color="{c_hex}" size="28"><b>{c_score}%</b></font>', st["bodyc"]))
    story.append(Spacer(1, 3 * mm))
    if c_score >= 60:
        ct = "Высокий уровень потенциальных разногласий. Осознанность и работа над отношениями критически важны для гармонии."
    elif c_score >= 30:
        ct = "Умеренный уровень трения. Конфликты возможны, но они решаемы при взаимном уважении и открытом диалоге."
    else:
        ct = "Низкий уровень конфликтности. Вы хорошо ладите и естественно находите компромиссы."
    story.append(Paragraph(ct, st["body"]))
    story.append(Spacer(1, 10 * mm))

    if data["karmic"]:
        story.append(Paragraph("Кармическая связь", st["h2"]))
        story.append(Spacer(1, 3 * mm))
        story.append(Paragraph("Обнаружены признаки глубинной связи между вами:", st["body"]))
        story.append(Spacer(1, 2 * mm))
        for reason in data["karmic"]:
            story.append(Paragraph(f"\u2605  {reason}", st["bullet"]))
            story.append(Spacer(1, 1.5 * mm))
    else:
        story.append(Paragraph("Кармическая связь", st["h2"]))
        story.append(Spacer(1, 3 * mm))
        story.append(Paragraph("Явных признаков кармической связи не обнаружено. Это означает, что ваши отношения строятся на текущих энергиях и выборах.", st["body"]))

    story.append(PageBreak())

    # ── PAGE 8: Recommendations ───────────────────────────────────────
    story.append(Paragraph("Рекомендации для вашей пары", st["h2"]))
    story.append(Spacer(1, 4 * mm))

    recs = data["recs"]

    story.append(Paragraph("Сильные стороны", st["h3"]))
    story.append(Spacer(1, 2 * mm))
    for item in recs["strengths"]:
        story.append(Paragraph(f"\u2713  {item}", st["bullet"]))
        story.append(Spacer(1, 1 * mm))
    story.append(Spacer(1, 5 * mm))

    story.append(Paragraph("Риски", st["h3"]))
    story.append(Spacer(1, 2 * mm))
    for item in recs["risks"]:
        story.append(Paragraph(f"\u26a0  {item}", st["bullet"]))
        story.append(Spacer(1, 1 * mm))
    story.append(Spacer(1, 5 * mm))

    story.append(Paragraph("Советы", st["h3"]))
    story.append(Spacer(1, 2 * mm))
    for item in recs["advice"]:
        story.append(Paragraph(f"\u2192  {item}", st["bullet"]))
        story.append(Spacer(1, 1 * mm))

    story.append(PageBreak())

    # ── PAGE 9: Footer / Disclaimer ───────────────────────────────────
    story.append(Spacer(1, 40 * mm))
    story.append(Paragraph("Информация", st["h2"]))
    story.append(Spacer(1, 4 * mm))
    story.append(Paragraph(
        "Данный отчёт создан на основе нумерологического анализа и носит "
        "исключительно информационно-развлекательный характер. Он не является "
        "научным исследованием и не может служить основанием для принятия "
        "жизненно важных решений. Совместимость людей определяется множеством "
        "факторов, выходящих за рамки нумерологии.",
        st["body"],
    ))
    story.append(Spacer(1, 8 * mm))
    story.append(Paragraph(
        "За профессиональной помощью в вопросах отношений обращайтесь "
        "к квалифицированному семейному психологу.",
        st["body"],
    ))
    story.append(Spacer(1, 20 * mm))
    story.append(Paragraph("matritsa.poehali.dev", st["subtitle"]))
    story.append(Spacer(1, 3 * mm))
    story.append(Paragraph("Матрица личности \u2014 нумерологический анализ", st["small"]))

    doc.build(story, onFirstPage=_add_footer, onLaterPages=_add_footer)
    return buf.getvalue()


def _fmt_date(iso):
    parts = iso.split("-")
    if len(parts) == 3:
        return f"{parts[2]}.{parts[1]}.{parts[0]}"
    return iso


# ── Handler ───────────────────────────────────────────────────────────

def handler(event, context):
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    body = {}
    if event.get("body"):
        body = json.loads(event["body"])

    action = body.get("action", "")
    token = event.get("headers", {}).get("X-Auth-Token", "")

    if action != "generate":
        return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Неизвестное действие"})}

    if not token:
        return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Не авторизован"})}

    conn = get_conn()
    try:
        user = get_user_by_token(conn, token)
        if not user:
            conn.close()
            return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Сессия истекла"})}

        date1 = body.get("date1", "").strip()
        date2 = body.get("date2", "").strip()

        if not date1 or not date2:
            conn.close()
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Укажите обе даты рождения"})}

        if not check_purchase(conn, user["id"], date1, date2):
            conn.close()
            return {"statusCode": 403, "headers": CORS, "body": json.dumps({"error": "Отчёт не оплачен"})}

        conn.close()

        data = calc_full(date1, date2)
        pdf_bytes = generate_pdf(data, date1, date2)
        pdf_b64 = base64.b64encode(pdf_bytes).decode("utf-8")

        return {
            "statusCode": 200,
            "headers": CORS,
            "body": json.dumps({"pdf": pdf_b64, "filename": "compatibility_report.pdf"}),
        }

    except Exception as e:
        try:
            conn.close()
        except Exception:
            pass
        return {"statusCode": 500, "headers": CORS, "body": json.dumps({"error": str(e)})}
