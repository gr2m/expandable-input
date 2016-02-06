/* global describe, beforeEach, it, $ */

// we delete the cached require of '@gr2m/frontend-test-setup'
// to make it work with mocha --watch.
delete require.cache[require.resolve('@gr2m/frontend-test-setup')]
require('@gr2m/frontend-test-setup')

var expect = require('chai').expect

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

describe('=== expandable-input ===', function () {
  this.timeout(90000)

  beforeEach(function () {
    return this.client.url('/')
  })

  it('sanity check', function () {
    return this.client
      .url('/index.html')
      // .getTitle()
      .execute(function getTitle () {
        return document.title
      }).then(toValue)
      .then(function (title) {
        expect(title).to.equal('Expandable Input – A jQuery plugin')
      })
  })

  it('inline input grows with content', function () {
    var defaultWidth

    // for (var key in this.client) {
    //   console.log(key)
    // }

    return this.client
      .execute(function setNameAndGetWidth () {
        return $('[name=name]').width()
      }).then(toValue)
      .then(function (width) {
        defaultWidth = width
      })
      .element('[name=name]')
      .keys('Missy Misdemour Elliot')
      .debug()
      .execute(function setNameAndGetWidth () {
        return $('[name=name]').width()
      }).then(toValue)
      .then(function (width) {
        expect(width).to.not.equal(defaultWidth)
      })
  })

  it('inline input grows when set with .val(text)', function () {
    return this.client
      .execute(function setNameAndGetWidth () {
        var $input = $('[name=name]')
        var defaultWidth = $input.width()
        $input.text('Missy Misdemour Elliot')
        return defaultWidth !== $input.width()
      }).then(toValue)
      .then(function (hasDifferentSize) {
        expect(hasDifferentSize).to.equal(true)
      })
  })

  it('block input grows with content', function () {
    return this.client
      .execute(function setNameAndGetWidth () {
        var $input = $('[name=about]')
        var defaultHeight = $input.height()
        $input.html('super<br>funky<br>fresh')
        return defaultHeight !== $input.height()
      }).then(toValue)
      .then(function (hasDifferentSize) {
        expect(hasDifferentSize).to.equal(true)
      })
  })
})
