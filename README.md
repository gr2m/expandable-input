# Expandable Input – A jQuery plugin

> A jQuery plugin to use <{span|div|...} contenteditable> as expandable inputs.

[![Build Status](https://travis-ci.org/gr2m/expandable-input.svg)](https://travis-ci.org/gr2m/expandable-input)
[![Dependency Status](https://david-dm.org/gr2m/expandable-input.svg)](https://david-dm.org/gr2m/expandable-input)
[![devDependency Status](https://david-dm.org/gr2m/expandable-input/dev-status.svg)](https://david-dm.org/gr2m/expandable-input#info=devDependencies)

## Download / Installation

You can download the latest JS & CSS code here:

- https://unpkg.com/expandable-input/dist/expandable-input.js
- https://unpkg.com/expandable-input/dist/expandable-input.css

Or install via [npm](https://www.npmjs.com/)

```
npm install --save expandable-input
```

The JS code can be required with

```js
var jQuery = require('jquery')
var expandableInput = require('expandable-input')

// init
expandableInput(jQuery)
```

The CSS code lives at `node_modules/expandable-input/expandable-input.css`

## Usage

```html
<!-- load jquery -->
<script src="jquery.js"></script>

<!-- load expandable-input assets -->
<link rel="stylesheet" type="text/css" href="expandable-input.css">
<script src="expandable-input.js"></script>

<!-- The behaviour is initialized on first interaction -->
<p>
  <strong>Author:</strong>
  <span contenteditable name="name" placeholder="Joe Doe"></span> |
  <span contenteditable name="email" placeholder="joe@example.com"></span>
</p>

<p contenteditable placeholder="Write comment"></p>
```

To listen to changes on the inputs

```js
$('[name=email]').on('input', function(event) {
  console.log('Current name is:', $(this).val())
})
```

## Notes

- `$.fn.val()` & `$.fn.select()` are being patched to work with the `contenteditable` inputs
- `display: inline` is currently not supported. It gets set to inline-block when initialized.
- no html5 validation or password=type etc is not supported.

## Local Setup

```bash
git clone git@github.com:gr2m/smartdate-input.git
cd smartdate-input
npm install
```

## Test

You can start a local dev server with

```bash
npm start
```

Run tests with

```bash
npm test
```

While working on the tests, you can start Selenium / Chrome driver
once, and then tests re-run on each save

```bash
npm run test:mocha:watch
```

## Fine Print

The Expandable Input Plugin have been authored by [Gregor Martynus](https://github.com/gr2m),
proud member of the [Hoodie Community](http://hood.ie/).

License: MIT
