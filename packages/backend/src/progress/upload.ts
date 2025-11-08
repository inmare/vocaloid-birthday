import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { staticFolder } from "../constants";

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, staticFolder);
    },
    filename(req, file, done) {
      const ext = file.originalname.split(".").pop();
      done(null, `${uuidv4()}.${ext}`);
    },
  }),
});

export default upload;
