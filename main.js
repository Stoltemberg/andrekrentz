/* ============ Mobile nav toggle ============ */
const toggle = document.querySelector('.nav__toggle');
const menu = document.querySelector('.nav__menu');
toggle.addEventListener('click', () => {
  const expanded = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', !expanded);
  menu.classList.toggle('nav__menu--open');
  toggle.classList.toggle('nav__toggle--active');
});

document.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    menu.classList.remove('nav__menu--open');
    toggle.classList.remove('nav__toggle--active');
    toggle.setAttribute('aria-expanded', 'false');
  });
});

/* ============ FAQ accordion ============ */
document.querySelectorAll('.faq__question').forEach(btn => {
  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    document.querySelectorAll('.faq__question').forEach(other => {
      other.setAttribute('aria-expanded', 'false');
      other.parentElement.classList.remove('faq__item--open');
    });
    if (!expanded) {
      btn.setAttribute('aria-expanded', 'true');
      btn.parentElement.classList.add('faq__item--open');
    }
  });
});

/* ============ Smooth scroll (offset for fixed header) ============ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const headerH = document.querySelector('.header').offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ============ Header shrink on scroll ============ */
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
  header.classList.toggle('header--scrolled', window.scrollY > 50);
}, { passive: true });

/* ============ Back to Top ============ */
const backToTop=document.getElementById('backToTop');
if(backToTop){
  window.addEventListener('scroll',()=>{backToTop.classList.toggle('visible',window.scrollY>500)});
  backToTop.addEventListener('click',function(e){
    e.preventDefault();
    window.scrollTo({top:0,behavior:'smooth'});
  });
}

/* ============ Parallax hero photo ============ */
const heroPhoto=document.querySelector('.hero__photo');
if(heroPhoto){window.addEventListener('scroll',()=>{const s=window.scrollY;if(s<window.innerHeight){heroPhoto.style.transform=`translateY(${s*0.08}px)`;}},{passive:true});}

/* ============ IntersectionObserver — fade-in animations ============ */
const animEls = document.querySelectorAll('.animate-fade-up, .animate-fade-right, .animate-fade-left');
const animObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      animObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
animEls.forEach(el => animObserver.observe(el));

/* ============ Counter animation ============ */
const counters = document.querySelectorAll('.counter');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = +el.dataset.target;
      const suffix = el.closest('.sobre__highlight')?.querySelector('.sobre__highlight-label')?.textContent.includes('Taxa') ? '%' : '+';
      const duration = 1800;
      const start = performance.now();
      const animate = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);          // ease-out cubic
        el.textContent = Math.floor(eased * target) + (progress >= 1 ? suffix : '');
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
counters.forEach(c => counterObserver.observe(c));

/* ============ Form submission → WhatsApp ============ */
document.getElementById('contatoForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();
  const telefone = document.getElementById('telefone').value.trim();
  const assunto = document.getElementById('assunto');
  const assuntoText = assunto.options[assunto.selectedIndex].text;
  const mensagem = document.getElementById('mensagem').value.trim();

  let waMsg = `Olá! Gostaria de agendar uma consulta.\n\n`;
  waMsg += `*Nome:* ${nome}\n`;
  waMsg += `*E-mail:* ${email}\n`;
  waMsg += `*Telefone:* ${telefone}\n`;
  waMsg += `*Área:* ${assuntoText}\n`;
  waMsg += `*Mensagem:* ${mensagem}`;

  const waUrl = `https://wa.me/5551999422266?text=${encodeURIComponent(waMsg)}`;
  window.open(waUrl, '_blank', 'noopener,noreferrer');
});
