import Subject from "../../models/Subject.js";

export const getSubjects = async (c) => {
  try {
    const subjects = await Subject.findAll({
      order: [["subjectId", "ASC"]],
    });

    if (!subjects || subjects.length === 0) {
      return c.json({ message: "No subjects found!" }, 404);
    }

    const formattedSubjects = subjects.map((subject) => ({
      subjectId: subject.subjectId,
      subjectName: subject.subjectName,
    }));

    return c.json({ subjects: formattedSubjects });
  } catch (error) {
    console.error("Get subjects error:", error.message);
    return c.json({ message: "Internal server error" }, 500);
  }
};
