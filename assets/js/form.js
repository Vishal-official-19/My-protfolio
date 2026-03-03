/* ============================================================
   CONTACT FORM + EMAILJS
   File: assets/js/form.js

   Setup:
   1. Go to https://www.emailjs.com → Free account banao
   2. "Add New Service" → Gmail/Outlook connect karo
   3. "Email Templates" → Template banao (variables: {{from_name}}, {{from_email}}, {{message}})
   4. "Account" → Public Key copy karo
   5. Neeche SERVICE_ID, TEMPLATE_ID, PUBLIC_KEY replace karo
   ============================================================ */

'use strict';

/* ── EmailJS Config (apni values yahan daalo) ── */
const EMAILJS_SERVICE_ID  = 'TFHsThsD8W1VVF_dGoati';
const EMAILJS_TEMPLATE_ID = 'template_j9iu1ir';
const EMAILJS_PUBLIC_KEY  = 'zN20uxb5foHYszb_9';

/* ── Form Elements ── */
const contactForm   = document.getElementById('contact-form');
const submitBtn     = document.getElementById('form-submit-btn');
const successBox    = document.getElementById('form-success-box');

/* ── Validation Rules ── */
const validators = {
  name: (v) => v.trim().length >= 2 || 'Name must be at least 2 characters',
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Please enter a valid email address',
  message: (v) => v.trim().length >= 20 || 'Message must be at least 20 characters',
};

/* ── Show / Clear field error ── */
function setError(fieldId, message) {
  const input = document.getElementById(fieldId);
  const errEl = document.getElementById(`${fieldId}-error`);
  input?.classList.add('error');
  if (errEl) { errEl.textContent = message; errEl.classList.add('show'); }
}

function clearError(fieldId) {
  const input = document.getElementById(fieldId);
  const errEl = document.getElementById(`${fieldId}-error`);
  input?.classList.remove('error');
  errEl?.classList.remove('show');
}

/* ── Live validation on blur ── */
['name', 'email', 'message'].forEach((id) => {
  const el = document.getElementById(id);
  el?.addEventListener('blur', () => {
    const result = validators[id]?.(el.value);
    if (result !== true) setError(id, result);
    else clearError(id);
  });

  el?.addEventListener('input', () => clearError(id));
});

/* ── Form Submit ── */
contactForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name    = document.getElementById('name')?.value ?? '';
  const email   = document.getElementById('email')?.value ?? '';
  const phone   = document.getElementById('phone')?.value ?? '';
  const budget  = document.getElementById('budget')?.value ?? '';
  const service = document.getElementById('service')?.value ?? '';
  const message = document.getElementById('message')?.value ?? '';

  /* Validate */
  let hasError = false;
  ['name', 'email', 'message'].forEach((id) => {
    const el = document.getElementById(id);
    const result = validators[id]?.(el.value);
    if (result !== true) {
      setError(id, result);
      hasError = true;
    }
  });

  if (hasError) return;

  /* Disable button */
  submitBtn.textContent = 'Sending…';
  submitBtn.disabled = true;

  /* Send via EmailJS */
  try {
    const now = new Date();
    const timeString = now.toLocaleString('en-US', { 
      dateStyle: 'medium', 
      timeStyle: 'short' 
    });

    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        name:         name,
        from_email:   email,
        phone:        phone || 'Not provided',
        budget:       budget || 'Not specified',
        service:      service || 'Not specified',
        message:      message,
        time:         timeString,
        reply_to:     email,
      }
    );

    /* Success */
    contactForm.reset();
    submitBtn.style.display = 'none';
    successBox?.classList.add('show');

  } catch (err) {
    console.error('EmailJS Error Details:', {
      error: err,
      serviceId: EMAILJS_SERVICE_ID,
      templateId: EMAILJS_TEMPLATE_ID,
      message: err.message,
      status: err.status
    });
    submitBtn.textContent = 'Failed — Try Again';
    submitBtn.disabled = false;
    alert(`Error: ${err.message || 'Something went wrong. Please email directly: vishalofficial9189@gmail.com'}`);
  }
});
