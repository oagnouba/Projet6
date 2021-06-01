/****** Création du modèle mongoose  ******/
const mongoose = require ('mongoose');
const uniqueValidator = require('mongoose-unique-validator');//m-u-v: évite qu'un user utilise plusieurs fois le même email pour s'enrégister


/****** Création schéma user ******/
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);//application du validator au schéma avant d'en faire un modèle

module.exports = mongoose.model('user', userSchema);
/****** Fin création schéma user ******/

/****** Fin création du modèle mongoose  ******/
