/* =====================================================================
   JUEGO.JS  →  El "cerebro" del juego Eco Vuela
   ---------------------------------------------------------------------
   HTML = el esqueleto (qué hay)
   CSS  = el maquillaje (cómo se ve)
   JavaScript = el cerebro (qué HACE: movimiento, puntos, botones...)

   Este archivo hace funcionar el juego tipo "Flappy Bird":
   un pajarito vuela y tiene que esquivar vapeadores y humo.

   Palabras que vas a ver mucho:
     const    → guarda un dato que NO va a cambiar (constante).
     let      → guarda un dato que SÍ puede cambiar (variable).
     function → un grupo de instrucciones con nombre, que se ejecuta
                cuando la "llamamos" escribiendo su nombre con ().
     if       → "si pasa esto, entonces haz aquello".
     ctx      → el "pincel" con el que dibujamos en el canvas (lienzo).

   El canvas mide 800 de ancho x 520 de alto.
   Las posiciones se miden así:
     x = de izquierda a derecha (0 es el borde izquierdo)
     y = de ARRIBA a ABAJO (0 es el borde de arriba, 520 el de abajo)
   ===================================================================== */

// Todo el código va dentro de esta función que se ejecuta sola: (function () { ... })();
// Sirve para que las variables del juego no se mezclen con otras de la página.
(function () {

  // La función principal: prepara TODO el juego.
  function initEcoGame() {

    /* ---------------------------------------------------------------
       1. BUSCAR LAS PARTES DEL HTML QUE VAMOS A USAR
       document.getElementById('nombre') busca en el HTML el elemento
       que tiene ese id="nombre" y lo guarda para poder usarlo.
       --------------------------------------------------------------- */
    const canvas = document.getElementById('ecoCanvas');            // el lienzo donde se dibuja
    const ctx = canvas && canvas.getContext ? canvas.getContext('2d') : null; // el "pincel" 2D
    const overlay = document.getElementById('ecoOverlay');          // la capa con el botón de inicio
    const startBtn = document.getElementById('ecoStart');           // el botón "Iniciar juego"
    const title = document.getElementById('ecoOverlayTitle');       // el título de la tarjeta
    const message = document.getElementById('ecoOverlayText');      // el texto de la tarjeta
    const scoreNode = document.getElementById('ecoScore');          // donde se muestran los puntos
    const bestNode = document.getElementById('ecoBest');            // donde se muestra el récord

    // Si falta alguna parte importante, el juego no arranca (return = salir de la función).
    if (!canvas || !ctx || !overlay || !startBtn) return;

    // W = ancho (width) y H = alto (height) del lienzo: 800 y 520.
    const W = canvas.width, H = canvas.height;


    /* ---------------------------------------------------------------
       2. CARGAR LAS IMÁGENES (sprites) DEL JUEGO
       "Sprite" = dibujito de un personaje u objeto del juego.
       Las imágenes están en la carpeta img/ y vienen del proyecto
       de Scratch.
       El pájaro tiene 3 imágenes: al cambiarlas rápido parece que
       mueve las alas (como un dibujo animado).
       --------------------------------------------------------------- */
    const spriteSources = {
      bird: ['img/pajaro-1.png', 'img/pajaro-2.png', 'img/pajaro-3.png'], // pajarito (3 posiciones de alas)
      vape: 'img/vapeador.png',  // obstáculo: vapeador
      smoke: 'img/humo.png',     // obstáculo: humo
      bg: 'img/fondo.png'        // fondo del cielo
    };

    // Aquí se guardan las imágenes ya cargadas.
    const sprites = {};

    // Para cada tipo de sprite (bird, vape, smoke, bg)...
    Object.keys(spriteSources).forEach(key => {
      // ...si es una sola imagen, la metemos en una lista para tratarlas todas igual...
      const list = Array.isArray(spriteSources[key]) ? spriteSources[key] : [spriteSources[key]];
      // ...y creamos un objeto Image por cada archivo para que el navegador lo cargue.
      sprites[key] = list.map(src => {
        const img = new Image();
        img.onload = () => { if (!running) draw(); }; // cuando la imagen termina de cargar, redibuja la pantalla de inicio
        img.src = src;
        return img;
      });
    });


    /* ---------------------------------------------------------------
       3. VARIABLES DEL JUEGO (el "estado" del juego)
       --------------------------------------------------------------- */
    let bird;           // el pajarito: su posición (x, y) y su velocidad vertical (vy)
    let obstacles;      // lista de obstáculos que hay en pantalla
    let score = 0;      // puntos de la partida actual
    let best = 0;       // récord (el puntaje más alto)
    let frame = 0;      // contador de cuadros: sirve para animar las alas
    let running = false;// ¿se está jugando ahora mismo? (true = sí, false = no)
    let raf = 0;        // número de la animación (para poder detenerla)
    let lastTime = 0;   // momento del último cuadro dibujado

    // localStorage = una "memoria" del navegador que no se borra al cerrar la página.
    // Aquí leemos el récord guardado. try/catch evita que el juego se dañe si el navegador no deja.
    try { best = Number(localStorage.getItem('ecoVuelaBest') || 0); } catch (_) {}
    bestNode.textContent = best;   // mostramos el récord en la pantalla


    /* ---------------------------------------------------------------
       4. FUNCIONES DEL JUEGO
       --------------------------------------------------------------- */

    // reset(): deja todo como al principio para una partida nueva.
    function reset() {
      bird = { x: 170, y: 245, vy: 0 };  // el pájaro empieza a la izquierda, a media altura y quieto
      obstacles = [];                    // sin obstáculos
      score = 0;                         // puntos en cero
      frame = 0;
      scoreNode.textContent = '0';
      addObstacle(850);                  // crea el primer obstáculo, un poco fuera de la pantalla (a la derecha)
    }

    // addObstacle(x): crea un obstáculo nuevo en la posición x.
    // Cada obstáculo tiene una parte arriba y otra abajo, con un hueco en el medio por donde pasa el pájaro.
    function addObstacle(x) {
      obstacles.push({
        x,                                   // posición horizontal
        center: 145 + Math.random() * 230,   // altura del centro del hueco (al azar entre 145 y 375)
        gap: 195,                            // tamaño del hueco
        kind: Math.random() > .5 ? 'vape' : 'smoke', // 50% vapeador, 50% humo (al azar)
        passed: false                        // ¿ya lo pasó el pájaro? (para sumar el punto una sola vez)
      });
    }

    // startGame(): empieza una partida.
    function startGame() {
      cancelAnimationFrame(raf);          // detiene una animación anterior si había una
      reset();                            // reinicia todo
      running = true;                     // ¡ahora sí se está jugando!
      overlay.classList.add('hidden');    // esconde la tarjeta del botón (ver .eco-overlay.hidden en el CSS)
      lastTime = performance.now();       // guarda la hora exacta de inicio
      raf = requestAnimationFrame(loop);  // arranca el ciclo del juego
    }

    // finishGame(): termina la partida (cuando el pájaro choca).
    function finishGame() {
      if (!running) return;               // si ya había terminado, no hace nada
      running = false;
      cancelAnimationFrame(raf);          // detiene la animación

      // Si hizo más puntos que el récord, se guarda el nuevo récord.
      if (score > best) {
        best = score;
        bestNode.textContent = best;
        try { localStorage.setItem('ecoVuelaBest', String(best)); } catch (_) {}
      }

      // Cambia los textos de la tarjeta y la vuelve a mostrar.
      title.textContent = '¡Vuelo terminado!';
      message.textContent = 'Conseguiste ' + score + ' punto(s). ¡Inténtalo otra vez y recuerda cuidar el aire de Bosa!';
      startBtn.textContent = '↻ Volver a jugar';
      overlay.classList.remove('hidden');
    }

    // flap(): el pájaro aletea (salta hacia arriba).
    // Un número negativo en vy = moverse hacia ARRIBA (porque y crece hacia abajo).
    function flap() {
      if (running) bird.vy = -7.4;
    }

    // loop(): el CICLO DEL JUEGO. Se repite unas 60 veces por segundo.
    // En cada vuelta: 1) actualiza (mueve todo)  2) dibuja  3) pide la siguiente vuelta.
    function loop(now) {
      if (!running) return;
      // dt = cuánto tiempo pasó desde el cuadro anterior. Así el juego va a la
      // misma velocidad en computadores rápidos y lentos.
      const dt = Math.min(2, Math.max(.5, (now - lastTime) / 16.67));
      lastTime = now;
      update(dt);   // mover cosas y revisar choques
      draw();       // dibujar todo
      if (running) raf = requestAnimationFrame(loop);  // pedir el siguiente cuadro
    }

    // update(dt): la "física" del juego. Mueve al pájaro y a los obstáculos.
    function update(dt) {
      frame += dt;

      // GRAVEDAD: cada cuadro el pájaro cae un poquito más rápido.
      bird.vy += .38 * dt;
      bird.y += bird.vy * dt;

      // Velocidad de los obstáculos: empieza en 3.6 y va subiendo con los puntos
      // (máximo +2.4). O sea: entre más puntos, más difícil.
      const speed = 3.6 + Math.min(score * .06, 2.4);

      // Si el último obstáculo ya avanzó lo suficiente, crea uno nuevo a la derecha.
      if (obstacles.length && obstacles[obstacles.length - 1].x < 500) addObstacle(850);

      // Revisamos cada obstáculo (o = obstáculo)
      for (const o of obstacles) {
        o.x -= speed * dt;   // lo movemos hacia la izquierda

        // ¿El pájaro ya lo pasó? → +1 punto (solo una vez por obstáculo).
        // 65 es el ancho del obstáculo.
        if (!o.passed && o.x + 65 < bird.x) {
          o.passed = true;
          score++;                         // score++ significa "súmale 1 a score"
          scoreNode.textContent = score;
        }

        // DETECCIÓN DE CHOQUES (colisión):
        // hitX = ¿el pájaro está a la misma altura horizontal que el obstáculo?
        const hitX = bird.x + 20 > o.x && bird.x - 20 < o.x + 65;
        // Si está ahí y NO pasa por el hueco (toca la parte de arriba o la de abajo) → pierde.
        if (hitX && (bird.y - 19 < o.center - o.gap / 2 || bird.y + 19 > o.center + o.gap / 2)) {
          finishGame();
          return;
        }
      }

      // Borramos los obstáculos que ya salieron por la izquierda (para no gastar memoria).
      obstacles = obstacles.filter(o => o.x > -100);

      // Si el pájaro se sale por arriba o toca el pasto de abajo → pierde.
      if (bird.y < 0 || bird.y > H - 58) finishGame();
    }

    // drawImageCover(): dibuja una imagen llenando un rectángulo sin deformarla
    // (recorta lo que sobre). Se usa para el fondo.
    function drawImageCover(img, x, y, w, h) {
      if (!img || !img.complete || !img.naturalWidth || h <= 0) return false; // si la imagen no ha cargado, no dibuja
      ctx.save();
      ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();      // solo se puede pintar dentro de este rectángulo
      const scale = Math.max(w / img.width, h / img.height);  // cuánto agrandar/achicar la imagen
      const sw = w / scale, sh = h / scale;
      ctx.drawImage(img, (img.width - sw) / 2, (img.height - sh) / 2, sw, sh, x, y, w, h);
      ctx.restore();
      return true;
    }

    // draw(): DIBUJA todo lo que se ve en el lienzo, en orden (lo último queda encima).
    function draw() {
      // 1) Borrar el cuadro anterior
      ctx.clearRect(0, 0, W, H);

      // 2) Fondo. Si la imagen no cargó, pinta un cielo azul con un sol de color.
      if (!drawImageCover(sprites.bg[0], 0, 0, W, H)) {
        ctx.fillStyle = '#8bd2d0'; ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#d9f1d8'; ctx.beginPath(); ctx.arc(680, 85, 55, 0, Math.PI * 2); ctx.fill();
      }

      // 3) Obstáculos (parte de arriba y parte de abajo de cada uno)
      obstacles.forEach(o => {
        const topH = o.center - o.gap / 2;       // alto de la parte de arriba
        const bottomY = o.center + o.gap / 2;    // dónde empieza la parte de abajo
        const bottomH = H - 58 - bottomY;        // alto de la parte de abajo (hasta el pasto)
        const img = sprites[o.kind][0];          // imagen: vapeador o humo

        if (img && img.complete && img.naturalWidth) {
          // Parte de arriba
          ctx.save(); ctx.beginPath(); ctx.rect(o.x, 0, 65, topH); ctx.clip();
          ctx.drawImage(img, o.x, topH - img.height, 65, img.height); ctx.restore();
          // Parte de abajo
          ctx.save(); ctx.beginPath(); ctx.rect(o.x, bottomY, 65, bottomH); ctx.clip();
          ctx.drawImage(img, o.x, bottomY, 65, img.height); ctx.restore();
        } else {
          // Si la imagen no cargó, dibuja rectángulos de color
          ctx.fillStyle = o.kind === 'vape' ? '#e9f1ee' : '#a7a7a7';
          ctx.fillRect(o.x, 0, 65, topH);
          ctx.fillRect(o.x, bottomY, 65, bottomH);
        }
      });

      // 4) El pasto de abajo (franja verde oscura + borde verde claro)
      ctx.fillStyle = '#37864d'; ctx.fillRect(0, H - 58, W, 58);
      ctx.fillStyle = '#a8d86b'; ctx.fillRect(0, H - 58, W, 9);

      // 5) El pajarito. Cambia de imagen cada 7 cuadros para "aletear".
      const birdFrames = sprites.bird;
      const birdImg = birdFrames[Math.floor(frame / 7) % birdFrames.length];
      ctx.save();
      ctx.translate(bird.x, bird.y);  // nos movemos a donde está el pájaro
      // Lo inclinamos según su velocidad: hacia arriba cuando sube, hacia abajo cuando cae.
      ctx.rotate(Math.max(-.4, Math.min(.7, bird.vy * .05)));
      if (!drawImageCentered(birdImg, 0, 0, 78, 66)) {
        // Si la imagen no cargó, dibuja un círculo verde con un ojito
        ctx.fillStyle = '#b5df58'; ctx.beginPath(); ctx.arc(0, 0, 23, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#173f35'; ctx.beginPath(); ctx.arc(8, -5, 3, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();

      // 6) Los puntos, escritos arriba a la izquierda
      ctx.fillStyle = '#173f35';
      ctx.font = 'bold 23px sans-serif';
      ctx.fillText('Puntos: ' + score, 20, 34);
    }

    // drawImageCentered(): dibuja una imagen centrada en el punto (x, y).
    function drawImageCentered(img, x, y, w, h) {
      if (!img || !img.complete || !img.naturalWidth) return false;
      ctx.drawImage(img, x - w / 2, y - h / 2, w, h);
      return true;
    }


    /* ---------------------------------------------------------------
       5. CONTROLES: escuchar lo que hace el jugador
       addEventListener('evento', función) = "cuando pase este evento,
       ejecuta esta función". Es como dejar a alguien "escuchando".
       --------------------------------------------------------------- */

    // Clic en el botón "Iniciar juego" → empieza.
    startBtn.addEventListener('click', function (e) {
      e.preventDefault();
      startGame();
    });

    // Clic en la capa oscura (fuera de la tarjeta) → también empieza.
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) startGame();
    });

    // Clic o toque (en celular) sobre el juego → si no está jugando, empieza; si está jugando, aletea.
    canvas.addEventListener('pointerdown', function (e) {
      e.preventDefault();
      if (!running) startGame(); else flap();
    });

    // Teclado: barra espaciadora o flecha hacia arriba → empieza o aletea.
    window.addEventListener('keydown', function (e) {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();  // evita que la página baje al presionar espacio
        if (!running) startGame(); else flap();
      }
    });

    // Al abrir la página: deja el juego listo y dibuja la primera imagen.
    reset();
    draw();
  }

  // Esperamos a que el HTML termine de cargar antes de iniciar el juego.
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initEcoGame);
  else initEcoGame();

})();
