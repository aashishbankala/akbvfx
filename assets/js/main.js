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
    const controls = className.includes("detail-media") ? " controls" : "";
    const preload = className.includes("detail-media") ? "auto" : "metadata";
    return `
      <video class="${className}" src="${project.cover}" autoplay muted loop${controls} playsinline preload="${preload}"></video>
    `;
  }

  if (project.coverType === "image") {
    const loading = className.includes("detail-media") ? "eager" : "lazy";
    return `
      <img class="${className}" src="${project.cover}" alt="${project.title}" loading="${loading}" />
    `;
  }

  return `
    <div class="${className} generated-visual ${project.visualClass || ""}">
      <span>${project.kicker}</span>
    </div>
  `;
};

const normalizeSoftwareName = (name = "") => name.toLowerCase().replace(/[^a-z0-9]/g, "");
const formatProjectTitle = (title = "") => title.replace(/:\s+/g, ":<br />");

const getSoftwareLogos = (project) => {
  const projectSoftware = project.software || [];
  const seen = new Set();

  return projectSoftware
    .map((name) => {
      const normalized = normalizeSoftwareName(name);
      return software.find((item) => normalizeSoftwareName(item.name) === normalized);
    })
    .filter(Boolean)
    .filter((item) => {
      const normalized = normalizeSoftwareName(item.name);
      if (seen.has(normalized)) return false;
      seen.add(normalized);
      return true;
    });
};

const projectSoftwareBadges = (project) => {
  const items = getSoftwareLogos(project);
  if (!items.length) return "";

  return `
    <span class="project-software-badges" aria-label="${items.map((item) => item.name).join(", ")}">
      ${items
        .map(
          (item) => `
            <span class="project-software-badge" title="${item.name}">
              <img src="${item.logo}" alt="${item.name} logo" loading="lazy" />
            </span>
          `
        )
        .join("")}
    </span>
  `;
};

const projectCard = (project) => `
  <a class="project-card" data-project="${project.slug}" href="project.html?slug=${project.slug}" aria-label="Open ${project.title}">
    ${createMedia(project)}
    ${projectSoftwareBadges(project)}
    <span class="project-card-glow"></span>
    <div class="project-card-content">
      <p>${project.kicker}</p>
      <h3>${project.title}</h3>
      <div class="project-card-meta">
        <span>${project.date}</span>
        <span>${project.software.join(" / ")}</span>
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

  rail.innerHTML = [...projects, ...projects, ...projects]
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
    .map((item, index) => {
      const ratio = item.ratio || "4 / 5";
      const label = `Open ${item.title}`;
      const layoutClass = item.layout ? ` art-${item.layout}` : "";

      if (item.type === "image") {
        return `
          <a class="art-card${layoutClass}" href="${item.src}" style="--art-ratio: ${ratio}; --art-delay: ${Math.min(index % 6, 5) * 34}ms" data-art-index="${index}" data-reveal aria-label="${label}">
            <img src="${item.src}" alt="${item.title}" loading="lazy" decoding="async" />
            <span class="art-card-caption">${item.title}</span>
          </a>
        `;
      }

      if (item.type === "video") {
        return `
          <a class="art-card${layoutClass}" href="${item.src}" style="--art-ratio: ${ratio}; --art-delay: ${Math.min(index % 6, 5) * 34}ms" data-art-index="${index}" data-reveal aria-label="${label}">
            <video src="${item.src}" autoplay muted loop playsinline></video>
            <span class="art-card-caption">${item.title}</span>
          </a>
        `;
      }

      return `
        <a class="art-card${layoutClass}" href="#" style="--art-ratio: ${ratio}; --art-delay: ${Math.min(index % 6, 5) * 34}ms" data-art-index="${index}" data-reveal aria-label="${label}">
          <div class="art-placeholder ${item.visualClass || ""}"></div>
          <span class="art-card-caption">${item.title}</span>
        </a>
      `;
    })
    .join("");
};

const setupArtworkLightbox = () => {
  const grid = document.querySelector("#artworkGrid");
  if (!grid || !artwork.length) return;

  let activeIndex = 0;

  const lightbox = document.createElement("div");
  lightbox.className = "art-lightbox";
  lightbox.setAttribute("aria-hidden", "true");
  lightbox.innerHTML = `
    <button class="art-lightbox-close" type="button" aria-label="Close artwork preview">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6.4 5 19 17.6 17.6 19 5 6.4 6.4 5Zm11.2 0L19 6.4 6.4 19 5 17.6 17.6 5Z" />
      </svg>
    </button>
    <button class="rail-arrow art-lightbox-arrow art-lightbox-prev" type="button" aria-label="Previous artwork">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M14.8 5 8 12l6.8 7 1.4-1.42L10.8 12l5.4-5.58L14.8 5Z" />
      </svg>
    </button>
    <figure class="art-lightbox-frame">
      <img src="" alt="" />
      <figcaption></figcaption>
    </figure>
    <button class="rail-arrow art-lightbox-arrow art-lightbox-next" type="button" aria-label="Next artwork">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m9.2 19 6.8-7-6.8-7-1.4 1.42L13.2 12l-5.4 5.58L9.2 19Z" />
      </svg>
    </button>
  `;
  document.body.appendChild(lightbox);

  const image = lightbox.querySelector("img");
  const caption = lightbox.querySelector("figcaption");
  const closeButton = lightbox.querySelector(".art-lightbox-close");
  const previousButton = lightbox.querySelector(".art-lightbox-prev");
  const nextButton = lightbox.querySelector(".art-lightbox-next");

  const showArtwork = (index) => {
    activeIndex = (index + artwork.length) % artwork.length;
    const item = artwork[activeIndex];
    image.src = item.src;
    image.alt = item.title;
    caption.textContent = item.title;
  };

  const openArtwork = (index) => {
    showArtwork(index);
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("has-art-lightbox");
    closeButton.focus({ preventScroll: true });
  };

  const closeArtwork = () => {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("has-art-lightbox");
    image.removeAttribute("src");
  };

  grid.addEventListener("click", (event) => {
    const card = event.target.closest("[data-art-index]");
    if (!card) return;

    event.preventDefault();
    openArtwork(Number(card.getAttribute("data-art-index")) || 0);
  });

  previousButton.addEventListener("click", () => showArtwork(activeIndex - 1));
  nextButton.addEventListener("click", () => showArtwork(activeIndex + 1));
  closeButton.addEventListener("click", closeArtwork);

  lightbox.addEventListener("click", (event) => {
    const interactiveElement = event.target.closest(
      ".art-lightbox-frame img, .art-lightbox-arrow, .art-lightbox-close"
    );

    if (!interactiveElement) closeArtwork();
  });

  document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("is-open")) return;

    if (event.key === "Escape") closeArtwork();
    if (event.key === "ArrowLeft") showArtwork(activeIndex - 1);
    if (event.key === "ArrowRight") showArtwork(activeIndex + 1);
  });
};

const renderGalleryItem = (item) => {
  const layoutClass = item.layout ? ` gallery-${item.layout}` : "";
  const caption = item.caption || "";
  const mediaLabel = caption || item.alt || "project media";
  const figcaption = caption ? `<figcaption>${caption}</figcaption>` : "";

  if (item.type === "video") {
    return `
      <figure class="gallery-item${layoutClass}">
        <video src="${item.src}" autoplay muted loop controls playsinline preload="auto"></video>
        ${figcaption}
      </figure>
    `;
  }

  if (item.type === "pdf") {
    return `
      <figure class="gallery-item gallery-pdf${layoutClass}">
        <iframe src="${item.src}" title="${mediaLabel}"></iframe>
        ${figcaption}
      </figure>
    `;
  }

  return `
    <figure class="gallery-item${layoutClass}">
      <a class="gallery-image-link" href="${item.src}" target="_blank" rel="noreferrer" aria-label="Open ${mediaLabel}">
        <img src="${item.src}" alt="${mediaLabel}" loading="eager" />
      </a>
      ${figcaption}
    </figure>
  `;
};

const renderProjectDetail = () => {
  const detail = document.querySelector("#projectDetail");
  if (!detail) return;

  const slug = new URLSearchParams(window.location.search).get("slug") || projects[0]?.slug;
  const project = projects.find((item) => item.slug === slug);
  const projectIndex = projects.findIndex((item) => item.slug === slug);
  const previousProject =
    projectIndex >= 0 && projects.length > 1
      ? projects[(projectIndex - 1 + projects.length) % projects.length]
      : null;
  const nextProject =
    projectIndex >= 0 && projects.length > 1 ? projects[(projectIndex + 1) % projects.length] : null;

  if (!project) {
    detail.innerHTML = `
      <section class="page-hero" data-reveal>
        <p class="eyebrow">Project not found</p>
        <h1>This project is not available yet.</h1>
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
          <h1>${formatProjectTitle(project.title)}</h1>
          <p>${project.description}</p>
        </div>
        <div class="detail-media-wrap">
          ${createMedia(project, "detail-media")}
        </div>
      </section>

      <section class="detail-meta-grid" data-reveal>
        <div>
          <span>Project Date</span>
          <strong>${project.date}</strong>
        </div>
        <div>
          <span>Responsibility</span>
          <strong>${project.role}</strong>
        </div>
        <div>
          <span>Primary Software</span>
          <strong>${project.software.join(", ")}</strong>
        </div>
        <div>
          <span>Render Engine</span>
          <strong>${project.renderer}</strong>
        </div>
      </section>

      <section class="detail-gallery" data-reveal>
        <div class="section-heading">
          <p class="eyebrow">Project Media</p>
          <h2>Technical breakdowns and Process captures</h2>
        </div>
        ${
          project.gallery.length
            ? `<div class="gallery-grid">${project.gallery.map(renderGalleryItem).join("")}</div>`
            : `<div class="empty-gallery">
                <p>Additional behind-the-scenes media will appear here when it is ready for this project.</p>
              </div>`
        }
      </section>

      ${
        nextProject
          ? `<nav class="project-detail-nav" data-reveal aria-label="Project navigation">
              <a class="button button-deep-green previous-project-link" href="project.html?slug=${previousProject.slug}">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="m14 5 7 7-7 7-1.4-1.45 4.5-4.55H3v-2h14.1l-4.5-4.55L14 5Z" />
                </svg>
                <span>Previous Project</span>
                <strong>${previousProject.title}</strong>
              </a>
              <a class="button button-ghost all-projects-link" href="projects.html">All Projects</a>
              <a class="button button-deep-green next-project-link" href="project.html?slug=${nextProject.slug}">
                <span>Next Project</span>
                <strong>${nextProject.title}</strong>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="m14 5 7 7-7 7-1.4-1.45 4.5-4.55H3v-2h14.1l-4.5-4.55L14 5Z" />
                </svg>
              </a>
            </nav>`
          : ""
      }
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
    const navFade = Math.min(Math.max((window.scrollY - 72) / 72, 0), 1);
    root.style.setProperty("--scroll-progress", amount.toFixed(3));
    root.style.setProperty("--background-glow", glow.toFixed(3));
    root.style.setProperty("--nav-fade-opacity", navFade.toFixed(3));
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

const setupMobileNav = () => {
  const topbar = document.querySelector(".topbar");
  const toggle = document.querySelector(".mobile-nav-toggle");
  if (!topbar || !toggle) return;
  const currentLink = topbar.querySelector(".main-nav a[aria-current='page']");
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const fallbackPage =
    currentPath === "project.html"
      ? "Projects"
      : currentPath === "index.html"
        ? "Demo Reel"
        : "Menu";
  const currentPage = document.createElement("button");
  currentPage.className = "mobile-current-page";
  currentPage.type = "button";
  currentPage.textContent = currentLink?.textContent?.trim() || fallbackPage;
  currentPage.setAttribute("aria-label", "Open menu");
  topbar.insertBefore(currentPage, toggle);

  const closeMenu = () => {
    topbar.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    currentPage.setAttribute("aria-label", "Open menu");
  };

  const toggleMenu = () => {
    const isOpen = topbar.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    currentPage.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  };

  toggle.addEventListener("click", toggleMenu);
  currentPage.addEventListener("click", toggleMenu);

  topbar.querySelectorAll(".main-nav a, .social-links a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) closeMenu();
  });
};

const setupProjectRailControls = () => {
  const rail = document.querySelector(".project-rail");
  if (!rail) return;

  document.querySelectorAll("[data-project-nudge]").forEach((button) => {
    button.addEventListener("click", () => {
      const direction = Number(button.getAttribute("data-project-nudge")) || 1;
      rail.dispatchEvent(
        new CustomEvent("akb:nudge-scroll", {
          detail: { direction },
        })
      );
      button.classList.add("is-active");
      window.setTimeout(() => button.classList.remove("is-active"), 520);
    });
  });
};

const setupAutoScroll = () => {
  const scrollers = [
    {
      element: document.querySelector(".software-marquee"),
      speed: 46,
      responsiveBoost: 0.012,
      startLabel: "Houdini",
    },
    {
      element: document.querySelector(".project-rail"),
      speed: 78,
      responsiveBoost: 0.04,
    },
  ].filter((item) => item.element);

  scrollers.forEach(({ element, speed, responsiveBoost = 0, startLabel }) => {
    let lastTime = performance.now();
    let loopPoint = 0;
    let hasSetInitialPosition = false;
    let nudgeSpeed = 0;
    let nudgeUntil = 0;

    const currentSpeed = () => speed + Math.min(window.innerWidth, 2200) * responsiveBoost;

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

    element.addEventListener("akb:nudge-scroll", (event) => {
      const direction = event.detail?.direction || 1;
      nudgeSpeed = direction * Math.max(currentSpeed() * 5.5, element.clientWidth * 1.4);
      nudgeUntil = performance.now() + 520;
    });

    const tick = (now) => {
      const delta = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const canScroll = element.scrollWidth > element.clientWidth;

      if (canScroll) {
        const boost = now < nudgeUntil ? nudgeSpeed : 0;
        element.scrollLeft += (currentSpeed() + boost) * delta;
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

setupLogoLoader();
renderSoftware();
renderHomeProjects();
renderProjectsGrid();
renderArtworkGrid();
setupArtworkLightbox();
renderProjectDetail();
setupVideoControls();
setupReveal();
setupScrollMotion();
setupMobileNav();
setupProjectRailControls();
setupAutoScroll();
setupParticleField();
