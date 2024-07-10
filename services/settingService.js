import prisma from "../models/prisma";

async function getAllSetting() {
  try {
    const result = await prisma.vulnSetting.findMany();
    return result;
  } catch (err) {
    console.log(err);
  }
}

async function updateSetting(id, status) {
  try {
    const result = await prisma.vulnSetting.update({
      where: { 
        id: parseInt(id)
      },
      data: {
        status: status
      },
    });
    return result;
  } catch (err) {
    console.log(err);
  }
}

export default { getAllSetting, updateSetting };