var path = require('path')
var Promise = require('promise')

function UpwardResolverPlugin (symbolList) {
  this.symbolList = symbolList ? getArray(symbolList) : []
}

UpwardResolverPlugin.prototype.apply = function (resolver) {
  resolver.plugin('module', plugin(resolver, this.symbolList))
}

function plugin (resolver, symbolList) {
  return function (req, done) {
    if (
      path.isAbsolute(req.request) ||
      symbolList.indexOf(req.request[0]) === -1
    ) { return done() }

    var requestList = getRequestList(root, req)
    var chain = Promise.resolve()

    requestList.forEach(function (request) {
      chain = chain.then(function () {
        return doResolve(request, resolver, req)
      })
    })
    chain.then(function () {
      done()
    }).catch(function (result) {
      done(null, result)
    })
  }
}

function getRequestList (root, req) {
  var root = path.resolve('./')
  var request = req.request.substr(1)
  var finalRequest = path.join(req.path, request)
  var list = []

  do {
    list.push(finalRequest)
    request = path.join('..', request)
    finalRequest = path.join(req.path, request)
  } while (path.relative(root, finalRequest).indexOf('..') !== 0)
  return list
}

function doResolve (request, resolver, req) {
  return new Promise(function (resolve, reject) {
    resolver.doResolve(['file', 'directory'], {
      directory: req.directory,
      path: req.path,
      query: req.query,
      request: request
    }, function (err, result) {
      if (result) {
        reject(result)
      } else {
        resolve()
      }
    })
  })
}

function getArray (tar) {
  var isArray = Object.prototype.toString.call(tar) === '[object Array]'
  return isArray ? tar : [tar]
}

module.exports = UpwardResolverPlugin
