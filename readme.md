# @binario/image-optimizer
![Build Master](https://github.com/binario-s-r-o/image-optimizer/actions/workflows/merge.yaml/badge.svg)

This module provides an easy way to generate responsive image variants.

## Integrations

- Gulp
- TODO: webpack
- TODO: rollup

## Data structures

### Presets config
The tool currently does **NOT** load the preset file automatically and it is upto the user whether to place the configuration inline to gulp file or whether to create a separate configuration file and manually require it in the gulp file.

#### Example configuration
```javascript
module.exports = {
  extraFormats: ['avif', 'webp'],
  original: {
    maxWidth: 2560, // in pixels
    maxHeight: 1440, // in pixels
    allowedFormats: ['jpeg', 'png', 'gif'],
    fallbackFormat: 'jpeg',
  },
  sharpFormatSettings: { // global format settings
    jpeg: {}, // https://sharp.pixelplumbing.com/api-output#jpeg
    png: {}, // https://sharp.pixelplumbing.com/api-output#png
    webp: {}, // https://sharp.pixelplumbing.com/api-output#webp
    avif: {}, // https://sharp.pixelplumbing.com/api-output#avif
  },
  sizes: [
    {
      suffix: '-sm',
      width: 640,
      // size specific format settings - overrides global format settings
      sharpFormatSettings: {},
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

### Gulp Manifest output

```json
{
  "/path/to/img1.jpeg": {
    "hw_ratio": 0.5625,
    "sources": [
      {
        "mime": "image/avif",
        "srcset": "/path/to/img1-sm.avif 640w, ...",
        "sizes": [
          {
            "path": "/path/to/img1-sm.avif",
            "width": 640
          },
          {
            "path": "/path/to/img1-md.avif",
            "width": 1080
          },
          {
            "path": "/path/to/img1-lg.avif",
            "width": 1920
          },
          {
            "path": "/path/to/img1.avif"
          }
        ]
      },
      {
        "mime": "image/webp",
        "srcset": "/path/to/img1-sm.webp 640w, ...",
        "sizes": [{
          // ...
        }]
      },
      {
        "mime": "image/jpeg",
        "srcset": "/path/to/img1-sm.jpeg 640w, ...",
        "sizes": [{
          // ...
        }]
      }
    ]
  }
}
```
