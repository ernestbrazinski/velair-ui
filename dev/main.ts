import '../themes/default.css';
import '../src/index.js';
import { VlModal } from '../src/components/vl-modal.js';
import { VlNotification } from '../src/components/vl-notification.js';

const modal = document.getElementById('demoModal');
const openBtn = document.getElementById('openModal');
const closeBtn = document.getElementById('closeModal');

if (modal instanceof VlModal && openBtn && closeBtn) {
  openBtn.addEventListener('click', () => {
    modal.open = true;
  });
  closeBtn.addEventListener('click', () => {
    modal.close();
  });
}

function showNotif(id: string) {
  const el = document.getElementById(id);
  if (el instanceof VlNotification) {
    el.open = true;
  }
}

document.getElementById('showNotifSuccess')?.addEventListener('click', () => {
  showNotif('notifSuccess');
});
document.getElementById('showNotifWarning')?.addEventListener('click', () => {
  showNotif('notifWarning');
});
document.getElementById('showNotifError')?.addEventListener('click', () => {
  showNotif('notifError');
});
document.getElementById('showNotifLong')?.addEventListener('click', () => {
  showNotif('notifLong');
});
