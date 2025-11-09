import multer from "multer";
import { staticFolder } from "../constants";

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, staticFolder);
    },
    filename(req, file, done) {
      done(null, file.originalname);
    },
  }),
});

export default upload;
