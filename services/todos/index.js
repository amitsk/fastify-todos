"use strict";

const loki = require("lokijs");
const db = new loki('todos.db', {
	autoload: true,
	autoloadCallback : databaseInitialize,
	autosave: true, 
	autosaveInterval: 4000
});

// implement the autoloadback referenced in loki constructor
function databaseInitialize() {
  let entries = db.getCollection("todos");
  if (entries === null) {
    entries = db.addCollection("todos");
  }

  // kick off any program logic or start listening to external events
  runProgramLogic();
}

// example method with any bootstrap logic to run after database initialized
function runProgramLogic() {
  let entryCount = db.getCollection("todos").count();
  console.log("number of entries in database : " + entryCount);
}

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
      let todos = db.getCollection('todos')
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
      reply.header("Content-Type", "application/json").code(201);
      let todos = db.getCollection('todos')
      let newTodo = todos.insert(request.body);
      return Object.assign({}, newTodo, {
        $loki: undefined,
        meta: undefined,
        id: newTodo.$loki
      });
    })
    .put("/todos/:todoId", opts, async (request, reply) => {
      reply.header("Content-Type", "application/json").code(200);
      let todos = db.getCollection('todos')
      let todo = todos.get(request.params.todoId);
      if (todo === null) {
        reply.code(404).send();
      } else {
        let newTodo = request.body;
        request.log.info(`newTodo : ${JSON.stringify(newTodo)}`)
        let updatedTodo = Object.assign({}, todo, newTodo);
        request.log.info(`Updated TODO : ${JSON.stringify(updatedTodo)}`)
        todos.update(updatedTodo)
        return Object.assign({}, updatedTodo, {
          $loki: undefined,
          meta: undefined,
          id: todo.$loki
        });
      }
    })
    .delete("/todos/:todoId", async (request, reply) => {
      let todos = db.getCollection('todos')
      let todo = todos.get(request.params.todoId);
      
      if (todo === null) {
        reply.code(404).send();
      } else {
        todos.remove({$loki: request.params.todoId});
        reply.header("Content-Type", "application/json").code(204);
        return {};
      }
    });
};
