/* ============================================================
   FORM JS v2.0 — EmailJS + Razorpay Payment
   
   SETUP:
   1. EmailJS: emailjs.com → Free account → Service + Template banao
      Replace: EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY

   2. Razorpay: dashboard.razorpay.com → Test Mode Key copy karo
      Replace: RAZORPAY_KEY_ID
   ============================================================ */
'use strict';

// 🔧 CONFIGURE THESE:
// Go to https://www.emailjs.com → Account → Copy your IDs
const EMAILJS_SERVICE_ID  = 'service_f2ka06r';  // Replace with your Service ID
const EMAILJS_TEMPLATE_ID = 'template_b3603i1'; // Replace with your Template ID
const EMAILJS_PUBLIC_KEY  = 'zN20uxb5foHYszb_9';  // Replace with your Public Key
const RAZORPAY_KEY_ID     = 'rzp_test_YourKeyHere';

/* ── Validation ── */
const validators = {
  name:    v => v.trim().length >= 2    || 'Name must be at least 2 characters',
  email:   v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Enter a valid email address',
  message: v => v.trim().length >= 20   || 'Message must be at least 20 characters',
};

function setError(id, msg)  { const i = document.getElementById(id); const e = document.getElementById(`${id}-error`); i?.classList.add('error'); if (e) { e.textContent = msg; e.classList.add('show'); } }
function clearError(id)     { document.getElementById(id)?.classList.remove('error'); document.getElementById(`${id}-error`)?.classList.remove('show'); }

['name','email','message'].forEach(id => {
  const el = document.getElementById(id);
  el?.addEventListener('blur',  () => { const r = validators[id]?.(el.value); if (r !== true) setError(id, r); else clearError(id); });
  el?.addEventListener('input', () => clearError(id));
});

/* ── Contact Form Submit ── */
const contactForm = document.getElementById('contact-form');
const submitBtn   = document.getElementById('form-submit-btn');
const successBox  = document.getElementById('form-success-box');

contactForm?.addEventListener('submit', async e => {
  e.preventDefault();
  let hasError = false;
  ['name','email','message'].forEach(id => {
    const el = document.getElementById(id);
    const r  = validators[id]?.(el?.value || '');
    if (r !== true) { setError(id, r); hasError = true; }
  });
  if (hasError) return;

  submitBtn.textContent = 'Sending…';
  submitBtn.disabled = true;

  try {
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      from_name:    document.getElementById('name')?.value || 'Not provided',
      from_email:   document.getElementById('email')?.value || 'Not provided',
      phone:        document.getElementById('phone')?.value || 'Not provided',
      budget:       document.getElementById('budget')?.value || 'Not specified',
      service_type: document.getElementById('service')?.value || 'Not specified',
      message:      document.getElementById('message')?.value || 'No message',
      reply_to:     document.getElementById('email')?.value,
    }, EMAILJS_PUBLIC_KEY);

    contactForm.reset();
    submitBtn.style.display = 'none';
    successBox?.classList.add('show');
  } catch (err) {
    console.error(err);
    submitBtn.textContent = 'Failed — Try Again';
    submitBtn.disabled = false;
  }
});

/* ── Razorpay Payment ── */
window.initRazorpayPayment = function({ amount, name, description, prefill = {} }) {
  /* amount in rupees — will convert to paise */
  const options = {
    key: RAZORPAY_KEY_ID,
    amount: amount * 100,
    currency: 'INR',
    name: 'Vishal Kumar',
    description: description || 'Web Development Service',
    image: 'assets/images/logo.png',
    prefill: {
      name:    prefill.name  || '',
      email:   prefill.email || '',
      contact: prefill.phone || '',
    },
    theme: { color: '#7c5cff' },
    handler: function(response) {
      /* Payment Success */
      document.getElementById('payment-success-box')?.classList.add('show');
      document.getElementById('payment-id-display')
        && (document.getElementById('payment-id-display').textContent = response.razorpay_payment_id);

      /* Send confirmation email */
      emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        from_name:  prefill.name  || 'Client',
        from_email: prefill.email || '',
        phone:      prefill.phone || '',
        message:    `Payment Successful! ID: ${response.razorpay_payment_id} | Amount: ₹${amount}`,
      }, EMAILJS_PUBLIC_KEY);
    },
  };
  const rzp = new Razorpay(options);
  rzp.open();
};
