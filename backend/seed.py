from datetime import datetime, timezone

from database import employees_collection

SEED_EMPLOYEES = [
    {
        "id": "0001", "name": "Anika Vaccaro", "designation": "Manager",
        "department": "Operations", "team": "Alpha", "supervisor": "John Smith",
        "tenure": "2 Yrs", "profile": 95, "shift": "Morning", "city": "New York",
        "avatar": "https://randomuser.me/api/portraits/women/68.jpg", "role": "admin",
    },
    {
        "id": "0002", "name": "Chance Stanton", "designation": "Team Lead",
        "department": "IT", "team": "Beta", "supervisor": "Sarah Lee",
        "tenure": "3 Yrs", "profile": 78, "shift": "Morning", "city": "Austin",
        "avatar": "https://randomuser.me/api/portraits/men/32.jpg", "role": "editor",
    },
    {
        "id": "0003", "name": "Gretchen Lubin", "designation": "HR Specialist",
        "department": "HR", "team": "Gamma", "supervisor": "Mike Ross",
        "tenure": "1 Yr", "profile": 62, "shift": "Evening", "city": "Seattle",
        "avatar": "https://randomuser.me/api/portraits/women/44.jpg", "role": "viewer",
    },
    {
        "id": "0004", "name": "Marcus Chen", "designation": "Analyst",
        "department": "Finance", "team": "Delta", "supervisor": "Lisa Wong",
        "tenure": "2 Yrs", "profile": 88, "shift": "Morning", "city": "Chicago",
        "avatar": "https://randomuser.me/api/portraits/men/22.jpg", "role": "editor",
    },
    {
        "id": "0005", "name": "Sophia Rodriguez", "designation": "Coordinator",
        "department": "Operations", "team": "Alpha", "supervisor": "John Smith",
        "tenure": "1 Yr", "profile": 45, "shift": "Night", "city": "Miami",
        "avatar": "https://randomuser.me/api/portraits/women/90.jpg", "role": "viewer",
    },
]


def seed_employees():
    if employees_collection.count_documents({}) > 0:
        return False

    now = datetime.now(timezone.utc)
    for emp in SEED_EMPLOYEES:
        doc = {**emp, "created_at": now, "updated_at": now}
        employees_collection.insert_one(doc)

    return True
