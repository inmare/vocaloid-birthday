import { type SongAttributes } from "@vocaloid-birthday/common";
import styled from "styled-components";
import { uiColor, whiteColor } from "./component.type";

const DateString = styled.p`
  font-weight: 700;
  font-size: 24px;
  text-align: center;

  margin: 10px 0;
`;

const SongList = styled.div`
  p {
    text-align: center;
    cursor: pointer;
    user-select: none;
    transition: all 0.1s ease-out;

    &:hover,
    &:active,
    .selected {
      background: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0) 10%,
        ${uiColor["900"]} 50%,
        rgba(255, 255, 255, 0) 90%
      );
      color: ${whiteColor["50"]};
      font-weight: 700;
      padding: 4px 0;
    }
  }
`;

export default function SongListDisplayer({
  dateString,
  songList,
  handleSong,
}: {
  dateString: string;
  songList: SongAttributes[];
  handleSong: (song: SongAttributes) => void;
}) {
  return (
    <>
      <DateString>{dateString}의 보컬로이드 곡</DateString>
      <SongList>
        {songList.map((song, index) => {
          return (
            <p
              key={index}
              onClick={() => {
                handleSong(song);
              }}
            >
              {song.title}
            </p>
          );
        })}
      </SongList>
    </>
  );
}
