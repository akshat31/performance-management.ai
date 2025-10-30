import React, { useEffect, useMemo, useState } from 'react'
import { getState, setState } from '../store'
import { generateManagerReviewDraft, suggestSkillRatings, guardLargeDrop } from '../lib/ai'

export default function ManagerReview() {
  const [state, setLocal] = useState(getState())
  const [draft, setDraft] = useState(state.managerDraft || '')
  const [skills, setSkills] = useState(state.skills)
  const [justifications, setJustifications] = useState({}) // skill -> text

  useEffect(() => { setLocal(getState()) }, [])

  function gen() {
    const d = generateManagerReviewDraft(state.selfDraft || '', state.profile)
    const ai = suggestSkillRatings(state.selfDraft || '')
    const merged = state.skills.map(s => ({ ...s, manager: ai[s.name] ?? s.manager }))
    setDraft(d)
    setSkills(merged)
  }

  function updateManagerRating(name, val) {
    const v = Number(val)
    setSkills(prev => prev.map(s => s.name === name ? { ...s, manager: v } : s))
  }

  function finalize() {
    // Validate large drops and require justification; create flags + audit entries
    let flags = []
    let auditEntries = []
    let discrepancies = []
    let hasBlocker = false

    const updated = skills.map(s => {
      const prev = s.self
      const nxt = s.manager
      const { exceeds, drop } = guardLargeDrop(prev, nxt, 2)
      if (exceeds) {
        if (!justifications[s.name] || justifications[s.name].trim().length < 10) {
          alert(`Rating drop >2 for "${s.name}". Please add a justification (min 10 chars).`)
          hasBlocker = true
        } else {
          flags.push({ skill:s.name, self: prev, manager: nxt, gap: prev - nxt, reason: justifications[s.name] })
          auditEntries.push({ type:'RATING_CHANGED_LARGE', by: 'Manager', skill:s.name, from: prev, to: nxt, reason: justifications[s.name], at: new Date().toISOString() })
          discrepancies.push({ skill:s.name, self: prev, manager: nxt, reason: justifications[s.name] })
        }
      } else if (prev !== nxt) {
        auditEntries.push({ type:'RATING_CHANGED', by: 'Manager', skill:s.name, from: prev, to: nxt, at: new Date().toISOString() })
      }
      return { ...s, final: nxt }
    })

    if (hasBlocker) return

    setLocal(setState(s => {
      s.managerDraft = draft
      s.skills = updated
      s.status.manager = 'Completed'
      s.audit.push(...auditEntries, { type:'MANAGER_SUBMIT', by:'Manager', at:new Date().toISOString() })
      s.hrFlags.push(...flags)
      s.discrepancies = discrepancies
      return s
    }))
    alert('Manager review submitted. HR notified for large deviations.')
  }

  return (
    <div className="grid" style={{gridTemplateColumns:'1fr 1fr'}}>
      <div className="card">
        <h3 style={{marginTop:0}}>Manager Review</h3>
        <div className="row">
          <button className="btn" onClick={gen}>🤖 AI Assist</button>
          <button className="btn primary" onClick={finalize}>Submit Final Ratings</button>
        </div>
        <div className="space"></div>
        <div className="label">Summary / Comments</div>
        <textarea value={draft} onChange={e => setDraft(e.target.value)} placeholder="Click 'AI Assist' to generate a starting draft..." />
      </div>
      <div className="card">
        <h3 style={{marginTop:0}}>Skill Ratings</h3>
        <table>
          <thead><tr><th>Skill</th><th>Self</th><th>Manager</th><th>Δ</th><th>Justification (if drop &gt;2)</th></tr></thead>
          <tbody>
            {skills.map(s => {
              const delta = s.manager - s.self
              const largeDrop = (s.self - s.manager) > 2
              return (
                <tr key={s.name}>
                  <td>{s.name}</td>
                  <td>{s.self}</td>
                  <td>
                    <select value={s.manager} onChange={e => updateManagerRating(s.name, e.target.value)}>
                      {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </td>
                  <td className={delta < 0 ? 'err' : delta > 0 ? 'ok' : 'muted'}>{delta > 0 ? `+${delta}` : delta}</td>
                  <td>
                    {largeDrop ? (
                      <input placeholder="Required for large drop..." value={justifications[s.name] || ''} onChange={e => setJustifications({...justifications, [s.name]: e.target.value})} />
                    ) : <span className="muted small">—</span>}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <div className="notice small">Policy: If a manager reduces a self-rating by &gt; 2 points (e.g., 5 → 2), a written reason is mandatory and HR is auto-notified.</div>
      </div>
    </div>
  )
}
