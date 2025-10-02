import { type SongAttributes } from "@vocaloid-birthday/common";

export default function SongTable({ song }: { song: SongAttributes }) {
  const keysToEliminate = ["id", "createdAt", "updatedAt"];
  const filteredSong = [];
  for (const [key, value] of Object.entries(song)) {
    if (keysToEliminate.includes(key)) continue;
    if (value === null) continue;
    filteredSong.push([key, value]);
  }

  return (
    <>
      <table>
        <tbody>
          {filteredSong.map(([key, value]) => (
            <tr key={key}>
              <th>{key}</th>
              <td>{String(value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
