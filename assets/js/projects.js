window.AKBVFX_PROJECTS = [
  {
    slug: "unreal-one-last-time-cybercity",
    title: "One Last Time: Cyber City",
    kicker: "UE / Cinematic Environment / Concept Trailer",
    date: "2026",
    role: "Environment Artist",
    software: ["Unreal Engine"],
    renderer: "Unreal Engine",
    coverType: "video",
    cover: "assets/media/projects/unreal-one-last-time-cybercity-john-wick.mp4",
    description:
      "A cinematic cyber city environment in Unreal Engine, shaped around dramatic action-film lighting, dense atmosphere, and a moody neon city feel. The piece is built to read quickly as a portfolio preview while still feeling like part of a larger scene.",
    gallery: [
      {
        type: "video",
        src: "assets/media/projects/unreal-one-last-time-cybercity-john-wick.mp4",
        caption: "Cyber city environment preview.",
      },
    ],
  },
  {
    slug: "maya-swedish-bar",
    title: "Swedish Bar Environment",
    kicker: "Orthographic / Animated 3D Environment / Custom Built",
    date: "2026",
    role: "LookDev, Modeling, UVs, Texturing, Assembly, Animation, Rendering",
    software: ["Maya", "Substance Painter"],
    renderer: "Arnold",
    coverType: "video",
    cover: "assets/media/projects/maya-swedish-bar.mp4",
    description:
      "A Maya environment piece centered on a Swedish bar setting, with attention on spatial layout, modeling choices, and presentation. It works as a clean environment showcase that can later be expanded with wireframes, material breakdowns, and lighting notes.",
    gallery: [
      {
        type: "video",
        src: "assets/media/projects/maya-swedish-bar.mp4",
        caption: "Swedish bar environment preview.",
      },
    ],
  },
  {
    slug: "houdini-procedural-texturing-programming",
    title: "Procedural Texturing",
    kicker: "Houdini COPs & VEX / Nuke AOVs",
    date: "2026",
    role: "Procedural Artist",
    software: ["Houdini", "Nuke"],
    renderer: "Karma XPU",
    coverType: "video",
    cover: "assets/media/projects/houdini-procedural-texturing-programming.mp4",
    description:
      "A procedural texturing and programming test in Houdini, built around controlled variation, surface breakup, and reusable logic. It highlights technical workflow thinking as much as the final visual result.",
    gallery: [
      {
        type: "video",
        src: "assets/media/projects/houdini-procedural-texturing-programming.mp4",
        caption: "Procedural texturing and programming preview.",
      },
    ],
  },
  {
    slug: "houdini-procedural-building",
    title: "Procedural Building System",
    kicker: "Houdini HScript / Procedural Building",
    date: "2026",
    role: "Procedural Artist",
    software: ["Houdini"],
    renderer: "Karma CPU Mplay",
    coverType: "video",
    cover: "assets/media/projects/houdini-procedural-building.mp4",
    description:
      "A Houdini procedural building study focused on modular structure, repeatable controls, and fast architectural variation. The piece shows how a flexible setup can generate complex building forms while keeping the design art-directable.",
    gallery: [
      {
        type: "video",
        src: "assets/media/projects/houdini-procedural-building.mp4",
        caption: "Procedural building system preview.",
      },
    ],
  },
  {
    slug: "houdini-venom-tendrils",
    title: "Venom Tendrils",
    kicker: "Houdini / Procedural Animation / Tendrils",
    date: "2026",
    role: "Procedural FX Artist",
    software: ["Houdini"],
    renderer: "Karma XPU",
    coverType: "video",
    cover: "assets/media/projects/houdini-venom-tendrils.mp4",
    description:
      "A Houdini procedural animation study built around Venom-inspired tendril motion, organic growth, and controllable FX behavior. The project focuses on animated form, timing, and procedural setup design, rendered in Karma XPU.",
    gallery: [
      {
        type: "video",
        src: "assets/media/projects/houdini-venom-tendrils.mp4",
        caption: "Venom tendrils procedural animation preview.",
      },
    ],
  },
  {
    slug: "unreal-aliens-lookdev",
    title: "Aliens Look Dev",
    kicker: "UE / Environment Concept / Tone / Lookdev",
    date: "2026",
    role: "Lookdev Artist",
    software: ["Unreal Engine"],
    renderer: "Unreal Engine",
    coverType: "video",
    cover: "assets/media/projects/unreal-aliens-lookdev.mp4",
    description:
      "An Unreal Engine look-development piece exploring alien forms, lighting mood, material response, and cinematic presentation. The focus is on selling shape, atmosphere, and readable creature detail in real time.",
    gallery: [
      {
        type: "video",
        src: "assets/media/projects/unreal-aliens-lookdev.mp4",
        caption: "Aliens lookdev preview.",
      },
    ],
  },
  {
    slug: "showreel-2026",
    title: "VFX Demoreel 2026",
    kicker: "Selected Works",
    date: "2026",
    role: "VFX Artist",
    software: ["Maya", "Substance Painter", "Houdini", "Nuke", "Cinema 4D", "Premiere Pro"],
    renderer: "Arnold / Redshift / Karma",
    coverType: "video",
    cover: "assets/media/showreel.mp4",
    description:
      "A curated demoreel landing piece for Aashish Kumar Bankala, bringing together Maya, Substance Painter, Houdini, Nuke, Cinema 4D, and Premiere Pro work across compositing, FX, CG integration, and cinematic VFX presentation.",
    gallery: [
      {
        type: "video",
        src: "assets/media/showreel.mp4",
        caption: "Full demoreel playback.",
      },
    ],
  },
];

const projectDisplayOrder = [
  "unreal-one-last-time-cybercity",
  "houdini-venom-tendrils",
  "houdini-procedural-texturing-programming",
  "maya-swedish-bar",
  "houdini-procedural-building",
  "unreal-aliens-lookdev",
  "showreel-2026",
];

window.AKBVFX_PROJECTS.sort(
  (a, b) => projectDisplayOrder.indexOf(a.slug) - projectDisplayOrder.indexOf(b.slug)
);

window.AKBVFX_SOFTWARE = [
  {
    name: "Houdini",
    logo: "assets/images/software/houdini.png",
  },
  {
    name: "Maya",
    logo: "assets/images/software/maya.png",
  },
  {
    name: "Unreal Engine",
    logo: "assets/images/software/unreal-engine.png",
  },
  {
    name: "Cinema 4D",
    logo: "assets/images/software/cinema4d.png",
  },
  {
    name: "Nuke",
    logo: "assets/images/software/nuke.png",
  },
  {
    name: "Blender",
    logo: "assets/images/software/blender.png",
  },
  {
    name: "Substance Painter",
    logo: "assets/images/software/substance-painter.svg",
  },
  {
    name: "Premiere Pro",
    logo: "assets/images/software/premiere-pro.png",
  },
  {
    name: "Photoshop",
    logo: "assets/images/software/photoshop.png",
  },
];
