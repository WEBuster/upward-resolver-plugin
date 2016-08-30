var path = require('path')
var rimraf = require('rimraf')
var webpack = require('webpack')
var expect = require('chai').expect

describe('upward-resolver-plugin', function () {

  var UpwardResolverPlugin = require('../')
  var outputDir = path.resolve(__dirname, './output')
  var globalConfig = {
    output: {
      path: outputDir,
      filename: 'test.build.js'
    }
  }

  function test (options, assert) {
    var config = Object.assign({}, globalConfig, options)
    webpack(config, function (err, stats) {
      if (stats.compilation.errors.length) {
        stats.compilation.errors.forEach(function (err) {
          console.error(err.message)
        })
      }
      assert(stats.compilation.errors)
    })
  }

  it('normal', function (done) {
    test({
      entry: './test/fixtures/normal'
    }, function (errors) {
      expect(errors).to.be.empty
      done()
    })
  })

  it('upward-resolve-file', function (done) {
    test({
      entry: './test/fixtures/upward/a/b/c/file',
      plugins: [
        new webpack.ResolverPlugin([
          new UpwardResolverPlugin('+')
        ])
      ]
    }, function (errors) {
      expect(errors).to.be.empty
      done()
    })
  })

  it('upward-resolve-directory', function (done) {
    test({
      entry: './test/fixtures/upward/a/b/c/directory',
      plugins: [
        new webpack.ResolverPlugin([
          new UpwardResolverPlugin('+')
        ])
      ]
    }, function (errors) {
      expect(errors).to.be.empty
      done()
    })
  })

})
