import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).with_name("students.db")

students = [
    ("22CS045", "Dhanushya", "Computer Science", 85, 72, 90, 78),
    ("22CS046", "Rahul", "Computer Science", 65, 70, 68, 72),
    ("22CS047", "Priya", "Information Technology", 92, 88, 95, 90),
    ("22CS048", "Arun", "Information Technology", 55, 60, 58, 62),
    ("22CS049", "Meena", "Computer Science", 78, 85, 80, 88),
]

with sqlite3.connect(DB_PATH) as connection:
    connection.execute("DROP TABLE IF EXISTS students")
    connection.execute("""
        CREATE TABLE students (
            student_id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            department TEXT NOT NULL,
            python INTEGER NOT NULL,
            database_mark INTEGER NOT NULL,
            ai INTEGER NOT NULL,
            web INTEGER NOT NULL
        )
    """)
    connection.executemany("INSERT INTO students VALUES (?, ?, ?, ?, ?, ?, ?)", students)
    connection.commit()

print(f"Seeded {len(students)} students into {DB_PATH}")
