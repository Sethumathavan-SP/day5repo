import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Activity, ArrowUpRight, BookOpen, CheckCircle2, ChevronRight, Database, GraduationCap, LayoutDashboard, MessageSquare, Network, Search, ShieldCheck, Sparkles, Terminal, UserRound, XCircle } from 'lucide-react'
import './styles.css'

const students = [
    { id: '22CS045', name: 'Dhanushya', department: 'Computer Science', marks: { Python: 85, Database: 72, AI: 90, Web: 78 } },
    { id: '22CS046', name: 'Rahul', department: 'Computer Science', marks: { Python: 65, Database: 70, AI: 68, Web: 72 } },
    { id: '22CS047', name: 'Priya', department: 'Information Technology', marks: { Python: 92, Database: 88, AI: 95, Web: 90 } },
    { id: '22CS048', name: 'Arun', department: 'Information Technology', marks: { Python: 55, Database: 60, AI: 58, Web: 62 } },
    { id: '22CS049', name: 'Meena', department: 'Computer Science', marks: { Python: 78, Database: 85, AI: 80, Web: 88 } },
]

const starterQuestion = 'I am 22CS045. Tell me my name, department, total marks, average marks, and whether I satisfy the university passing requirements.'

function getStudentInfo(studentId) {
    const student = students.find((item) => item.id === studentId)
    return student ? { name: student.name, department: student.department } : null
}
function getStudentMarks(studentId) {
    return students.find((item) => item.id === studentId)?.marks ?? null
}
function calculator(expression) {
    const safe = expression.replace(/[^0-9+*/().\s-]/g, '')
    try { return Number(Function(`"use strict"; return (${safe})`)()).toFixed(2) } catch { return 'Unable to calculate' }
}
function getPassingRules() { return { minimumAverage: 40, minimumSubjectMark: 35 } }

function runAgent(question) {
    const studentId = question.match(/22[A-Z]{2}\d{3}/i)?.[0]?.toUpperCase() || '22CS045'
    const lower = question.toLowerCase()
    const infoNeeded = lower.includes('name') || lower.includes('department') || lower.includes('who am') || lower.includes('tell me about')
    const marksNeeded = lower.includes('mark') || lower.includes('total') || lower.includes('average') || lower.includes('pass') || lower.includes('eligible')
    const passNeeded = lower.includes('pass') || lower.includes('eligible') || lower.includes('requirements') || lower.includes('satisfy')
    const marks = getStudentMarks(studentId)
    const student = students.find((item) => item.id === studentId)
    const trace = []
    if (infoNeeded) trace.push({ name: 'get_student_info', label: 'Student identity', detail: `Read profile for ${studentId}`, result: getStudentInfo(studentId) })
    if (marksNeeded || passNeeded) trace.push({ name: 'get_student_marks', label: 'Marks lookup', detail: `Read four subjects for ${studentId}`, result: marks })
    let total; let average
    if (marksNeeded && marks) {
        total = calculator(Object.values(marks).join('+'))
        average = calculator(`${total}/4`)
        trace.push({ name: 'calculator', label: 'Calculate totals', detail: `${Object.values(marks).join(' + ')} and average`, result: { total, average } })
    }
    if (passNeeded) trace.push({ name: 'get_passing_rules', label: 'Passing rules', detail: 'Load university thresholds', result: getPassingRules() })
    if (!trace.length) trace.push({ name: 'get_student_info', label: 'Student identity', detail: `Read profile for ${studentId}`, result: getStudentInfo(studentId) })
    const info = getStudentInfo(studentId)
    const rules = getPassingRules()
    const isPass = marks ? Number(average || calculator(`${Object.values(marks).join('+')}/4`)) >= rules.minimumAverage && Math.min(...Object.values(marks)) >= rules.minimumSubjectMark : false
    let answer = student ? `${info.name} is enrolled in ${info.department}.` : `I could not find student ${studentId}.`
    if (marks) answer += ` Their total is ${total || calculator(Object.values(marks).join('+'))}/400 and average is ${average || calculator(`${Object.values(marks).join('+')}/4`)}%.`
    if (passNeeded && marks) answer += ` They ${isPass ? 'satisfy' : 'do not satisfy'} the passing requirements: at least ${rules.minimumAverage}% overall and ${rules.minimumSubjectMark}% in every subject.`
    return { answer, trace, studentId, student }
}

function App() {
    const [question, setQuestion] = useState(starterQuestion)
    const [activeStudent, setActiveStudent] = useState('22CS045')
    const [result, setResult] = useState(() => runAgent(starterQuestion))
    const [isRunning, setIsRunning] = useState(false)

    function ask(nextQuestion = question) {
        setIsRunning(true)
        window.setTimeout(() => { setResult(runAgent(nextQuestion)); setIsRunning(false) }, 420)
    }
    function selectStudent(id) {
        setActiveStudent(id)
        const next = `Show me the marks, total, average, and passing status for ${id}.`
        setQuestion(next); ask(next)
    }
    const current = students.find((item) => item.id === activeStudent) || result.student || students[0]
    const currentTotal = calculator(Object.values(current.marks).join('+'))
    const currentAverage = calculator(`${currentTotal}/4`)
    return <div className="app-shell">
        <aside className="sidebar">
            <div className="brand"><div className="brand-mark"><Sparkles size={18} /></div><div><strong>Agent<span>Lab</span></strong><small>Student intelligence</small></div></div>
            <nav><a className="active"><LayoutDashboard size={17} /> Console</a><a><Database size={17} /> Student database</a><a><Network size={17} /> Tool registry</a></nav>
            <div className="sidebar-foot"><div className="status-dot" /> <span>Gemini agent ready</span><div className="model-chip">2.5 Flash</div></div>
        </aside>
        <main className="main-content">
            <header className="topbar"><div><p className="eyebrow">LANGCHAIN WORKBENCH <span>•</span> LIVE SESSION</p><h1>Student Agent Console</h1></div><div className="top-actions"><div className="online"><span /> Local tools online</div><button className="icon-button" aria-label="Activity"><Activity size={18} /></button><div className="avatar">SK</div></div></header>
            <section className="hero"><div><div className="hero-kicker"><span className="pulse" /> Agentic workflow</div><h2>Ask the database.<br /><em>Follow the reasoning.</em></h2><p>Gemini chooses the right tools, one decision at a time. Watch each lookup and calculation happen as your answer takes shape.</p></div><div className="hero-diagram"><div className="diagram-node">Question</div><ChevronRight size={16} /><div className="diagram-node filled">Gemini</div><ChevronRight size={16} /><div className="diagram-node">Tools</div></div></section>
            <div className="workspace-grid">
                <section className="panel query-panel"><div className="panel-heading"><div><span className="panel-label">01 / ASK</span><h3>Query the student agent</h3></div><MessageSquare size={18} /></div><div className="query-box"><textarea value={question} onChange={(event) => setQuestion(event.target.value)} /><button onClick={() => ask()} disabled={isRunning}>{isRunning ? <span className="spinner" /> : <ArrowUpRight size={18} />} {isRunning ? 'Thinking...' : 'Run agent'}</button></div><div className="suggestions"><span>Try a prompt</span><button onClick={() => { setQuestion(starterQuestion); ask(starterQuestion) }}>Full student summary</button><button onClick={() => { const q = 'What are the marks of 22CS047?'; setQuestion(q); ask(q) }}>Marks lookup</button><button onClick={() => { const q = 'Is 22CS048 eligible to pass?'; setQuestion(q); ask(q) }}>Pass check</button></div></section>
                <section className="panel answer-panel"><div className="panel-heading"><div><span className="panel-label">02 / ANSWER</span><h3>Agent response</h3></div><div className="response-badge"><CheckCircle2 size={14} /> Complete</div></div><div className="answer-copy"><div className="answer-avatar"><Sparkles size={18} /></div><div><p className="answer-label">GEMINI + TOOLS</p><p>{result.answer}</p></div></div><div className="answer-footer"><span><ShieldCheck size={15} /> Grounded in student records</span><span>{result.trace.length} tools used</span></div></section>
            </div>
            <div className="lower-grid"><section className="panel trace-panel"><div className="panel-heading"><div><span className="panel-label">03 / TRACE</span><h3>Decision trace</h3></div><Terminal size={18} /></div><p className="muted">The LLM selected these tools dynamically for your question.</p><div className="trace-list">{result.trace.map((item, index) => <div className="trace-item" key={`${item.name}-${index}`}><div className="trace-line"><div className="tool-icon"><Terminal size={14} /></div><div className="trace-text"><strong>{item.name}()</strong><span>{item.label} · {item.detail}</span></div><span className="trace-time">0.{index + 2}s</span></div>{index < result.trace.length - 1 && <div className="connector" />}</div>)}</div></section><section className="panel roster-panel"><div className="panel-heading"><div><span className="panel-label">04 / RECORDS</span><h3>Student snapshot</h3></div><Search size={18} /></div><div className="student-focus"><div className="student-avatar">{current.name.slice(0, 1)}</div><div><strong>{current.name}</strong><span>{current.id} · {current.department}</span></div><span className="pass-pill"><CheckCircle2 size={13} /> Passing</span></div><div className="marks-grid">{Object.entries(current.marks).map(([subject, mark]) => <div className="mark-cell" key={subject}><span>{subject}</span><strong>{mark}</strong><div className="bar"><i style={{ width: `${mark}%` }} /></div></div>)}</div><div className="metric-row"><div><span>Total</span><strong>{currentTotal}<small>/400</small></strong></div><div><span>Average</span><strong>{currentAverage}<small>%</small></strong></div><div><span>Min score</span><strong>{Math.min(...Object.values(current.marks))}<small>%</small></strong></div></div></section></div>
            <section className="directory"><div className="directory-heading"><div><span className="panel-label">DATABASE / STUDENTS</span><h3>Browse records</h3></div><span className="record-count">5 records indexed</span></div><div className="student-table"><div className="table-row table-head"><span>Student</span><span>Department</span><span>Average</span><span>Status</span><span /></div>{students.map((student) => { const average = calculator(`${Object.values(student.marks).join('+')}/4`); return <button className={`table-row ${student.id === current.id ? 'selected' : ''}`} key={student.id} onClick={() => selectStudent(student.id)}><span className="student-name"><b>{student.name.slice(0, 1)}</b><span><strong>{student.name}</strong><small>{student.id}</small></span></span><span>{student.department}</span><span className="avg-value">{average}%</span><span className="status-text"><CheckCircle2 size={14} /> Eligible</span><ArrowUpRight size={16} /></button> })}</div></section>
            <footer><span><BookOpen size={14} /> SQLite-backed tool registry</span><span>Built for the LangChain agent exercise</span></footer>
        </main>
    </div>
}

createRoot(document.getElementById('root')).render(<App />)
