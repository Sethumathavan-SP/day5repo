import json
import os
import sqlite3
from pathlib import Path

from fastapi import FastAPI, HTTPException
from langchain.agents import AgentExecutor, create_tool_calling_agent
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.tools import tool
from langchain_google_genai import ChatGoogleGenerativeAI
from pydantic import BaseModel
from dotenv import load_dotenv

DB_PATH = Path(__file__).with_name("students.db")
load_dotenv(Path(__file__).with_name(".env"))
app = FastAPI(title="Student Agent API")


def find_student(student_id: str):
    with sqlite3.connect(DB_PATH) as connection:
        connection.row_factory = sqlite3.Row
        return connection.execute(
            "SELECT * FROM students WHERE student_id = ?", (student_id.upper(),)
        ).fetchone()


@tool
def get_student_info(student_id: str) -> str:
    """Return the student's name and department from the student database."""
    student = find_student(student_id)
    if not student:
        return f"No student found for {student_id}."
    return json.dumps({"name": student["name"], "department": student["department"]})


@tool
def get_student_marks(student_id: str) -> str:
    """Return Python, Database, AI, and Web marks for a student."""
    student = find_student(student_id)
    if not student:
        return f"No student found for {student_id}."
    return json.dumps({
        "python": student["python"],
        "database": student["database_mark"],
        "ai": student["ai"],
        "web": student["web"],
    })


@tool
def calculator(expression: str) -> str:
    """Calculate a total or average using a basic arithmetic expression."""
    allowed = set("0123456789+-*/(). ")
    if not set(expression) <= allowed:
        return "Only arithmetic expressions are allowed."
    try:
        return str(round(eval(expression, {"__builtins__": {}}, {}), 2))
    except Exception:
        return "Unable to calculate that expression."


@tool
def get_passing_rules() -> str:
    """Return the university minimum average and minimum subject mark rules."""
    return json.dumps({"minimum_overall_average": 40, "minimum_mark_each_subject": 35})


class Question(BaseModel):
    question: str


def build_agent():
    model = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        temperature=0,
        google_api_key=os.environ["GOOGLE_API_KEY"],
    )
    tools = [get_student_info, get_student_marks, calculator, get_passing_rules]
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are a student records assistant. Use tools for every fact. "
         "For passing status, fetch marks and rules, calculate the average, and check both thresholds. "
         "Explain which tools you used in the final answer."),
        ("human", "{input}"),
        MessagesPlaceholder("agent_scratchpad"),
    ])
    return AgentExecutor(agent=create_tool_calling_agent(model, tools, prompt), tools=tools, verbose=True)


@app.post("/ask")
def ask(question: Question):
    if not os.environ.get("GOOGLE_API_KEY"):
        raise HTTPException(status_code=500, detail="GOOGLE_API_KEY is not configured")
    return build_agent().invoke({"input": question.question})
