import os
from datetime import datetime, timezone

from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS

from database import employees_collection, audit_collection, init_db
from seed import seed_employees

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

app = Flask(__name__)
CORS(app)

VALID_ROLES = {"admin", "editor", "viewer"}


def utc_now():
    return datetime.now(timezone.utc)


def serialize_employee(doc):
    if not doc:
        return None
    return {
        "id": doc["id"],
        "name": doc["name"],
        "designation": doc.get("designation", ""),
        "department": doc.get("department", ""),
        "team": doc.get("team", ""),
        "supervisor": doc.get("supervisor", ""),
        "tenure": doc.get("tenure", ""),
        "profile": doc.get("profile", 0),
        "shift": doc.get("shift", ""),
        "city": doc.get("city", ""),
        "avatar": doc.get("avatar", ""),
        "role": doc.get("role", "viewer"),
    }


def serialize_audit(doc):
    return {
        "time": doc["time"].strftime("%m/%d/%Y, %I:%M:%S %p"),
        "action": doc["action"],
        "details": doc["details"],
    }


def add_audit_log(action, details):
    audit_collection.insert_one({
        "time": utc_now(),
        "action": action,
        "details": details,
    })


def validate_employee_payload(data, is_update=False):
    errors = []

    if not is_update and not data.get("name", "").strip():
        errors.append("Name is required")

    profile = data.get("profile", 50)
    try:
        profile = int(profile)
        if profile < 0 or profile > 100:
            errors.append("Profile must be between 0 and 100")
    except (TypeError, ValueError):
        errors.append("Profile must be a number")

    role = data.get("role", "viewer")
    if role not in VALID_ROLES:
        errors.append(f"Role must be one of: {', '.join(VALID_ROLES)}")

    return errors, profile


def build_employee_doc(data, profile, existing=None):
    now = utc_now()
    return {
        "id": data.get("id") or (existing["id"] if existing else ""),
        "name": data.get("name", existing["name"] if existing else "").strip(),
        "designation": data.get("designation", existing.get("designation", "") if existing else "").strip() or "Staff",
        "department": data.get("department", existing.get("department", "") if existing else "").strip() or "General",
        "team": data.get("team", existing.get("team", "") if existing else "").strip() or "Core",
        "supervisor": data.get("supervisor", existing.get("supervisor", "") if existing else "").strip() or "Admin",
        "tenure": data.get("tenure", existing.get("tenure", "") if existing else "").strip() or "0 Yr",
        "profile": profile,
        "shift": data.get("shift", existing.get("shift", "") if existing else "").strip() or "Morning",
        "city": data.get("city", existing.get("city", "") if existing else "").strip() or "Unknown",
        "avatar": data.get("avatar", existing.get("avatar", "") if existing else "").strip()
        or "https://randomuser.me/api/portraits/lego/1.jpg",
        "role": data.get("role", existing.get("role", "viewer") if existing else "viewer"),
        "updated_at": now,
        "created_at": existing.get("created_at", now) if existing else now,
    }


def generate_next_id():
    employees = employees_collection.find({}, {"id": 1})
    max_num = 0
    for emp in employees:
        try:
            num = int(emp["id"])
            if num > max_num:
                max_num = num
        except (ValueError, KeyError):
            continue
    return str(max_num + 1).zfill(4)


# ── Static files ──

@app.route("/")
def serve_index():
    return send_from_directory(BASE_DIR, "index.html")


@app.route("/css/<path:filename>")
def serve_css(filename):
    return send_from_directory(os.path.join(BASE_DIR, "css"), filename)


@app.route("/js/<path:filename>")
def serve_js(filename):
    return send_from_directory(os.path.join(BASE_DIR, "js"), filename)


# ── API: Employees CRUD ──

@app.route("/api/employees", methods=["GET"])
def get_employees():
    query = {}
    job = request.args.get("job", "").strip()
    dept = request.args.get("dept", "").strip()
    team = request.args.get("team", "").strip()
    name = request.args.get("name", "").strip()
    designation = request.args.get("designation", "").strip()
    min_profile = request.args.get("minProfile", "").strip()

    if job:
        query["designation"] = {"$regex": job, "$options": "i"}
    if dept:
        query["department"] = {"$regex": dept, "$options": "i"}
    if team:
        query["team"] = {"$regex": team, "$options": "i"}
    if name:
        query["name"] = {"$regex": name, "$options": "i"}
    if designation:
        query["designation"] = {"$regex": designation, "$options": "i"}
    if min_profile:
        try:
            query["profile"] = {"$gte": int(min_profile)}
        except ValueError:
            return jsonify({"error": "minProfile must be a number"}), 400

    employees = [serialize_employee(doc) for doc in employees_collection.find(query).sort("id", 1)]
    return jsonify(employees)


@app.route("/api/employees/<employee_id>", methods=["GET"])
def get_employee(employee_id):
    doc = employees_collection.find_one({"id": employee_id})
    if not doc:
        return jsonify({"error": "Employee not found"}), 404
    return jsonify(serialize_employee(doc))


@app.route("/api/employees/next-id", methods=["GET"])
def get_next_id():
    return jsonify({"id": generate_next_id()})


@app.route("/api/employees", methods=["POST"])
def create_employee():
    data = request.get_json(silent=True) or {}
    errors, profile = validate_employee_payload(data)
    if errors:
        return jsonify({"error": errors[0]}), 400

    emp_id = data.get("id", "").strip() or generate_next_id()
    if employees_collection.find_one({"id": emp_id}):
        return jsonify({"error": "Employee ID already exists"}), 409

    doc = build_employee_doc({**data, "id": emp_id}, profile)
    employees_collection.insert_one(doc)
    add_audit_log("CREATE", doc["name"])

    return jsonify(serialize_employee(doc)), 201


@app.route("/api/employees/<employee_id>", methods=["PUT"])
def update_employee(employee_id):
    existing = employees_collection.find_one({"id": employee_id})
    if not existing:
        return jsonify({"error": "Employee not found"}), 404

    data = request.get_json(silent=True) or {}
    errors, profile = validate_employee_payload(data, is_update=True)
    if errors:
        return jsonify({"error": errors[0]}), 400

    if not data.get("name", existing["name"]).strip():
        return jsonify({"error": "Name is required"}), 400

    doc = build_employee_doc(data, profile, existing)
    employees_collection.update_one({"id": employee_id}, {"$set": doc})
    add_audit_log("UPDATE", doc["name"])

    return jsonify(serialize_employee(doc))


@app.route("/api/employees/<employee_id>", methods=["DELETE"])
def delete_employee(employee_id):
    doc = employees_collection.find_one({"id": employee_id})
    if not doc:
        return jsonify({"error": "Employee not found"}), 404

    employees_collection.delete_one({"id": employee_id})
    add_audit_log("DELETE", doc["name"])

    return jsonify({"message": f"Deleted {doc['name']}"})


@app.route("/api/employees/<employee_id>/role", methods=["PATCH"])
def update_role(employee_id):
    data = request.get_json(silent=True) or {}
    role = data.get("role", "").strip()

    if role not in VALID_ROLES:
        return jsonify({"error": f"Role must be one of: {', '.join(VALID_ROLES)}"}), 400

    doc = employees_collection.find_one({"id": employee_id})
    if not doc:
        return jsonify({"error": "Employee not found"}), 404

    employees_collection.update_one(
        {"id": employee_id},
        {"$set": {"role": role, "updated_at": utc_now()}},
    )
    add_audit_log("PERMISSION", f"{doc['name']} → {role}")

    updated = employees_collection.find_one({"id": employee_id})
    return jsonify(serialize_employee(updated))


# ── API: Stats & Audit ──

@app.route("/api/stats", methods=["GET"])
def get_stats():
    employees = list(employees_collection.find())
    total = len(employees)
    if total == 0:
        return jsonify({"total": 0, "avgProfile": 0, "highPerformers": 0, "departments": 0})

    avg = round(sum(e.get("profile", 0) for e in employees) / total)
    high = sum(1 for e in employees if e.get("profile", 0) >= 80)
    depts = len({e.get("department", "") for e in employees})

    return jsonify({
        "total": total,
        "avgProfile": avg,
        "highPerformers": high,
        "departments": depts,
    })


@app.route("/api/audit-logs", methods=["GET"])
def get_audit_logs():
    limit = min(int(request.args.get("limit", 20)), 100)
    logs = [
        serialize_audit(doc)
        for doc in audit_collection.find().sort("time", -1).limit(limit)
    ]
    return jsonify(logs)


@app.route("/api/health", methods=["GET"])
def health_check():
    try:
        employees_collection.database.client.admin.command("ping")
        return jsonify({"status": "ok", "database": "connected"})
    except Exception as exc:
        return jsonify({"status": "error", "database": str(exc)}), 503


if __name__ == "__main__":
    init_db()
    seeded = seed_employees()
    if seeded:
        print("Database seeded with sample employees.")

    port = int(os.getenv("PORT", 5000))
    debug = os.getenv("FLASK_DEBUG", "true").lower() == "true"
    print(f"NexusHR API running at http://localhost:{port}")
    app.run(host="0.0.0.0", port=port, debug=debug)
