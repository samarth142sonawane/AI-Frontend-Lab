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
  const storedTheme = localStorage.getItem('nexus-theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme:light)').matches ? 'light' : 'dark');
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
    if(t==='light') root.setAttribute('data-theme','light'); else root.removeAttribute('data-theme');
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
  const numObservers=new IntersectionObserver((entries,observer)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const targets=entry.target.querySelectorAll('[data-target], .metric-value, .impact-value');
        targets.forEach(el=>animateNumber(el));
        observer.unobserve(entry.target);
      }
    });
  }, {threshold:0.25});

  document.querySelectorAll('.metrics, .impact').forEach(section=>numObservers.observe(section));

  function animateNumber(el){
    const parent=el.closest('[data-target]') || el.parentElement;
    let target=el.dataset.target || parent.dataset.target;
    if(!target) return;
    const fixed=el.dataset.fixed || parent.dataset.fixed || 0;
    const decimals = el.dataset.decimals || 0;
    // normalize special cases like percentages
    let start=0; let end=parseFloat(target);
    const duration=1400; const startTime=performance.now();
    function step(t){
      const p=Math.min(1,(t-startTime)/duration);
      const eased=1 - Math.pow(1-p,3);
      let value = start + (end-start)*eased;
      if(fixed>0) value = value.toFixed(fixed);
      else if(decimals>0) value = (value/100).toFixed(1);
      else value = Math.floor(value).toLocaleString();
      if(parent.classList.contains('metric')){
        if(parent.dataset.target && parent.dataset.target.length>4 && !fixed) el.textContent = Math.floor(value).toLocaleString();
        else if(parent.dataset.target && parent.dataset.target.includes('.') && !fixed) el.textContent = value + (parent.dataset.target.includes('%')? '%' : (parent.dataset.target.length<4? '' : ''));
        else el.textContent = (fixed? value + (parent.dataset.target.includes('%')? '%' : '') : value);
      } else if(el.classList.contains('impact-value')){
        el.textContent = fixed? value + (parent.dataset.target.includes('%')? '%' : '') : Math.floor(end*(p)).toLocaleString();
      } else {
        el.textContent = fixed? value + (parent.dataset.target.includes('%')? '%' : '') : Math.floor(end*p).toLocaleString();
      }
      if(p<1) requestAnimationFrame(step);
      else {
        if(fixed) el.textContent = end + (parent.dataset.target.includes('.')? (parent.dataset.target.includes('%')? '%' : '') : '');
        else el.textContent = (end>=1000? Math.floor(end).toLocaleString() : end.toString());
      }
    }
    requestAnimationFrame(step);
  }

  // Contact form simple handler
  const contactForm=document.getElementById('contactForm');
  contactForm.addEventListener('submit',e=>{
    e.preventDefault();
    const btn=contactForm.querySelector('button');
    btn.textContent='Sending...';
    setTimeout(()=>{btn.textContent='Send Message'; contactForm.reset(); alert('Message sent — thank you!');}, 900);
  });

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
