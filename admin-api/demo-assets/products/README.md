# Demo product images

Place these six JPEG files in this directory before running `yarn demo:seed`:

- `classic-t-shirt.jpg`
- `running-shoes.jpg`
- `leather-backpack.jpg`
- `wireless-headphones.jpg`
- `smart-watch.jpg`
- `coffee-mug.jpg`
- `iphone-16-pro.jpg`

The seed validates that every file exists, is non-empty, is within
`UPLOAD_MAX_BYTES` (5 MiB by default), and has a JPEG signature before making
database changes or uploading anything.

Use only images that you own or are licensed to use. The seed uploads each file
to the existing `products` bucket using a deterministic `demo-` prefixed object
name. Do not rename the files.
