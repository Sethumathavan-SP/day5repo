# Student Agent Console

A React/Vite implementation of the LangChain student-agent exercise. The UI demonstrates the four required tools and an agent-style decision trace over the supplied SQLite records:

- `get_student_info(student_id)`
- `get_student_marks(student_id)`
- `calculator(expression)`
- `get_passing_rules()`

The browser demo keeps the data local so it runs with no API key. A real Gemini + SQLite implementation is included in `backend/` for the full assignment workflow.

## Run

```bash
npm install
npm run dev
```

## Real Gemini agent

```bash
cd backend
python seed_db.py
pip install -r requirements.txt
# Edit backend/.env and replace the placeholder with your Gemini API key
uvicorn agent:app --reload
```

The `POST /ask` endpoint creates a LangChain tool-calling agent. Gemini decides when to call the four tools; no fixed tool sequence is hard-coded.

The app includes the challenge question, prompt shortcuts, a decision trace, marks calculations, passing status, and a browsable student directory.
"# day5repo" 
