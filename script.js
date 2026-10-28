(function () {
  var topo = document.querySelector('.topo');
  var botao = document.querySelector('.menu-btn');
  var menu = document.getElementById('menu');

  // Menu mobile: abre e fecha, e fecha ao escolher uma seção
  function alternarMenu(abrir) {
    menu.classList.toggle('aberto', abrir);
    botao.setAttribute('aria-expanded', String(abrir));
    botao.textContent = abrir ? 'Fechar' : 'Menu';
  }
  botao.addEventListener('click', function () {
    alternarMenu(!menu.classList.contains('aberto'));
  });
  menu.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') alternarMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') alternarMenu(false);
  });

  // Sombra no cabeçalho ao rolar
  function aoRolar() {
    topo.classList.toggle('sombra', window.scrollY > 8);
  }
  window.addEventListener('scroll', aoRolar, { passive: true });
  aoRolar();

  // Sair rápido: troca a página atual por outra, sem deixar a anterior no histórico
  document.getElementById('sair').addEventListener('click', function () {
    window.location.replace('https://www.google.com.br');
  });

  // Ano do rodapé
  document.getElementById('ano').textContent = new Date().getFullYear();
})();

// Galeria: amplia a foto em uma janela
(function () {
  var visor = document.getElementById('visor');
  var galeria = document;
  if (!visor || !galeria || !visor.showModal) return;
  var img = visor.querySelector('img');
  galeria.addEventListener('click', function (e) {
    var a = e.target.closest('a.foto');
    if (!a) return;
    e.preventDefault();
    img.src = a.href;
    img.alt = a.querySelector('img').alt;
    document.getElementById('legenda').textContent = img.alt;
    visor.showModal();
  });
  document.getElementById('fechar').addEventListener('click', function () { visor.close(); });
  visor.addEventListener('click', function (e) { if (e.target === visor) visor.close(); });
})();

// Carrossel: setas rolam um slide por vez; deslizar e o teclado também funcionam
(function () {
  var reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('.carrossel').forEach(function (c) {
    var pista = c.querySelector('.pista');
    var ant = c.querySelector('.ant');
    var prox = c.querySelector('.prox');
    function passo() {
      var s = pista.querySelector('.slide');
      var gap = parseFloat(getComputedStyle(pista).columnGap) || 0;
      return s.getBoundingClientRect().width + gap;
    }
    function atualizar() {
      ant.disabled = pista.scrollLeft <= 2;
      prox.disabled = pista.scrollLeft + pista.clientWidth >= pista.scrollWidth - 2;
    }
    function ir(dir) {
      pista.scrollBy({ left: dir * passo(), behavior: reduz ? 'auto' : 'smooth' });
    }
    ant.addEventListener('click', function () { ir(-1); });
    prox.addEventListener('click', function () { ir(1); });
    pista.addEventListener('scroll', atualizar, { passive: true });
    window.addEventListener('resize', atualizar);
    atualizar();
  });
})();

// Vídeos: se o arquivo não carregar, avisa o visitante e registra o caminho no console
document.addEventListener('error', function (e) {
  var src = e.target;
  if (src.tagName !== 'SOURCE' || !src.parentNode || src.parentNode.tagName !== 'VIDEO') return;
  var video = src.parentNode;
  if (video.dataset.erro) return;
  video.dataset.erro = '1';
  console.error('Vídeo não carregou:', src.getAttribute('src'));
  var aviso = document.createElement('p');
  aviso.className = 'erro-video';
  aviso.textContent = 'Não foi possível carregar este vídeo.';
  video.parentNode.insertBefore(aviso, video.nextSibling);
}, true);