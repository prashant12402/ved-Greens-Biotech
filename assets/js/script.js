// Mobile nav toggle + contact form handling (robust, multi-page friendly)

document.addEventListener('DOMContentLoaded', function () {
	// Mobile nav toggle
	const nav = document.getElementById('mainNav');
	const toggle = document.getElementById('navToggle');

	if (toggle) {
		toggle.addEventListener('click', function () {
			if (!nav) return;
			nav.classList.toggle('open');
			toggle.setAttribute('aria-expanded', nav.classList.contains('open'));
		});
	}

	// Close nav when clicking outside (mobile)
	document.addEventListener('click', function (e) {
		if (!nav || !nav.classList.contains('open')) return;
		const outside = !e.target.closest('.nav') && !e.target.closest('.nav-toggle');
		if (outside) {
			nav.classList.remove('open');
			toggle && toggle.setAttribute('aria-expanded', 'false');
		}
	});

	// Contact form handling (basic client-side feedback)
	const form = document.getElementById('contactForm');
	const msg = document.getElementById('formMsg');

	if (form && msg) {
		form.addEventListener('submit', function (e) {
			e.preventDefault();

			const name = (form.elements['name'] || {}).value || '';
			const email = (form.elements['email'] || {}).value || '';

			if (!name.trim() || !email.trim()) {
				msg.style.color = 'crimson';
				msg.textContent = 'Please provide name and email.';
				return;
			}

			msg.style.color = '';
			msg.textContent = 'Sending...';

			// Replace with real fetch() POST to your server endpoint
			setTimeout(function () {
				msg.style.color = 'green';
				msg.textContent = 'Thank you! Your enquiry has been received. We will contact you shortly.';
				form.reset();
			}, 700);
		});
	}
});
