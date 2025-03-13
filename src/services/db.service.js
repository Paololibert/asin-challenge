const { PrismaClient } = require('@prisma/client');
const { performance } = require('perf_hooks');
const prisma = new PrismaClient();

const importData = async (records) => {
  // Convert matricule to string if it's not already
  records = records.map(record => ({
    ...record,
    matricule: String(record.matricule)
  }));

  // Remove duplicate matricule entries
  const uniqueRecords = records.filter((record, index, self) =>
    index === self.findIndex((r) => r.matricule === record.matricule)
  );

  // Import data into the database
  try {
    const start = performance.now();
    const result = await prisma.people.createMany({ data: uniqueRecords });
    const end = performance.now();
    console.log(`importData executed in ${end - start} ms`);
    return result;
  } catch (error) {
    if (error.code === 'P2002' && error.meta.target.includes('matricule')) {
      console.log('Duplicate matricule found, removing duplicates and retrying...');
      const existingMatricules = await prisma.people.findMany({
        where: {
          matricule: {
            in: records.map(record => record.matricule)
          }
        },
        select: {
          matricule: true
        }
      });
      const existingMatriculeSet = new Set(existingMatricules.map(record => record.matricule));
      const filteredRecords = records.filter(record => !existingMatriculeSet.has(record.matricule));
      if (filteredRecords.length > 0) {
        const startRetry = performance.now();
        const resultRetry = await prisma.people.createMany({ data: filteredRecords });
        const endRetry = performance.now();
        console.log(`importData retry executed in ${endRetry - startRetry} ms`);
        return resultRetry;
      }
    } else {
      console.error('Erreur lors de l\'import des données :', error);
    }
  }
};

const listRecords = async () => {
  const records = await prisma.people.findMany();
  console.log(records);
  return records;
};

module.exports = { importData, listRecords };
