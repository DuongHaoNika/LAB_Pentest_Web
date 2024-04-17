import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getAllSetting() {
  try {
    const result = await prisma.vulnSetting.findMany();
    return result;
  } catch (err) {
    console.log(err);
  }
}

async function updateSetting(id, activated) {
  try {
    const result = await prisma.vulnSetting.update({
      where: { id: id },
      data: { activated: activated },
    });
    return result;
  } catch (err) {
    console.log(err);
  }
}

export default { getAllSetting, updateSetting };
