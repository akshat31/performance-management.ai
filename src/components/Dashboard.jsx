import React, { useEffect, useState } from 'react'
import { getState, setState, resetState } from '../store'

export default function Dashboard() {
  const [state, setLocal] = useState(getState())

  useEffect(() => {
    const s = getState(); setLocal(s);
  }, [])

  const goalsCompleted = Math.round((state.goals.filter(g=>g.status==='Completed').length / state.goals.length) * 100)

  return (
    <div className="grid" style={{gridTemplateColumns:'1fr 1fr'}}>
      <div className="card">
        <h3 style={{marginTop:0}}>Review Status</h3>
        <div className="row">
          <div><div className="kpi">{state.status.self === 'Submitted' ? '✅' : '⏳'} </div><div className="muted small">Self-Assessment</div></div>
          <div><div className="kpi">{state.status.manager === 'Completed' ? '✅' : '⏳'} </div><div className="muted small">Manager Review</div></div>
          <div><div className="kpi">{state.status.hr === 'Finalizing' ? '⏳' : '⏳'} </div><div className="muted small">HR</div></div>
        </div>
        <div className="space"></div>
        <div className="notice small">Tip: Use the "Self Evaluation" tab to auto-generate your draft with AI, then submit to manager.</div>
        <div className="space"></div>
        <button className="btn ghost" onClick={() => { setLocal(resetState()) }}>Reset Demo Data</button>
      </div>
      <div className="card">
        <h3 style={{marginTop:0}}>Snapshot</h3>
        <table>
          <tbody>
            <tr><td>Goals Completed</td><td className="right">{goalsCompleted}%</td></tr>
            <tr><td>Development Focus</td><td className="right">Stakeholder Comms, Mentorship, DevOps</td></tr>
            <tr><td>Discrepancy Flags</td><td className="right">{state.hrFlags.length}</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
