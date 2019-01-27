"use strict";

// module.exports = function (fastify, opts, next) {
//   fastify.get('/todos', function (request, reply) {
//     reply.send('this is an example')
//   })

//   next()
// }

//If you prefer async/await, use the following

const opts = {
  schema: {
    response: {
      200: {
        type: "object",
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          completed: { type: "boolean" }
        }
      }
    }
  }
};

module.exports = async function(fastify, opts) {
  fastify
    .get("/todos/:todoId", async function(request, reply) {
      request.log.info(`TodoId passed in is  ${request.params.todoId}`);
      // reply.log.info( request.query)
      // reply.log.info("Hello")
      reply.header("Content-Type", "application/json").code(200);
      return {
        id: request.params.todoId,
        name: "My Todo",
        description: "Descr",
        completed: false
      }
    })
    .post("/todos", opts, async (request, reply) => {
      reply.header("Content-Type", "application/json")
      .code(200);
      return {
        id: request.params.todoId,
        name: "My Todo",
        description: "Descr",
        completed: false
      }
    })
    .put("/todos/:todoId", opts, async (request, reply) => {
      reply.header("Content-Type", "application/json")
      .code(201)
      return {
        id: request.params.todoId,
        name: "My Todo",
        description: "Descr",
        completed: false
      }
    })
    .delete("/todos/:todoId", async (request, reply) => {
      reply.code(204);
    });
};
