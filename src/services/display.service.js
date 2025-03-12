const { listRecords } = require('./db.service');

const displayRecords = async () => {
  try {
    const records = await listRecords();
    console.log('Données importées :', records);
  } catch (error) {
    console.error('Erreur lors de l\'affichage des données :', error);
  }
};

displayRecords();
