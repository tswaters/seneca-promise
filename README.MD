![Seneca][Logo]

# Seneca Promise

[![npm version][npm-badge]][npm-url]
[![Dependency Status][david-badge]][david-url]
[![Build Status][travis-badge]][travis-url]
[![Coverage Status][coveralls-badge]][coveralls-url]

- __Node:__ 8.x
- __Seneca:__ 2.x - 3.x

This plugin adds a series of methods to the `seneca` instance that allow for
promises and async/await.  For lots of examples, refer to the tests.

If you're using this module, and need help, you can:

- Post a [github issue][],

If you are new to Seneca in general, please take a look at [senecajs.org][]. We have
everything from tutorials to sample apps to help get you up and running quickly.

## Install
```
npm install seneca-promise
```

## Quick Example

```js

const seneca = Seneca()
seneca.use(SenecaPromise)
seneca.ready(() => {

  // you can throw errors!
  seneca.addAsync('cmd:error', async () => {
    throw new Error('aw snap!')
  })

  // you can await other actions!
  seneca.addAsync('cmd:test', async (msg) => {
    await this.actAsync('cmd:error', msg)
  })

  // and call into prior actions with `priorAsync`!
  seneca.addAsync('cmd:test', async msg => {
    return await result = this.priorAsync(msg)
  })

  // and you can even wrap methods!
  seneca.wrapAsync('cmd:*', async msg => {
    console.log('Received cmd', msg.pattern)
    return await this.priorAsync(msg)
  })

})

```

## API

* addAsync
  Same as `add` but allow you to return a promise.

* wrapAsync
  Same as `wrap` but allows you to return a promise

* priorAsync
  Same as `prior` but allows you to return a promise.

* actAsync
  Same as `act` but returns a promise.

[Logo]: http://senecajs.org/files/assets/seneca-logo.png
[senecajs.org]: http://senecajs.org/
[github issue]: https://github.com/tswaters/seneca-promise/issues
[npm-badge]: https://badge.fury.io/js/hashifier.svg
[npm-url]: https://badge.fury.io/js/hashifier
[david-badge]: https://david-dm.org/tswaters/hashifier.svg
[david-url]: https://david-dm.org/tswaters/hashifier
[travis-badge]: https://travis-ci.org/tswaters/seneca-promise.svg?branch=master
[travis-url]: https://travis-ci.org/tswaters/seneca-promise
[coveralls-badge]: https://coveralls.io/repos/github/tswaters/seneca-promise/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/tswaters/seneca-promise?branch=master
