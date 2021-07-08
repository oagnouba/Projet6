const Sauce = require('../models/sauce_mdl');
const fs = require('fs');//importation des différentes opérations liées système de fichiers fs=file system

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);//analyse de la chaîne de caractère qu'on transforme en objet
  delete sauceObject._id; //supprime le champ _id du schéma car il n'est pas nécessaire pour une publication
  delete sauceObject.likes;
  delete sauceObject.dislikes;
  delete sauceObject.usersLiked;
  delete sauceObject.usersDisliked;
  delete sauceObject.email;
  delete sauceObject.password;

  const sauce = new Sauce({
    //title: req.body.title, (pour chaque élément -> chemin très long)
    ...sauceObject, //copie les champs qu'il y a dans le body de la request; ... = spread operator
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });

  sauce
    .save() //enrégistre l'objet ajouté
    .then(() => res.status(201).json({ message: "Sauce enrégistrée" })) //renvoi une réponse au frontend pour éviter l'expiration de la requête
    .catch((error) => res.status(400).json({ error })); //pour une erreur en cas d'anomalie
};
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
    }
    : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id }) //1er argument c'est l'objet de comparaison; 2ème = l'objet modifié
    .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })//identifier le user enrégistré dans les paramètres de la requête
    .then(sauce => {
      const filename = sauce.imageUrl.split("/images/")[1]; //on recupère le nom du fichier à supprimer
      fs.unlink("images/${filename}", () => {//on supprime le fichier avec fs.unlink et on fait le callback
        Sauce.deleteOne({ _id: req.params.id })//suppression de l'objet dans la page
          .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }) //pour trouver une sauce, on passe un objet de comparaison "ici id"
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};




exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces)) //on récupère le tableau des sauces qu'on renvoie
    .catch((error) => res.status(400).json({ error }));
};

// LIKE & DISLIKE
exports.likeStatus = (req, res, next) => {
  const like = req.body.like;
  const userId = req.body.userId;

  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.usersLiked.find((user) => user === req.body.userId)) {
        // on cherche si l'utilisateur est déjà dans le tableau usersLiked
        Sauce.updateOne(
          { _id: req.params.id }, { // si oui, maj de la sauce avec le _id présent dans la requête
            $inc: { likes: -1 },
            $pull: { usersLiked: req.body.userId }, // delete le user du tableau.
          }
        )
          .then(() => {
            res.status(201).json({ message: "vote enregistré." });
          })
          .catch((error) => {
            res.status(400).json({ error });
          });
      }
      if (sauce.usersDisliked.find((user) => user === req.body.userId)) {
        //mêmes principes que précédemment avec le tableau usersDisliked
        Sauce.updateOne(
          { _id: req.params.id },
          {
            $inc: { dislikes: -1 },
            $pull: { usersDisliked: req.body.userId },
          }
        )
          .then(() => {
            res.status(201).json({ message: "vote enregistré." });
          })
          .catch((error) => {
            res.status(400).json({ error });
          });
      }
    })
    .then(()=>{
      // LIKE
      if (like == 1) {
        Sauce.updateOne(
          { _id: req.params.id },
          {
            $push: { usersLiked: userId }, //ajout du user dans le array usersLiked
            $inc: { likes: 1 }, //ajout de "1" au compte total de like de la sauce
          }
        )
          .then(() => res.status(200).json({ message: "Like ajouté" }))
          .catch((error) => res.status(400).json({ error }));
      }

      // DISLIKE
      if (like == -1) {
        Sauce.updateOne(
          { _id: req.params.id },
          {
            $push: { usersDisliked: userId },
            $inc: { dislikes: 1 },
          }
        )
          .then(() => res.status(200).json({ message: "Dislike ajouté" }))
          .catch((error) => res.status(400).json({ error }));
      }
    })
    .catch((error) => {
      res.status(404).json({ error });
    });


};

  //NEUTRE
  exports.rateOneSauce = (req, res, _) => {
  switch (req.body.like) {
    case 0 :
      Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
          if (sauce.usersLiked.find( user => user === req.body.userId)) {  // on cherche si l'utilisateur est déjà dans le tableau usersLiked
            Sauce.updateOne({ _id: req.params.id }, {         // si oui, maj de la sauce avec le _id présent dans la requête
              $inc: { likes: -1 },
              $pull: { usersLiked: req.body.userId }          // delete le user du tableau.
            })
              .then(() => { res.status(201).json({ message: "vote enregistré."}); })
              .catch((error) => { res.status(400).json({error}); });

          }
          if (sauce.usersDisliked.find(user => user === req.body.userId)) {  //mêmes principes que précédemment avec le tableau usersDisliked
            Sauce.updateOne({ _id: req.params.id }, {
              $inc: { dislikes: -1 },
              $pull: { usersDisliked: req.body.userId }
            })
              .then(() => { res.status(201).json({ message: "vote enregistré." }); })
              .catch((error) => { res.status(400).json({error}); });
          }
        })
        .catch((error) => { res.status(404).json({error}); });
          }
    };
