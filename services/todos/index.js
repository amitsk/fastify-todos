'use strict'

// module.exports = function (fastify, opts, next) {
//   fastify.get('/todos', function (request, reply) {
//     reply.send('this is an example')
//   })

//   next()
// }

//If you prefer async/await, use the following

module.exports = async function (fastify, opts) {
  fastify.get('/todos', async function (request, reply) {
    return 'this is an example'
  })
}
