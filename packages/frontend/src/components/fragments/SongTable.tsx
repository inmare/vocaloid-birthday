import { useAuth } from "@components/AuthContext";
import { type PVAttributes, type SongWithPVs } from "@vocaloid-birthday/common";
import clsx from "clsx";
import { Copy } from "lucide-react";
import {
  type AnchorHTMLAttributes,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
} from "react";

function TableA({
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a {...props} className="text-cyan-700 underline" target="_blank">
      {children}
    </a>
  );
}

function TableTh({
  className,
  children,
  ...rest
}: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={clsx(
        "m-1 w-30 truncate border border-zinc-700 bg-zinc-800 px-2 py-1 text-ellipsis",
        className,
      )}
      {...rest}
    >
      {children}
    </th>
  );
}

interface TdAttributes extends TdHTMLAttributes<HTMLTableCellElement> {
  isAdmin: boolean;
}

function TableTd({ isAdmin, className, children, ...rest }: TdAttributes) {
  return (
    <th
      className={clsx(
        "m-1 border border-zinc-700 px-2 py-1 text-start font-medium",
        className,
      )}
      {...rest}
    >
      <div className="flex flex-row justify-between overflow-auto">
        <div className="truncate text-ellipsis">{children}</div>
        {isAdmin && (
          <button
            className="cursor-pointer"
            onClick={() => {
              window.navigator.clipboard.writeText(children?.toString() ?? "");
            }}
          >
            <Copy stroke="#666" />
          </button>
        )}
      </div>
    </th>
  );
}

export default function SongTable({ song }: { song: SongWithPVs }) {
  const { accessToken } = useAuth();
  const isAdmin = !!accessToken;

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
          {isAdmin && (
            <tr>
              <TableTh>곡 ID</TableTh>
              <TableTd isAdmin={isAdmin}>{song.id}</TableTd>
            </tr>
          )}
          <tr>
            <TableTh>제목</TableTh>
            <TableTd isAdmin={isAdmin}>{song.title}</TableTd>
          </tr>
          <tr>
            <TableTh>제목(한국어)</TableTh>
            <TableTd isAdmin={isAdmin}>{song.titleKr ?? ""}</TableTd>
          </tr>
          <tr>
            <TableTh>작곡가</TableTh>
            <TableTd isAdmin={isAdmin}>{song.composer}</TableTd>
          </tr>
          <tr>
            <TableTh>작곡가(한국어)</TableTh>
            <TableTd isAdmin={isAdmin}>{song.composerKr ?? ""}</TableTd>
          </tr>
          <tr>
            <TableTh>업로드 날짜</TableTh>
            <TableTd isAdmin={isAdmin}>{song.publishDate.toString()}</TableTd>
          </tr>
          <tr>
            <TableTh>VocaDB</TableTh>
            <TableTd isAdmin={isAdmin}>
              <TableA href={vocaDBLink}>{song.vocaDBId}</TableA>
            </TableTd>
          </tr>
          <tr>
            <TableTh>PV</TableTh>
            <TableTd isAdmin={isAdmin}>{createPVLink(song.PVs)}</TableTd>
          </tr>
        </tbody>
      </table>
    </>
  );
}
