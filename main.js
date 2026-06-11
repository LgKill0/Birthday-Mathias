window.addEventListener('error', function(e) { alert('Global Error: ' + e.message + ' at L' + e.lineno); });
window.addEventListener('unhandledrejection', function(e) { alert('Promise Error: ' + (e.reason && e.reason.message ? e.reason.message : e.reason)); });
/* ==========================================================
   🎂 BIRTHDAY SURPRISE SPA — main.js
   ==========================================================
   Autor: Desarrollador Frontend Senior
   Descripción: Lógica completa de la SPA de cumpleaños.
   
   ESTRUCTURA DEL ARCHIVO:
   1. CONFIGURACION_USUARIO — Variables editables por el usuario
   2. Inicialización de Firebase Firestore
   3. Fase 1: Splash Screen + Explosión de partículas
   4. Fase 2: Dashboard + Contador en tiempo real
   5. Fase 3: Life Reels + Reproductor de video
   6. Fase 4: Quiz Polaroid + Confeti
   7. Utilidades (toasts, animaciones auxiliares)
   
   NOTA: Este archivo usa ES Modules (import/export).
   El tag <script> en index.html DEBE tener type="module".
   ========================================================== */


// ===========================================================
// 1. CONFIGURACION_USUARIO
// ===========================================================
// ✏️ MODIFICA ESTAS VARIABLES para personalizar tu regalo.
// Aquí defines tus credenciales de Firebase, las preguntas
// del quiz, el mensaje final, la foto, y textos decorativos.
// ===========================================================

const CONFIGURACION_USUARIO = {

  // ---------------------------------------------------------
  // 🔥 CREDENCIALES DE FIREBASE
  // ---------------------------------------------------------
  // Obtén estos valores desde la consola de Firebase:
  // https://console.firebase.google.com → Tu proyecto → 
  // Configuración del proyecto → General → Tu app web →
  // SDK setup and configuration → Config
  //
  // ⚠️ IMPORTANTE: Reemplaza TODOS los valores de ejemplo
  // con tus credenciales reales de Firebase.
  // ---------------------------------------------------------
  firebaseConfig: {
    apiKey: "AIzaSyCM-Jb4ivTk7Yh-d67CgvQQke0T5EiaBRQ",
    authDomain: "birthday-mathias.firebaseapp.com",
    projectId: "birthday-mathias",
    storageBucket: "birthday-mathias.firebasestorage.app",
    messagingSenderId: "589363888385",
    appId: "1:589363888385:web:3a8116139877e9be2edb00"
  },

  // ---------------------------------------------------------
  // 📄 RUTAS DE FIRESTORE
  // ---------------------------------------------------------
  // Colección y documento donde se almacenan los datos.
  // Por defecto usa: colección "cumpleanos", documento "datos"
  // Campos del documento:
  //   - horasJuntos (number): Contador de horas
  //   - videos (array): Lista de URLs de videos
  //
  // ⚠️ IMPORTANTE: Debes crear este documento en Firestore
  // manualmente la primera vez, o el código lo creará
  // automáticamente con valores iniciales.
  // ---------------------------------------------------------
  firestoreCollection: "cumpleanos",
  firestoreDocument: "datos",

  // ---------------------------------------------------------
  // 🎂 TEXTOS DEL DASHBOARD
  // ---------------------------------------------------------
  // Personaliza el título y subtítulo del dashboard.
  tituloCumpleanos: "¡Feliz Cumpleaños!",
  subtituloCumpleanos: "Pagina especial de Mathias",

  // ---------------------------------------------------------
  // 📸 GALERÍA DE 11 NIVELES
  // ---------------------------------------------------------
  imagenesGaleria: [
    { src: "img/polaroid.jpg", title: "Tenia mucho sueño", desc: "Esos joint estaban duros papi.", rarityClass: "rarity-poco-comun", rarityName: "Poco común" },
    { src: "Quiz/Quiz/Le gusta el dinero.jpg", title: "Le gusta el dinero", desc: "Ese perro luce hambriento...", rarityClass: "rarity-rara", rarityName: "Rara" },
    { src: "Quiz/Quiz/Pendejos Weones.jpg", title: "Pendejos Weones", desc: "Eran muy inocentes, y gordos.", rarityClass: "rarity-rara", rarityName: "Rara" },
    { src: "Quiz/Quiz/Unknown Slayer.jpg", title: "Unknown Slayer", desc: "Alguien se ve borrosamente atractivo ahi.", rarityClass: "rarity-mitica", rarityName: "Mítica" },
    { src: "Quiz/Quiz/Foto Extraña.jpg", title: "Foto Extraña", desc: "Como mantiene el equilibrio?", rarityClass: "rarity-poco-comun", rarityName: "Poco común" },
    { src: "Quiz/Quiz/Parecen Cansados.jpg", title: "Parecen Cansados", desc: "Parece que trabajaron mucho.", rarityClass: "rarity-rara", rarityName: "Rara" },
    { src: "Quiz/Quiz/Recuerdos Borrosos.jpg", title: "Recuerdos Borrosos", desc: "Mhm??? No lo recuerdo muy bien...", rarityClass: "rarity-legendaria", rarityName: "Legendaria" },
    { src: "Quiz/Quiz/Papa Rellena.jpg", title: "Papa Rellena", desc: "Se ve delicioso.", rarityClass: "rarity-comun", rarityName: "Común" },
    { src: "Quiz/Quiz/Algo no calza.jpg", title: "Algo no calza...", desc: "Las cosas pudieron ser diferentes?", rarityClass: "rarity-comun", rarityName: "Común" },
    { src: "Quiz/Quiz/Era un grupo grande.jpg", title: "Era un grupo grande", desc: "A donde habran ido.", rarityClass: "rarity-mitica", rarityName: "Mítica" },
    { src: "Quiz/Quiz/3Años_36Meses_1095Dias_26298Horas.jpg", title: "3 Años / 36 Meses / 1095 Días / 26298 Horas", desc: "Parece haber pasado mucho tiempo, un tanto nostalgico...", rarityClass: "rarity-legendaria", rarityName: "Legendaria" }
  ],

  // ---------------------------------------------------------
  // 🎬 VIDEOS LOCALES (NATIVOS)
  // ---------------------------------------------------------
  videosLocales: [
    "videos/1000051123.mp4",
    "videos/1000065313.mp4",
    "videos/20250503_203230.mp4",
    "videos/20250530_151354.mp4",
    "videos/d850377f22814d0db926b5853c8eecd5.mov",
    "videos/VID_20260609_213824_174.mp4",
    "videos/VID_20260610_004039.mp4",
    "videos/VID_20260610_004652.mp4",
    "videos/VID_20260610_004849.mp4"
  ],

  // ---------------------------------------------------------
  // ❓ PREGUNTAS DEL QUIZ (22 TOTALES)
  // ---------------------------------------------------------
  quizPreguntas: [
    { pregunta: "¿Qué frase digo siempre?", opciones: ["No manches", "Ya qué", "Eso tilin", "Six seven"], correcta: 3 },
    { pregunta: "¿Cual es el segundo nombre del Bastian?", opciones: ["Andres", "Jesus", "Ignacio", "Esteban"], correcta: 1 },
    { pregunta: "¿Cuantos años tiene el octavio?", opciones: ["20", "21", "22", "23"], correcta: 1 },
    { pregunta: "¿La comida preferida del dilan?", opciones: ["Pizza", "Sushi", "Pure y carne", "Completos"], correcta: 2 },
    { pregunta: "¿Color favorito de la fransisca?", opciones: ["Rojo", "Azul", "Corazon azul", "Verde"], correcta: 2 },
    { pregunta: "¿Apodo preferido del maximo?", opciones: ["Mochila de Camping", "Max", "Enano", "Gordo"], correcta: 0 },
    { pregunta: "¿Quien se quedara calvo antes?", opciones: ["Bastian", "Maximo", "Octavio", "Baltontin"], correcta: 3 },
    { pregunta: "¿Personaje autista favorito del bastian?", opciones: ["Mario", "Sonic", "Tails", "Shadow"], correcta: 1 },
    { pregunta: "¿Cuantas novias hemos tenido los 6?", opciones: ["10", "20", "Ninguna", "Mas de 67"], correcta: 3 },
    { pregunta: "¿Como se llama la capital de placilla city?", opciones: ["Valparaiso", "Curauma", "Tottus", "Lider"], correcta: 2 },
    { pregunta: "¿Quien es la amiga de la hermana de la toti?", opciones: ["Manzana", "Naranja", "Piña", "Uva"], correcta: 2 },
    { pregunta: "¿Quien tiene el pelo mas quemado?", opciones: ["Pascuala", "Bastian", "Octavio", "Fransisca💀"], correcta: 3 },
    { pregunta: "¿Viaje de ensueño?", opciones: ["Francia/Dinamarca", "Japon/Amsterdam", "Italia/España", "Corea/China"], correcta: 1 },
    { pregunta: "¿En que curso ocurrio el incidente 'Pou Octavio'?", opciones: ["8vo basico", "Primero medio", "Segundo medio", "Tercero medio"], correcta: 1 },
    { pregunta: "¿Que queria estudiar el dilan antes que informatica?", opciones: ["Derecho", "Psicologia", "Medicina", "Arquitectura"], correcta: 1 },
    { pregunta: "¿Cual era el apodo mas memorable del Octavio?", opciones: ["Espermio", "Fideo", "Octa", "Largo"], correcta: 0 },
    { pregunta: "¿En que curso de basica llego el Maximo?", opciones: ["3ro basico", "4to basico", "5to basico", "6to basico"], correcta: 1 },
    { pregunta: "¿Nombre de seguridad del bastian?", opciones: ["Yiyi", "Basti", "Seguro", "Clave"], correcta: 0 },
    { pregunta: "¿En que numero termina 8 elevado a 888?", opciones: ["2", "4", "6", "8"], correcta: 2 },
    { pregunta: "¿Cuantos años mentales tiene el mathias?", opciones: ["6", "8", "10", "12"], correcta: 1 },
    { pregunta: "¿Edad de todo el grupo sumada y elevada al cuadrado?", opciones: ["15000", "17161", "18200", "19000"], correcta: 1 },
    { pregunta: "¿En que clase estabamos cuando 'Alguien' casi quema la sala?", opciones: ["Matematica", "Remplazo", "Lenguaje", "Fisica"], correcta: 1 },
    { pregunta: "¿Como se llamaba el server de minecraft que hacia alucion a un juego chistoso?", opciones: ["Summer Time", "Winter Memories", "Spring Field", "Autumn Fall"], correcta: 1 }
  ],

  // ---------------------------------------------------------
  // 💌 MENSAJE FINAL
  // ---------------------------------------------------------
  // Texto emotivo que aparece al completar el quiz.
  // Usa \n para saltos de línea.
  // ---------------------------------------------------------
  mensajeFinal: `Querido Mathias:

Te queremos demasiado. Eres súper hueco, pero te ganaste un lugar enorme en nuestro corazón, especialmente en el mío. Espero de verdad que nuestra amistad perdure por mucho tiempo... bueno, ojalá no tanto tiempo, si Dios quiere.

Te amamos y te respetamos con todo el heart. Eres el único tetón que soporto en esta vida.

Te quiero mucho,

Dilan

P.D.: En serio, ponte las pilas con el ejercicio si no querí quedar como el Jorge.`,

  // Firma que aparece debajo del mensaje final
  firmaFinal: "— Dilan 💝"
};


const SoundEngine = {
  ctx: null,
  init() {
    try {
      if (!this.ctx) {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    } catch (e) {
      console.warn("AudioContext no soportado o bloqueado", e);
    }
  },
  playBGM() {
    try {
      const bgm = document.getElementById('bgm');
      if (bgm && bgm.paused) {
        bgm.volume = 0;
        bgm.play().then(() => {
          let vol = 0;
          const fadeInterval = setInterval(() => {
            if (vol < 0.2) {
              vol += 0.01;
              bgm.volume = Math.min(vol, 0.2);
            } else {
              clearInterval(fadeInterval);
            }
          }, 100);
        }).catch(e => console.warn("BGM auto-play blocked", e));
      }
    } catch(e) { console.warn(e); }
  },
  pauseBGM() {
    try {
      const bgm = document.getElementById('bgm');
      if (bgm && !bgm.paused) {
        bgm.volume = 0.05; // Baja el volumen pero no lo pausa del todo
      }
    } catch(e) {}
  },
  resumeBGM() {
    try {
      const bgm = document.getElementById('bgm');
      if (bgm && !bgm.paused) {
        bgm.volume = 0.2; // Restaura el volumen suave
      }
    } catch(e) {}
  },
  playTone(freq, type, duration, vol=0.1) {
    try {
      if(!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(vol, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) { console.warn(e); }
  },
  playNoise(duration, vol=0.1) {
    try {
      if(!this.ctx) return;
      const bufferSize = Math.floor(this.ctx.sampleRate * duration);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(vol, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1000, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + duration);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start();
    } catch (e) { console.warn(e); }
  },
  playMagicExplosion() {
    this.init();
    this.playNoise(1.5, 0.3);
    this.playTone(600, 'sine', 1, 0.2);
    this.playTone(800, 'sine', 1.2, 0.2);
  },
  playHeart() {
    this.init();
    this.playTone(880, 'sine', 0.1, 0.1);
    setTimeout(() => this.playTone(1760, 'sine', 0.15, 0.1), 50);
  },
  playSmallConfetti() {
    this.init();
    this.playNoise(0.5, 0.2);
    this.playTone(400, 'triangle', 0.3, 0.1);
    this.playTone(600, 'triangle', 0.4, 0.1);
  },
  playGrandConfetti() {
    this.init();
    this.playNoise(2.0, 0.4);
    const notes = [440, 554, 659, 880, 1108, 1318];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 'sine', 1, 0.2), i * 150);
    });
  },
  playRarity(rarityClass) {
    this.init();
    const map = { "rarity-comun": 0, "rarity-poco-comun": 1, "rarity-rara": 2, "rarity-mitica": 3, "rarity-legendaria": 4 };
    const level = map[rarityClass] || 0;
    const types = ['sine', 'triangle', 'square', 'sawtooth', 'square'];
    const type = types[level];
    const bases = [261.63, 329.63, 392.00, 523.25, 659.25];
    const duration = 0.5 + (level * 0.3);
    const vol = 0.1 + (level * 0.05);
    
    this.playTone(bases[level], type, duration, vol);
    this.playTone(bases[level] * 1.25, type, duration, vol);
    this.playTone(bases[level] * 1.5, type, duration, vol);
    
    if(level >= 3) {
       setTimeout(() => this.playTone(bases[level]*2, type, duration, vol), 200);
    }
    if(level === 4) {
       setTimeout(() => this.playTone(bases[level]*2.5, 'square', 1.5, 0.2), 400);
       setTimeout(() => this.playTone(bases[level]*3, 'sine', 2, 0.2), 600);
    }
  }
};

// ===========================================================
// 2. INICIALIZACIÓN DE FIREBASE
// ===========================================================
// Importamos las funciones de Firebase V10 (Web Modular API)
// directamente desde el CDN de Google. No necesitamos npm.
//
// ⚠️ Firebase es OPCIONAL. Si las credenciales no son válidas,
// la app funciona igual con videos locales y localStorage.
// ===========================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";

import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  increment,
  arrayUnion
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

// Flag global para saber si Firebase está disponible
let firebaseDisponible = false;
let app, db, docRef;

// Intentar inicializar Firebase (no rompe la app si falla)
try {
  app = initializeApp(CONFIGURACION_USUARIO.firebaseConfig);
  db = getFirestore(app);
  docRef = doc(
    db,
    CONFIGURACION_USUARIO.firestoreCollection,
    CONFIGURACION_USUARIO.firestoreDocument
  );
} catch (error) {
  console.warn("⚠️ Firebase no configurado. Usando modo local.", error);
}

// Control de registro único para el listener de Firebase
let firebaseListenerRegistered = false;

/**
 * setupFirebaseListener()
 * Registra el listener en tiempo real de Firestore.
 * Se asegura de que se registre una sola vez y actualice la UI dinámicamente.
 */
function setupFirebaseListener() {
  if (!firebaseDisponible || !docRef || firebaseListenerRegistered) return;

  const counterEl = document.getElementById('hours-counter');
  const playerEl = document.getElementById('reel-player');
  const placeholderEl = document.getElementById('reel-placeholder');
  const totalEl = document.getElementById('reel-total');

  // Si la UI aún no está inicializada, no registrar todavía (se registrará desde initApp)
  if (!counterEl || !playerEl || !totalEl) return;

  firebaseListenerRegistered = true;
  console.log("📡 Registrando listener de Firestore (onSnapshot)...");

  onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();

      // === SINCRONIZAR CONTADOR ===
      const hours = data.horasJuntos || 0;
      localStorage.setItem('horasJuntos', hours.toString());
      animateCounter(counterEl, hours);

      // === SINCRONIZAR LEADERBOARD ===
      if (data.highLaughScore !== undefined) {
        const localHigh = parseInt(localStorage.getItem('highLaughScore') || '0');
        if (data.highLaughScore > localHigh) {
          localStorage.setItem('highLaughScore', data.highLaughScore);
        }
        const scoreHighEl = document.getElementById('score-high');
        if (scoreHighEl) scoreHighEl.textContent = Math.max(localHigh, data.highLaughScore);
        
        // Sincronizar variable local si la función ya se ejecutó
        if (typeof window.highLaughScore !== 'undefined') {
          window.highLaughScore = Math.max(localHigh, data.highLaughScore);
        }
      }

      // === AGREGAR VIDEOS DE FIREBASE a los locales ===
      const firebaseVideos = data.videos || [];
      reelsArray = [
        ...CONFIGURACION_USUARIO.videosLocales,
        ...firebaseVideos
      ];
      totalEl.textContent = reelsArray.length;

      if (reelsArray.length > 0) {
        if (placeholderEl) placeholderEl.style.display = 'none';
        if (playerEl) playerEl.style.display = 'block';

        // Si se acaba de añadir un nuevo video, saltar a él automáticamente
        if (shouldJumpToLastReel) {
          shouldJumpToLastReel = false;
          currentReelIndex = reelsArray.length - 1;
          loadReel(currentReelIndex);
        }
      }
    }
  }, (error) => {
    console.warn("⚠️ onSnapshot error (usando modo local):", error);
  });
}

/**
 * ensureDocumentExists()
 * Verifica si el documento de datos existe en Firestore.
 * Si no existe, lo crea con valores iniciales.
 * Si Firebase no está disponible, no hace nada.
 */
async function ensureDocumentExists() {
  if (!docRef) return;
  try {
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      await setDoc(docRef, {
        horasJuntos: 0,
        videos: [],
        highLaughScore: 0
      });
      console.log("📄 Documento de datos creado en Firestore.");
    }
    firebaseDisponible = true;
    console.log("🔥 Firebase conectado correctamente.");
    
    // Intentar configurar el listener de inmediato ya que Firebase está listo
    setupFirebaseListener();
  } catch (error) {
    console.warn("⚠️ Firebase no disponible. Modo local activado.", error);
    firebaseDisponible = false;
  }
}


// ===========================================================
// 3. FASE 1: SPLASH SCREEN + EXPLOSIÓN DE PARTÍCULAS
// ===========================================================
// Al hacer clic en el splash, se lanzan partículas desde
// el punto de clic usando Canvas 2D API.
// Tras ~1.5s, el splash se desvanece y revela el contenido.
// ===========================================================

/**
 * Clase Particle
 * Representa una partícula individual en la explosión.
 * Cada partícula tiene posición, velocidad, vida, tamaño y color.
 */
class Particle {
  /**
   * @param {number} x - Posición X inicial (punto del clic)
   * @param {number} y - Posición Y inicial (punto del clic)
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;

    // Ángulo aleatorio para la dirección (360 grados)
    const angle = Math.random() * Math.PI * 2;
    // Velocidad aleatoria entre 2 y 12 px/frame
    const speed = Math.random() * 10 + 2;

    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;

    // Vida de la partícula (1 = nueva, 0 = muerta)
    this.life = 1;
    // Velocidad de decaimiento
    this.decay = Math.random() * 0.015 + 0.008;

    // Tamaño aleatorio
    this.size = Math.random() * 5 + 2;

    // Colores en tonos rosa, magenta y dorado
    const hue = Math.random() > 0.3
      ? Math.random() * 40 + 320 // Rosa-magenta (320-360)
      : Math.random() * 20 + 40; // Dorado (40-60)
    const saturation = Math.random() * 30 + 70;
    const lightness = Math.random() * 30 + 50;
    this.color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }

  /**
   * update() — Actualiza la posición y vida de la partícula.
   * Aplica gravedad (0.08) y decaimiento de vida.
   */
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.08; // Gravedad sutil
    this.vx *= 0.99; // Fricción del aire
    this.life -= this.decay;
  }

  /**
   * draw(ctx) — Dibuja la partícula en el canvas.
   * Usa globalAlpha para simular desvanecimiento.
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    if (this.life <= 0) return;
    ctx.globalAlpha = Math.max(0, this.life);
    ctx.fillStyle = this.color;
    // Dibuja un cuadrado (pixelado) para el efecto "explosión de píxeles"
    ctx.fillRect(
      this.x - this.size / 2,
      this.y - this.size / 2,
      this.size,
      this.size
    );
  }
}

/**
 * initSplashScreen()
 * Configura el evento de clic en el splash screen.
 * Al hacer clic, lanza la explosión y luego revela el dashboard.
 */
function initSplashScreen() {
  const splashEl = document.getElementById('splash-screen');
  const canvasEl = document.getElementById('explosion-canvas');
  const ctx = canvasEl.getContext('2d');

  // Ajustar el canvas al tamaño de la ventana
  function resizeCanvas() {
    canvasEl.width = window.innerWidth;
    canvasEl.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Variable para saber si ya se hizo clic (evita múltiples clics)
  let clicked = false;

  /**
   * handleSplashClick(e)
   * Manejador del clic en el splash screen.
   * Crea partículas en el punto de clic y las anima.
   */
  function handleSplashClick(e) {
      if (clicked) return;
      clicked = true;
      try { SoundEngine.playMagicExplosion(); } catch (err) { console.warn("Sound error:", err); }
      try { SoundEngine.playBGM(); } catch (err) { console.warn("BGM error:", err); }

    // Obtener coordenadas del clic (o del toque en móvil)
    const clickX = e.clientX || (e.touches && e.touches[0].clientX) || window.innerWidth / 2;
    const clickY = e.clientY || (e.touches && e.touches[0].clientY) || window.innerHeight / 2;

    // Ocultar el texto inmediatamente
    document.getElementById('splash-text').style.opacity = '0';

    // Crear array de partículas (250 para un efecto impactante)
    const particles = [];
    for (let i = 0; i < 250; i++) {
      particles.push(new Particle(clickX, clickY));
    }

    // Bucle de animación usando requestAnimationFrame
    let animationId;
    function animate() {
      // Limpiar canvas con transparencia para efecto de estela
      ctx.globalAlpha = 0.15;
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);
      ctx.globalAlpha = 1;

      // Actualizar y dibujar cada partícula
      let aliveCount = 0;
      particles.forEach(p => {
        p.update();
        p.draw(ctx);
        if (p.life > 0) aliveCount++;
      });

      // Continuar animación si hay partículas vivas
      if (aliveCount > 0) {
        animationId = requestAnimationFrame(animate);
      }
    }
    animate();

    // Tras 1.5 segundos, desvanecer el splash y mostrar el contenido
    setTimeout(() => {
      splashEl.classList.add('fade-out');

      // Esperar a que termine la transición CSS (0.6s)
      setTimeout(() => {
        splashEl.style.display = 'none';
        cancelAnimationFrame(animationId);

        // Mostrar el contenido principal
        const mainContent = document.getElementById('main-content');
        mainContent.classList.remove('hidden');
        mainContent.style.animation = 'fadeInUp 0.8s ease-out';

        // Iniciar la app: un solo listener de Firestore + UI
        initApp();
      }, 600);
    }, 1500);
  }

  // Escuchar clic (mobile dispara clic automáticamente tras el touch)
  splashEl.addEventListener('click', handleSplashClick);

  // También permitir activación con teclado (accesibilidad)
  splashEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSplashClick(e);
    }
  });
}


// ===========================================================
// 4. INICIALIZACIÓN UNIFICADA POST-SPLASH
// ===========================================================
// Un solo punto de entrada que configura TODO tras el splash:
// - Un ÚNICO onSnapshot para Dashboard + Reels (eficiente)
// - Botones de incremento del Dashboard
// - Controles del reproductor de video
// - Quiz Polaroid
// ===========================================================

/**
 * initApp()
 * Punto de entrada principal post-splash.
 * 
 * ESTRATEGIA DE DATOS:
 * - Videos locales se cargan INMEDIATAMENTE (sin esperar Firebase)
 * - Contador usa localStorage como base, y se sincroniza con Firebase
 *   si está disponible
 * - Firebase es un COMPLEMENTO, no un requisito
 */
function initApp() {
  // --- Referencias del DOM (Dashboard) ---
  const counterEl = document.getElementById('hours-counter');

  // Actualizar textos del dashboard según CONFIGURACION_USUARIO
  document.getElementById('birthday-title').textContent =
    CONFIGURACION_USUARIO.tituloCumpleanos;
  document.getElementById('birthday-subtitle').textContent =
    CONFIGURACION_USUARIO.subtituloCumpleanos;

  // --- Referencias del DOM (Life Reels) ---
  const playerEl = document.getElementById('reel-player');
  const placeholderEl = document.getElementById('reel-placeholder');
  const currentEl = document.getElementById('reel-current');
  const totalEl = document.getElementById('reel-total');

  // =============================================================
  // PASO 1: CARGAR VIDEOS LOCALES INMEDIATAMENTE
  // =============================================================
  // Los videos nativos del proyecto se muestran sin esperar Firebase,
  // a menos que Firebase ya se haya cargado en segundo plano.
  if (!firebaseListenerRegistered) {
    reelsArray = [...CONFIGURACION_USUARIO.videosLocales];
  }
  totalEl.textContent = reelsArray.length;

  if (reelsArray.length > 0) {
    placeholderEl.style.display = 'none';
    playerEl.style.display = 'block';
    loadReel(currentReelIndex);
  }

  // =============================================================
  // PASO 2: CARGAR CONTADOR DESDE LOCALSTORAGE
  // =============================================================
  // localStorage es el fallback cuando Firebase no está configurado.
  // Si Firebase está disponible, onSnapshot sobreescribirá este valor.
  const localHours = parseInt(localStorage.getItem('horasJuntos') || '0', 10);
  animateCounter(counterEl, localHours);

  // =============================================================
  // PASO 3: FIREBASE (opcional) — Sincronizar si está disponible
  // =============================================================
  setupFirebaseListener();

  // =============================================================
  // BOTONES DE INCREMENTO (Dashboard)
  // =============================================================
  // Funcionan con localStorage SIEMPRE + Firebase si está disponible
  const buttons = document.querySelectorAll('.btn-increment');
  buttons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const value = parseInt(btn.dataset.value, 10);

      // Actualizar localStorage (siempre funciona)
      const currentLocal = parseInt(localStorage.getItem('horasJuntos') || '0', 10);
      const newValue = currentLocal + value;
      localStorage.setItem('horasJuntos', newValue.toString());
      animateCounter(counterEl, newValue);

      // Feedback visual
      showToast(`+${value} hora${value > 1 ? 's' : ''} añadida${value > 1 ? 's' : ''} ⏰`);
      counterEl.classList.add('pop');
      setTimeout(() => counterEl.classList.remove('pop'), 300);

      // Intentar sincronizar con Firebase si está disponible
      if (firebaseDisponible && docRef) {
        try {
          await updateDoc(docRef, {
            horasJuntos: increment(value)
          });
        } catch (error) {
          console.warn("⚠️ Firebase sync falló (dato guardado localmente):", error);
        }
      }
    });
  });

  // =============================================================
  // CONTROLES DE LIFE REELS
  // =============================================================
  const playPauseBtn = document.getElementById('btn-play-pause');
  const playOverlay = document.getElementById('reel-play-overlay');

  /**
   * togglePlayPause()
   * Alterna entre reproducir y pausar el video actual.
   */
  function togglePlayPause() {
    if (reelsArray.length === 0) return;

    if (playerEl.paused) {
      playerEl.play().catch(() => {});
    } else {
      playerEl.pause();
    }
  }

  // Sincronizar el botón y el overlay con los eventos reales de reproducción del video
  playerEl.addEventListener('play', () => {
    if (playPauseBtn) playPauseBtn.textContent = '⏸';
    if (playOverlay) playOverlay.classList.remove('paused');
    try { SoundEngine.pauseBGM(); } catch(e){}
  });

  playerEl.addEventListener('pause', () => {
    if (playPauseBtn) playPauseBtn.textContent = '▶';
    if (playOverlay) playOverlay.classList.add('paused');
    try { SoundEngine.resumeBGM(); } catch(e){}
  });

  // Botón play/pause
  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', togglePlayPause);
  }

  // Click en overlay del video para pausar/reanudar
  if (playOverlay) {
    playOverlay.addEventListener('click', togglePlayPause);
  }

  // --- NUEVO: Botón de Mute/Unmute (Corregido para Pixel Art) ---
  const btnMute = document.getElementById('btn-mute');
  if (btnMute) {
    // Por defecto el video inicia silenciado
    btnMute.style.opacity = '0.5';
    
    btnMute.addEventListener('click', (e) => {
      e.stopPropagation(); // Evitar pausar el video al presionar mute
      playerEl.muted = !playerEl.muted;
      
      // Ocultar ondas cuando esté muteado, mostrarlas cuando tenga sonido
      const waves = document.getElementById('volume-waves');
      if (waves) {
        waves.style.display = playerEl.muted ? 'none' : 'flex';
      }
      
      // Indicador visual de mute (opaco = con sonido, semi-transparente = muteado)
      btnMute.style.opacity = playerEl.muted ? '0.5' : '1';
    });
  }


  // --- HUD: Botón Like ---
  const btnLike = document.getElementById('btn-like');
  if (btnLike) {
    btnLike.addEventListener('click', (e) => {
      e.stopPropagation();
      if (reelsArray.length === 0) return;
      
      const videoURL = reelsArray[currentReelIndex];
      let likedReels = JSON.parse(localStorage.getItem('likedReels') || '[]');
      const isLiked = likedReels.includes(videoURL);
      
      const heartIcon = document.getElementById('hud-heart-icon');
      const likeCount = document.getElementById('hud-like-count');
      
      if (isLiked) {
        // Quitar like
        likedReels = likedReels.filter(url => url !== videoURL);
        heartIcon.className = 'pixel-heart-empty';
        likeCount.textContent = '0';
      } else {
        // Dar like
        likedReels.push(videoURL);
        heartIcon.className = 'pixel-heart-full';
        likeCount.textContent = '1';
      }
      localStorage.setItem('likedReels', JSON.stringify(likedReels));
    });
  }

  // --- HUD: Botón Comentarios ---
  const btnComment = document.getElementById('btn-comment');
  const commentsSheet = document.getElementById('comments-sheet');
  const btnCloseComments = document.getElementById('btn-close-comments');
  
  if (btnComment && commentsSheet) {
    btnComment.addEventListener('click', (e) => {
      e.stopPropagation();
      if (reelsArray.length === 0) return;
      
      const videoURL = reelsArray[currentReelIndex];
      const allComments = JSON.parse(localStorage.getItem('reelCommentsV4') || '{}');
      const currentComments = allComments[videoURL] || [];
      
      const commentsList = document.getElementById('comments-list');
      commentsList.innerHTML = '';
      
      currentComments.forEach((c, i) => {
        const item = document.createElement('div');
        item.className = 'comment-item';
        item.style.animationDelay = `${i * 0.05}s`; // Efecto cascada
        
        item.innerHTML = `
          <div class="pixel-avatar"></div>
          <div class="comment-content">
            <div class="comment-author">${c.author}</div>
            <div class="comment-text">${c.text}</div>
          </div>
        `;
        commentsList.appendChild(item);
      });
      
      commentsSheet.classList.add('open');
    });
  }
  
  if (btnCloseComments) {
    btnCloseComments.addEventListener('click', (e) => {
      e.stopPropagation();
      commentsSheet.classList.remove('open');
    });
  }

  // BOTÓN SIGUIENTE — Avanza al siguiente reel (con módulo)
  document.getElementById('btn-next-reel').addEventListener('click', () => {
    if (reelsArray.length === 0) return;
    currentReelIndex = (currentReelIndex + 1) % reelsArray.length;
    loadReel(currentReelIndex, 1);
  });

  // BOTÓN ANTERIOR — Retrocede al reel anterior (con módulo)
  document.getElementById('btn-prev-reel').addEventListener('click', () => {
    if (reelsArray.length === 0) return;
    currentReelIndex = (currentReelIndex - 1 + reelsArray.length) % reelsArray.length;
    loadReel(currentReelIndex, -1);
  });

  // AUTO-AVANCE — Al terminar un video, pasar al siguiente
  playerEl.addEventListener('ended', () => {
    if (reelsArray.length === 0) return;
    currentReelIndex = (currentReelIndex + 1) % reelsArray.length;
    loadReel(currentReelIndex, 1);
  });

  // ---------------------------------------------------------
  // INTERSECTION OBSERVER — Auto-pause cuando no es visible
  // ---------------------------------------------------------
  // Pausa el video automáticamente cuando la sección de reels
  // sale del viewport (ej: el usuario hace scroll al quiz).
  // Ahorra recursos de CPU/batería.
  // ---------------------------------------------------------
  const reelsSection = document.getElementById('life-reels');
  if ('IntersectionObserver' in window && reelsSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting && !playerEl.paused) {
          // Video salió de la pantalla → pausar
          playerEl.pause();
          if (playPauseBtn) playPauseBtn.textContent = '▶';
          if (playOverlay) playOverlay.classList.add('paused');
        }
      });
    }, { threshold: 0.2 }); // Se activa cuando menos del 20% es visible

    observer.observe(reelsSection);
  }

  // BOTÓN AÑADIR REEL — Agrega URL al array con arrayUnion
  document.getElementById('btn-add-reel').addEventListener('click', addNewReel);
  document.getElementById('new-reel-url').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addNewReel();
  });


  // --- BOTONES DE NAVEGACION POLAROID ---
  document.getElementById('btn-prev-photo').addEventListener('click', () => {
    if (currentViewLevel > 0) {
      currentViewLevel--;
      loadLevelView(currentViewLevel);
    }
  });

  document.getElementById('btn-next-photo').addEventListener('click', () => {
    const maxViewable = Math.min(currentImageLevel, 10);
    if (currentViewLevel < maxViewable) {
      currentViewLevel++;
      loadLevelView(currentViewLevel);
      if (currentViewLevel === currentImageLevel && currentImageLevel < 11) {
        prepareNextRound(); 
      }
    }
  });

  // ---------------------------------------------------------
  // MINIJUEGOS (DASHBOARD)
  // ---------------------------------------------------------
  
  // --- MINIJUEGO 1: Cazador de Risas ---
  const laughTarget = document.getElementById('laugh-target');
  const scoreCurrentEl = document.getElementById('score-current');
  const scoreHighEl = document.getElementById('score-high');
  const laughStatus = document.getElementById('laugh-status');
  
  let currentLaughScore = 0;
  let highLaughScore = parseInt(localStorage.getItem('highLaughScore') || '0');
  if (scoreHighEl) scoreHighEl.textContent = highLaughScore;
  let laughTimeout;
  
  function moveLaughTarget() {
    const arena = document.getElementById('laughs-arena');
    if (!arena || !laughTarget) return;
    
    const newTop = Math.floor(Math.random() * 80) + 10;
    const newLeft = Math.floor(Math.random() * 80) + 10;
    laughTarget.style.top = newTop + '%';
    laughTarget.style.left = newLeft + '%';
    
    clearTimeout(laughTimeout);
    const timeLimit = Math.max(400, 1500 - (currentLaughScore * 80)); // Se hace más difícil
    
    laughTimeout = setTimeout(() => {
      if (currentLaughScore > 0) {
        laughStatus.textContent = `¡Se escapó! Puntaje final: ${currentLaughScore}`;
        laughStatus.style.color = "var(--pink-dark)";
        currentLaughScore = 0;
        scoreCurrentEl.textContent = currentLaughScore;
      }
      moveLaughTarget();
    }, timeLimit);
  }
  
  if (laughTarget) {
    moveLaughTarget();
    laughTarget.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      try { SoundEngine.playHeart(); } catch (err) { console.warn("Sound error:", err); }
      currentLaughScore++;
      scoreCurrentEl.textContent = currentLaughScore;
      laughStatus.textContent = "¡Atrapada!";
      laughStatus.style.color = "var(--mint)";
      
      if (currentLaughScore > highLaughScore) {
        highLaughScore = currentLaughScore;
        scoreHighEl.textContent = highLaughScore;
        localStorage.setItem('highLaughScore', highLaughScore);
        laughStatus.textContent = "¡NUEVO RÉCORD!";
        laughStatus.style.color = "#b8860b";
        
        // Guardar globalmente en Firebase
        if (typeof firebaseDisponible !== 'undefined' && firebaseDisponible && typeof docRef !== 'undefined' && docRef) {
          try {
            updateDoc(docRef, { highLaughScore: highLaughScore });
          } catch(e) { console.warn("Error guardando récord:", e); }
        }
      }
      
      moveLaughTarget();
    });
  }

  // --- MINIJUEGO 2: Medidor de Amistad ---
  const btnMash = document.getElementById('btn-mash');
  const friendshipBar = document.getElementById('friendship-bar');
  const friendshipStatus = document.getElementById('friendship-status');
  
  let friendshipProgress = 0;
  let mashInterval;
  let isFriendshipMaxed = false;
  
  if (btnMash) {
    btnMash.addEventListener('mousedown', () => btnMash.style.transform = 'scale(0.95)');
    btnMash.addEventListener('mouseup', () => btnMash.style.transform = 'scale(1)');
    btnMash.addEventListener('mouseleave', () => btnMash.style.transform = 'scale(1)');
    
    btnMash.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isFriendshipMaxed) return;
      
      friendshipProgress += 8; 
      if (friendshipProgress >= 100) {
        friendshipProgress = 100;
        isFriendshipMaxed = true;
        friendshipStatus.textContent = "∞ Infinito";
        friendshipStatus.style.color = "#b8860b";
        btnMash.textContent = "¡AMISTAD MÁXIMA!";
        btnMash.style.background = "linear-gradient(90deg, var(--pink-primary), var(--gold))";
        btnMash.style.color = "white";
        createConfettiExplosion();
        try { SoundEngine.playSmallConfetti(); } catch (err) { console.warn("Sound error:", err); }
      } else {
        friendshipStatus.textContent = Math.floor(friendshipProgress) + "%";
      }
      friendshipBar.style.width = friendshipProgress + "%";
    });
    
    mashInterval = setInterval(() => {
      if (!isFriendshipMaxed && friendshipProgress > 0) {
        friendshipProgress -= 2.5; 
        if (friendshipProgress < 0) friendshipProgress = 0;
        friendshipStatus.textContent = Math.floor(friendshipProgress) + "%";
        friendshipBar.style.width = friendshipProgress + "%";
      }
    }, 150);
  }
  
  function createConfettiExplosion() {
    const card = document.getElementById('card-friendship');
    if (!card) return;
    const colors = ['#ff4d4d', '#ffaa00', '#7c3aed', '#ff1493', '#00b4d8'];
    for(let i=0; i<30; i++) {
      const conf = document.createElement('div');
      conf.className = 'confetti-explosion';
      conf.style.background = colors[i % colors.length];
      conf.style.left = "50%";
      conf.style.top = "50%";
      const angle = Math.random() * Math.PI * 2;
      const velocity = 50 + Math.random() * 100;
      conf.style.setProperty('--dx', `${Math.cos(angle) * velocity}px`);
      conf.style.setProperty('--dy', `${Math.sin(angle) * velocity + 150}px`);
      card.appendChild(conf);
      setTimeout(() => conf.remove(), 2000);
    }
  }

  // ---------------------------------------------------------
  // QUIZ POLAROID
  // ---------------------------------------------------------
  initQuiz();
}


// ===========================================================
// 5. ANIMACIÓN DEL CONTADOR
// ===========================================================

/**
 * animateCounter(element, targetValue)
 * Anima el valor del contador desde su valor actual
 * hasta el nuevo valor con un efecto de conteo rápido.
 * 
 * @param {HTMLElement} element - Elemento del DOM del contador
 * @param {number} targetValue - Valor final del contador
 */
function animateCounter(element, targetValue) {
  const currentValue = parseInt(element.textContent, 10) || 0;
  const diff = targetValue - currentValue;

  // Si no hay diferencia, solo asignar
  if (diff === 0) {
    element.textContent = targetValue;
    return;
  }

  const duration = 500; // ms
  const startTime = performance.now();

  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Función de easing (ease-out)
    const eased = 1 - Math.pow(1 - progress, 3);

    const current = Math.round(currentValue + diff * eased);
    element.textContent = current.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}


// ===========================================================
// 6. LIFE REELS — FUNCIONES AUXILIARES
// ===========================================================
// Los videos se almacenan como array en Firestore.
// Se implementa bucle infinito con módulo: si el índice
// supera el total, vuelve a 0.
// ===========================================================

// Constantes para la generación procedural de comentarios
const COMMENT_NAMES = ["Dilan", "Bastian", "Fransisca", "Pascuala", "Octavio", "Maximo", "Violeta", "Claudio", "Jhon Alex", "Mori", "Aquiles", "Rocky", "Tom"];

const PARENTAL_PHRASES = [
  "Qué lindo recuerdo, hijo. Te quiero mucho, Mathias.",
  "Mi niño hermoso, me encanta verte feliz.",
  "Qué grande estás mi Mathias, besitos.",
  "Tan lindo mi niño en este video.",
  "Buena Mathias, un abrazo grande.",
  "Qué buen momento, saludos Mathias.",
  "Ese es mi muchacho, ¡excelente video!",
  "Me alegro de verte bien, Mathias. Un abrazo."
];

const CHILEAN_PHRASES = [
  "Weeena Mathias, te sacaste el manso video hermano.",
  "Puta el weon pulento, grande Mathias.",
  "Brígido el video compare, te pasaste Mathias.",
  "Aonde la viste Mathias, estai entero vio.",
  "Puro corte el Mathias, oe zí.",
  "De vio el Mathias, manso estilo hermano.",
  "Saaaale pa allá Mathias, te fuiste en la volá.",
  "Ese es mi compa Mathias, terrible choro el video.",
  "Wena wena Mathias, tamos ready pa la otra.",
  "El culiao máquina, yapo Mathias saca otro video.",
  "Mansos cortes Mathias, le pusiste color.",
  "Ta de vio la wea Mathias, un crack.",
  "Puta la wea wena Mathias, saludos compare.",
  "Te fuiste al chancho Mathias, tremendo video."
];

/** Control para saltar al último reel cuando se añade uno nuevo */
let shouldJumpToLastReel = false;

/** Índice actual del reel (variable de estado local) */
let currentReelIndex = 0;

/** Array local de URLs de video (sincronizado con Firestore) */
let reelsArray = [];

/**
 * loadReel(index, direction)
 * Carga y reproduce un video del array en la posición indicada con animación vertical.
 * 
 * @param {number} index - Índice del video en reelsArray
 * @param {number} direction - Dirección del deslizamiento (1 hacia arriba, -1 hacia abajo)
 */
function loadReel(index, direction = 1) {
  const playerEl = document.getElementById('reel-player');
  const currentEl = document.getElementById('reel-current');

  if (reelsArray.length === 0 || index < 0 || index >= reelsArray.length) return;

  const videoURL = reelsArray[index];
  
  // --- ANIMACIÓN TIPO TIKTOK (Preparar posición inicial) ---
  playerEl.style.transition = 'none';
  playerEl.style.transform = `translateY(${direction * 100}%)`;
  
  // Forzar reflujo para aplicar la posición inicial antes de iniciar la transición
  void playerEl.offsetWidth;

  playerEl.src = videoURL;
  
  // OBLIGATORIO: Forzar al navegador a cargar la nueva fuente de video.
  // Sin esto, los videos remotos pueden fallar al intentar reemplazar un video local.
  playerEl.load();
  
  currentEl.textContent = index + 1; // Mostrar 1-indexado

  // --- SINCRONIZAR HUD (Likes) ---
  const likedReels = JSON.parse(localStorage.getItem('likedReels') || '[]');
  const isLiked = likedReels.includes(videoURL);
  const heartIcon = document.getElementById('hud-heart-icon');
  const likeCount = document.getElementById('hud-like-count');
  
  if (heartIcon && likeCount) {
    if (isLiked) {
      heartIcon.className = 'pixel-heart-full';
      likeCount.textContent = '1';
    } else {
      heartIcon.className = 'pixel-heart-empty';
      likeCount.textContent = '0';
    }
  }

  // --- SINCRONIZAR HUD (Comentarios) ---
  let allComments = JSON.parse(localStorage.getItem('reelCommentsV4') || '{}');
  if (!allComments[videoURL]) {
    // Generar nuevos comentarios aleatorios para este video si no existen
    const numComments = Math.floor(Math.random() * 3) + 5; // Entre 5 y 7
    const generated = [];
    const usedNames = new Set();
    const usedPhrases = new Set();
    
    // Asegurar que no pidamos más comentarios que nombres disponibles
    const maxComments = Math.min(numComments, COMMENT_NAMES.length);
    
    for(let i=0; i<maxComments; i++) {
      let randomName;
      // 1. Evitar que el mismo usuario comente dos veces en el mismo video
      do {
        randomName = COMMENT_NAMES[Math.floor(Math.random() * COMMENT_NAMES.length)];
      } while (usedNames.has(randomName));
      usedNames.add(randomName);
      
      let randomPhrase = "";
      const isParental = (randomName === "Violeta" || randomName === "Claudio");
      const phraseArray = isParental ? PARENTAL_PHRASES : CHILEAN_PHRASES;
      
      // 2. Evitar que se repita exactamente el mismo comentario en el mismo video
      let attempts = 0;
      do {
        randomPhrase = phraseArray[Math.floor(Math.random() * phraseArray.length)];
        attempts++;
      } while (usedPhrases.has(randomPhrase) && attempts < 20); // attempts previene bucles infinitos si hay pocas frases
      usedPhrases.add(randomPhrase);
      
      generated.push({ author: randomName, text: randomPhrase });
    }
    allComments[videoURL] = generated;
    localStorage.setItem('reelCommentsV4', JSON.stringify(allComments));
  }
  
  const currentCommentsCount = document.getElementById('hud-comment-count');
  if (currentCommentsCount) {
    currentCommentsCount.textContent = allComments[videoURL].length;
  }

  // Cerrar panel de comentarios si estaba abierto al cambiar de video
  const commentsSheet = document.getElementById('comments-sheet');
  if (commentsSheet) commentsSheet.classList.remove('open');

  // --- ANIMACIÓN TIPO TIKTOK (Deslizar hacia el centro) ---
  playerEl.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  playerEl.style.transform = 'translateY(0)';

  // Manejar errores de carga de video (ej. CORS, URL caída, formato no soportado)
  playerEl.onerror = () => {
    console.error("❌ Error al cargar el video:", videoURL, playerEl.error);
    // Mostrar un toast para que el usuario sepa que el video está roto
    if (typeof showToast === "function") {
      showToast("Error al cargar este video 🚫");
    }
  };

  // Intentar reproducción automática
  playerEl.play().catch((err) => {
    // Silenciar el error — el usuario puede hacer clic manualmente
    console.log("ℹ️ Autoplay bloqueado o video cargando. El usuario puede interactuar.", err);
  });
}

/**
 * addNewReel()
 * Lee la URL del input, valida que sea una URL,
 * y la agrega al array de videos en Firestore con arrayUnion.
 * Requiere Firebase configurado y conectado.
 */
async function addNewReel() {
  const inputEl = document.getElementById('new-reel-url');
  const url = inputEl.value.trim();

  // Validación básica de URL
  if (!url) {
    showToast("Pega una URL de video primero 📋");
    return;
  }

  try {
    new URL(url); // Lanza error si no es URL válida
  } catch {
    showToast("URL no válida. Intenta de nuevo 🔗");
    return;
  }

  // Verificar que Firebase esté disponible
  if (!firebaseDisponible || !docRef) {
    showToast("Firebase no conectado. El video no se puede guardar 🔌");
    return;
  }

  try {
    shouldJumpToLastReel = true;
    // Usar arrayUnion para añadir sin duplicar
    await updateDoc(docRef, {
      videos: arrayUnion(url)
    });

    inputEl.value = ''; // Limpiar el input
    showToast("¡Reel añadido! 🎬");
  } catch (error) {
    shouldJumpToLastReel = false;
    console.error("❌ Error al añadir reel:", error);
    showToast("Error al guardar el reel 😢");
  }
}


// ===========================================================
// 6. FASE 4: QUIZ POLAROID + CONFETI
// ===========================================================
// Quiz de 4 preguntas secuenciales.
// - Correcta → Siguiente pregunta
// - Incorrecta → Shake + Reinicio a pregunta 1
// - 4 correctas seguidas → Confeti + Reveal Polaroid
// 
// El estado del quiz es LOCAL (se reinicia al recargar).
// ===========================================================

/** Índice de la pregunta actual del quiz */
let currentImageLevel = 0;
let currentViewLevel = 0;
let currentQuestionsForLevel = [];
let quizCurrentIndex = 0;
let quizLocked = false;
let availableQuestions = [];
let finalQuestionIndex = CONFIGURACION_USUARIO.quizPreguntas.length - 1; // La última pregunta

function initQuiz() {
  availableQuestions = [];
  for(let i = 0; i < CONFIGURACION_USUARIO.quizPreguntas.length - 1; i++) {
    availableQuestions.push(i);
  }
  currentImageLevel = 0;
  currentViewLevel = 0;
  loadLevelView(currentImageLevel);
  prepareNextRound();
}

function loadLevelView(level) {
  const imgData = CONFIGURACION_USUARIO.imagenesGaleria[level];
  const photoEl = document.getElementById('polaroid-photo');
  const lockEl = document.getElementById('polaroid-lock');
  const infoEl = document.getElementById('polaroid-info');
  const titleEl = document.getElementById('polaroid-title');
  const descEl = document.getElementById('polaroid-desc');
  const rarityEl = document.getElementById('polaroid-rarity');
  const containerEl = document.getElementById('polaroid-container');
  const levelTextEl = document.getElementById('gallery-level');
  const quizSection = document.getElementById('quiz-container');
  const btnPrev = document.getElementById('btn-prev-photo');
  const btnNext = document.getElementById('btn-next-photo');
  
  photoEl.src = imgData.src;
  
  if (level === 10 && currentImageLevel === 10) {
    levelTextEl.textContent = "Nivel Final";
  } else {
    levelTextEl.textContent = `Nivel ${level + 1} de 11`;
  }
  
  if (level < currentImageLevel) {
    containerEl.classList.remove('blurred');
    containerEl.classList.add('revealed');
    lockEl.style.display = 'none';
    infoEl.style.display = 'block';
    titleEl.textContent = imgData.title;
    descEl.textContent = imgData.desc;
    rarityEl.className = `polaroid-rarity ${imgData.rarityClass}`;
    rarityEl.textContent = imgData.rarityName;
    rarityEl.style.display = 'inline-block';
    quizSection.style.display = 'none';
    const maxViewable = Math.min(currentImageLevel, 10);
    btnNext.style.display = level >= maxViewable ? 'none' : 'inline-block';
  } else {
    containerEl.classList.add('blurred');
    containerEl.classList.remove('revealed');
    lockEl.style.display = 'block';
    infoEl.style.display = 'none';
    quizSection.style.display = 'block';
    btnNext.style.display = 'none';
  }
  
  btnPrev.style.display = level > 0 ? 'inline-block' : 'none';
}

function prepareNextRound() {
  currentQuestionsForLevel = [];
  if (currentImageLevel === 10) {
    if (availableQuestions.length > 0) {
      const rIdx = Math.floor(Math.random() * availableQuestions.length);
      currentQuestionsForLevel.push(availableQuestions.splice(rIdx, 1)[0]);
    }
    currentQuestionsForLevel.push(finalQuestionIndex);
  } else {
    for(let i=0; i<2; i++) {
      if (availableQuestions.length === 0) break;
      const rIdx = Math.floor(Math.random() * availableQuestions.length);
      currentQuestionsForLevel.push(availableQuestions.splice(rIdx, 1)[0]);
    }
  }
  quizCurrentIndex = 0;
  if (currentQuestionsForLevel.length > 0) {
    renderQuestion(currentQuestionsForLevel[quizCurrentIndex]);
  }
}

function renderQuestion(globalIndex) {
  const pregunta = CONFIGURACION_USUARIO.quizPreguntas[globalIndex];
  document.getElementById('quiz-question').textContent = pregunta.pregunta;
  const statusNum = document.getElementById('quiz-current-num');
  if (statusNum) statusNum.textContent = quizCurrentIndex + 1;
  const dots = document.querySelectorAll('.progress-dot');
  dots.forEach((dot, i) => {
    dot.classList.remove('active', 'completed');
    if (i < quizCurrentIndex) dot.classList.add('completed');
    if (i === quizCurrentIndex) dot.classList.add('active');
  });
  const optionsContainer = document.getElementById('quiz-options');
  optionsContainer.innerHTML = ''; 
  pregunta.opciones.forEach((opcion, i) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option';
    btn.textContent = opcion;
    btn.setAttribute('role', 'option');
    btn.id = `quiz-option-${i}`;
    btn.addEventListener('click', () => handleAnswer(i, pregunta.correcta, btn));
    optionsContainer.appendChild(btn);
  });
}

function handleAnswer(selectedIndex, correctIndex, buttonEl) {
  if (quizLocked) return;
  quizLocked = true;
  if (selectedIndex === correctIndex) {
    buttonEl.classList.add('correct');
    setTimeout(() => {
      quizCurrentIndex++;
      if (quizCurrentIndex >= currentQuestionsForLevel.length) {
        onLevelComplete();
      } else {
        renderQuestion(currentQuestionsForLevel[quizCurrentIndex]);
      }
      quizLocked = false;
    }, 700);
  } else {
    buttonEl.classList.add('wrong');
    const correctBtn = document.getElementById(`quiz-option-${correctIndex}`);
    if (correctBtn) correctBtn.classList.add('correct');
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.classList.add('shake');
    setTimeout(() => {
      quizContainer.classList.remove('shake');
      quizCurrentIndex = 0;
      renderQuestion(currentQuestionsForLevel[0]);
      quizLocked = false;
      showToast("¡Ups! Vuelve a intentar este nivel 🔄");
    }, 800);
  }
}

function onLevelComplete() {
  launchConfetti();
  currentImageLevel++;
  
  const containerEl = document.getElementById('polaroid-container');
  containerEl.classList.remove('blurred');
  containerEl.classList.add('revealed');
  
  document.getElementById('polaroid-lock').style.display = 'none';
  document.getElementById('polaroid-info').style.display = 'block';
  
  const imgData = CONFIGURACION_USUARIO.imagenesGaleria[currentViewLevel];
  document.getElementById('polaroid-title').textContent = imgData.title;
  document.getElementById('polaroid-desc').textContent = imgData.desc;
  
  const rarityEl = document.getElementById('polaroid-rarity');
  rarityEl.className = `polaroid-rarity ${imgData.rarityClass}`;
  rarityEl.textContent = imgData.rarityName;
  rarityEl.style.display = 'inline-block';
  
  document.getElementById('quiz-container').style.display = 'none';
  document.getElementById('btn-next-photo').style.display = 'inline-block';
  
  if (currentImageLevel >= 11) {
    try { SoundEngine.playGrandConfetti(); } catch (err) { console.warn("Sound error:", err); }
    document.getElementById('btn-next-photo').style.display = 'none';
    
    // Inyectar el mensaje final del usuario
    const finalMsg = document.getElementById('final-message');
    document.getElementById('final-text').innerHTML = CONFIGURACION_USUARIO.mensajeFinal.replace(/\n/g, '<br>');
    document.getElementById('final-signature').textContent = CONFIGURACION_USUARIO.firmaFinal;
    
    if (finalMsg) finalMsg.classList.remove('hidden');
    showToast("🎉 ¡Felicidades! Has desbloqueado todo.");
    
    setTimeout(() => {
      document.getElementById('final-message').scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }, 500);
  } else {
    try { SoundEngine.playRarity(imgData.rarityClass); } catch (err) { console.warn("Sound error:", err); }
    showToast(`🎉 ¡Nivel ${currentImageLevel} desbloqueado!`);
    setTimeout(() => {
      document.getElementById('gallery-nav').scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }, 300);
  }
}


// ===========================================================
// 6B. SISTEMA DE CONFETI (Canvas)
// ===========================================================
// Partículas de confeti que caen desde arriba del viewport.
// Usa el canvas #confetti-canvas superpuesto a toda la página.
// ===========================================================

/**
 * Clase ConfettiPiece
 * Representa una pieza de confeti con forma rectangular,
 * rotación, y movimiento oscilante hacia abajo.
 */
class ConfettiPiece {
  /**
   * @param {number} canvasWidth - Ancho del canvas
   * @param {number} canvasHeight - Alto del canvas
   */
  constructor(canvasWidth, canvasHeight) {
    // Posición inicial: aleatoria en X, por encima del viewport
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * -canvasHeight;

    // Velocidad de caída y oscilación lateral
    this.vy = Math.random() * 3 + 2;
    this.vx = Math.random() * 2 - 1;

    // Dimensiones del confeti (rectángulo estrecho)
    this.width = Math.random() * 8 + 4;
    this.height = Math.random() * 4 + 2;

    // Rotación
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = Math.random() * 0.1 - 0.05;

    // Oscilación lateral
    this.oscillationSpeed = Math.random() * 0.03 + 0.01;
    this.oscillationDistance = Math.random() * 40 + 10;
    this.xStart = this.x;
    this.time = Math.random() * 100;

    // Color vibrante aleatorio
    const colors = [
      '#ff66b2', '#ffb3d9', '#ff1493', '#ffd700',
      '#c084fc', '#7c3aed', '#6ee7b7', '#ff6b6b',
      '#f472b6', '#fb923c', '#a78bfa', '#34d399'
    ];
    this.color = colors[Math.floor(Math.random() * colors.length)];

    // Vida
    this.life = 1;
    this.canvasHeight = canvasHeight;
  }

  update() {
    this.time++;
    this.y += this.vy;
    this.x = this.xStart + Math.sin(this.time * this.oscillationSpeed) * this.oscillationDistance;
    this.rotation += this.rotationSpeed;

    // Decrementar vida cuando pasa de la mitad de la pantalla
    if (this.y > this.canvasHeight * 0.7) {
      this.life -= 0.01;
    }
  }

  /**
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    if (this.life <= 0) return;
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.life);
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.fillStyle = this.color;
    ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    ctx.restore();
  }
}

/**
 * launchConfetti()
 * Crea y anima 300 piezas de confeti durante ~4 segundos.
 */
function launchConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');

  // Ajustar canvas al viewport
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Crear piezas de confeti
  const pieces = [];
  for (let i = 0; i < 300; i++) {
    pieces.push(new ConfettiPiece(canvas.width, canvas.height));
  }

  let frame = 0;
  const maxFrames = 240; // ~4 segundos a 60fps

  function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let aliveCount = 0;
    pieces.forEach(p => {
      p.update();
      p.draw(ctx);
      if (p.life > 0 && p.y < canvas.height + 50) aliveCount++;
    });

    frame++;

    if (aliveCount > 0 && frame < maxFrames) {
      requestAnimationFrame(animateConfetti);
    } else {
      // Limpiar canvas al terminar
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  animateConfetti();
}


// ===========================================================
// 7. UTILIDADES
// ===========================================================

/**
 * showToast(message, duration)
 * Muestra una notificación temporal (toast) en la parte
 * inferior de la pantalla.
 * 
 * @param {string} message - Texto del toast
 * @param {number} duration - Duración en ms (por defecto 2500)
 */
function showToast(message, duration = 2500) {
  const toast = document.getElementById('toast-container');
  toast.textContent = message;
  toast.classList.add('show');

  // Ocultar tras la duración especificada
  setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}


// ===========================================================
// 8. INICIALIZACIÓN DE LA APLICACIÓN
// ===========================================================
// Punto de entrada principal. Se ejecuta cuando el DOM
// está completamente cargado.
// ===========================================================

function bootstrapApp() {
  console.log("🎂 Birthday Surprise SPA — Cargada");

  // PRIMERO: Inicializar el splash screen (NO depende de Firebase)
  initSplashScreen();

  // DESPUÉS: Conectar Firebase en segundo plano (no bloquea)
  ensureDocumentExists().catch(err => {
    console.warn("⚠️ Firebase init falló:", err);
  });
}

// Arranque a prueba de balas: si el DOM ya cargó, arranca de inmediato.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrapApp);
} else {
  bootstrapApp();
}
