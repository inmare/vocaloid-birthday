import { type SongWithPVs } from "@vocaloid-birthday/common";
import clsx from "clsx";

export default function SongListDisplayer({
  songList,
  currentSong,
  handleSong,
  pad = false,
}: {
  songList: SongWithPVs[];
  currentSong: SongWithPVs | null;
  handleSong: (song: SongWithPVs) => void;
  pad: boolean;
}) {
  const activeClass = "bg-linear-to-r text-lg font-bold";
  const hoverClass = activeClass
    .split(" ")
    .map((value) => `hover:${value}`)
    .join(" ");
  const padClass = "py-20";
  return (
    <>
      <div
        className={clsx({
          [padClass]: pad,
        })}
      >
        {songList.map((song, index) => {
          return (
            <p
              key={index}
              onClick={() => {
                handleSong(song);
              }}
              className={clsx(
                "cursor-pointer from-transparent via-cyan-900 to-transparent text-center transition-all duration-100 select-none",
                hoverClass,
                { [activeClass]: currentSong && currentSong.id === song.id },
              )}
            >
              {song.title}
            </p>
          );
        })}
      </div>
    </>
  );
}
