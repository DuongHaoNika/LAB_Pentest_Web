import settingService from "../services/settingService";
const getIndex = async (req, res) => {
  const settings = await settingService.getAllSetting();
  res.render("settings", {
    settings,
  });
};

const updateSetting = async (req, res) => {
  const { id, activated } = req.body;
  console.log(req.body);
  Object.keys(req.body).forEach(async (key) => {
    try {
      const result = await settingService.updateSetting(
        parseInt(key),
        req.body[key] === "1" ? true : false
      );
    } catch (err) {
      console.log(err);
    }
  });
  res.redirect("/settings");
};

export default { getIndex, updateSetting };
