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


/* ===== SO X27 : real bridge, realtime browser AI, advanced Three.js core ===== */
(function(){
  const $ = (s, root=document) => root.querySelector(s);

  function logTo(sel, text){
    const box = $(sel);
    if(!box) return;
    const div = document.createElement('div');
    div.textContent = text;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
  }

  // Local bridge connection
  const BRIDGE_URL = 'http://127.0.0.1:8765';

  async function callBridge(command){
    logTo('[data-x27-local-log]', 'WEB: ' + command);
    try {
      const res = await fetch(BRIDGE_URL + '/command', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({command})
      });
      const data = await res.json();
      logTo('[data-x27-local-log]', 'SO X27 LOCAL: ' + (data.message || JSON.stringify(data)));
      setBridgeStatus(true);
      return data;
    } catch(e){
      logTo('[data-x27-local-log]', 'ERROR: local bridge offline. Start sox27_bridge_server.py');
      setBridgeStatus(false);
      return null;
    }
  }

  function setBridgeStatus(online){
    const st = $('[data-x27-bridge-status]');
    if(!st) return;
    st.classList.remove('is-online','is-offline');
    st.classList.add(online ? 'is-online' : 'is-offline');
    st.textContent = online ? 'ONLINE' : 'OFFLINE';
  }

  async function testBridge(){
    try {
      const res = await fetch(BRIDGE_URL + '/status');
      const data = await res.json();
      setBridgeStatus(true);
      logTo('[data-x27-local-log]', 'BRIDGE: ' + (data.message || 'online'));
    } catch(e){
      setBridgeStatus(false);
      logTo('[data-x27-local-log]', 'BRIDGE: offline');
    }
  }

  const localSend = $('[data-x27-local-send]');
  const localInput = $('[data-x27-local-command]');
  if(localSend && localInput){
    localSend.addEventListener('click', () => {
      const cmd = localInput.value.trim();
      if(cmd) callBridge(cmd);
      localInput.value = '';
    });
    localInput.addEventListener('keydown', e => {
      if(e.key === 'Enter'){
        const cmd = localInput.value.trim();
        if(cmd) callBridge(cmd);
        localInput.value = '';
      }
    });
  }

  const testBtn = $('[data-x27-test-bridge]');
  if(testBtn) testBtn.addEventListener('click', testBridge);

  document.querySelectorAll('[data-x27-local-demo]').forEach(btn => {
    btn.addEventListener('click', () => callBridge(btn.dataset.x27LocalDemo));
  });

  setTimeout(testBridge, 1200);

  // Realtime browser AI demo
  const realtimeInput = $('[data-x27-realtime-input]');
  const realtimeSend = $('[data-x27-realtime-send]');
  const realtimeMic = $('[data-x27-realtime-mic]');
  const realtimeOrb = $('[data-x27-realtime-orb]');

  function answerAI(q){
    const question = String(q || '').trim();
    if(!question) return;
    logTo('[data-x27-realtime-log]', 'USER: ' + question);
    if(realtimeOrb) realtimeOrb.classList.add('is-speaking');

    let response;
    if(/vision|keyence|cofidur|cam/i.test(question)){
      response = "SO X27: La partie vision industrielle repose sur l’acquisition image, les outils IA Keyence, la décision OK/NOK et l’action sur le convoyeur.";
    } else if(/projet|project/i.test(question)){
      response = "SO X27: Les projets clés sont l’assistant vocal, le command center, la vision industrielle Keyence, l’automatisation desktop et l’architecture agentique.";
    } else if(/présente|presente|about|qui/i.test(question)){
      response = "SO X27: Sofiane Badja est orienté automatique, robotique, vision industrielle et IA appliquée aux systèmes intelligents.";
    } else if(/connect|local|python/i.test(question)){
      response = "SO X27: La connexion réelle nécessite le serveur local sox27_bridge_server.py, car un site web ne peut pas lancer directement des programmes Windows.";
    } else {
      response = "SO X27: Commande analysée. Cette interface est prête à être reliée à une vraie API IA ou au serveur local SO X27.";
    }

    let i = 0;
    const timer = setInterval(() => {
      if(i === 0) logTo('[data-x27-realtime-log]', response);
      i++;
      if(i > 1){
        clearInterval(timer);
        if(realtimeOrb) realtimeOrb.classList.remove('is-speaking');
      }
    }, 350);
  }

  if(realtimeSend && realtimeInput){
    realtimeSend.addEventListener('click', () => {
      answerAI(realtimeInput.value);
      realtimeInput.value = '';
    });
    realtimeInput.addEventListener('keydown', e => {
      if(e.key === 'Enter'){
        answerAI(realtimeInput.value);
        realtimeInput.value = '';
      }
    });
  }

  if(realtimeMic){
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if(SR){
      const rec = new SR();
      rec.lang = 'fr-FR';
      rec.continuous = false;
      rec.interimResults = false;
      realtimeMic.addEventListener('click', () => {
        realtimeMic.classList.add('is-listening');
        logTo('[data-x27-realtime-log]', 'SO X27: listening...');
        rec.start();
      });
      rec.onresult = e => {
        realtimeMic.classList.remove('is-listening');
        answerAI(e.results[0][0].transcript);
      };
      rec.onerror = () => {
        realtimeMic.classList.remove('is-listening');
        logTo('[data-x27-realtime-log]', 'SO X27: microphone unavailable.');
      };
      rec.onend = () => realtimeMic.classList.remove('is-listening');
    }
  }

  // Advanced Three.js neural core
  if(window.THREE && !document.getElementById('sox27-three-core')){
    const canvas = document.createElement('canvas');
    canvas.id = 'sox27-three-core';
    document.body.prepend(canvas);

    const renderer = new THREE.WebGLRenderer({canvas, alpha:true, antialias:true});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, innerWidth/innerHeight, 0.1, 1000);
    camera.position.z = 82;

    const group = new THREE.Group();
    scene.add(group);

    const nodeCount = innerWidth < 760 ? 80 : 150;
    const positions = [];
    const geom = new THREE.BufferGeometry();
    const vertices = [];

    for(let i=0;i<nodeCount;i++){
      const x = (Math.random()-.5)*130;
      const y = (Math.random()-.5)*80;
      const z = (Math.random()-.5)*70;
      positions.push(new THREE.Vector3(x,y,z));
      vertices.push(x,y,z);
    }

    geom.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    const mat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.75,
      transparent: true,
      opacity: 0.76
    });
    const points = new THREE.Points(geom, mat);
    group.add(points);

    const lineGeom = new THREE.BufferGeometry();
    const lineVertices = [];
    for(let i=0;i<positions.length;i++){
      for(let j=i+1;j<positions.length;j++){
        if(positions[i].distanceTo(positions[j]) < 22){
          lineVertices.push(positions[i].x,positions[i].y,positions[i].z);
          lineVertices.push(positions[j].x,positions[j].y,positions[j].z);
        }
      }
    }
    lineGeom.setAttribute('position', new THREE.Float32BufferAttribute(lineVertices, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x8b5cf6,
      transparent:true,
      opacity:0.12
    });
    const lines = new THREE.LineSegments(lineGeom, lineMat);
    group.add(lines);

    let mx = 0, my = 0;
    window.addEventListener('mousemove', e => {
      mx = (e.clientX / innerWidth - .5) * 2;
      my = (e.clientY / innerHeight - .5) * 2;
    });

    function resize(){
      renderer.setSize(innerWidth, innerHeight);
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener('resize', resize);

    function animate(){
      requestAnimationFrame(animate);
      group.rotation.y += 0.0018;
      group.rotation.x += 0.0007;
      group.rotation.y += (mx*0.08 - group.rotation.y) * 0.004;
      group.rotation.x += (-my*0.05 - group.rotation.x) * 0.004;
      renderer.render(scene, camera);
    }
    animate();
  }
})();
