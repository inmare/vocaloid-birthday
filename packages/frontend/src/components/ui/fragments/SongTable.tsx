import { type PVAttributes, type SongWithPVs } from "@vocaloid-birthday/common";
import styled from "styled-components";

const MainTable = styled.table`
  border-collapse: collapse;
  th {
    border: 1px solid black;
    padding: 5px 10px;
  }

  td {
    border: 1px solid black;
    padding: 5px 10px;
  }
`;

export default function SongTable({ song }: { song: SongWithPVs }) {
  const createPVLink = (pvList: PVAttributes[]) => {
    return (
      <>
        {pvList.map((value, index) => {
          const pvId = value.pvId;
          const service = value.service;
          let link: string;
          if (service === "Youtube") {
            link = `https://youtu.be/${pvId}`;
          } else if (service === "NicoNicoDouga") {
            link = `https://nicovideo.jp/watch/${pvId}`;
          } else if (service === "BiliBili") {
            link = `https://www.bilibili.com/video/${pvId}`;
          } else {
            link = "#";
          }
          return (
            <a key={index} href={link}>
              {service}
            </a>
          );
        })}
      </>
    );
  };
  const vocaDBLink = `https://vocadb.net/s/${song.vocaDBId}`;
  return (
    <>
      <MainTable>
        <tbody>
          <tr>
            <th>제목</th>
            <td>{song.title}</td>
          </tr>
          <tr>
            <th>제목(한국어)</th>
            <td>{song.titleKr ?? ""}</td>
          </tr>
          <tr>
            <th>작곡가</th>
            <td>{song.composer}</td>
          </tr>
          <tr>
            <th>작곡가(한국어)</th>
            <td>{song.composerKr ?? ""}</td>
          </tr>
          <tr>
            <th>업로드 날짜</th>
            <td>{song.publishDate.toString()}</td>
          </tr>
          <tr>
            <th>VocaDB</th>
            <td>
              <a href={vocaDBLink}>{song.vocaDBId}</a>
            </td>
          </tr>
          <tr>
            <th>PV</th>
            <td>{createPVLink(song.PVs)}</td>
          </tr>
        </tbody>
      </MainTable>
    </>
  );
}
