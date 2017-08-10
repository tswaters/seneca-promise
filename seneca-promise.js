
'use strict'

function SenecaPromise () {

  this.decorate('addAsync', function (...args) {
    const action = args[args.length - 1]
    const pattern = args.slice(0, -1)
    this.add(...pattern, function (msg, cb) {
      action.call(this, msg)
        .then(result => cb(null, result))
        .catch(err => cb(err))
    })
  })

  this.decorate('priorAsync', function (msg) {
    return new Promise((resolve, reject) =>
      this.prior.call(this, msg, (err, result) =>
        err ? reject(err) : resolve(result)
      )
    )
  })

  this.decorate('actAsync', function (...pattern) {
    return new Promise((resolve, reject) =>
      this.act.call(this, ...pattern, (err, result) =>
        err ? reject(err) : resolve(result)
      )
    )
  })

  return {
    name: 'SenecaPromise'
  }

}

module.exports = SenecaPromise
