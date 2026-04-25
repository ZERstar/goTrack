'use client';
import { useState, useRef } from 'react';
import type { Remark, CustomMilestone } from '@/types';

const INITIAL_REMARKS: Remark[] = [
  { id: 'r1', author: 'Priya M.', initials: 'PM', color: '#7C3AED', time: 'Apr 23 · 2:14 PM', tag: 'customs', own: false, text: 'Customs hold — missing certificate of origin. Document submitted to freight forwarder, awaiting re-inspection. ETA delay ~3 days.' },
  { id: 'r2', author: 'You', initials: 'Me', color: '#1E54B7', time: 'Apr 23 · 4:30 PM', tag: 'ops', own: true, text: 'Escalated to MAEU operations. They confirmed the hold is on their end, not customs. Waiting for port agent update.' },
  { id: 'r3', author: 'Raj K.', initials: 'RK', color: '#0D9488', time: 'Apr 24 · 9:05 AM', tag: 'client', own: false, text: 'Client called — they can accept delivery 2 days later. Updated ETA communicated. No penalty clause triggered.' },
];

const INITIAL_MILESTONES: CustomMilestone[] = [
  { id: 'cm1', name: 'Document Submission to Customs', expected: 'Apr 23 2025', actual: 'Apr 23 2025', status: 'reached', notify: true, edited: false },
  { id: 'cm2', name: 'Customs Re-inspection Clearance', expected: 'Apr 26 2025', actual: null, status: 'overdue', notify: true, edited: false },
  { id: 'cm3', name: 'Client Confirmation of New ETA', expected: 'Apr 24 2025', actual: 'Apr 24 2025', status: 'reached', notify: false, edited: false },
];

const TAGS = ['customs', 'client', 'ops', 'alert'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDateForDisplay(value: string) {
  if (!value) return 'TBD';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const [year, month, day] = value.split('-').map(Number);
  return `${MONTHS[month - 1]} ${day} ${year}`;
}

function formatDateForInput(value: string | null) {
  if (!value || value === 'Today') return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const match = value.match(/^([A-Za-z]{3})\s(\d{1,2})\s(\d{4})$/);
  if (!match) return '';
  const monthIndex = MONTHS.indexOf(match[1]);
  if (monthIndex === -1) return '';
  return `${match[3]}-${String(monthIndex + 1).padStart(2, '0')}-${String(Number(match[2])).padStart(2, '0')}`;
}

function PencilIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
    </svg>
  );
}

function updateMilestoneField(
  milestones: CustomMilestone[],
  milestoneId: string,
  updater: (milestone: CustomMilestone) => CustomMilestone,
) {
  return milestones.map((milestone) => {
    if (milestone.id !== milestoneId) return milestone;
    const nextMilestone = updater(milestone);
    return { ...nextMilestone, edited: true };
  });
}

export default function RemarksTab() {
  const [remarks, setRemarks] = useState<Remark[]>(INITIAL_REMARKS);
  const [milestones, setMilestones] = useState<CustomMilestone[]>(INITIAL_MILESTONES);
  const [text, setText] = useState('');
  const [tag, setTag] = useState('ops');
  const [notify, setNotify] = useState(false);
  const [amName, setAmName] = useState('');
  const [amExpected, setAmExpected] = useState('');
  const [amActual, setAmActual] = useState('');
  const [amStatus, setAmStatus] = useState<CustomMilestone['status']>('pending');
  const [amNotify, setAmNotify] = useState(true);
  const [editingMilestoneId, setEditingMilestoneId] = useState<string | null>(null);
  const feedRef = useRef<HTMLDivElement>(null);

  const send = () => {
    if (!text.trim()) return;
    setRemarks(prev => [...prev, { id: 'r' + Date.now(), author: 'You', initials: 'Me', color: '#1E54B7', time: 'Just now', tag, own: true, text: text.trim() }]);
    setText('');
    setTimeout(() => { if (feedRef.current) feedRef.current.scrollTop = feedRef.current.scrollHeight; }, 50);
  };

  const resetMilestoneForm = () => {
    setEditingMilestoneId(null);
    setAmName('');
    setAmExpected('');
    setAmActual('');
    setAmStatus('pending');
    setAmNotify(true);
  };

  const upsertMilestone = () => {
    if (!amName.trim()) return;
    const actual = amStatus === 'reached'
      ? (amActual ? formatDateForDisplay(amActual) : 'Today')
      : null;
    const expected = amExpected ? formatDateForDisplay(amExpected) : 'TBD';

    setMilestones((prev) => {
      if (!editingMilestoneId) {
        return [...prev, {
          id: 'cm' + Date.now(),
          name: amName.trim(),
          expected,
          actual,
          status: amStatus,
          notify: amNotify,
          edited: false,
        }];
      }

      return prev.map((milestone) => {
        if (milestone.id !== editingMilestoneId) return milestone;

        const changed = (
          milestone.name !== amName.trim() ||
          milestone.expected !== expected ||
          milestone.actual !== actual ||
          milestone.status !== amStatus ||
          milestone.notify !== amNotify
        );

        return {
          ...milestone,
          name: amName.trim(),
          expected,
          actual,
          status: amStatus,
          notify: amNotify,
          edited: milestone.edited || changed,
        };
      });
    });
    resetMilestoneForm();
  };

  const editMilestone = (milestone: CustomMilestone) => {
    setEditingMilestoneId(milestone.id);
    setAmName(milestone.name);
    setAmExpected(formatDateForInput(milestone.expected));
    setAmActual(formatDateForInput(milestone.actual));
    setAmStatus(milestone.status);
    setAmNotify(milestone.notify);
  };

  return (
    <div className="rm-layout">
      <div className="rm-left">
        <div className="rm-section-header">
          <span>💬 Remarks &amp; Notes</span>
          <span style={{ fontSize: 10, color: '#94A3B8', fontWeight: 500 }}>{remarks.length} entries · visible to all stakeholders</span>
        </div>

        <div className="remarks-feed" ref={feedRef}>
          {remarks.map(r => (
            <div key={r.id} className="remark-bubble" style={{ flexDirection: r.own ? 'row-reverse' : 'row' }}>
              <div className="remark-avatar" style={{ background: r.color }}>{r.initials}</div>
              <div className="remark-body" style={{ alignItems: r.own ? 'flex-end' : 'flex-start', display: 'flex', flexDirection: 'column' }}>
                <div className="remark-meta">
                  {!r.own && <span className="remark-author">{r.author}</span>}
                  <span className="remark-time">{r.time}</span>
                  {r.tag && <span className={`remark-tag ${r.tag}`}>{r.tag}</span>}
                </div>
                <div className={`remark-text${r.own ? ' own' : ''}`}>{r.text}</div>
                <div className="remark-actions">
                  <span className="remark-action">Reply</span>
                  <span className="remark-action">React</span>
                  {r.own && <span className="remark-action">Edit</span>}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="compose-box">
          <div style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.5px' }}>Tag this remark</div>
          <div className="compose-tags">
            {TAGS.map(t => (
              <button key={t} className={`compose-tag-btn${tag === t ? ' selected' : ''}`} onClick={() => setTag(t)}>{t}</button>
            ))}
          </div>
          <div className="compose-input-row">
            <textarea
              className="compose-textarea"
              placeholder='Add a note — "Customs hold: missing docs", "Client requested early delivery"…'
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
              rows={2}
            />
            <button className="compose-send" onClick={send}>Send</button>
          </div>
          <label className="compose-notify">
            <input type="checkbox" checked={notify} onChange={e => setNotify(e.target.checked)} style={{ accentColor: '#1E54B7' }} />
            Notify all stakeholders when posted
          </label>
        </div>
      </div>

      <div className="rm-right">
        <div className="rm-section-header">
          <span>📌 Custom Milestones</span>
          <span style={{ fontSize: 10, color: '#94A3B8', fontWeight: 500 }}>{milestones.length} added</span>
        </div>

        <div className="milestones-list">
          {milestones.map(m => (
            <div key={m.id} className={`custom-milestone ${m.status}`}>
              <div className="cm-top">
                <div className="cm-name-wrap">
                  <div className="cm-name">{m.name}</div>
                  {m.edited && (
                    <span className="cm-edited-flag">
                      <PencilIcon />
                      Edited
                    </span>
                  )}
                </div>
                <span className={`cm-badge ${m.status}`}>
                  {m.status === 'reached' ? '✓ Reached' : m.status === 'overdue' ? '⚠ Overdue' : '○ Pending'}
                </span>
              </div>
              <div className="cm-dates">
                <div className="cm-date">Expected: <strong>{m.expected}</strong></div>
                <div className="cm-date">Actual: <strong style={{ color: m.actual ? '#15803D' : m.status === 'overdue' ? '#DC2626' : '#94A3B8' }}>{m.actual ?? '–'}</strong></div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
                <div
                  className="cm-notify"
                  onClick={() => setMilestones((prev) => updateMilestoneField(prev, m.id, (milestone) => ({ ...milestone, notify: !milestone.notify })))}
                >
                  <span>{m.notify ? '🔔' : '🔕'}</span>
                  <span className={m.notify ? 'cm-on' : ''}>{m.notify ? 'Alert on' : 'Alert off'}</span>
                </div>
                <div className="cm-actions">
                  <span className="cm-action-link" onClick={() => editMilestone(m)}>
                    <PencilIcon />
                    Edit
                  </span>
                  {(m.status === 'pending' || m.status === 'overdue') && (
                    <span
                      className="cm-action-link"
                      onClick={() => setMilestones((prev) => updateMilestoneField(prev, m.id, (milestone) => ({ ...milestone, status: 'reached', actual: 'Today' })))}
                    >
                      Mark reached
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="add-milestone-form">
          <div className="am-title">{editingMilestoneId ? 'Edit custom milestone' : '+ Add custom milestone'}</div>
          <div className="am-row">
            <input className="am-input" placeholder='e.g. "Document Submission to Customs"' value={amName} onChange={e => setAmName(e.target.value)} onKeyDown={e => e.key === 'Enter' && upsertMilestone()} />
          </div>
          <div className="am-row">
            <input type="date" className="am-input date" value={amExpected} onChange={e => setAmExpected(e.target.value)} />
            <select className="am-input" value={amStatus} onChange={e => setAmStatus(e.target.value as CustomMilestone['status'])}>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
              <option value="reached">Reached</option>
            </select>
          </div>
          <div className="am-row">
            <input type="date" className="am-input date" value={amActual} onChange={e => setAmActual(e.target.value)} disabled={amStatus !== 'reached'} />
            <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: '#64748B', flex: 1, cursor: 'pointer' }}>
              <input type="checkbox" checked={amNotify} onChange={e => setAmNotify(e.target.checked)} style={{ accentColor: '#1E54B7' }} />
              Alert me
            </label>
            {editingMilestoneId && (
              <button className="am-secondary-btn" onClick={resetMilestoneForm}>Cancel</button>
            )}
            <button className="am-add-btn" onClick={upsertMilestone}>{editingMilestoneId ? 'Save' : 'Add'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
