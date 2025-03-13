const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const cleanupData = async () => {
  try {
    console.time('cleanupData');
    await prisma.people.deleteMany(); // delete all records
    console.timeEnd('cleanupData');
    const records = await prisma.people.findMany();
    console.log('Données restantes :', records);
    console.log('Toutes les données ont été supprimées.');
  } catch (error) {
    console.error('Erreur lors de la suppression des données :', error);
  } finally {
    await prisma.$disconnect();
  }
};

module.exports = { cleanupData };
