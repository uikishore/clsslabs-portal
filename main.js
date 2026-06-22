/* ════════════════ SIGNAL · interaction layer ════════════════ */
(function(){
'use strict';
var reduceMotion=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
var isTouch=window.matchMedia('(hover:none),(pointer:coarse)').matches;
var smoothEnabled=!reduceMotion&&!isTouch;

/* ── custom cursor (pointer devices only) ── */
(function(){
  var C=document.getElementById('cur'),R=document.getElementById('ring');
  if(!C||!R||isTouch){if(C)C.style.display='none';if(R)R.style.display='none';return;}
  var mx=innerWidth/2,my=innerHeight/2,rx=mx,ry=my;
  addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY;C.style.left=mx+'px';C.style.top=my+'px';});
  (function loop(){rx+=(mx-rx)*.16;ry+=(my-ry)*.16;R.style.left=rx+'px';R.style.top=ry+'px';requestAnimationFrame(loop);})();
  var hot='a,button,.click,.ptile,.svc-row,.indp,input,textarea,select,.tdot,.psp';
  document.addEventListener('mouseover',function(e){if(e.target.closest(hot))R.classList.add('big');});
  document.addEventListener('mouseout',function(e){if(e.target.closest(hot))R.classList.remove('big');});
})();

/* ── hero spectral waveform (canvas) ── */
(function(){
  var cv=document.getElementById('hwave');if(!cv)return;
  var cx=cv.getContext('2d'),W,H,t=0,dpr=Math.min(2,window.devicePixelRatio||1);
  function resize(){W=cv.offsetWidth;H=cv.offsetHeight;cv.width=W*dpr;cv.height=H*dpr;cx.setTransform(dpr,0,0,dpr,0,0);}
  resize();addEventListener('resize',resize);
  var stops=[[79,70,229],[124,92,255],[200,75,224],[255,122,138]];
  function col(p){var i=Math.min(stops.length-2,Math.floor(p*(stops.length-1))),f=p*(stops.length-1)-i,a=stops[i],b=stops[i+1];return'rgb('+Math.round(a[0]+(b[0]-a[0])*f)+','+Math.round(a[1]+(b[1]-a[1])*f)+','+Math.round(a[2]+(b[2]-a[2])*f)+')';}
  function draw(){
    cx.clearRect(0,0,W,H);
    for(var L=0;L<3;L++){
      cx.beginPath();
      var amp=H*(0.16-L*0.035),mid=H*0.55+L*4,k=0.018+L*0.004,ph=t*(1+L*0.35);
      for(var x=0;x<=W;x+=4){
        var y=mid+Math.sin(x*k+ph)*amp*Math.sin(x*0.004+t*0.4)+Math.sin(x*k*2.3+ph*1.4)*amp*0.3;
        x===0?cx.moveTo(x,y):cx.lineTo(x,y);
      }
      var g=cx.createLinearGradient(0,0,W,0);g.addColorStop(0,'rgba(79,70,229,0)');g.addColorStop(.5,col(L/3+.2));g.addColorStop(1,'rgba(255,122,138,0)');
      cx.strokeStyle=g;cx.lineWidth=2-L*0.5;cx.globalAlpha=0.85-L*0.22;cx.stroke();
    }
    cx.globalAlpha=1;t+=reduceMotion?0:0.022;
    if(!reduceMotion)requestAnimationFrame(draw);else{} 
  }
  draw();
})();

/* ── nav shadow + scroll progress + parallax ── */
var nav=document.getElementById('nav'),prog=document.getElementById('prog'),toTop=document.getElementById('toTop');
function setNav(y){if(nav)nav.classList.toggle('sc',y>24);document.documentElement.style.setProperty('--navH',y>24?'60px':'70px');if(toTop)toTop.classList.toggle('show',y>360);if(typeof revealScan==='function')revealScan();}
if(toTop)toTop.addEventListener('click',function(){if(typeof ssTo==='function'){ssTo(0);}else{scrollTo({top:0,behavior:'smooth'});}});
function updateParallax(){
  if(prog){var mx=Math.max(1,document.documentElement.scrollHeight-innerHeight);prog.style.width=(Math.min(1,scrollY/mx)*100).toFixed(2)+'%';}
  var vh=innerHeight;
  var els=document.querySelectorAll('.prx');
  for(var i=0;i<els.length;i++){
    var el=els[i];if(el.offsetParent===null)continue;
    var r=el.getBoundingClientRect();if(r.bottom<-260||r.top>vh+260)continue;
    var sp=parseFloat(el.dataset.prx||'0.1');
    var off=(r.top+r.height/2-vh/2)*-sp;
    el.style.transform='translate3d(0,'+off.toFixed(2)+'px,0)';
  }
  if(window.updateSapScroll)window.updateSapScroll();
}

/* ── momentum smooth-scroll (keeps real scrollY so sticky works) ── */
var SS={target:scrollY,current:scrollY,running:false,ease:0.11};
function maxScroll(){return Math.max(0,document.documentElement.scrollHeight-innerHeight);}
function ssLoop(){
  SS.current+=(SS.target-SS.current)*SS.ease;
  if(Math.abs(SS.target-SS.current)<0.4){SS.current=SS.target;SS.running=false;scrollTo(0,SS.current);setNav(SS.current);updateParallax();return;}
  scrollTo(0,SS.current);setNav(SS.current);updateParallax();requestAnimationFrame(ssLoop);
}
function ssStart(){if(!SS.running){SS.running=true;SS.current=scrollY;requestAnimationFrame(ssLoop);}}
function ssTo(y,instant){y=Math.max(0,Math.min(y,maxScroll()));if(instant){SS.target=SS.current=y;scrollTo(0,y);setNav(y);updateParallax();return;}SS.target=y;ssStart();}
if(smoothEnabled){
  addEventListener('wheel',function(e){if(e.ctrlKey)return;e.preventDefault();SS.target=Math.max(0,Math.min(SS.target+e.deltaY,maxScroll()));ssStart();},{passive:false});
  addEventListener('scroll',function(){if(!SS.running){SS.target=SS.current=scrollY;setNav(scrollY);updateParallax();}},{passive:true});
}else{
  addEventListener('scroll',function(){setNav(scrollY);updateParallax();},{passive:true});
}
addEventListener('resize',updateParallax);
updateParallax();setNav(scrollY);

/* ── scroll reveals (scoped to active page, scan-based) ── */
function rvScope(){return document;}
function revealAll(){rvScope().querySelectorAll('.rv:not(.on)').forEach(function(el){el.classList.add('on');});}
function revealScan(){var vh=window.innerHeight||document.documentElement.clientHeight;rvScope().querySelectorAll('.rv:not(.on)').forEach(function(el){var r=el.getBoundingClientRect();if(r.top<vh*0.88&&r.bottom>-40){el.classList.add('on');}});}
function initRv(){revealScan();requestAnimationFrame(revealScan);}
initRv();
/* safety net: never leave content hidden if scroll/observer misbehaves (e.g. inside a non-scrolling frame) */
setTimeout(revealAll,2600);

/* ════ SAP "Full-Cycle Excellence" — scroll-linked sticky card storytelling ════ */
(function(){
  var stack=document.getElementById('sapSticky');
  if(!stack)return;
  var panels=[].slice.call(stack.querySelectorAll('.sap-panel'));
  var cards=panels.map(function(p){return p.querySelector('.sap-card-xl');});
  var N=panels.length;
  function clamp(v,a,b){return v<a?a:(v>b?b:v);}
  function lerp(a,b,t){return a+(b-a)*t;}
  function smooth(t){return t*t*(3-2*t);}
  var desktop=function(){return window.matchMedia('(min-width:861px)').matches;};
  var enabled=!reduceMotion&&!isTouch&&desktop();
  function reset(){cards.forEach(function(c){if(!c)return;c.style.transform='';c.style.opacity='';c.style.filter='';c.style.boxShadow='';c.classList.remove('is-hero');});}
  window.updateSapScroll=function(){
    if(!stack.offsetParent){return;}            /* page hidden */
    if(!enabled){reset();return;}
    var vh=innerHeight;
    for(var i=0;i<N;i++){
      var c=cards[i];if(!c)continue;
      var top=panels[i].getBoundingClientRect().top;
      var arrive=smooth(clamp(1-top/vh,0,1));    /* how far THIS card has risen into place */
      var cover=0;                                /* how far the NEXT card covers this one */
      if(i<N-1){cover=smooth(clamp(1-panels[i+1].getBoundingClientRect().top/vh,0,1));}
      var ty=lerp(46,0,arrive);                  /* settle up as it arrives */
      var sc=lerp(1,0.915,cover);                /* recede behind the next card */
      var op=lerp(0.5,1,arrive)*lerp(1,0.42,cover);
      var bl=lerp(0,4.5,cover);
      c.style.transform='translateY('+ty.toFixed(2)+'px) scale('+sc.toFixed(4)+')';
      c.style.opacity=op.toFixed(3);
      c.style.filter=bl<0.05?'none':'blur('+bl.toFixed(2)+'px)';
      /* elevated shadow grows as it arrives, plus a soft spectral focus glow on the hero */
      var foc=arrive*(1-cover);
      c.style.boxShadow='0 '+(10+foc*34).toFixed(0)+'px '+(34+foc*54).toFixed(0)+'px -'+(16+foc*4).toFixed(0)+'px rgba(21,23,58,'+(0.06+foc*0.16).toFixed(3)+'),0 0 '+(foc*48).toFixed(0)+'px rgba(79,70,229,'+(foc*0.16).toFixed(3)+')';
      c.classList.toggle('is-hero',arrive>0.75&&cover<0.3);
    }
  };
  function setup(){enabled=!reduceMotion&&!isTouch&&desktop();stack.classList.toggle('stackable',enabled);if(!enabled)reset();window.updateSapScroll();}
  setup();
  addEventListener('resize',setup);
})();


/* ── counters ── */
function initCnt(){
  var io=new IntersectionObserver(function(es){es.forEach(function(e){
    if(e.isIntersecting){
      var n=parseInt(e.target.dataset.n)||0,step=n/(1600/16),c=0;
      var t=setInterval(function(){c=Math.min(c+step,n);e.target.textContent=Math.floor(c);if(c>=n)clearInterval(t);},16);
      io.unobserve(e.target);
    }
  });},{threshold:.5});
  document.querySelectorAll('.cnt:not([data-done])').forEach(function(el){el.dataset.done=1;io.observe(el);});
}
initCnt();

/* ── hero headline line-reveal on load ── */
addEventListener('load',function(){var h=document.getElementById('htit');if(h)setTimeout(function(){h.classList.add('on');},120);});
setTimeout(function(){var h=document.getElementById('htit');if(h)h.classList.add('on');},700);

/* ── magnetic primary buttons ── */
if(!isTouch){
  document.querySelectorAll('.bp,.bw,.bgo').forEach(function(b){
    b.addEventListener('mousemove',function(e){var r=b.getBoundingClientRect();b.style.transform='translate('+((e.clientX-r.left-r.width/2)*0.18).toFixed(1)+'px,'+((e.clientY-r.top-r.height/2)*0.22).toFixed(1)+'px)';});
    b.addEventListener('mouseleave',function(){b.style.transform='';});
  });
}

/* ── testimonial rotator ── */
(function(){
  var data=[
    {t:"The innovative solutions and dedicated support from CLSS Labs have enhanced our operational efficiency, improved stakeholder engagement and streamlined processes across our departments. We highly recommend CLSS Labs for their exceptional IT consulting services.",a:"A",n:"Anandavel",r:"GM — System Intelligence & Solutions, Hatsun Agro"},
    {t:"Roca India has been associated with CLSS for SAP, Java and other in-house application development and support. Their expertise in SAP and application development has led to seamless integration and improved efficiency, with unwavering support throughout.",a:"J",n:"Jayasankar",r:"Head of IT, Roca India"},
    {t:"The vendor collaboration platform has revolutionized our invoice accounting by integrating vendors, showrooms, the corporate order department and accounts into one platform. It offers complete transparency and timely input-credit reconciliation, making our financial operations more efficient and accurate.",a:"Y",n:"Yadindra",r:"Vice President — Finance"},
    {t:"The product is efficient and enabled MCIE to file our GSTR returns — both GSTR1 and GSTR2 — on time, and has helped us reduce errors through tight integration with SAP.",a:"UN",n:"Urmila Naik",r:"Mahindra CIE"},
    {t:"We've had great experiences with CLSS. They have exceptional domain and technical expertise, and their projects are always successful. Their innovative products have improved our processes significantly — we highly recommend them.",a:"V",n:"Vasudevan",r:"Vice President — IT"}
  ];
  var txt=document.getElementById('ttxt'),av=document.getElementById('tav'),nm=document.getElementById('tan'),rl=document.getElementById('tar'),nav=document.getElementById('tnav');
  if(!txt||!nav)return;
  nav.innerHTML=data.map(function(_,i){return'<button class="tdot'+(i===0?' on':'')+'" data-i="'+i+'" aria-label="Testimonial '+(i+1)+'"></button>';}).join('');
  var cur=0,timer;
  function show(i){
    cur=i;var d=data[i];var body=txt.closest('.tqbody')||txt.parentNode;
    body.style.opacity=0;body.style.transform='translateY(8px)';
    setTimeout(function(){txt.textContent=d.t;av.textContent=d.a;nm.textContent=d.n;rl.textContent=d.r;body.style.opacity=1;body.style.transform='none';},260);
    nav.querySelectorAll('.tdot').forEach(function(b,bi){b.classList.toggle('on',bi===i);});
  }
  var body=txt.closest('.tqbody')||txt.parentNode;body.style.transition='opacity .42s ease,transform .42s ease';
  nav.querySelectorAll('.tdot').forEach(function(b){b.addEventListener('click',function(){show(+b.dataset.i);restart();});});
  function next(){show((cur+1)%data.length);}
  function restart(){clearInterval(timer);if(!reduceMotion)timer=setInterval(next,6500);}
  restart();
})();

/* ════════════════ MPA navigation bootstrap ════════════════ */
/* psnav rail rendering — derives the current page id from the URL, picks
   the matching family (products / services / industries) and writes peer
   links straight into #psnav. No SPA routing, no view transitions. */
var navData = {
  products:   [['emsis','EMSIS'],['gst','GCS'],['evc','Vendor Collaboration']],
  services:   [['sap','SAP Applications'],['ent','Enterprise Apps'],['web','Web Dev'],['mob','Mobile Apps'],['bi','Business Intelligence'],['portal','Portal Solutions']],
  industries: [['i-media','Media & Broadcast'],['i-mfg','Manufacturing'],['i-dairy','Dairy & Agro'],['i-jwl','Jewellery']]
};
var pageType = {
  evc:'products', emsis:'products', radio:'products', fms:'products', gst:'products', eway:'products', dms:'products',
  sap:'services', ent:'services', web:'services', mob:'services', bi:'services', portal:'services',
  'i-media':'industries','i-mfg':'industries','i-dairy':'industries','i-jwl':'industries'
};
function currentPageId(){
  var p = (location.pathname || '').split('/').pop() || 'index.html';
  if (!p || p === '' || p === 'index.html') return 'home';
  return p.replace(/\.html$/i,'');
}
function hrefFor(id){ return id === 'home' ? 'index.html' : id + '.html'; }
function renderPsnav(){
  var el = document.getElementById('psnav');
  var wrap = document.getElementById('psn');
  if (!el) return;
  var act = currentPageId();
  var type = pageType[act];
  if (!type) { if (wrap) wrap.style.display = 'none'; el.innerHTML=''; return; }
  if (wrap) wrap.style.display = '';
  var rows = navData[type] || [];
  el.innerHTML = rows.map(function(r){
    var id = r[0], name = r[1];
    return '<a class="psp' + (id===act?' on':'') + '" href="' + hrefFor(id) + '">' + name + '</a>';
  }).join('');
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderPsnav);
} else {
  renderPsnav();
}
/* ── industries pinned parallax ── */
(function(){
  var stage=document.getElementById('indxStage'),track=document.getElementById('indxTrack');
  if(!stage||!track)return;
  var maxX=0,dist=0;
  function navH(){return parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--navH'))||70;}
  function isMobile(){return window.innerWidth<=820;}
  function measure(){
    if(isMobile()){stage.classList.add('no-pin');stage.style.height='';track.style.transform='';for(var m=0;m<track.children.length;m++){track.children[m].style.opacity='';var mi=track.children[m].querySelector('.indx-img');if(mi)mi.style.transform='';}return;}
    stage.classList.remove('no-pin');
    var pinH=window.innerHeight-navH();
    var vw=track.parentElement.clientWidth;
    maxX=Math.max(0,track.scrollWidth-vw);
    dist=maxX;
    stage.style.height=(pinH+dist)+'px';
  }
  function frame(){
    if(isMobile()||!stage.offsetParent)return;
    var rect=stage.getBoundingClientRect();
    var p=dist>0?Math.min(1,Math.max(0,(navH()-rect.top)/dist)):0;
    track.style.transform='translate3d('+(-p*maxX).toFixed(2)+'px,0,0)';
    var cx=window.innerWidth/2,kids=track.children;
    for(var i=0;i<kids.length;i++){var c=kids[i],r=c.getBoundingClientRect(),ctr=r.left+r.width/2,dz=(ctr-cx)/window.innerWidth;var im=c.querySelector('.indx-img');if(im)im.style.transform='translateX('+(dz*-50).toFixed(2)+'px) scale(1.14)';c.style.opacity=(1-Math.min(Math.abs(dz),0.62)*0.5).toFixed(3);}
    var bar=document.getElementById('indxBar');if(bar)bar.style.width=(p*100).toFixed(1)+'%';
  }
  var ticking=false;function onScroll(){if(!ticking){ticking=true;requestAnimationFrame(function(){frame();ticking=false;});}}
  window.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('resize',function(){measure();frame();});
  window.__indxSync=function(){measure();frame();};
  setTimeout(function(){measure();frame();},250);
  window.addEventListener('load',function(){measure();frame();});
})();
/* ── policy TOC scroll-spy ── */
(function(){
  var ctx=null;
  function setup(){var toc=document.querySelector('.lgl-toc');if(!toc)return null;var links=[].slice.call(toc.querySelectorAll('a'));var secs=links.map(function(a){var id=a.getAttribute('href');return id?document.querySelector(id):null;});return {links:links,secs:secs};}
  function spy(){if(!ctx)ctx=setup();if(!ctx)return;var navH=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--navH'))||70;var line=navH+130,cur=0;for(var i=0;i<ctx.secs.length;i++){var sc=ctx.secs[i];if(sc&&sc.getBoundingClientRect().top<=line)cur=i;}ctx.links.forEach(function(a,i){a.classList.toggle('active',i===cur);});}
  var t=false;function req(){if(!t){t=true;requestAnimationFrame(function(){spy();t=false;});}}
  window.addEventListener('scroll',req,{passive:true});
  window.addEventListener('resize',req);
  window.__spySync=function(){ctx=setup();spy();};
  setTimeout(function(){window.__spySync();},300);
})();

/* ── sliding "spotlight" nav indicator ── */
(function(){
  var bar=document.querySelector('.nlinks');if(!bar)return;
  var spot=document.createElement('span');spot.className='nav-spot';bar.insertBefore(spot,bar.firstChild);
  function move(el){var b=bar.getBoundingClientRect(),r=el.getBoundingClientRect();spot.style.width=r.width+'px';spot.style.height=r.height+'px';spot.style.transform='translate('+(r.left-b.left)+'px,'+(r.top-b.top)+'px)';spot.style.opacity='1';}
  bar.querySelectorAll('.na').forEach(function(el){
    el.addEventListener('mouseenter',function(){move(el);});
    el.addEventListener('focus',function(){move(el);});
  });
  bar.addEventListener('mouseleave',function(){spot.style.opacity='0';});
})();

/* ── mobile drawer ── */
var drawer=document.getElementById('drawer'),burger=document.getElementById('burger');
function closeDrawer(){if(drawer){drawer.classList.remove('open');drawer.querySelectorAll('.dw-sec,.dw-a').forEach(function(el){el.style.transitionDelay='0s';});}if(burger)burger.classList.remove('x');document.body.style.overflow='';}
window.closeDrawer=closeDrawer;
if(burger&&drawer){
  burger.addEventListener('click',function(){var o=drawer.classList.toggle('open');burger.classList.toggle('x',o);document.body.style.overflow=o?'hidden':'';drawer.querySelectorAll('.dw-sec,.dw-a').forEach(function(el,i){el.style.transitionDelay=o?(0.045*i+0.08).toFixed(3)+'s':'0s';});});
  drawer.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){setTimeout(closeDrawer,80);});});
}

/* ── form → mailto ── */
var MAIL_TO='sales@clsslabs.com';
function fval(id){var el=document.getElementById(id);return el?el.value.trim():'';}
function validEmail(e){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);}
function flashErr(b,msg){var o=b.dataset.label||b.textContent;b.dataset.label=o;b.textContent=msg;b.classList.remove('ok');b.classList.add('err');setTimeout(function(){b.textContent=o;b.classList.remove('err');},2400);}
function buildMail(subject,fields){var body='';fields.forEach(function(f){body+=f[0]+': '+(f[1]||'—')+'\n';});body+='\n— Sent from clsslabs.com';return'mailto:'+MAIL_TO+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);}
function sent(b,label){b.textContent='✓ Opening your email app…';b.classList.add('ok');setTimeout(function(){b.textContent=label;b.classList.remove('ok');},4500);}
window.doSub=function(){
  var b=document.getElementById('fsub');if(!b)return;
  var first=fval('cf_first'),last=fval('cf_last'),email=fval('cf_email');
  if(!first||!last){flashErr(b,'Please add your name');return;}
  if(!validEmail(email)){flashErr(b,'Please add a valid email');return;}
  window.location.href=buildMail('New enquiry — '+first+' '+last,[['Name',first+' '+last],['Email',email],['Company',fval('cf_company')],['Phone',fval('cf_phone')],['Area of Interest',fval('cf_interest')],['Message',fval('cf_message')]]);
  sent(b,'Send Message →');
};
window.doSubEVC=function(){
  var b=document.getElementById('fsubEVC');if(!b)return;
  var name=fval('evc_name'),company=fval('evc_company'),email=fval('evc_email');
  if(!name){flashErr(b,'Please add your name');return;}
  if(!company){flashErr(b,'Please add your company');return;}
  if(!validEmail(email)){flashErr(b,'Please add a valid email');return;}
  window.location.href=buildMail('Demo request — '+company+' ('+name+')',[['Name',name],['Company',company],['Work Email',email],['Phone',fval('evc_phone')],['Interest','Business Partner Portal — demo'],['Notes',fval('evc_message')]]);
  sent(b,'Request a Demo →');
};

/* ── anchor smooth-scroll ── */
document.querySelectorAll('a[href^="#"]:not([onclick])').forEach(function(a){a.addEventListener('click',function(e){var sel=a.getAttribute('href');if(sel==='#'||sel.length<2)return;var t=document.querySelector(sel);if(t){e.preventDefault();var y=t.getBoundingClientRect().top+scrollY-86;if(smoothEnabled){ssTo(y);}else{scrollTo({top:y,behavior:'smooth'});}}});});

})();
