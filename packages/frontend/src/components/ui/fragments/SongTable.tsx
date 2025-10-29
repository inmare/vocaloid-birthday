import { type PVAttributes, type SongWithPVs } from "@vocaloid-birthday/common";
import type {
  AnchorHTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from "react";

function TableA({
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a {...props} className="underline text-cyan-700">
      {children}
    </a>
  );
}

function TableTh({
  children,
  ...props
}: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className="m-1 px-2 py-1 bg-cyan-700 w-30 truncate text-ellipsis"
      {...props}
    >
      {children}
    </th>
  );
}

function TableTd({
  children,
  ...props
}: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className="m-1 px-2 py-1 bg-cyan-100 text-zinc-950 font-medium text-start truncate text-ellipsis"
      {...props}
    >
      {children}
    </th>
  );
}

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
            <TableA key={index} href={link}>
              {service}
            </TableA>
          );
        })}
      </>
    );
  };
  const vocaDBLink = `https://vocadb.net/s/${song.vocaDBId}`;
  return (
    <>
      <table className="border-collapse table-fixed w-full">
        <tbody>
          <tr>
            <TableTh>제목</TableTh>
            <TableTd>{song.title}</TableTd>
          </tr>
          <tr>
            <TableTh>제목(한국어)</TableTh>
            <TableTd>{song.titleKr ?? ""}</TableTd>
          </tr>
          <tr>
            <TableTh>작곡가</TableTh>
            <TableTd>{song.composer}</TableTd>
          </tr>
          <tr>
            <TableTh>작곡가(한국어)</TableTh>
            <TableTd>{song.composerKr ?? ""}</TableTd>
          </tr>
          <tr>
            <TableTh>업로드 날짜</TableTh>
            <TableTd>{song.publishDate.toString()}</TableTd>
          </tr>
          <tr>
            <TableTh>VocaDB</TableTh>
            <TableTd>
              <TableA href={vocaDBLink}>{song.vocaDBId}</TableA>
            </TableTd>
          </tr>
          <tr>
            <TableTh>PV</TableTh>
            <TableTd>{createPVLink(song.PVs)}</TableTd>
          </tr>
        </tbody>
      </table>
    </>
  );
}
