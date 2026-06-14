// Smooth scrolling handled via CSS; add interactions here
document.addEventListener('DOMContentLoaded',()=>{
  // Mobile nav toggle
  const mobileToggle=document.getElementById('mobileToggle');
  const navLinks=document.getElementById('navLinks');
  mobileToggle.addEventListener('click',()=>{
    navLinks.classList.toggle('open');
  });

  // Theme toggle (dark / light)
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;
  const storedTheme = localStorage.getItem('nexus-theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light');
  function updateToggleUI(){
    const sun = document.querySelector('.icon-sun');
    const moon = document.querySelector('.icon-moon');
    if(root.getAttribute('data-theme')==='light'){
      if(sun) sun.style.display='block';
      if(moon) moon.style.display='none';
    } else {
      if(sun) sun.style.display='none';
      if(moon) moon.style.display='block';
    }
  }
  function applyTheme(t){
    root.setAttribute('data-theme', t);
    localStorage.setItem('nexus-theme', t);
    updateToggleUI();
  }
  if(themeToggle){
    themeToggle.addEventListener('click', ()=>{
      const current = root.getAttribute('data-theme')==='light' ? 'dark' : 'light';
      applyTheme(current);
    });
  }
  // set initial theme
  applyTheme(storedTheme);

  // Small visual reveal for dashboard preview
  const preview = document.querySelector('.dashboard-screenshot');
  if(preview){
    preview.style.opacity = 0;
    preview.style.transform = 'translateY(8px) scale(0.995)';
    setTimeout(()=>{ preview.style.transition = 'opacity 700ms ease, transform 700ms ease'; preview.style.opacity=1; preview.style.transform='translateY(0) scale(1)'; }, 250);
  }

  // Navbar transparency on scroll
  const navbar=document.getElementById('navbar');
  window.addEventListener('scroll',()=>{
    if(window.scrollY>20) navbar.classList.add('scrolled'); else navbar.classList.remove('scrolled');
  });

  // Scroll reveal and active section highlighting
  const sections=document.querySelectorAll('main section');
  const navItems=document.querySelectorAll('.nav-link');

  const obsOptions={root:null,rootMargin:'0px',threshold:0.18};
  const sectionObserver=new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      const id=entry.target.id;
      if(entry.isIntersecting){
        entry.target.classList.add('show');
        // highlight nav
        navItems.forEach(a=>a.classList.toggle('active', a.getAttribute('href')===('#'+id)));
      }
    });
  }, obsOptions);
  sections.forEach(s=>{ s.classList.add('reveal'); sectionObserver.observe(s); });

  // Animated counters
  const counterTargets = document.querySelectorAll('[data-target]');
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const element = entry.target;
      const rawTarget = element.dataset.target;
      if (!rawTarget) return;
      const suffix = element.dataset.suffix || '';
      const target = parseFloat(rawTarget);
      const duration = 1400;
      const startTime = performance.now();

      function update(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        let value = target * eased;

        if (rawTarget.includes('.')) {
          value = value.toFixed(2);
        } else {
          value = Math.round(value).toLocaleString();
        }

        element.textContent = `${value}${suffix}`;
        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          element.textContent = `${rawTarget}${suffix}`;
        }
      }

      requestAnimationFrame(update);
      observer.unobserve(element);
    });
  }, { threshold: 0.25 });

  counterTargets.forEach(target => counterObserver.observe(target));

  const progressBars = document.querySelectorAll('.progress-fill[data-progress]');
  const progressObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const bar = entry.target;
      const value = bar.dataset.progress;
      bar.style.width = `${value}%`;
      bar.style.opacity = '1';
      observer.unobserve(bar);
    });
  }, { threshold: 0.2 });

  progressBars.forEach(bar => progressObserver.observe(bar));

  // Contact form simple handler
  const contactForm=document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit',e=>{
      e.preventDefault();
      const btn=contactForm.querySelector('button');
      btn.textContent='Sending...';
      setTimeout(()=>{btn.textContent='Send Message'; contactForm.reset(); alert('Message sent — thank you!');}, 900);
    });
  }

  // Smooth internal link behavior for better UX
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      const href=a.getAttribute('href');
      if(href.length>1){
        e.preventDefault();
        document.querySelector(href).scrollIntoView({behavior:'smooth',block:'start'});
        navLinks.classList.remove('open');
      }
    });
  });

});
