import path from "path";
import { exec } from "child_process";

export default function miku() {
  if (process.platform === "win32") {
    const fileDir = path.join(__dirname, "../Miku-Ringtone.mp3");
    const command = `start ${fileDir}`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error("명령어 실행 중 오류 발생:", error.message);
        return;
      }
      if (stderr) {
        console.error("stderr:", stderr);
        return;
      }
    });
  }
}

miku();
