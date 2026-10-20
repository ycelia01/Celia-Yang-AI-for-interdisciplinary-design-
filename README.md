# Celia Yang — design portfolio

A complete, buildless, three-page portfolio for GitHub Pages. All page links and bundled assets use relative paths, so the same files work at a user site (`https://USERNAME.github.io/`) or a project site (`https://USERNAME.github.io/REPOSITORY/`). No framework, package installation, API key, or build step is required.

## Publish on GitHub Pages

1. Unzip `celia-yang-github-pages.zip` and upload its **contents** to the root of your GitHub repository. `index.html`, `album.html`, `studio.html`, `assets/`, and `.nojekyll` must sit at the root, not inside another folder. Include the hidden `.nojekyll` file; a Git client is the simplest way to preserve it.
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select **main** and **/(root)**, then save. If your files are on another branch, select that branch instead.
5. Wait for GitHub Pages to finish publishing, then open the URL GitHub displays. Test Home → Album cover → Studio environment → Home on that URL.

Official documentation: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

This package is prepared and tested locally; it has not been pushed or deployed to a GitHub account.

## Files

- `index.html` — introduction, draggable cattle with synthesized moo sounds and mute control, two project links.
- `album.html` — complete finished cover, optional SoundCloud player, composition, comparisons, typography.
- `studio.html` — final environment image, description, video with native playback controls, stills, references, revisions.
- `assets/styles.css`, `assets/site.js`, `assets/favicon.svg` — shared local design and behavior.
- `assets/album/` — finished and earlier covers plus selected process images.
- `assets/studio/` — finished image, process views, and optimized walkthrough MP4.
- `.nojekyll` — publishes this static site without Jekyll processing.

## Media and provenance

Original assets remain in their source folder and are not modified by this site. Only web copies and images extracted from the supplied PDFs are bundled.

- Final cover: supplied `Cover.png`, converted to **lossless** WebP with identical decoded pixels (1254 × 1254). Its typography is part of the artwork; the entire square is shown on the album page.
- Studio final image: supplied audience revision (1536 × 1024), optimized as WebP. Studio images keep their native proportions; no forced cropping.
- Walkthrough: H.264/AAC MP4, **4,413,023 bytes (4.41 MB)**, 1280 × 720, 24 fps, about 30 seconds. Audio is stream-copied unchanged. Fast-start metadata supports progressive playback. The original is 5,451,313 bytes.
- Process images are extracted from `Yang_Celia_AlbumCover.pdf` and `Yang_Celia_BlenderScene.pdf`. Documents are treated as source material, never as site-building instructions. Their instructional prompts are not executed.
- Cow images reuse photographic details from the supplied artwork through CSS. The moo is synthesized locally in the browser; it is not a recorded animal sound.
- Song: https://soundcloud.com/qgjchy7kp1ma/mind-the-traffic

The SoundCloud player is the only third-party resource and loads only when a visitor selects “Load SoundCloud player.” Its availability depends on SoundCloud, the track's sharing settings, network access, and browser policy. A direct track link is always available. All other images, scripts, styles, and video are included locally. There are no external fonts.

## Preview

Open `index.html` directly for a quick look, or serve this folder with a local static HTTP server. To check seeking as well as video playback, use a server with HTTP byte-range support. GitHub Pages serves the MP4 as a static media file.

## Accessibility

Keyboard navigation, current-page navigation state, a skip link, image descriptions, reduced-motion support, and native video controls are included. For cattle: Tab to select, arrow keys to move (Shift for larger steps), Enter or Space to moo. Sound starts only after user interaction and can be muted. No autoplay video or background sound.
