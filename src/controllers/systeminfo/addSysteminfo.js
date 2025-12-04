import SystemInfo from "../../models/SystemInfo.js";

export const addSysteminfo = async (c) => {
  try {
    let body;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: "Invalid JSON body" }, 400);
    }
    const { systemPhone, systemEmail } = body;
    if (
      (!systemPhone || systemPhone.trim().length === 0) &&
      (!systemEmail || systemEmail.trim().length === 0)
    ) {
      return c.json({ message: "phone and email are required" }, 400);
    }

    const insertedAlso = await SystemInfo.findAll();
    if (insertedAlso.length >= 1) {
      return c.json({ msg: "inserted, edit it" });
    }

    const checkSystem = await SystemInfo.findOne({
      where: { systemPhone, systemEmail },
    });
    if (checkSystem) {
      return c.json({ message: "phone and email already exists" }, 409);
    }
    const newSys = await SystemInfo.create({ systemPhone, systemEmail });
    return c.json(
      {
        message: "added new system info successfully!",
        id: newSys.systemPhone,
        name: newSys.systemEmail,
      },
      201
    );
  } catch (error) {
    return c.json({ message: "Internal server error" }, 500);
  }
};
