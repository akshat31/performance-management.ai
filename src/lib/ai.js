// Simple, pluggable AI helper.
// For real LLMs, replace the generate* functions to call your API.
// The demo uses heuristics and prompt-shaped outputs.

export function generateSelfEvalDraft(profile, goals, feedback) {
  const name = profile?.name || "Employee";
  const period = profile?.period || "this review period";
  const accomplishments = goals.filter(g => g.status === 'Completed').map(g => g.title);
  const partials = goals.filter(g => g.status === 'Partial').map(g => g.title);
  const fb = feedback.slice(0,3).map(f => `“${f.text}” – ${f.source}`).join('\n');

  return `Section 1: Key Accomplishments\n` +
    `I successfully ${accomplishments.length ? 'delivered ' + accomplishments.join(', ') : 'completed my planned tasks'}${partials.length ? `, and shipped first versions of ${partials.join(', ')}` : ''}.\n\n` +
    `Section 2: Challenges & Resolutions\n` +
    `Faced ambiguity around ${partials[0] || accomplishments[0] || 'a module'}; resolved via team discussions and clearer test coverage.\n\n` +
    `Section 3: Goal Progress\n` +
    goals.map(g => `- ${g.title}: ${g.status} (${g.notes || '—'})`).join('\n') + `\n\n` +
    `Section 4: Feedback Summary\n` + fb + `\n\n` +
    `Section 5: Skills & Development Areas\n` +
    `- Communication: 4 (clearer updates, client calls)\n- QA Ownership: 4 (coverage improved)\n- Backend Development: 5 (strong execution)\n\n` +
    `Section 6: Development Plan\n` +
    `Present cross-team demos; explore DevOps optimizations; mentor a new joiner; improve docs.`
}

export function generateManagerReviewDraft(self, profile) {
  const name = profile?.name || 'Employee';
  const lines = self.split('\n').filter(Boolean).slice(0,6).join(' ');
  return `Summary: ${name} demonstrated consistent delivery ${profile?.period ? 'in ' + profile.period : ''}. ${lines}...`;
}

export function suggestSkillRatings(self) {
  // Very naive heuristics
  const base = { Communication: 4, 'QA Ownership': 4, 'Backend Development': 5 };
  if (self.toLowerCase().includes('feedback')) base['Communication'] = 4;
  return base;
}

export function guardLargeDrop(prev, nxt, threshold = 2) {
  const drop = prev - nxt;
  const exceeds = drop > threshold;
  return { exceeds, drop };
}
