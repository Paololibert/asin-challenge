const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const importData = async (records) => {
  // Import data into the database
  try {
    return await prisma.people.createMany({ data: records });
  } catch (error) {
    // Log any errors, an error will be throw if there is a matricule conflict
    console.error('Erreur lors de l\'import des données :', error);
  }
};

const listRecords = async () => {
  const records = await prisma.people.findMany();
  console.log(records);
  return records;
};

module.exports = { importData, listRecords };
