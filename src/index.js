const multiplex = require('multiplex')

exports = module.exports = function (transport, isListener) {
  var id = 1

  const muxer = multiplex()

  transport.pipe(muxer).pipe(transport)

  muxer.newStream = (callback) => {
    if (!callback) {
      callback = noop
    }
    id = id + (isListener ? 2 : 1)

    const stream = muxer.createStream(id)

    setTimeout(() => {
      callback(null, stream)
    })

    return stream
  }

  // The rest of the API comes by default with SPDY
  // muxer.on('stream', (stream) => {})
  // muxer.on('close', () => {})
  // muxer.on('error', (err) => {})
  // muxer.end()
  muxer.multicodec = exports.multicodec
  return muxer
}

exports.multicodec = '/multiplex/6.7.0'

function noop () {}
