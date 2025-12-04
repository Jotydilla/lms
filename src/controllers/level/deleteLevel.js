import Level from "../../models/Level.js";
import StudentClass from "../../models/StudentClass.js";

export const deleteLevel = async (c) => {
  try {
    const id = c.req.param("id");
    const checkLevel = await Level.findByPk(id);
    if (!checkLevel) {
      return c.json({ message: "Level id not found!" });
    }

    const checkRelation = await StudentClass.findOne({
      where: { level_id: id },
    });
    if (checkRelation) {
      return c.json({ msg: "not delete this class" });
    }
    await Level.destroy({ where: { level_id: id } });
    return c.json({ message: "deleted level succussfuly!!" });
  } catch (error) {
    return c.json({ message: "Internal erver error" });
  }
};
