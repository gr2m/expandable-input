/* global $ */
var spawn = require('child_process').spawn

var debug = require('debug')('test')
var expect = require('chai').expect
var selsa = require('selsa')
var test = require('tap').test

var selsaOptions = {}

function toValue (result) {
  if (isError(result.value)) {
    var error = new Error(result.value.message)
    Object.keys(result.value).forEach(function (key) {
      error[key] = result.value[key]
    })
    throw error
  }

  return result.value
}

function isError (value) {
  return value && value.name && /error/i.test(value.name)
}

selsa(selsaOptions, function (error, api) {
  if (error) {
    throw error
  }

  var server = spawn('./node_modules/.bin/webpack-dev-server', ['--context', 'demo', '--config', 'demo/webpack.config.js', '--content-base', 'demo', '-d', '--port', '3891'])
  // the correct way would be to do something like this;
  // var server = new WebpackDevServer(webpack(require('../demo/webpack.config.js')), {})
  // but server.close() does not work, the process hangs :/ Might be fixed with v2

  setTimeout(function () {
    test('=== expandable-input ===', function (group) {
      group.beforeEach(function () {
        return api.browser.url('http://localhost:3891/')
      })

      group.tearDown(function () {
        server.kill()
        return api.tearDown(group.passing(), function (error) {
          if (error) {
            return debug(error)
          }

          debug('selsa stopped')

          process.exit()
        })
      })

      group.test('sanity check', function (t) {
        api.browser
          .url('http://localhost:3891/index.html')
          // .getTitle()
          .execute(function getTitle () {
            return document.title
          }).then(toValue)
          .then(function (title) {
            expect(title).to.equal('Expandable Input – A jQuery plugin')
          })
          .then(t.end, t.end)
      })

      group.test('inline input grows with content', function (t) {
        var defaultWidth

        api.browser
          .execute(function setNameAndGetWidth () {
            return $('[name=name]').width()
          }).then(toValue)
          .then(function (width) {
            defaultWidth = width
          })
          // click also sets focus, so "keys" command enters text into the input
          .click('[name="name"]')
          .keys('Missy Misdemour Elliot')
          .execute(function setNameAndGetWidth () {
            return $('[name=name]').width()
          }).then(toValue)
          .then(function (width) {
            expect(width).to.not.equal(defaultWidth)
          })
          .then(t.end, t.end)
      })

      group.test('inline input grows when set with .val(text)', function (t) {
        api.browser
          .execute(function setNameAndGetWidth () {
            var $input = $('[name=name]')
            var defaultWidth = $input.width()
            $input.text('Missy Misdemour Elliot')
            return defaultWidth !== $input.width()
          }).then(toValue)
          .then(function (hasDifferentSize) {
            expect(hasDifferentSize).to.equal(true)
          })
          .then(t.end, t.end)
      })

      group.test('block input grows with content', function (t) {
        api.browser
          .execute(function setNameAndGetWidth () {
            var $input = $('[name=about]')
            var defaultHeight = $input.height()
            $input.html('super<br>funky<br>fresh')
            return defaultHeight !== $input.height()
          }).then(toValue)
          .then(function (hasDifferentSize) {
            expect(hasDifferentSize).to.equal(true)
          })
          .then(t.end, t.end)
      })

      group.end()
    })
  }, 3000)
})
