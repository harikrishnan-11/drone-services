const $      = (s,r=document)=>r.querySelector(s),                    $$  = (s,r=document)=>[...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches, nav = $('.nav'), menu = $('.menu');
  // nav: sticky, hide on scroll down, burger, active link
let ly = 0;
addEventListener('scroll',()=>{const y=scrollY;nav.classList.toggle('stuck',y>40);nav.classList.toggle('hide',y>ly&&y>300&&!menu.classList.contains('show'));ly=y},{passive:true});
$    ('.burger').onclick = ()=>menu.classList.toggle('show');
const here               = location.pathname.split('/').pop()||'index.html';
$$('.menu a').forEach(a=>{a.addEventListener('click',()=>menu.classList.remove('show'));if(a.getAttribute('href').slice(2)===here)a.classList.add('act')});
  // heading underline, scroll reveal, bars, counters
const once = (sel,fn,o={threshold:.2})=>{const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){io.unobserve(e.target);fn(e.target)}}),o);$$(sel).forEach(el=>io.observe(el))};
once('h2',h=>h.classList.add('h-in'),{threshold:.3});
once('.bar',b=>b.querySelector('i').style.width=b.dataset.v+'%',{threshold:.5});
once('.sgrid b[data-c]',b=>{const to=+b.dataset.c,s=b.dataset.s||'',t0=performance.now();(function f(t){const p=reduce?1:Math.min((t-t0)/1600,1);b.textContent=Math.round(to*(1-Math.pow(1-p,3))).toLocaleString('en-US')+s;if(p<1)requestAnimationFrame(f)})(t0)},{threshold:.8});
if(!reduce)$$('.card,.plan,.post,.ci,.panel,.two>div,.q,.tl-item,.sgrid>div,.eyebrow,.chips2,.form .f').forEach(el=>{
  el.classList.add('rv');el.style.setProperty('--d',[...el.parentElement.children].indexOf(el)%4*.1+'s');
  once('.rv',e=>{e.classList.add('in');setTimeout(()=>e.classList.remove('rv','in'),1300)},{threshold:.12});
});
  // timeline dots
$$('.tl-item').forEach(i=>i.classList.add('on'));
  // FAQ accordion
$$('.q button').forEach(b=>b.onclick=()=>{const q=b.parentElement,was=q.classList.contains('open');$$('.q').forEach(x=>x.classList.remove('open'));if(!was)q.classList.add('open')});
  // blog filter
$$('.chips2 button').forEach(b=>b.onclick=()=>{$$('.chips2 button').forEach(x=>x.classList.toggle('on',x===b));$$('.post').forEach(p=>p.classList.toggle('off',b.dataset.c!=='all'&&p.dataset.c!==b.dataset.c))});
  // password toggle
$$('.pw button').forEach(b=>b.onclick=()=>{const i=b.previousElementSibling,s=i.type==='password';i.type=s?'text':'password';b.innerHTML=`<i class="fa-solid fa-eye${s?'-slash':''}"></i>`});
  // form validation
const rules = {name:v=>/^[A-Za-z][A-Za-z .'-]{1,}$/.test(v),email:v=>/^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(v),pass:v=>v.length>=8,msg:v=>v.trim().length>=10,sel:v=>!!v};
$$('form[data-f]').forEach(f=>{
  const bad = (el,on)=>el.closest('.f').classList.toggle('err',on);
  f.addEventListener('submit',e=>{e.preventDefault();let ok=true;
    $$('[data-r]',f).forEach(el=>{let g=rules[el.dataset.r](el.value);if(el.dataset.r==='pass'&&el.dataset.m)g=g&&el.value===$(el.dataset.m,f).value;bad(el,!g);ok=ok&&g});
    const t = $('input[type=checkbox][required]',f);if(t&&!t.checked)ok = false;
    if(ok){$('.ok',f).classList.add('show');f.reset();setTimeout(()=>$('.ok',f).classList.remove('show'),4000)}});
  $$('[data-r]',f).forEach(el=>el.addEventListener('input',()=>el.closest('.f').classList.remove('err')));
});
$$('.news').forEach(n=>n.onsubmit=e=>{e.preventDefault();n.reset();alert('Thanks for subscribing!')});