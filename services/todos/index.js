"use strict";

const loki = require("lokijs");
const db = new loki("todos.json", { env: "NODEJS", autosave: true });
const todos = db.addCollection("todos");

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
      let todo = todos.get(request.params.todoId);
      if (todo === null) {
        reply.code(404).send();
      } else {
        reply.header("Content-Type", "application/json").code(200);
        return Object.assign({}, todo, {
          $loki: undefined,
          meta: undefined,
          id: todo.$loki
        });
      }
    })
    .post("/todos", opts, async (request, reply) => {
      reply.header("Content-Type", "application/json").code(200);
      let newTodo = todos.insert(request.body);
      return Object.assign({}, newTodo, {
        $loki: undefined,
        meta: undefined,
        id: newTodo.$loki
      });
    })
    .put("/todos/:todoId", opts, async (request, reply) => {
      reply.header("Content-Type", "application/json").code(201);
      return {
        id: request.params.todoId,
        name: "My Todo",
        description: "Descr",
        completed: false
      };
    })
    .delete("/todos/:todoId", async (request, reply) => {
      reply.code(204);
    });
};
