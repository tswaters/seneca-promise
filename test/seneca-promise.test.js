
'use strict'

const util = require('util')
const assert = require('assert')
const Seneca = require('seneca')
const SenecaPromise = require('..')

describe('seneca-promise', () => {

  let si = null
  let act = null

  beforeEach(done => {
    si = Seneca({log: 'silent'})
    si.use(SenecaPromise)
    act = util.promisify(si.act).bind(si)
    si.ready(() => {

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

      si.addAsync('cmd:resolve-additional', {additional: true}, async (msg) => {
        return await act('cmd:resolve', msg)
      })

      si.addAsync('cmd:reject', async () => {
        throw new Error('rejected!')
      })

      done()
    })
  })

  afterEach(done => si.close(done))

  it('should reject prior actions properly', () =>
    si.actAsync('cmd:prior-error', {ok: true})
      .then(() => {throw new Error('should not hit')})
      .catch(err => {
        assert.equal(err.orig.message, 'rejected!')
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
        assert.equal(err.orig.message, 'rejected!')
      })
  )

})
