import React, { useEffect, useState } from 'react'
import { getState } from '../store'

export default function AuditTrail() {
  const [state, setLocal] = useState(getState())
  useEffect(() => setLocal(getState()), [])

  return (
    <div className="card">
      <h3 style={{marginTop:0}}>Audit Trail</h3>
      {state.audit.length === 0 ? <div className="muted small">No events yet.</div> : (
        <table>
          <thead><tr><th>Time</th><th>Event</th><th>Details</th></tr></thead>
          <tbody>
            {state.audit.map((e, i) => (
              <tr key={i}>
                <td className="small">{new Date(e.at).toLocaleString()}</td>
                <td>{e.type}</td>
                <td className="small">{JSON.stringify(e)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="notice small">Every rating change, submission, and HR decision is logged with user, time, and relevant fields.</div>
    </div>
  )
}
