/* =========================================================================
   REDEEM PAGE — manual redemption via mailto.

   No backend, no third-party service, no setup required. When someone
   confirms a redemption, this opens THEIR OWN email app with a message
   already addressed to you and filled in with the item and their email —
   they just have to hit send.

   To change which inbox requests go to, edit DESTINATION_EMAIL below.
   ========================================================================= */

const DESTINATION_EMAIL = "goldencontrollertech@gmail.com";

// Renders the redeem store grid from window.GCT_REDEEM_ITEMS (redeem-data.js).
// Editing items, prices, or photos only requires editing redeem-data.js.
function renderRedeemStore() {
  const grid = document.getElementById('redeem-store-grid');
  if (!grid) return;

  const items = window.GCT_REDEEM_ITEMS || [];

  grid.innerHTML = items.map(item => `
    <div class="store-card" data-item="${escapeHtmlAttr(item.name)}" data-cost="${escapeHtmlAttr(item.cost)}">
      <div class="store-card-plate">
        <img src="${escapeHtmlAttr(item.image || 'assets/redeem/placeholder-item.png')}" alt="${escapeHtmlAttr(item.name)}" loading="lazy">
      </div>
      <div class="store-card-body">
        <h3>${escapeHtml(item.name)}</h3>
        <span class="store-card-price"><span class="coin-dot"></span>${escapeHtml(item.cost)} coins</span>
        <button class="btn btn-primary redeem-btn">Redeem</button>
      </div>
    </div>
  `).join('');
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeHtmlAttr(str) {
  return escapeHtml(str).replace(/"/g, '&quot;');
}

document.addEventListener('DOMContentLoaded', () => {
  renderRedeemStore();

  const overlay = document.getElementById('redeemOverlay');
  const closeBtn = document.getElementById('redeemClose');
  const form = document.getElementById('redeemForm');
  const statusEl = document.getElementById('redeemStatus');
  const submitBtn = document.getElementById('redeemSubmitBtn');

  if (!overlay || !form) return;

  function openModal(itemName, cost) {
    document.getElementById('redeemItemName').textContent = itemName;
    document.getElementById('redeemItemCost').textContent = cost;
    document.getElementById('redeemItemField').value = itemName;
    document.getElementById('redeemCostField').value = cost;
    document.getElementById('redeemEmail').value = '';
    statusEl.textContent = '';
    statusEl.className = 'redeem-modal-note';
    submitBtn.disabled = false;
    submitBtn.textContent = 'Confirm redemption';
    overlay.classList.add('open');
    document.getElementById('redeemEmail').focus();
  }

  function closeModal() {
    overlay.classList.remove('open');
  }

  document.querySelectorAll('.redeem-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.store-card');
      if (!card) return;
      openModal(card.dataset.item, card.dataset.cost);
    });
  });

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const itemName = document.getElementById('redeemItemField').value;
    const cost = document.getElementById('redeemCostField').value;
    const userEmail = document.getElementById('redeemEmail').value.trim();

    if (!userEmail) {
      statusEl.textContent = 'Please enter your Loopable account email.';
      statusEl.className = 'redeem-modal-note error';
      return;
    }

    const subject = `Loopable Redemption Request — ${itemName}`;
    const body =
      `Item: ${itemName}\n` +
      `Cost: ${cost} coins\n` +
      `Loopable account email: ${userEmail}\n\n` +
      `(Sent from the Golden Controller Tech redeem page)`;

    const mailtoLink =
      `mailto:${DESTINATION_EMAIL}` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoLink;

    statusEl.textContent = 'Opening your email app — just hit send to complete your request.';
    statusEl.className = 'redeem-modal-note success';
    submitBtn.textContent = 'Email app opened ✓';
    submitBtn.disabled = true;

    setTimeout(closeModal, 2600);
  });
});