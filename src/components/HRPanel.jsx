import React, { useEffect, useState } from 'react'
import { getState, setState } from '../store'

export default function HRPanel() {
  const [state, setLocal] = useState(getState())
  useEffect(() => setLocal(getState()), [])

  function approveFlag(idx) {
    setLocal(setState(s => {
      const flag = s.hrFlags[idx]
      s.audit.push({ type:'HR_REVIEW', by:'HR', action:'Approved', flag, at:new Date().toISOString() })
      s.hrFlags.splice(idx,1)
      s.status.hr = 'Finalizing'
      return s
    }))
  }

  function requestClarification(idx) {
    setLocal(setState(s => {
      const flag = s.hrFlags[idx]
      s.audit.push({ type:'HR_REVIEW', by:'HR', action:'Clarify', flag, at:new Date().toISOString() })
      return s
    }))
    alert('Clarification requested from manager.')
  }

  return (
    <div className="grid" style={{gridTemplateColumns:'1fr 1fr'}}>
      <div className="card">
        <h3 style={{marginTop:0}}>Deviation Flags</h3>
        {state.hrFlags.length === 0 ? <div className="muted">No active flags.</div> : (
          <table>
            <thead><tr><th>Skill</th><th>Self</th><th>Mgr</th><th>Gap</th><th>Reason</th><th></th></tr></thead>
            <tbody>
              {state.hrFlags.map((f, i) => (
                <tr key={i}>
                  <td>{f.skill}</td><td>{f.self}</td><td>{f.manager}</td><td className="warn">{f.gap}</td><td className="small">{f.reason}</td>
                  <td className="right">
                    <button className="btn ghost" onClick={() => requestClarification(i)}>Clarify</button>
                    <button className="btn primary" onClick={() => approveFlag(i)}>Approve</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="card">
        <h3 style={{marginTop:0}}>Employee Visibility</h3>
        {state.discrepancies.length === 0 ? <div className="muted small">No discrepancies to show.</div> : (
          <table>
            <thead><tr><th>Skill</th><th>Self</th><th>Manager</th><th>Reason</th></tr></thead>
            <tbody>
              {state.discrepancies.map((d, i) => (
                <tr key={i}><td>{d.skill}</td><td>{d.self}</td><td>{d.manager}</td><td className="small">{d.reason}</td></tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="notice small">Employees can view changed ratings & justifications before final submission for transparency.</div>
      </div>
    </div>
  )
}
