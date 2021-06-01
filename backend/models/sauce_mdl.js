/****** Création du modèle mongoose  ******/
const mongoose = require('mongoose');

/****** Création schéma des sauces ******/
const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number, required: true },
  dislikes: { type: Number, required: true },
  usersLiked: { type: String, required: true },
  usersDisliked: { type: String, required: true },
});

module.exports = mongoose.model('Sauce', sauceSchema);//exporter pour pouvoir utiliser ce schéma comme modèle
/****** Création schéma de données ******/

/****** Fin création du modèle mongoose  ******/
