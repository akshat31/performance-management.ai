const KEY = 'ai-perf-demo-v1';

const defaultState = {
  profile: { name:'Nitu Kumari', role:'Backend Engineer', period:'Q3 2025' },
  goals: [
    { id:'g1', title:'Admin Profile Screen', status:'Completed', notes:'Delivered on time, no major bugs' },
    { id:'g2', title:'EKS Setup QA', status:'Completed', notes:'Verified and deployed' },
    { id:'g3', title:'Leaderboard Feature', status:'Partial', notes:'First version delivered; feedback in progress' },
  ],
  feedback: [
    { id:'f1', source:'Peer', text:'Very dependable and detail-oriented' },
    { id:'f2', source:'Client', text:'Quick and clean turnaround' },
    { id:'f3', source:'Team lead', text:'Good team collaboration' },
  ],
  selfDraft:'',
  managerDraft:'',
  skills: [
    { name:'Backend Development', self:5, manager:5, final:5 },
    { name:'QA Ownership', self:4, manager:4, final:4 },
    { name:'Communication', self:4, manager:4, final:4 },
  ],
  discrepancies: [],
  audit: [],
  hrFlags: [],
  status: { self:'Not Submitted', manager:'Not Started', hr:'Pending' }
};

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || defaultState } catch { return defaultState; }
}
function save(state) { localStorage.setItem(KEY, JSON.stringify(state)); }

export function getState() { return load(); }
export function setState(mutator) {
  const s = load();
  const ns = mutator ? mutator(s) || s : s;
  save(ns);
  return ns;
}
export function resetState() { save(defaultState); return defaultState; }
