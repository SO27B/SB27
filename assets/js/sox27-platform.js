/* =========================================================
   SO X27 — AI Platform Interactions
========================================================= */
(function(){
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => Array.from(root.querySelectorAll(s));

  // Dynamic spotlight tracking for panels
  $$('.x27-panel, .x27-command-card, .x27-project-card, .x27-vision-card, .x27-terminal-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(2) + '%');
      card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(2) + '%');
    });
  });

  // AI Command Terminal
  const terminal = $('[data-x27-terminal]');
  const input = $('[data-x27-input]');
  const send = $('[data-x27-send]');
  const mic = $('[data-x27-mic]');

  const answers = {
    'status': [
      'SO X27 CORE STATUS: ONLINE',
      'Neural Systems: ACTIVE',
      'Industrial Vision: READY',
      'Automation Engine: RUNNING'
    ],
    'projects': [
      'Loading real project modules...',
      '01 — SO X27 Voice Assistant',
      '02 — Industrial Vision Keyence',
      '03 — Automation Agent & Task Queue',
      '04 — ROS2 / Robotics Systems'
    ],
    'vision': [
      'Industrial Vision module selected.',
      'Camera: Keyence IV4-600CA',
      'Tools: AI Search, OCR, Differentiation, OK/NOK logic',
      'Target: automated quality control on production line.'
    ],
    'about': [
      'Profile: Sofiane Badja',
      'Focus: Automation, Robotics, AI, Industrial Vision',
      'Identity: SO X27 — Intelligent Systems Engineer'
    ],
    'default': [
      'Command received.',
      'This is a web demo interface of SO X27.',
      'The real local assistant runs on Python with voice, planner, executor and automation modules.'
    ]
  };

  function addLine(text){
    if(!terminal) return;
    const div = document.createElement('div');
    div.textContent = text;
    terminal.appendChild(div);
    terminal.scrollTop = terminal.scrollHeight;
  }

  function runCommand(raw){
    const cmd = String(raw || '').trim();
    if(!cmd) return;
    addLine('USER: ' + cmd);

    const key =
      /status|état|etat|system|système|systeme/i.test(cmd) ? 'status' :
      /project|projet|module/i.test(cmd) ? 'projects' :
      /vision|keyence|camera|caméra|cofidur/i.test(cmd) ? 'vision' :
      /about|sofiane|profile|profil/i.test(cmd) ? 'about' :
      'default';

    let i = 0;
    const lines = answers[key];
    const timer = setInterval(() => {
      addLine('SO X27: ' + lines[i]);
      i++;
      if(i >= lines.length) clearInterval(timer);
    }, 230);
  }

  if(send && input){
    send.addEventListener('click', () => {
      runCommand(input.value);
      input.value = '';
    });
    input.addEventListener('keydown', e => {
      if(e.key === 'Enter'){
        runCommand(input.value);
        input.value = '';
      }
    });
  }

  $$('[data-x27-command]').forEach(btn => {
    btn.addEventListener('click', () => runCommand(btn.dataset.x27Command || btn.textContent));
  });

  // Browser speech recognition demo
  if(mic){
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if(!SR){
      mic.title = 'SpeechRecognition non supporté par ce navigateur';
    } else {
      const rec = new SR();
      rec.lang = 'fr-FR';
      rec.continuous = false;
      rec.interimResults = false;
      mic.addEventListener('click', () => {
        mic.classList.add('is-listening');
        addLine('SO X27: Listening...');
        rec.start();
      });
      rec.onresult = e => {
        const text = e.results[0][0].transcript;
        mic.classList.remove('is-listening');
        runCommand(text);
      };
      rec.onerror = () => {
        mic.classList.remove('is-listening');
        addLine('SO X27: Micro unavailable in this browser session.');
      };
      rec.onend = () => mic.classList.remove('is-listening');
    }
  }

  // Cinematic enter system overlay
  const enterBtn = $('[data-x27-enter]');
  let overlay = $('.x27-enter-system');
  if(enterBtn && !overlay){
    overlay = document.createElement('div');
    overlay.className = 'x27-enter-system';
    overlay.innerHTML = `
      <div class="x27-enter-card">
        <h2>SO X27</h2>
        <p>Initializing Intelligent Systems Interface...</p>
        <div class="x27-terminal-body" style="min-height:140px;text-align:left;margin-top:1rem">
          <div>Neural architecture online</div>
          <div>Industrial vision synchronized</div>
          <div>Automation command center ready</div>
          <div>Welcome to SO X27</div>
        </div>
      </div>`;
    document.body.appendChild(overlay);

    enterBtn.addEventListener('click', e => {
      e.preventDefault();
      overlay.classList.add('is-active');
      setTimeout(() => overlay.classList.remove('is-active'), 2600);
    });
  }

  // Neural core canvas 3D style
  const canvas = document.getElementById('sox27-neural-core');
  if(canvas){
    const ctx = canvas.getContext('2d');
    let w, h, dpr, nodes = [];
    let mx = innerWidth/2, my = innerHeight/2;

    addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

    function resize(){
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = canvas.width = Math.floor(innerWidth * dpr);
      h = canvas.height = Math.floor(innerHeight * dpr);
      canvas.style.width = innerWidth + 'px';
      canvas.style.height = innerHeight + 'px';

      const count = innerWidth < 760 ? 42 : 86;
      nodes = Array.from({length: count}, () => ({
        x: Math.random()*w,
        y: Math.random()*h,
        z: Math.random()*0.9 + 0.22,
        vx: (Math.random()-.5)*0.32*dpr,
        vy: (Math.random()-.5)*0.32*dpr,
        r: (Math.random()*1.8+1.2)*dpr,
        p: Math.random()*Math.PI*2
      }));
    }
    resize();
    addEventListener('resize', resize);

    function frame(){
      ctx.clearRect(0,0,w,h);
      const mouseX = mx*dpr, mouseY = my*dpr;
      for(const n of nodes){
        n.p += .014;
        n.x += n.vx + (mouseX - n.x)*0.000018*n.z;
        n.y += n.vy + (mouseY - n.y)*0.000018*n.z;
        if(n.x < -40) n.x = w+40; if(n.x > w+40) n.x = -40;
        if(n.y < -40) n.y = h+40; if(n.y > h+40) n.y = -40;
      }

      const max = (innerWidth < 760 ? 115 : 165)*dpr;
      for(let i=0;i<nodes.length;i++){
        for(let j=i+1;j<nodes.length;j++){
          const a=nodes[i], b=nodes[j];
          const dx=a.x-b.x, dy=a.y-b.y, dist=Math.hypot(dx,dy);
          if(dist < max){
            const alpha = (1-dist/max)*0.30;
            const g = ctx.createLinearGradient(a.x,a.y,b.x,b.y);
            g.addColorStop(0, `rgba(56,189,248,${alpha})`);
            g.addColorStop(.5, `rgba(250,204,21,${alpha*.55})`);
            g.addColorStop(1, `rgba(139,92,246,${alpha})`);
            ctx.strokeStyle = g;
            ctx.lineWidth = .75*dpr;
            ctx.beginPath();
            ctx.moveTo(a.x,a.y);
            ctx.lineTo(b.x,b.y);
            ctx.stroke();
          }
        }
      }

      for(const n of nodes){
        const pulse = .7 + Math.sin(n.p)*.26;
        ctx.beginPath();
        ctx.fillStyle = `rgba(226,246,255,${.48 + pulse*.18})`;
        ctx.shadowColor = 'rgba(56,189,248,.7)';
        ctx.shadowBlur = 13*dpr;
        ctx.arc(n.x,n.y,n.r*(1+pulse*.45),0,Math.PI*2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      requestAnimationFrame(frame);
    }
    frame();
  }
})();
