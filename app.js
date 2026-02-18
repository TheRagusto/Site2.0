document.addEventListener('DOMContentLoaded', () => {
  try {
    const slides = document.getElementById('slides');
    const navLinks = Array.from(document.querySelectorAll('.navbar a'));
    const slideEls = Array.from(document.querySelectorAll('.slide'));
    const order = ['about', 'video', 'graphics', 'music'];
    // Language toggle (EN/ES)
    const langToggle = document.getElementById('langToggle');
    window.__lang = 'en';

    const hero1 = document.getElementById('heroLine1');
    const hero2 = document.getElementById('heroLine2');
    const hero3 = document.getElementById('heroLine3');
    const hero4 = document.getElementById('heroLine4');
    const musicNow = document.getElementById('musicNow');

    const i18n = {
      en: {
        hero: ["Video Editor","and motion graphics designer","passionate about music, and","storytelling"],
        nav: { about: "About me", video: "Video", graphics: "Graphics", music: "Music" },
        nowPlaying: "NOW PLAYING"
      },
      es: {
        hero: ["Editor de video","y diseñador de motion graphics","apasionado por la música y","el storytelling"],
        nav: { about: "Sobre mí", video: "Video", graphics: "Gráficos", music: "Música" },
        nowPlaying: "REPRODUCIENDO"
      }
    };

    function applyLanguage(lang){
      window.__lang = lang;

      // document language
      document.documentElement.lang = (lang === 'es' ? 'es' : 'en');

      // About hero
      const h = i18n[lang].hero;
      if (hero1) hero1.textContent = h[0];
      if (hero2) hero2.textContent = h[1];
      if (hero3) hero3.textContent = h[2];
      if (hero4) hero4.textContent = h[3];

      // Navbar labels
      navLinks.forEach(a => {
        const key = (a.getAttribute('data-nav') || '').toLowerCase();
        if (i18n[lang].nav[key]) a.textContent = i18n[lang].nav[key];
      });

      // NOW PLAYING label (preserve dots element)
      if (musicNow){
        const dots = musicNow.querySelector('.np-dots');
        musicNow.textContent = i18n[lang].nowPlaying;
        if (dots) musicNow.appendChild(dots);
      }

      // Refresh currently selected project/track text (titles stay the same)
      try{
        if (typeof window.__currentProjectIdx === 'number') setProject(window.__currentProjectIdx);
        if (typeof window.__currentTrackIdx === 'number') setNowPlaying(window.__currentTrackIdx);
      } catch(e){}
    }

    if (langToggle){
      const toggle = () => applyLanguage(window.__lang === 'en' ? 'es' : 'en');
      langToggle.addEventListener('click', toggle);
      langToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
      });
    }


    const logo = document.getElementById('logo');

    function updateLogoShift(section) {
      if (!logo) return;
      // Only shift in music when "Ragus" is visible
      if (section !== 'music') {
        logo.style.setProperty('--logo-shift', '0px');
        return;
      }
      const raf = logo.querySelector('.logo-name.is-rafael');
      const rag = logo.querySelector('.logo-name.is-ragus');
      if (!raf || !rag) return;

      // Measure the delta between the two text widths so the right edge feels anchored.
      const wRafael = raf.getBoundingClientRect().width;
      const wRagus = rag.getBoundingClientRect().width;
      const shift = Math.round(Math.max(0, (wRafael - wRagus)));
      logo.style.setProperty('--logo-shift', shift + 'px');
    }

    function safeSetTransform(idx) {
      if (!slides) return;
      slides.style.transform = `translateX(${-idx * 100}vw)`;
    }

    function setActive(section) {
      const idx = Math.max(0, order.indexOf(section));
      const active = order[idx] || 'about';

      safeSetTransform(idx);
      document.body.setAttribute('data-section', active);

      updateLogoShift(active);

      slideEls.forEach(s => s.classList.toggle('is-active', s.getAttribute('data-section') === active));
      navLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('data-nav') === active));
    }

    function normalizeHash() {
      const raw = (location.hash || '#about').replace('#', '').trim().toLowerCase();
      return order.includes(raw) ? raw : 'about';
    }

    // Hash-driven navigation (deep links)
    function fromHash() {
      setActive(normalizeHash());
    }

    window.addEventListener('hashchange', fromHash);

    // Click-driven navigation (works even if hashchange is interfered by hosting/router)
    navLinks.forEach(a => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const section = (a.getAttribute('data-nav') || 'about').toLowerCase();
        setActive(section);

        // keep URL in sync without forcing scroll/jump
        if (history && history.replaceState) {
          history.replaceState(null, '', '#' + section);
        } else {
          location.hash = section;
        }
      });
    });

    // Initial
    fromHash();
    applyLanguage(window.__lang);


    window.addEventListener('resize', () => updateLogoShift(document.body.getAttribute('data-section') || 'about'));

    // Project tabs (Video)
    const projectTabs = Array.from(document.querySelectorAll('.video-tabs .video-tab'));
    const projectFrame = document.getElementById('projectYouTube');
    const projectTitle = document.getElementById('projectTitle');
    const projectDesc = document.getElementById('projectDesc');
    const videoPreview = document.querySelector('.video-preview');

    const projects = [
  {
    title: "\"Freestylers Compilation (Kraken Battles)\"",
    desc_en:
      "I planned, recorded, and edited this TikTok-style compilation. We attended a freestyle meet, selected a few standout freestylers, and cut the highlights to showcase their talent and energy.",
    desc_es:
      "Planifiqué, grabé y edité esta compilación estilo TikTok. Fuimos a un evento de freestyle, seleccionamos a varios competidores destacados y armamos los mejores momentos para mostrar su talento y energía.",
    youtube: "https://www.youtube.com/embed/fHCXzycv-Zc"
  },
  {
    title: "\"Redes\"",
    desc_en: "University short film. I worked as Director of Photography and editor.",
    desc_es: "Cortometraje universitario. Participé como director de fotografía y editor.",
    youtube: "https://www.youtube.com/embed/eTviGXcaWHo"
  },
  {
    title: "\"Las Olas\"",
    desc_en: "University short film. I worked as sound recordist and audio editor.",
    desc_es: "Cortometraje universitario. Participé como sonidista y editor de audio.",
    youtube: "https://www.youtube.com/embed/hJ6nH880P4I"
  },
  {
    title: "\"La Primera Luz del Día\"",
    desc_en: "Short film. I worked as editor, producer, and writer.",
    desc_es: "Cortometraje. Participé como editor, productor y guionista.",
    youtube: "https://www.youtube.com/embed/7hNqBENfL2U"
  },
  {
    title: "\"Entrevista a Monseñor Carlos Marquez\"",
    desc_en: "Interview. I worked as editor.",
    desc_es: "Entrevista. Participé como editor.",
    youtube: "https://www.youtube.com/embed/A6ssI1zgNXc"
  },
  {
    title: "\"Motion Graphics (Master Oogway)\"",
    desc_en: "Motion graphics project with narration by Master Oogway (Kung Fu Panda).",
    desc_es: "Proyecto de motion graphics con narración del Maestro Oogway (Kung Fu Panda).",
    youtube: "https://www.youtube.com/embed/xvuYpCX2nsA"
  },
  {
    title: "\"Concept Ad (Coca-Cola) — Short\"",
    desc_en: "Personal project: concept art for a short-format Coca-Cola ad.",
    desc_es: "Proyecto personal: concept art para un anuncio corto de Coca-Cola.",
    youtube: "https://www.youtube.com/embed/U03laOzLI88"
  }
];

    function setProject(i) {
      window.__currentProjectIdx = i;
      const idx = Math.max(0, Math.min(projects.length - 1, i));
      projectTabs.forEach((t, n) => t.classList.toggle('is-active', n === idx));
      const p = projects[idx];

      if (projectTitle) projectTitle.textContent = p.title;
      if (projectDesc) projectDesc.textContent = (window.__lang === 'es' ? (p.desc_es || p.desc_en) : (p.desc_en || p.desc_es || ''));

      if (projectFrame) {
        const hasVideo = !!p.youtube;
        projectFrame.src = hasVideo ? p.youtube : '';
        if (videoPreview) videoPreview.classList.toggle('is-empty', !hasVideo);
      }
    }

    projectTabs.forEach((t, i) => {
      t.addEventListener('click', () => setProject(i));
      t.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setProject(i);
        }
      });
    });

    // Default to first project when Video is shown (and at load)
    setProject(0);

    // Graphics gallery
    const gMainImg = document.getElementById('graphicsMainImg');
    const gThumbs = Array.from(document.querySelectorAll('.gthumb'));
    const gFullBtn = document.getElementById('graphicsFullBtn');
    const gMainWrap = document.getElementById('graphicsMain');

    function setGraphics(i){
      const idx = Math.max(0, Math.min(gThumbs.length - 1, i));
      gThumbs.forEach((b, n) => {
        const active = n === idx;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      const btn = gThumbs[idx];
      if (!btn) return;
      const src = btn.getAttribute('data-src');
      if (gMainImg && src) gMainImg.src = src;
    }

    gThumbs.forEach((b, i) => {
      b.addEventListener('click', () => setGraphics(i));
      b.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setGraphics(i);
        }
      });
    });

    // Fullscreen (works on most modern browsers)
    if (gFullBtn && gMainWrap){
      const gModal = document.getElementById('gModal');
      const gModalImg = document.getElementById('gModalImg');
      const gModalClose = document.getElementById('gModalClose');

      const isIOS = (() => {
        const ua = navigator.userAgent || '';
        const iOS = /iPad|iPhone|iPod/.test(ua);
        const iPadOS = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
        return iOS || iPadOS;
      })();

      function openGModal(){
        if (!gModal || !gModalImg) return;
        gModalImg.src = (gMainImg && gMainImg.src) ? gMainImg.src : '';
        gModal.classList.add('is-open');
        gModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }

      function closeGModal(){
        if (!gModal) return;
        gModal.classList.remove('is-open');
        gModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }

      if (gModal){
        gModal.addEventListener('click', (e) => {
          // click outside the image closes
          if (e.target === gModal) closeGModal();
        });
      }
      if (gModalClose){
        gModalClose.addEventListener('click', closeGModal);
      }
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeGModal();
      });

      gFullBtn.addEventListener('click', async () => {
        // Prefer Fullscreen API on desktop; use modal fallback on iOS/unsupported browsers.
        const canFS = !!(gMainWrap.requestFullscreen && document.fullscreenEnabled);
        if (!canFS || isIOS){
          if (gModal && gModal.classList.contains('is-open')) closeGModal();
          else openGModal();
          return;
        }

        try{
          if (document.fullscreenElement){
            await document.exitFullscreen();
          } else {
            await gMainWrap.requestFullscreen();
          }
        } catch(e){
          // If Fullscreen fails, fallback to modal
          openGModal();
        }
      });
    }
// Default selected graphic
    setGraphics(0);


    // Music tiles (SoundCloud)
        const musicTitleEl = document.getElementById('musicTitle');
    const musicDescEl  = document.getElementById('musicDesc');
    const musicTiles   = Array.from(document.querySelectorAll('.music-grid .mtile'));
    const scPlayer     = document.getElementById('scPlayer');

    const tracks = [
      { title: "Clouds",        desc_en: "SoundCloud track.", desc_es: "Pista en SoundCloud.", url: "https://soundcloud.com/user-327547324/clouds1mix-mp3" },
      { title: "Loud Enough",    desc_en: "SoundCloud track.", desc_es: "Pista en SoundCloud.", url: "https://soundcloud.com/user-327547324/loud-enough2-wav" },
      { title: "Funk Decision",  desc_en: "SoundCloud track.", desc_es: "Pista en SoundCloud.", url: "https://soundcloud.com/user-327547324/funkdecision-mp3" },
      { title: "PSA",            desc_en: "SoundCloud track.", desc_es: "Pista en SoundCloud.", url: "https://soundcloud.com/user-327547324/groovy" }
    ];

    let activeTrackIdx = 0;
    let isTrackPlaying = false;
    let scWidget = null;
    let scReady  = false;

    function pauseTileVideo(idx){
      const btn = musicTiles[idx];
      const v = btn ? btn.querySelector('video') : null;
      if (!v) return;
      try { v.pause(); v.currentTime = 0; } catch (_) {}
    }

    function playTileVideo(idx){
      const btn = musicTiles[idx];
      const v = btn ? btn.querySelector('video') : null;
      if (!v) return;
      try { v.currentTime = 0; v.play().catch(() => {}); } catch (_) {}
    }

    function pauseAllTiles(){
      musicTiles.forEach((_, i) => pauseTileVideo(i));
    }

    function setNowPlaying(idx){
      window.__currentTrackIdx = idx;
      const t = tracks[idx];
      if (!t) return;
      if (musicTitleEl) musicTitleEl.textContent = t.title;
      if (musicDescEl)  musicDescEl.textContent  = (window.__lang === 'es' ? (t.desc_es || t.desc_en) : (t.desc_en || t.desc_es || ''));
    }

    function setSelectedUI(idx){
      musicTiles.forEach((b, n) => {
        const active = n === idx;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-selected', active ? 'true' : 'false');
      });
    }

    function ensureWidget(){
      if (!scPlayer || !window.SC || !SC.Widget) return null;
      if (scWidget) return scWidget;
      scWidget = SC.Widget(scPlayer);

      scWidget.bind(SC.Widget.Events.READY, () => { scReady = true; });

      // Keep sticker video in sync even when the user presses pause/play inside the embed.
      scWidget.bind(SC.Widget.Events.PLAY, () => {
        isTrackPlaying = true;
        pauseAllTiles();
        playTileVideo(activeTrackIdx);
      });

      scWidget.bind(SC.Widget.Events.PAUSE, () => {
        isTrackPlaying = false;
        pauseTileVideo(activeTrackIdx);
      });

      scWidget.bind(SC.Widget.Events.FINISH, () => {
        isTrackPlaying = false;
        pauseTileVideo(activeTrackIdx);
      });

      return scWidget;
    }

    function loadAndPlay(idx){
      const t = tracks[idx];
      if (!t) return;

      setNowPlaying(idx);
      setSelectedUI(idx);

      pauseAllTiles();

      const w = ensureWidget();
      if (w && scReady){
        w.load(t.url, {
          auto_play: true,
          hide_related: true,
          show_comments: false,
          show_user: true,
          show_reposts: false,
          show_teaser: false,
          visual: false
        });
        // Sticker will start on PLAY event, but we also try immediately for responsiveness.
        playTileVideo(idx);
        isTrackPlaying = true;
        return;
      }

      // Fallback: if widget isn't ready yet, just update the iframe src (no event sync until ready).
      if (scPlayer){
        const base = "https://w.soundcloud.com/player/?url=";
        const params = [
          "color=%23000000",
          "auto_play=true",
          "hide_related=true",
          "show_comments=false",
          "show_user=true",
          "show_reposts=false",
          "show_teaser=false",
          "visual=false",
          "enable_api=true"
        ].join("&");
        scPlayer.src = base + encodeURIComponent(t.url) + "&" + params;
        playTileVideo(idx);
        isTrackPlaying = true;
      }
    }

    function pauseCurrent(){
      const w = ensureWidget();
      if (w && scReady){
        w.pause();
      } else if (scPlayer){
        // reload current track with autoplay off
        const t = tracks[activeTrackIdx];
        const base = "https://w.soundcloud.com/player/?url=";
        const params = [
          "color=%23000000",
          "auto_play=false",
          "hide_related=true",
          "show_comments=false",
          "show_user=true",
          "show_reposts=false",
          "show_teaser=false",
          "visual=false",
          "enable_api=true"
        ].join("&");
        scPlayer.src = base + encodeURIComponent(t.url) + "&" + params;
      }
      pauseTileVideo(activeTrackIdx);
      isTrackPlaying = false;
    }

    function toggleTrack(idx){
      const clamped = Math.max(0, Math.min(tracks.length - 1, idx));

      // If clicking the same selected tile: toggle play/pause.
      if (clamped === activeTrackIdx){
        if (isTrackPlaying){
          pauseCurrent();
        } else {
          // resume current
          const w = ensureWidget();
          if (w && scReady){
            w.play();
            // sticker syncs on PLAY event
          } else {
            loadAndPlay(clamped);
          }
        }
        return;
      }

      // Switch track and play
      activeTrackIdx = clamped;
      loadAndPlay(clamped);
    }

    // Hook up tile interactions
    musicTiles.forEach((b, i) => {
      b.addEventListener('click', () => toggleTrack(i));
      b.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleTrack(i);
        }
      });
    });

    // Init default UI (no autoplay)
    activeTrackIdx = 0;
    setNowPlaying(0);
    setSelectedUI(0);
    pauseAllTiles();
    ensureWidget();

    // CV button link
    const cvWrapper = document.querySelector('.cv-button-wrapper');
    if (cvWrapper) {
      cvWrapper.style.cursor = 'pointer';
      const cvUrl = "https://www.canva.com/design/DAGnFUS11uc/jRYroXVkZ-sjzfrUQ5MP3A/view?utm_content=DAGnFUS11uc&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h1ddd68837d";
      const openCv = () => window.open(cvUrl, "_blank", "noopener,noreferrer");
      cvWrapper.addEventListener('click', openCv);
      cvWrapper.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openCv();
        }
      });
    }


  } catch (err) {
    // If something goes wrong, don't break anchor navigation.
    console.error('[portfolio] init error:', err);
  }
});
