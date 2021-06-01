const express = require('express'); //importer express
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const sauceRoutes = require('./routes/sauce_rt');
const userRoutes = require('./routes/user');

/****** Connexion de l'api à la base de donnée ******/
mongoose
  .connect(
    "mongodb+srv://oagnouba:cestMoi37@cluster0.c0mi7.mongodb.net/Pekocko?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));
/****** Fin connexion de l'api à la base de donnée ******/

const app = express(); //créer l'application express

/*app.use((req, res) => {
  res.json({ message: 'La quête est bien reçue!'});
});*/

/****** Eviter les erreurs CORS ******/ //Le CORS empêche l'user d'accéder à des données auxquelles il n'est pas autosiré ce n'est pas le but recherché pour l'appli
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");//on donne l'accès à tlm
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );//autorisation d'utiliser certains en-tête
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );//autorisation d'utiliser certaines méthodes
  next();
});
/****** Fin éviter les erreurs CORS ******/

/****** Convertir le corps de la requête en json ******/
app.use(express.json());
/****** Fin convertir le corps de la requête en json ******/

app.use('/images', express.static(path.join(__dirname, 'images')));//???

app.use('/api/sauces', sauceRoutes);//importation du router
app.use('/api/auth', userRoutes);

module.exports = app;//exporter 'app' pour y avoir accès depuis les autres fichiers
