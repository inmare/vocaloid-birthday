import styled, { css } from "styled-components";
import { useState, useEffect, useRef } from "react";
import calendarIcon from "@assets/calendar.svg";
import { uiColor, whiteColor } from "./component.type";
import { rgba, getMaxDate } from "./utils";
import clsx from "clsx";

const IconWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2px;

  p {
    font-size: 12px;
    text-align: center;
  }
`;

const Icon = styled.button`
  background: transparent;
  margin: 8px;
  cursor: pointer;
  border: none;
`;

const ButtonIcon = styled.img`
  filter: drop-shadow(0 0 4px ${rgba(uiColor["900"], 0.3)});
  width: 70px;
`;

const PickerWrapper = styled.div<{ $visible: boolean }>`
  position: relative;
  z-index: 1;

  opacity: 0;
  visibility: hidden;
  transform: translateY(-36px);
  transition: all 0.2s ease-out;

  ${(props) =>
    props.$visible &&
    css`
      opacity: 1;
      visibility: visible;
      transform: translateY(-32px);
    `}
`;

const Picker = styled.div`
  position: absolute;
  top: 0px;
  left: 50%;
  transform: translateX(-50%);

  background-color: ${whiteColor["50"]};
  padding: 16px;
  border: 1px solid ${uiColor["900"]};
  border-radius: 16px;
  box-shadow: 0 0 4px 0px ${rgba(uiColor["900"], 0.3)};

  min-width: 200px;

  & > .button-wrapper {
    display: flex;
    justify-content: space-between;
  }
`;

type SelectMode = "month" | "date";

const ModeBtn = styled.button<{
  $currentMode: SelectMode;
  $mode: SelectMode;
}>`
  background-color: ${uiColor["200"]};
  border: none;
  padding: 8px 14px;
  cursor: pointer;
  transition: all 0.1s ease-out;

  ${(props) => {
    if (props.$mode === "month") {
      return css`
        border-radius: 9999px 0px 0px 9999px;
        border-right: 1px solid ${whiteColor["50"]};
      `;
    } else {
      return css`
        border-radius: 0px 9999px 9999px 0px;
      `;
    }
  }};

  ${(props) => {
    if (props.$currentMode === props.$mode) {
      return css`
        background-color: ${uiColor["700"]};
        color: ${whiteColor["50"]};
      `;
    }
  }};
`;

const SelectButton = styled.button`
  background-color: ${uiColor["200"]};
  border: none;
  padding: 8px 14px;
  border-radius: 9999px;
  transition: all 0.1s ease-out;
  cursor: pointer;

  &:hover,
  &:active {
    background-color: ${uiColor["900"]};
    color: ${whiteColor["50"]};
  }
`;

const DateString = styled.p`
  text-align: center;
  margin: 12px 0px;
`;

const DateWrapper = styled.div<{
  $currentMode: SelectMode;
  $mode: SelectMode;
}>`
  display: grid;
  min-width: 240px;

  ${(props) => {
    if (props.$mode === "month") {
      return css`
        grid-template-columns: repeat(4, 1fr);
      `;
    } else {
      return css`
        grid-template-columns: repeat(7, 1fr);
      `;
    }
  }};

  display: ${(props) => (props.$currentMode !== props.$mode ? "none" : "")};
`;

const DateButton = styled.button<{ $value: number }>`
  background-color: ${uiColor["200"]};
  border: none;
  aspect-ratio: 1 / 1;
  margin: 2px;
  border-radius: 9999px;
  font-size: 14px;
  font-family: "Pretendard", sans-serif;
  transition: all 0.1s ease-out;

  &:hover,
  &:active,
  &.selected {
    background-color: ${uiColor["500"]};
    color: ${whiteColor["50"]};
  }

  ${(props) => {
    if (props.$value === 0) {
      return css`
        grid-column: span 2;
        aspect-ratio: auto;
      `;
    }
  }}

  &.deactivated {
    background-color: ${uiColor["100"]};
    color: ${uiColor["300"]};
    pointer-events: none;
  }
`;

// 1 ~ 12
const monthDate = Array.from({ length: 12 }, (_, i) => i + 1);
// 전체, 1 ~ 31
// 0: 전체
const dayDate = Array.from({ length: 32 }, (_, i) => i);

export default function DatePicker({
  initMonth,
  initDate,
  handleDate,
}: {
  initMonth: number;
  initDate: number;
  handleDate: (month: number, date: number) => void;
}) {
  const [visible, setVisible] = useState(false);
  const [currentMode, setCurrentMode] = useState<SelectMode>("month");
  const [month, setMonth] = useState<number>(initMonth);
  const [date, setDate] = useState<number>(initDate);

  const maxDate = getMaxDate(month);
  const dateString = date === 0 ? `${month}월 전체` : `${month}월 ${date}일`;

  const pickerRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clickEvent = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isOutsideClicked = !pickerRef.current?.contains(target);
      const isIconClicked = iconRef.current?.contains(target);

      if (pickerRef.current && isOutsideClicked && !isIconClicked) {
        setVisible(false);
      }
    };

    window.addEventListener("click", clickEvent);
    return () => window.removeEventListener("click", clickEvent);
  }, [visible]);

  const handleSelect = () => {
    handleDate(month, date);
    setVisible(false);
  };

  const handleMonth = (month: number) => {
    setMonth(month);
    const maxDate = getMaxDate(month);
    if (date > getMaxDate(month)) {
      setDate(maxDate);
    }
  };

  return (
    <>
      <IconWrapper ref={iconRef} onClick={() => setVisible(!visible)}>
        <Icon>
          <ButtonIcon src={calendarIcon} />
        </Icon>
        <p>
          아이콘을 눌러
          <br />
          날짜를 설정해보세요
        </p>
      </IconWrapper>
      <PickerWrapper ref={pickerRef} $visible={visible}>
        <Picker>
          <div className="button-wrapper">
            <div>
              <ModeBtn
                $currentMode={currentMode}
                $mode={"month"}
                onClick={() => setCurrentMode("month")}
              >
                월
              </ModeBtn>
              <ModeBtn
                $currentMode={currentMode}
                $mode={"date"}
                onClick={() => setCurrentMode("date")}
              >
                일
              </ModeBtn>
            </div>
            <SelectButton onClick={handleSelect}>선택</SelectButton>
          </div>
          <DateString>{dateString}</DateString>
          <DateWrapper $currentMode={currentMode} $mode={"month"}>
            {monthDate.map((m) => {
              return (
                <DateButton
                  key={m}
                  $value={m}
                  onClick={() => handleMonth(m)}
                  className={clsx({
                    selected: m === month,
                  })}
                >
                  {m}
                </DateButton>
              );
            })}
          </DateWrapper>
          <DateWrapper $currentMode={currentMode} $mode={"date"}>
            {dayDate.map((d) => {
              return (
                <DateButton
                  key={d}
                  $value={d}
                  onClick={() => setDate(d)}
                  className={clsx({
                    selected: d === date,
                    deactivated: d !== 0 && d > maxDate,
                  })}
                >
                  {d === 0 ? "전체" : d}
                </DateButton>
              );
            })}
          </DateWrapper>
        </Picker>
      </PickerWrapper>
    </>
  );
}
