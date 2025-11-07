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
    <a {...props} className="text-cyan-700 underline">
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
      className="m-1 w-30 truncate bg-cyan-700 px-2 py-1 text-ellipsis"
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
      className="m-1 truncate bg-cyan-100 px-2 py-1 text-start font-medium text-ellipsis text-zinc-950"
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
      <table className="mx-auto w-full max-w-xl table-fixed border-collapse">
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
