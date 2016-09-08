var path = require('path')
var Promise = require('promise')

function UpwardResolverPlugin (options) {
  if (Object.prototype.toString.call(options) === '[object Object]') {
    this.syntaxList = options.syntax ? getArray(options.syntax) : []
    this.dirList = options.dir ? getArray(options.dir) : ['.']
  } else {
    this.syntaxList = options ? getArray(options) : []
    this.dirList = ['.']
  }
}

UpwardResolverPlugin.prototype.apply = function (resolver) {
  resolver.plugin('module', plugin(resolver, this.syntaxList, this.dirList))
}

function plugin (resolver, syntaxList, dirList) {
  return function (req, done) {
    if (
      path.isAbsolute(req.request) ||
      syntaxList.indexOf(req.request[0]) === -1
    ) { return done() }

    var requestList = getRequestList(root, req, dirList)
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

function getRequestList (root, req, dirList) {
  var root = path.resolve('./')
  var list = []
  var request = req.request.substr(1)
  var finalRequest = path.join(req.path, request)
  var requestWithDir = ''
  var finalRequestWithDir = ''

  list.push(finalRequest)

  while (isParentDirOf(root, finalRequest)) {
    request = path.join('..', request)
    finalRequest = path.join(req.path, request)

    dirList.forEach(function (dir) {
      requestWithDir = request.replace(/^(\.\.[\/\\])+/, '$&' + dir + '/')
      finalRequestWithDir = path.join(req.path, requestWithDir)

      if (isParentDirOf(root, finalRequestWithDir)) {
        list.push(finalRequestWithDir)
      }
    })
  }

  return list
}

function isParentDirOf (base, tar) {
  return path.relative(base, tar).indexOf('..') !== 0
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
