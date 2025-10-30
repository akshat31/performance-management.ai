import React, { useEffect, useState } from 'react'
import { getState, setState } from '../store'
import { generateSelfEvalDraft } from '../lib/ai'

export default function SelfEval() {
  const [state, setLocal] = useState(getState())
  const [draft, setDraft] = useState(state.selfDraft || '')

  useEffect(() => {
    setLocal(getState())
  }, [])

  function gen() {
    const d = generateSelfEvalDraft(state.profile, state.goals, state.feedback)
    setDraft(d)
  }

  function save() {
    setLocal(setState(s => {
      s.selfDraft = draft
      return s
    }))
  }

  function submit() {
    setLocal(setState(s => {
      s.selfDraft = draft
      s.status.self = 'Submitted'
      s.audit.push({ type:'SELF_SUBMIT', by: s.profile.name, at: new Date().toISOString() })
      return s
    }))
    alert('Submitted to Manager')
  }

  return (
    <div className="grid" style={{gridTemplateColumns:'1fr 1fr'}}>
      <div className="card">
        <h3 style={{marginTop:0}}>Self Evaluation (Employee)</h3>
        <div className="row">
          <button className="btn" onClick={gen}>✨ Generate AI Draft</button>
          <button className="btn ghost" onClick={save}>Save</button>
          <button className="btn primary" onClick={submit} disabled={!draft}>Submit to Manager</button>
        </div>
        <div className="space"></div>
        <div className="label">Draft</div>
        <textarea value={draft} onChange={e => setDraft(e.target.value)} placeholder="Click 'Generate AI Draft' to start..." />
      </div>
      <div className="card">
        <h3 style={{marginTop:0}}>Goals</h3>
        <table>
          <thead><tr><th>Goal</th><th>Status</th><th>Notes</th></tr></thead>
          <tbody>
            {state.goals.map(g => (
              <tr key={g.id}><td>{g.title}</td><td>{g.status}</td><td className="muted small">{g.notes}</td></tr>
            ))}
          </tbody>
        </table>
        <div className="space"></div>
        <h4>Recent Feedback</h4>
        <ul>
          {state.feedback.map(f => (<li key={f.id} className="muted small">“{f.text}” – {f.source}</li>))}
        </ul>
      </div>
    </div>
  )
}
