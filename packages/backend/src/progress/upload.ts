import multer from "multer";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, join(process.cwd(), "..", "database", "svg"));
    },
    filename(req, file, done) {
      const ext = file.originalname.split(".").pop();
      done(null, `${uuidv4()}.${ext}`);
    },
  }),
});

export default upload;
