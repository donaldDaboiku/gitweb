// ── Hardcoded payment / account details ─────────────────────────────────────
const ACCOUNT = {
  bankName:    'GTBank',
  accountName: 'Olafunmiloye Donald Daboiku',
  accountNo:   '0751332204',
  sortCode:    '',
};
// ─────────────────────────────────────────────────────────────────────────────

function showTab(id, el) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.getElementById('tab-' + id).classList.add('active');
  el.classList.add('active');
}

function getFields() {
  return {
    name:     document.getElementById('f-name').value,
    client:   document.getElementById('f-client').value,
    type:     document.getElementById('f-type').value,
    price:    document.getElementById('f-price').value,
    time:     document.getElementById('f-time').value,
    deposit:  document.getElementById('f-deposit').value,
    contact:  document.getElementById('f-contact').value,
    features: document.getElementById('f-features').value,
  };
}

function updatePreview() {
  const f = getFields();
  const name    = f.name    || '[Your Name]';
  const client  = f.client  || '[Client Name]';
  const type    = f.type;
  const price   = f.price   || '[Amount]';
  const time    = f.time    || '[Timeline]';
  const deposit = f.deposit || '50% upfront';
  const contact = f.contact || '[Your contact]';

  const features = f.features
    ? f.features.split('\n').filter(l => l.trim()).map(l => `• ${l.trim()}`).join('\n')
    : '• Mobile responsive\n• SEO setup\n• Contact form\n• 2 months support';

  const today = new Date().toLocaleDateString('en-NG', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  document.getElementById('proposal-preview').innerHTML = `
    <div class="p-title">Website Design Proposal</div>
    <div class="p-sub">From: <strong>${name}</strong> &nbsp;|&nbsp; Date: ${today}</div>
    <hr>
    <div class="row"><span>Prepared for</span><strong>${client}</strong></div>
    <div class="row"><span>Project type</span><strong>${type}</strong></div>
    <div class="row"><span>Delivery timeline</span><strong>${time}</strong></div>
    <div class="row"><span>Total investment</span><strong style="color:#185FA5;">₦${price}</strong></div>
    <div class="row"><span>Deposit required</span><strong>${deposit}</strong></div>
    <hr>
    <div style="font-size:13px;color:var(--color-text-secondary);margin-bottom:4px;font-weight:700;letter-spacing:0.05em;">WHAT'S INCLUDED</div>
    <div style="font-size:15px;color:var(--color-text-secondary);white-space:pre-line;line-height:1.8;">${features}</div>
    <hr>
    <div style="font-size:13px;color:var(--color-text-secondary);margin-bottom:4px;font-weight:700;letter-spacing:0.05em;">PAYMENT DETAILS</div>
    <div class="row"><span>Bank</span><strong>${ACCOUNT.bankName}</strong></div>
    <div class="row"><span>Account name</span><strong>${ACCOUNT.accountName}</strong></div>
    <div class="row"><span>Account number</span><strong>${ACCOUNT.accountNo}</strong></div>
    <div class="row"><span>Sort code</span><strong>${ACCOUNT.sortCode}</strong></div>
    <hr>
    <div style="font-size:13px;color:var(--color-text-secondary);margin-bottom:4px;font-weight:700;letter-spacing:0.05em;">NEXT STEPS</div>
    <div style="font-size:15px;color:var(--color-text-secondary);">To proceed, kindly confirm acceptance and make the deposit payment to the account above. Work begins immediately after deposit is confirmed.</div>
    <hr>
    <div class="row"><span>Contact</span><strong>${contact}</strong></div>
    <div style="font-size:13px;color:var(--color-text-tertiary);margin-top:8px;text-align:center;">This proposal is valid for 14 days from the date above.</div>
  `;
}

function copyProposal(btn) {
  const text = document.getElementById('proposal-preview').innerText;
  navigator.clipboard.writeText(text).then(() => {
    flash(btn, '<i class="ti ti-check"></i> Copied!');
  }).catch(() => {
    // Fallback
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    flash(btn, '<i class="ti ti-check"></i> Copied!');
  });
}

function shareProposal(btn) {
  const f = getFields();
  const params = new URLSearchParams();
  Object.entries(f).forEach(([k, v]) => { if (v) params.set(k, v); });

  const url = location.href.split('?')[0] + '?' + params.toString();
  navigator.clipboard.writeText(url).then(() => {
    flash(btn, '<i class="ti ti-check"></i> Link copied!');
  }).catch(() => {
    prompt('Copy this link:', url);
  });
}

function flash(btn, html) {
  const orig = btn.innerHTML;
  btn.innerHTML = html;
  setTimeout(() => { btn.innerHTML = orig; }, 2500);
}

function sendPrompt(prompt) {
  window.open('https://gemini.google.com/app?q=' + encodeURIComponent(prompt), '_blank');
}

// ── Auto-fill form from URL params on page load ──────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(location.search);
  const map = {
    name: 'f-name', client: 'f-client', type: 'f-type',
    price: 'f-price', time: 'f-time', deposit: 'f-deposit',
    contact: 'f-contact', features: 'f-features',
  };
  let filled = false;
  Object.entries(map).forEach(([param, id]) => {
    const val = params.get(param);
    if (val) {
      const el = document.getElementById(id);
      if (el) { el.value = val; filled = true; }
    }
  });
  if (filled) {
    // Switch to proposal tab and render preview
    const proposalTab = document.querySelector('[onclick*="proposal"]');
    if (proposalTab) showTab('proposal', proposalTab);
    updatePreview();
  }
});
