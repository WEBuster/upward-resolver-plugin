# upward-resolver-plugin

[![Build Status](https://circleci.com/gh/WEBuster/upward-resolver-plugin/tree/master.svg?style=shield)](https://circleci.com/gh/WEBuster/upward-resolver-plugin/tree/master)
[![Version](https://img.shields.io/npm/v/upward-resolver-plugin.svg?style=flat-square)](https://www.npmjs.com/package/upward-resolver-plugin)
[![License](https://img.shields.io/npm/l/upward-resolver-plugin.svg?style=flat-square)](LICENSE)

> A webpack resolver plugin to upward resolve file.

## Install

```shell
npm i -D upward-resolver-plugin
```

## webpack config

```js
var UpwardResolverPlugin = require('upward-resolver-plugin')
var webpack = require('webpack')
```

```js
{
  plugins: [
    new webpack.ResolverPlugin([
      new UpwardResolverPlugin({
        syntax: ['+'],
        dir: ['.']
      })
    ])
  ]
}
```

## Example

```shell
/root
  /a
    /b
      /c
        index.js
    hello.js
```

In `/root/a/b/c/index.js`

```js
require('+hello')
```

Then `/root/a/hello.js` will be resolved.
