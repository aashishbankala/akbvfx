const projects = window.AKBVFX_PROJECTS || [];
const software = window.AKBVFX_SOFTWARE || [];
const artwork = window.AKBVFX_ARTWORK || [];
const pageName = window.location.pathname.split("/").pop() || "index.html";
const navigationEntry = performance.getEntriesByType?.("navigation")?.[0];
const isReloadNavigation =
  navigationEntry?.type === "reload" || performance.navigation?.type === 1;

history.scrollRestoration = "manual";

if (isReloadNavigation && (pageName !== "index.html" || window.location.hash)) {
  window.location.replace("index.html");
}

if (isReloadNavigation && pageName === "index.html") {
  window.addEventListener("load", () => {
    window.scrollTo(0, 0);
  });
}

const createMedia = (project, className = "project-media") => {
  if (project.coverType === "video") {
    return `
      <video class="${className}" src="${project.cover}" autoplay muted loop playsinline></video>
    `;
  }

  return `
    <div class="${className} generated-visual ${project.visualClass || ""}">
      <span>${project.kicker}</span>
    </div>
  `;
};

const projectCard = (project) => `
  <a class="project-card" href="project.html?slug=${project.slug}" aria-label="Open ${project.title}">
    ${createMedia(project)}
    <span class="project-card-glow"></span>
    <div class="project-card-content">
      <p>${project.kicker}</p>
      <h3>${project.title}</h3>
      <div class="project-card-meta">
        <span>${project.date}</span>
        <span>${project.software.slice(0, 3).join(" / ")}</span>
      </div>
    </div>
  </a>
`;

const renderSoftware = () => {
  const track = document.querySelector("#softwareTrack");
  if (!track) return;

  const chips = [
    ...software,
    ...software,
    ...software,
    ...software,
    ...software,
    ...software,
  ]
    .map(
      (item) => `
        <span class="software-chip ${item.tone === "mono" ? "is-mono" : ""}" title="${item.name}" aria-label="${item.name}">
          <img src="${item.logo}" alt="${item.name} logo" loading="lazy" />
        </span>
      `
    )
    .join("");
  track.innerHTML = chips;
};

const renderHomeProjects = () => {
  const rail = document.querySelector("#homeProjectRail");
  if (!rail) return;

  rail.innerHTML = [
    ...projects,
    ...projects,
    ...projects,
    ...projects,
    ...projects,
    ...projects,
  ]
    .map(projectCard)
    .join("");
};

const renderProjectsGrid = () => {
  const grid = document.querySelector("#projectsGrid");
  if (!grid) return;

  grid.innerHTML = projects.map(projectCard).join("");
};

const renderArtworkGrid = () => {
  const grid = document.querySelector("#artworkGrid");
  if (!grid) return;

  grid.innerHTML = artwork
    .map((item) => {
      const ratio = item.ratio || "4 / 5";

      if (item.type === "image") {
        return `
          <figure class="art-card" style="--art-ratio: ${ratio}">
            <img src="${item.src}" alt="${item.title}" loading="lazy" />
            <figcaption>${item.title}</figcaption>
          </figure>
        `;
      }

      if (item.type === "video") {
        return `
          <figure class="art-card" style="--art-ratio: ${ratio}">
            <video src="${item.src}" autoplay muted loop playsinline></video>
            <figcaption>${item.title}</figcaption>
          </figure>
        `;
      }

      return `
        <figure class="art-card" style="--art-ratio: ${ratio}">
          <div class="art-placeholder ${item.visualClass || ""}"></div>
          <figcaption>${item.title}</figcaption>
        </figure>
      `;
    })
    .join("");
};

const renderGalleryItem = (item) => {
  if (item.type === "video") {
    return `
      <figure class="gallery-item">
        <video src="${item.src}" controls playsinline></video>
        <figcaption>${item.caption}</figcaption>
      </figure>
    `;
  }

  return `
    <figure class="gallery-item">
      <img src="${item.src}" alt="${item.caption}" loading="lazy" />
      <figcaption>${item.caption}</figcaption>
    </figure>
  `;
};

const renderProjectDetail = () => {
  const detail = document.querySelector("#projectDetail");
  if (!detail) return;

  const slug = new URLSearchParams(window.location.search).get("slug") || projects[0]?.slug;
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    detail.innerHTML = `
      <section class="page-hero" data-reveal>
        <p class="eyebrow">Project not found</p>
        <h1>This project is not in the CMS data yet.</h1>
        <a class="button button-primary" href="projects.html">Back to Projects</a>
      </section>
    `;
    return;
  }

  document.title = `${project.title} | AKB VFX`;

  detail.innerHTML = `
    <article class="detail-page">
      <section class="detail-hero" data-reveal>
        <div class="detail-copy">
          <a class="button button-ghost back-link" href="projects.html">Back to Projects</a>
          <p class="eyebrow">${project.kicker}</p>
          <h1>${project.title}</h1>
          <p>${project.description}</p>
        </div>
        <div class="detail-media-wrap">
          ${createMedia(project, "detail-media")}
        </div>
      </section>

      <section class="detail-meta-grid" data-reveal>
        <div>
          <span>Date</span>
          <strong>${project.date}</strong>
        </div>
        <div>
          <span>Role</span>
          <strong>${project.role}</strong>
        </div>
        <div>
          <span>Software</span>
          <strong>${project.software.join(", ")}</strong>
        </div>
        <div>
          <span>Renderer</span>
          <strong>${project.renderer}</strong>
        </div>
      </section>

      <section class="detail-gallery" data-reveal>
        <div class="section-heading">
          <p class="eyebrow">Behind The Scenes</p>
          <h2>Breakdowns, gallery, and process media.</h2>
        </div>
        ${
          project.gallery.length
            ? `<div class="gallery-grid">${project.gallery.map(renderGalleryItem).join("")}</div>`
            : `<div class="empty-gallery">
                <p>Add behind-the-scenes images, screenshots, or breakdown videos in <strong>assets/js/projects.js</strong>.</p>
              </div>`
        }
      </section>
    </article>
  `;
};

const setupVideoControls = () => {
  const button = document.querySelector("#soundToggle");
  const video = document.querySelector("#heroVideo");
  if (!button || !video) return;

  const icon = button.querySelector("img");
  const updateButton = () => {
    const label = video.muted ? "Turn sound on" : "Turn sound off";
    button.setAttribute("aria-label", label);
    button.setAttribute("title", label);
    if (icon) {
      icon.src = video.muted ? "assets/images/ui/sound-off.png" : "assets/images/ui/sound-on.png";
    }
  };

  updateButton();

  button.addEventListener("click", () => {
    video.muted = !video.muted;
    updateButton();
    if (video.paused) video.play();
  });
};

const setupReveal = () => {
  const elements = document.querySelectorAll("[data-reveal]");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("is-visible");
      });
    },
    { threshold: 0.18 }
  );

  elements.forEach((element) => observer.observe(element));
};

const setupScrollMotion = () => {
  const root = document.documentElement;
  let ticking = false;

  const update = () => {
    const height = Math.max(window.innerHeight, 1);
    const amount = Math.min(window.scrollY / height, 1.6);
    const glow = Math.min(Math.max((window.scrollY - height * 0.82) / (height * 0.42), 0), 1);
    root.style.setProperty("--scroll-progress", amount.toFixed(3));
    root.style.setProperty("--background-glow", glow.toFixed(3));
  };

  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    },
    { passive: true }
  );

  window.addEventListener("resize", update);
  update();
};

const setupAutoScroll = () => {
  const scrollers = [
    { element: document.querySelector(".software-marquee"), speed: 46, startLabel: "Houdini" },
    { element: document.querySelector(".project-rail"), speed: 56 },
  ].filter((item) => item.element);

  scrollers.forEach(({ element, speed, startLabel }) => {
    let lastTime = performance.now();
    let loopPoint = 0;
    let hasSetInitialPosition = false;

    const centerStartItem = () => {
      if (!startLabel) return false;

      const targets = Array.from(element.querySelectorAll(".software-chip")).filter(
        (item) => item.getAttribute("aria-label") === startLabel
      );
      const target =
        targets.find((item) => item.offsetLeft >= loopPoint && item.offsetLeft < loopPoint * 2) ||
        targets[Math.floor(targets.length / 2)];
      if (!target) return false;

      element.scrollLeft = target.offsetLeft - (element.clientWidth - target.offsetWidth) / 2;
      return true;
    };

    const measure = () => {
      loopPoint = element.scrollWidth / 3;
      if (!loopPoint) return;

      if (!hasSetInitialPosition && centerStartItem()) {
        hasSetInitialPosition = true;
        return;
      }

      if (element.scrollLeft < 1) {
        element.scrollLeft = loopPoint;
      }
      hasSetInitialPosition = true;
    };

    const normalize = () => {
      if (!loopPoint) measure();
      if (!loopPoint) return;

      if (element.scrollLeft >= loopPoint * 2) {
        element.scrollLeft -= loopPoint;
      } else if (element.scrollLeft <= 0) {
        element.scrollLeft += loopPoint;
      }
    };

    window.addEventListener("resize", measure);
    window.requestAnimationFrame(() => {
      measure();
      window.requestAnimationFrame(measure);
    });

    const tick = (now) => {
      const delta = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const canScroll = element.scrollWidth > element.clientWidth;

      if (canScroll) {
        element.scrollLeft += speed * delta;
        normalize();
      }

      window.requestAnimationFrame(tick);
    };

    window.requestAnimationFrame(tick);
  });
};

const setupParticleField = () => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const canvas = document.createElement("canvas");
  canvas.className = "particle-field";
  canvas.setAttribute("aria-hidden", "true");
  document.body.prepend(canvas);

  const context = canvas.getContext("2d", { alpha: true });
  if (!context) {
    canvas.remove();
    return;
  }

  const random = (() => {
    let seed = 94281;
    return () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
  })();

  let width = 0;
  let height = 0;
  let pixelRatio = 1;
  let particles = [];
  let lastTime = performance.now();
  let scrollX = 0;
  let scrollTargetX = window.scrollY * 0.1;

  const wrap = (value, min, max) => {
    const range = max - min;
    return ((((value - min) % range) + range) % range) + min;
  };

  const createParticles = () => {
    const count = Math.min(150, Math.max(76, Math.floor((width * height) / 14500)));
    particles = Array.from({ length: count }, () => ({
      x: random() * width,
      y: random() * height,
      radius: 0.55 + random() * 1.65,
      alpha: 0.12 + random() * 0.26,
      hueMix: random(),
      vx: 3 + random() * 7,
      vy: -2.5 - random() * 5.5,
      phase: random() * Math.PI * 2,
      orbitX: 8 + random() * 34,
      orbitY: 6 + random() * 24,
      speedX: 0.18 + random() * 0.36,
      speedY: 0.16 + random() * 0.32,
    }));
  };

  const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.ceil(width * pixelRatio);
    canvas.height = Math.ceil(height * pixelRatio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    createParticles();
  };

  const updateScrollTarget = () => {
    scrollTargetX = window.scrollY * 0.1;
  };

  const draw = (now) => {
    const delta = Math.min((now - lastTime) / 1000, 0.05);
    const time = now * 0.001;
    lastTime = now;
    scrollX += (scrollTargetX - scrollX) * 0.08;

    context.clearRect(0, 0, width, height);

    particles.forEach((particle) => {
      particle.x = wrap(particle.x + particle.vx * delta, -70, width + 70);
      particle.y = wrap(particle.y + particle.vy * delta, -70, height + 70);

      const x = wrap(
        particle.x + scrollX + Math.sin(time * particle.speedX + particle.phase) * particle.orbitX,
        -80,
        width + 80
      );
      const y = wrap(
        particle.y + Math.cos(time * particle.speedY + particle.phase) * particle.orbitY,
        -80,
        height + 80
      );
      const glow = context.createRadialGradient(x, y, 0, x, y, particle.radius * 4.6);
      const color =
        particle.hueMix > 0.68
          ? `138, 255, 220`
          : particle.hueMix > 0.34
            ? `88, 255, 143`
            : `10, 168, 83`;

      glow.addColorStop(0, `rgba(${color}, ${particle.alpha * 0.55})`);
      glow.addColorStop(0.34, `rgba(${color}, ${particle.alpha * 0.14})`);
      glow.addColorStop(1, `rgba(${color}, 0)`);

      context.fillStyle = glow;
      context.beginPath();
      context.arc(x, y, particle.radius * 4.6, 0, Math.PI * 2);
      context.fill();

      context.fillStyle = `rgba(${color}, ${Math.min(particle.alpha + 0.08, 0.42)})`;
      context.beginPath();
      context.arc(x, y, particle.radius, 0, Math.PI * 2);
      context.fill();
    });

    window.requestAnimationFrame(draw);
  };

  window.addEventListener("resize", resize);
  window.addEventListener("scroll", updateScrollTarget, { passive: true });
  resize();
  window.requestAnimationFrame(draw);
};

const setupLogoLoader = () => {
  const loader = document.createElement("div");
  loader.className = "logo-loader";
  loader.setAttribute("aria-hidden", "true");
  loader.innerHTML = `<img src="assets/images/logo-png.png" alt="" />`;
  document.body.appendChild(loader);

  window.setTimeout(() => {
    loader.classList.add("is-leaving");
  }, 650);

  window.setTimeout(() => {
    loader.remove();
  }, 1150);
};

const setupCursor = () => {
  if (!window.matchMedia("(pointer: fine)").matches) return;

  const cursor = document.createElement("div");
  cursor.className = "cursor-dot";
  document.body.appendChild(cursor);
  document.body.classList.add("has-custom-cursor");

  window.addEventListener("pointermove", (event) => {
    cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
    cursor.classList.add("is-visible");
  });

  window.addEventListener("pointerdown", () => cursor.classList.add("is-pressed"));
  window.addEventListener("pointerup", () => cursor.classList.remove("is-pressed"));
  window.addEventListener("pointerleave", () => cursor.classList.remove("is-visible"));
};

setupLogoLoader();
renderSoftware();
renderHomeProjects();
renderProjectsGrid();
renderArtworkGrid();
renderProjectDetail();
setupVideoControls();
setupReveal();
setupScrollMotion();
setupAutoScroll();
setupParticleField();
setupCursor();
