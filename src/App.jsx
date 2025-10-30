import React, { useEffect, useMemo, useState } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import SelfEval from './components/SelfEval'
import ManagerReview from './components/ManagerReview'
import HRPanel from './components/HRPanel'
import AuditTrail from './components/AuditTrail'

function useNav() {
  const location = useLocation()
  const tabs = [
    { to:'/', label:'Dashboard' },
    { to:'/self', label:'Self Evaluation' },
    { to:'/manager', label:'Manager Review' },
    { to:'/hr', label:'HR Oversight' },
    { to:'/audit', label:'Audit Trail' },
  ]
  return { tabs, pathname: location.pathname }
}

export default function App() {
  const { tabs, pathname } = useNav()
  return (
    <div className="container">
      <div className="sticky">
        <h1 style={{margin:'0 0 8px 0'}}>AI Performance Manager <span className="tag">Demo</span></h1>
        <div className="nav">
          {tabs.map(t => (
            <Link key={t.to} to={t.to} className={['pill', pathname === t.to ? 'active': ''].join(' ')}>{t.label}</Link>
          ))}
        </div>
      </div>
      <div className="divider"></div>
      <Routes>
        <Route path="/" element={<Dashboard/>} />
        <Route path="/self" element={<SelfEval/>} />
        <Route path="/manager" element={<ManagerReview/>} />
        <Route path="/hr" element={<HRPanel/>} />
        <Route path="/audit" element={<AuditTrail/>} />
      </Routes>
    </div>
  )
}
