# AKB VFX Portfolio

This is a static HTML/CSS/JS portfolio for Aashish Kumar Bankala.

## Edit Your Projects

Open `assets/js/projects.js` and add or edit objects in `window.AKBVFX_PROJECTS`.

Each project supports:

- `title`
- `date`
- `role`
- `software`
- `renderer`
- `description`
- `coverType`
- `gallery`

For real project images, place files in `assets/images/` and reference them from the gallery:

```js
{
  type: "image",
  src: "assets/images/my-breakdown.jpg",
  caption: "Before and after comp breakdown."
}
```

## Replace The Logo

When you have your logo PNG, add it to `assets/images/` and replace the temporary `AKB` mark in each HTML file with an image.

## Resume

The resume link points to:

`assets/docs/AashishKumarBankala_Resume_2026.pdf`

Replace that file when you update your resume.

## Edit Artwork

Open `assets/js/artwork.js` to replace the placeholder collage items with images or videos.

For example:

```js
{
  title: "Creature sketch",
  type: "image",
  src: "assets/images/artwork/creature-sketch.jpg",
  ratio: "4 / 5"
}
```
