const { cleanupData } = require('../services/cleanup.service');

cleanupData().then(() => {
  console.log('Nettoyage terminé.');
}).catch((error) => {
  console.error('Erreur lors du nettoyage :', error);
});
