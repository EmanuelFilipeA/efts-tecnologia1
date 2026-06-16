/* ============================================================
   EFTS Technology — Scripts Principais
   Arquivo: assets/js/main.js
   ============================================================ */

/* ── INJEÇÃO DO LOGO SVG ──
   O <template id="logoTpl"> no HTML contém o SVG do logo.
   Aqui ele é clonado e inserido em cada elemento com [data-logo],
   ajustando o tamanho conforme os atributos data-big e data-small. */
const logoTpl = document.getElementById('logoTpl');
document.querySelectorAll('[data-logo]').forEach(host => {
  const svg = logoTpl.content.firstElementChild.cloneNode(true);
  if (host.hasAttribute('data-big'))   { svg.setAttribute('width','72'); svg.setAttribute('height','72'); svg.classList.add('logo-animate'); }
  if (host.hasAttribute('data-small')) { svg.setAttribute('width','30'); svg.setAttribute('height','30'); }
  host.prepend(svg);
});

/* ── ALTERNÂNCIA DE TEMA (claro / escuro) ──
   Lê o tema salvo no localStorage ao carregar,
   e alterna entre dark/light ao clicar no botão lateral. */
const root      = document.documentElement;
const toggleBtn = document.getElementById('theme-toggle');
const icon      = document.getElementById('theme-icon');
const saved     = localStorage.getItem('theme') || 'dark';

root.setAttribute('data-theme', saved);
icon.textContent = saved === 'dark' ? '☀️' : '🌙';

toggleBtn.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  icon.textContent = next === 'dark' ? '☀️' : '🌙';
});

/* ── BARRA DE PROGRESSO DE SCROLL + ENCOLHIMENTO DA NAVBAR ──
   Atualiza a largura da barra de progresso no topo
   e adiciona a classe .scrolled na navbar ao rolar. */
const progress = document.getElementById('scrollProgress');
const navbar   = document.getElementById('navbar');

function onScroll() {
  const h = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (window.scrollY / h * 100) + '%';
  navbar.classList.toggle('scrolled', window.scrollY > 30);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll(); // executa na carga para estado inicial correto

/* ── BOTÃO VOLTAR AO TOPO ──
   Aparece quando o usuário passou 75% da página,
   e rola suavemente até o topo ao ser clicado. */
const toTop = document.getElementById('toTop');
window.addEventListener('scroll', () => {
  const h = document.documentElement.scrollHeight - window.innerHeight;
  toTop.classList.toggle('show', h > 0 && window.scrollY / h > 0.75);
}, { passive: true });
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ── EFEITO DE DIGITAÇÃO (typewriter) ──
   Digita e apaga as palavras da lista em loop,
   com velocidade diferente para digitar e apagar. */
const words = ['Manutenção','Formatação','Redes','Softwares','Backups','Impressoras','ERP','Landing Pages','Automação RPA'];
const el    = document.getElementById('typing-word');
let wi = 0, ci = 0, deleting = false;

function type() {
  const word = words[wi];
  if (!deleting) {
    el.textContent = word.slice(0, ++ci);
    if (ci === word.length) {
      deleting = true;
      setTimeout(type, 1800); // pausa antes de começar a apagar
      return;
    }
  } else {
    el.textContent = word.slice(0, --ci);
    if (ci === 0) {
      deleting = false;
      wi = (wi + 1) % words.length; // avança para a próxima palavra
    }
  }
  setTimeout(type, deleting ? 45 : 80); // apagar é mais rápido que digitar
}
type();

/* ── PARALLAX DO HERO COM MOUSE ──
   Move a grade, o SVG de circuito e o brilho em direções
   opostas ao mover o mouse sobre a seção hero,
   criando profundidade de camadas. */
const hero     = document.getElementById('inicio');
const heroGrid = document.getElementById('heroGrid');
const circuit  = document.getElementById('circuit');
const glow     = document.getElementById('heroGlow');
const reduce   = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduce) {
  hero.addEventListener('mousemove', (e) => {
    const r = hero.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;  // -0.5 a +0.5
    const y = (e.clientY - r.top) / r.height - .5;
    heroGrid.style.transform = `translate(${x*-18}px, ${y*-18}px)`; // grade move ao contrário
    circuit.style.transform  = `translate(${x*26}px, ${y*26}px)`;   // circuito move no mesmo sentido
    glow.style.transform     = `translate(calc(-50% + ${x*120}px), calc(-50% + ${y*120}px))`; // brilho segue o mouse
  });
  hero.addEventListener('mouseleave', () => {
    heroGrid.style.transform = circuit.style.transform = '';
    glow.style.transform = 'translate(-50%,-50%)'; // volta ao centro
  });
}

/* ── BOTÃO MAGNÉTICO ──
   O botão [data-magnetic] acompanha levemente o cursor,
   criando um efeito de atração ao passar o mouse. */
document.querySelectorAll('[data-magnetic]').forEach(btn => {
  if (reduce) return;
  btn.addEventListener('mousemove', (e) => {
    const r = btn.getBoundingClientRect();
    btn.style.transform = `translate(${(e.clientX-r.left-r.width/2)*.25}px, ${(e.clientY-r.top-r.height/2)*.35}px)`;
  });
  btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
});

/* ── TILT 3D + SPOTLIGHT NOS CARDS DE SERVIÇO ──
   Ao mover o mouse sobre um card, aplica rotação 3D proporcional
   à posição do cursor e atualiza as variáveis CSS --mx/--my
   para o efeito de spotlight radial definido no CSS. */
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const r  = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;   // 0 a 1 horizontal
    const py = (e.clientY - r.top)  / r.height;  // 0 a 1 vertical
    card.style.setProperty('--mx', px*100 + '%');
    card.style.setProperty('--my', py*100 + '%');
    if (!reduce) card.style.transform = `rotateY(${(px-.5)*8}deg) rotateX(${(.5-py)*8}deg) translateZ(0)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

/* ── LINK ATIVO NA NAVBAR AO ROLAR ──
   Detecta qual seção está visível e marca o link correspondente
   na navbar com a classe .active. */
const navLinks = {
  servicos: document.getElementById('nav-servicos'),
  contato:  document.getElementById('nav-contato'),
};
const secIds = ['servicos','contato'];

window.addEventListener('scroll', () => {
  const y = window.scrollY + 120; // offset para ativar um pouco antes do topo da seção
  let current = null;
  ['inicio',...secIds].forEach(id => {
    const sec = document.getElementById(id);
    if (sec && y >= sec.offsetTop && y < sec.offsetTop + sec.offsetHeight) current = id;
  });
  Object.values(navLinks).forEach(l => l && l.classList.remove('active'));
  if (navLinks[current]) navLinks[current].classList.add('active');
}, { passive: true });

/* ── ANIMAÇÃO DE ENTRADA (Intersection Observer) ──
   Observa todos os elementos .reveal e adiciona .visible
   quando eles entram na viewport, disparando a animação do CSS.
   Cards de serviço recebem um delay escalonado por coluna. */
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      obs.unobserve(e.target); // para de observar após animar
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((node, i) => {
  if (node.classList.contains('service-card')) node.style.transitionDelay = (i % 3) * 0.07 + 's';
  obs.observe(node);
});

/* ── ENVIO REAL DO FORMULÁRIO VIA FORMSPREE ──
   Valida os campos nativamente, envia via fetch para o Formspree
   e exibe feedback de sucesso ou erro sem recarregar a página. */
const form        = document.getElementById('contactForm');
const submitBtn   = document.getElementById('submitBtn');
const submitLabel = document.getElementById('submitLabel');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!form.checkValidity()) { form.reportValidity(); return; }

  // Bloqueia o botão durante o envio
  submitBtn.disabled = true;
  submitLabel.textContent = 'Enviando...';

  try {
    const response = await fetch('https://formspree.io/f/xojzbady', {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' },
    });

    if (response.ok) {
      // Sucesso: mostra confirmação e limpa o formulário
      submitBtn.classList.add('sent');
      submitLabel.textContent = '✓ Mensagem Enviada';
      form.reset();
      setTimeout(() => {
        submitBtn.classList.remove('sent');
        submitLabel.textContent = 'Mandar email';
        submitBtn.disabled = false;
      }, 2600);
    } else {
      // Erro retornado pelo Formspree
      submitLabel.textContent = 'Erro ao enviar. Tente novamente.';
      submitBtn.disabled = false;
    }
  } catch {
    // Erro de rede (sem conexão, etc.)
    submitLabel.textContent = 'Sem conexão. Tente novamente.';
    submitBtn.disabled = false;
  }
});
