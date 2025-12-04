import formidable from "formidable";
import fs from "fs";
import path from "path";

export const uploadMiddleware = (uploadDir = "../files/criteria") => {
  return async (c, next) => {
    const form = formidable({
      multiples: true,
      uploadDir,
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024,
    }); // 5MB max

    await new Promise((resolve, reject) => {
      form.parse(c.req.raw, (err, fields, files) => {
        if (err) {
          reject(err);
          return;
        }
        c.set("fields", fields);
        c.set("files", files);
        resolve();
      });
    });

    await next();
  };
};
