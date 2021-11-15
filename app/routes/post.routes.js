module.exports = app => {
  const posts = require("../controllers/post.controller.js");

  var router = require("express").Router();

  // Inserta post
  router.post("/", posts.create);

  // lista completa de post
  router.get("/", posts.findAll);

  // Borrar post
  router.delete("/:id", posts.delete);

  app.use('/api/posts', router);
};