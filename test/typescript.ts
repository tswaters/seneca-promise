
import assert = require('assert')
import Seneca = require('seneca')
import SenecaPromise = require('..')

type AuthAction = {role: string, cmd: string}
type AuthParams = {user: string}
type AuthResponse  = {ok: boolean}

const si = Seneca()

si.use(SenecaPromise)

si.ready(function (this: Seneca.Instance) {

  // using jsonic for definition - note first generic param needs to be string
  // if you want the types on `msg`, define a joint type to 2nd type param
  // this will be the only example using string jsonic for action definition.

  this.addAsync<string, AuthAction & AuthParams, AuthResponse>('role:user,cmd:resolves', async function (msg) {
    assert(msg.user)
    assert(msg.cmd)
    assert(msg.role)
    return {ok: true}
  })

  // not using jsonic is a bit easier as you can define action/params & response

  this.addAsync<AuthAction, AuthParams, AuthResponse>({role: 'auth', cmd: 'rejects'}, async function (msg) {
    assert(msg.user)
    assert(msg.cmd)
    assert(msg.role)
    return {ok: false}
  })

  // you can call into prior actions. the first type parameter should be a joint of action/params
  // the second one is the response - you'll get back all the values in `result`

  this.wrapAsync<AuthAction, AuthParams, AuthResponse>({role: 'auth', cmd: '*'}, async function (msg) {
    assert(msg.user)
    assert(msg.cmd)
    assert(msg.role)
    const result = await this.priorAsync<AuthAction & AuthParams, AuthResponse>(msg)
    assert(result.ok)
    return {ok: result.ok}
  })

  // calling into something
  // with jsonic

  this.addAsync('role:test', async () => {
    const result = await this.actAsync<string, AuthParams, AuthResponse>('role:user,cmd:resolves', {user: 'user'})
    assert(result.ok)
  })

})
