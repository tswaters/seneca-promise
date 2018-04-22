
'use strict'

const assert = require('assert')
const Seneca = require('seneca')
const SenecaPromise = require('..')

describe('seneca-promise', () => {

  let si = null

  beforeEach(done => {
    si = Seneca({log: 'silent'})
    si.use(SenecaPromise)
    si.ready(() => {

      si.addAsync('role:auth,cmd:rejects', async msg => {
        if (msg.user !== 'user') {
          throw new Error('unauthorized')
        }
        else {
          throw new Error('rejected!')
        }
      })

      si.addAsync('role:auth,cmd:resolves', async msg => {
        if (msg.user !== 'user') {
          throw new Error('unauthorized')
        }
        else {
          return msg
        }
      })

      si.wrapAsync('role:auth,cmd:*', async function (msg) {
        msg.user = 'user'
        return await this.priorAsync(msg)
      })

      si.addAsync('cmd:prior', async (msg) => {
        msg.second = true
        return msg
      })

      si.addAsync('cmd:prior', async function (msg) {
        msg.first = true
        return await this.priorAsync(msg)
      })

      si.addAsync('cmd:prior-error', async () => {
        throw new Error('rejected!')
      })

      si.addAsync('cmd:prior-error', async function (msg) {
        msg.first = true
        return await this.priorAsync(msg)
      })

      si.addAsync('cmd:resolve', async (msg) => {
        return msg
      })

      si.addAsync('cmd:resolve-additional', {additional: true}, async function (msg) {
        return await this.actAsync('cmd:resolve', msg)
      })

      si.addAsync('cmd:reject', async () => {
        throw new Error('rejected!')
      })

      done()
    })
  })

  afterEach(done => si.close(done))

  it('should wrap actions and resolve properly', () =>
    si.actAsync('role:auth,cmd:resolves')
      .then(msg => {
        assert.equal(msg.user, 'user')
      })
  )

  it('should wrap actions and reject properly', () =>
    si.actAsync('role:auth,cmd:rejects')
      .then(() => {throw new Error('should not hit')})
      .catch(err => {
        assert.equal(err.details.message, 'rejected!')
      })
  )

  it('should reject prior actions properly', () =>
    si.actAsync('cmd:prior-error', {ok: true})
      .then(() => {throw new Error('should not hit')})
      .catch(err => {
        assert.equal(err.details.message, 'rejected!')
      })
  )

  it('should resolve prior actions properly', () =>
    si.actAsync('cmd:prior', {ok: true})
      .then(result => {
        assert.equal(result.first, true)
        assert.equal(result.second, true)
      })
  )

  it('should resolve properly', () =>
    si.actAsync('cmd:resolve', {ok: true})
      .then(result => {
        assert.equal(result.ok, true)
      })
  )

  it('should work with second add parameter', () =>
    si.actAsync('cmd:resolve,additional:true', {ok: true})
      .then(result => {
        assert.equal(result.ok, true)
      })
  )

  it('should reject properly', () =>
    si.actAsync('cmd:reject')
      .then(() => {throw new Error('should not hit')})
      .catch(err => {
        assert.equal(err.details.message, 'rejected!')
      })
  )

})
