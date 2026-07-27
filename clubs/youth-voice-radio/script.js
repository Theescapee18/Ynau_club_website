(function(){
  'use strict';

  var header=document.getElementById('siteHeader');
  var menuButton=document.getElementById('mobileMenuBtn');
  var mobileNav=document.getElementById('mobileNav');
  var backToTop=document.getElementById('backToTop');
  var reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function updatePageChrome(){
    header.classList.toggle('scrolled',window.scrollY>12);
    backToTop.classList.toggle('visible',window.scrollY>window.innerHeight*.65);
  }

  function closeMobileMenu(){
    menuButton.classList.remove('active');
    mobileNav.classList.remove('open');
    menuButton.setAttribute('aria-expanded','false');
    menuButton.setAttribute('aria-label','打开导航菜单');
  }

  updatePageChrome();
  window.addEventListener('scroll',updatePageChrome,{passive:true});

  menuButton.addEventListener('click',function(){
    var open=menuButton.getAttribute('aria-expanded')==='true';
    menuButton.classList.toggle('active',!open);
    mobileNav.classList.toggle('open',!open);
    menuButton.setAttribute('aria-expanded',String(!open));
    menuButton.setAttribute('aria-label',open?'打开导航菜单':'关闭导航菜单');
  });

  mobileNav.querySelectorAll('a').forEach(function(link){link.addEventListener('click',closeMobileMenu)});
  backToTop.addEventListener('click',function(){window.scrollTo({top:0,behavior:reduceMotion?'auto':'smooth'})});

  var revealItems=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window&&!reduceMotion){
    var revealObserver=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){entry.target.classList.add('visible');revealObserver.unobserve(entry.target)}
      });
    },{threshold:.08,rootMargin:'0px 0px -28px'});
    revealItems.forEach(function(item){revealObserver.observe(item)});
  }else{revealItems.forEach(function(item){item.classList.add('visible')})}

  var sections=document.querySelectorAll('main section[id]');
  var navLinks=document.querySelectorAll('.desktop-nav a');
  if('IntersectionObserver' in window){
    var navObserver=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){navLinks.forEach(function(link){link.classList.toggle('active',link.getAttribute('href')==='#'+entry.target.id)})}
      });
    },{rootMargin:'-35% 0px -55%'});
    sections.forEach(function(section){navObserver.observe(section)});
  }

  var lightbox=document.getElementById('lightbox');
  var lightboxImage=document.getElementById('lightboxImage');
  var lightboxCaption=document.getElementById('lightboxCaption');
  var closeButton=lightbox.querySelector('.lightbox-close');
  var previousFocus=null;

  function openLightbox(item){
    var image=item.querySelector('img');
    previousFocus=item;
    lightboxImage.src=image.src;
    lightboxImage.alt=image.alt;
    lightboxCaption.textContent=item.dataset.caption||'';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden','false');
    document.body.classList.add('modal-open');
    closeButton.focus();
  }

  function closeLightbox(){
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden','true');
    lightboxImage.src='';
    document.body.classList.remove('modal-open');
    if(previousFocus)previousFocus.focus();
  }

  document.querySelectorAll('.gallery-item,.honor-card').forEach(function(item){item.addEventListener('click',function(){openLightbox(item)})});
  closeButton.addEventListener('click',closeLightbox);
  lightbox.addEventListener('click',function(event){if(event.target===lightbox)closeLightbox()});
  document.addEventListener('keydown',function(event){if(event.key==='Escape'&&lightbox.classList.contains('open'))closeLightbox()});
})();
