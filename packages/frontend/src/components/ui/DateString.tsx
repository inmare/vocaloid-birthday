export default function DateString({
  month,
  date,
}: {
  month: number;
  date: number;
}) {
  const realDateString = date === 0 ? "전체" : date + "일";
  const dateString = month + "월 " + realDateString;
  return (
    <>
      <p className="text-center text-2xl font-bold break-keep">
        {dateString}의 보컬로이드 곡
      </p>
    </>
  );
}
