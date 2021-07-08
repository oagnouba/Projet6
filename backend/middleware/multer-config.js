const multer = require("multer");

/****** Création du dictionnaire ******/
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};
/****** Fin création du dictionnaire ******/


/****** Configuration de multer ******/
const storage = multer.diskStorage({//on l'enrégistre sur le disque
  destination: (req, file, callback) => {//1er argument: destination indique dans quel dossier enrégistrer les fichiers et a 3 arguments
    callback(null, "images");//null indique qu'il n'y a pas eu d'erreur et images = nom du dossier
  },
  filename: (req, file, callback) => {//2eme argument: filename: nom du fichier utilisé
    const name = file.originalname.split(" ").join("_");//on crée le nom du fichier par rapport à son nom d'origine
//split enlève les espaces dans les noms de fichier et join les remplace par _
    const extension = MIME_TYPES[file.mimetype];//on génère l'extension au fichier à partir du dictionnaire (minetype)
//qui correspond au minetype du fichier envoyé par le frontend
    callback(null, Date.now() + "." + extension);
  },
});

/****** Fin configuration de multer ******/
module.exports = multer({ storage: storage }).single("image");//export de multer en lui indiquant qu'il s'agit de fichier image unique
