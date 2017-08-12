
[![npm version][npm-badge]][npm-url]
[![Dependency Status][david-badge]][david-url]
[![Build Status][travis-badge]][travis-url]

# Seneca Promise

Utilities for seneca re: promises, async/await

## Usage

For lots of examples, refer to the tests.

```js

const seneca = Seneca()
seneca.use(SenecaPromise)
seneca.ready(() => {

  // you can await other actions!
  seneca.addAsync('cmd:test', async (msg) => {
    await this.actAsync('cmd:error', msg)
  })

  // and call into prior actions with `priorAsync`
  seneca.addAsync('cmd:test', async msg => {
    return await result = this.priorAsync(msg)
  })

})

```

## API

* addAsync 
  Same as `add` but allow you to return a promise.

* priorAsync
  Same as `prior` but allows you to return a promise.

* actAsync
  Same as `act` but returns a promise.

[npm-badge]: https://badge.fury.io/js/hashifier.svg
[npm-url]: https://badge.fury.io/js/hashifier
[david-badge]: https://david-dm.org/tswaters/hashifier.svg
[david-url]: https://david-dm.org/tswaters/hashifier
[travis-badge]: https://travis-ci.org/tswaters/seneca-promise.svg?branch=master
[travis-url]: https://travis-ci.org/tswaters/seneca-promise
