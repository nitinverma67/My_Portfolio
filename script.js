const pages = [...document.querySelectorAll('.page')];
const navLinks = [...document.querySelectorAll('.nav-link')];
const nav = document.getElementById('nav');
const menuToggle = document.getElementById('menuToggle');

function showPage(id) {
  if (!document.getElementById(id)) return;
  pages.forEach(page => {
    const selected = page.id === id;
    page.classList.toggle('active', selected);
    page.setAttribute('aria-hidden', String(!selected));
  });
  navLinks.forEach(link => {
    const selected = link.dataset.page === id;
    link.classList.toggle('active', selected);
    if (selected) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  nav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.textContent = '☰';
  window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
}
navLinks.forEach(link => link.addEventListener('click', () => showPage(link.dataset.page)));
document.querySelectorAll('[data-goto]').forEach(button => button.addEventListener('click', () => showPage(button.dataset.goto)));
document.getElementById('backHome')?.addEventListener('click', () => showPage('home'));
if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');

    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.textContent = isOpen ? '×' : '☰';
});
}

// Certificate filters
document.querySelectorAll('[data-filter]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach(item => item.classList.toggle('active', item === button));
    document.querySelectorAll('.certificate-card').forEach(card => {
      card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter;
    });
  });
});

// A static site cannot store submissions securely without a backend.
// Prepare an email draft instead, so the visitor's details are not silently sent to a third party.
document.getElementById('contactForm').addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const subject = `Portfolio enquiry: ${data.get('reason')}`;
  const body = [
    `Name: ${data.get('name')}`,
    `Mobile: ${data.get('mobile')}`,
    `Email: ${data.get('email')}`,
    `Reason: ${data.get('reason')}`,
    '',
    'Message:',
    data.get('message') || '(No additional message)'
  ].join('\n');
  const status = document.getElementById('formStatus');
  status.textContent = 'Your email app should open with the message details. Review and send it there.';
  window.location.href = `mailto:nitinverma7546@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
document.getElementById('year').textContent = new Date().getFullYear();
pages.forEach(page => page.setAttribute('aria-hidden', String(!page.classList.contains('active'))));
