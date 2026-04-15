import '../src/index.js';
import { VlModal } from '../src/components/vl-modal.js';

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
