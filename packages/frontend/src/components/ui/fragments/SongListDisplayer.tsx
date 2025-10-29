import { type SongWithPVs } from "@vocaloid-birthday/common";
import clsx from "clsx";
import { type HTMLAttributes } from "react";

interface SongItemProps extends HTMLAttributes<HTMLParagraphElement> {
  currentSong: SongWithPVs | null;
  song: SongWithPVs;
}

function SongItem({ currentSong, song, children, ...rest }: SongItemProps) {
  const activeClass = "bg-linear-to-r text-lg font-bold";
  const hoverClass = "hover:bg-linear-to-r hover:text-lg hover:font-bold";

  return (
    <p
      className={clsx(
        "cursor-pointer from-transparent via-cyan-900 to-transparent text-center transition-all duration-100 select-none truncate text-ellipsis",
        hoverClass,
        { [activeClass]: currentSong && currentSong.id === song.id },
      )}
      {...rest}
    >
      {children}
    </p>
  );
}

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
  const padClass = "py-20";
  return (
    <>
      <div
        className={clsx("px-10", {
          [padClass]: pad,
        })}
      >
        {songList.map((song, index) => {
          return (
            <SongItem
              key={index}
              currentSong={currentSong}
              song={song}
              onClick={() => {
                handleSong(song);
              }}
            >
              {song.title}
            </SongItem>
          );
        })}
      </div>
    </>
  );
}
