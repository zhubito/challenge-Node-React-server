const db = require("../models");
const Post = db.posts;
const Op = db.Sequelize.Op;

// Insertar Post
exports.create = (req, res) => {
  // Validación
  if (!req.body.name || !req.body.description) {
    res.status(400).send({
      message: "El nombre y la descripción son obligatorios"
    });
    return;
  }

  const post = {
    name: req.body.name,
    description: req.body.description
  };

  Post.create(post)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Ocurrio algún problema al crear el post."
      });
    });
};

// Busca todos los post
exports.findAll = (req, res) => {
  const name = req.body.name;
  var condition = name ? { name: { [Op.iLike]: `%${name}%` } } : null;

  Post.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Ocurrio algún problema al buscar los posts."
      });
    });
};

// Borra post por ID
exports.delete = async (req, res) => {
  const id = req.params.id;

  //Buscamos elemento antes de borrar para devolver
  const dataDeleted = await Post.findByPk(id)
    .then(data => {
      console.log('busca: data');
      console.log(data);
      if (data) {
        return data;
      } else {
        res.status(404).send({
          message: `No se pudo encontrar el post con id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: err.message
      });
    });

  Post.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send(dataDeleted);
      } else {
        res.send({
          message: `No se pudo eliminar el post con id=${id}. Quizás no fue encontrado!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Ocurrio algún problema al buscar los posts."
      });
    });
};