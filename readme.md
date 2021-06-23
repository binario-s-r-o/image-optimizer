# @binario/image-optimizer

This module provides an easy way to generate responsive image variants.

## Integrations

- Gulp
- Rollup

## Data structures

### Presets config

```javascript
module.eports = {
  manifest: {
    enable: true,
    name: 'image-manifest.json',
    save: './path/to/dir',
  },
  extraFormats: ['avif', 'webp'],
  original: {
    maxWidth: 2560, // in pixels
    maxHeight: 1440, // in pixels
    allowedFormats: ['jpeg', 'png', 'gif'],
    fallbackFormat: 'jpeg',
  },
  sharpFormatSettings: { // future enhancement - not implemented yet
    jpeg: {}, // https://sharp.pixelplumbing.com/api-output#jpeg
    png: {}, // https://sharp.pixelplumbing.com/api-output#png
    webp: {}, // https://sharp.pixelplumbing.com/api-output#webp
    avif: {}, // https://sharp.pixelplumbing.com/api-output#avif
  },
  sizes: [
    {
      suffix: '-sm',
      width: 640,
    },
    {
      suffix: '-md',
      width: 1080,
    },
    {
      suffix: '-lg',
      width: 1920,
    },
  ],
}
```

### Manifest output

```json
{
  "/path/to/img1.jpeg": {
    "hw_ratio": 0.5625,
    "original": {
      "format": "jpeg",
      "uri": "/path/to/img1.jpeg"
    },
    "sources": [
      {
        "mime": "image/avif",
        "srcset": "/path/to/img1-sm.avif 640w, ..."
      },
      {
        "mime": "image/webp",
        "srcset": "/path/to/img1-sm.webp 640w, ..."
      },
      {
        "mime": "image/jpeg",
        "srcset": "/path/to/img1-sm.jpeg 640w, ...",
      }
    ]
  }
}
```
