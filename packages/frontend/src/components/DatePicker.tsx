import styled, { css } from "styled-components";
import { useState } from "react";
import calendarIcon from "@assets/calendar.svg";
import { uiColor, whiteColor } from "./component.type";
import { rgba } from "./utils";

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  p {
    font-size: 12px;
  }
`;

const Button = styled.button`
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
  transform: translateY(-22px);
  transition: all 0.2s ease-out;

  ${(props) =>
    props.$visible &&
    css`
      opacity: 1;
      visibility: visible;
      transform: translateY(-18px);
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
`;

type SelectMode = "month" | "date";

const ModeBtn = styled.button<{
  $currentMode: SelectMode;
  $mode: SelectMode;
}>`
  background-color: #ffffff;
  border: 1px solid #212a4a;
  padding: 8px 20px;

  transition: all 0.1s ease-out;

  ${(props) => {
    if (props.$mode === "month") {
      return css`
        border-radius: 8px 0px 0px 8px;
        border-right: none;
      `;
    } else {
      return css`
        border-radius: 0px 8px 8px 0px;
      `;
    }
  }};

  ${(props) => {
    if (props.$currentMode === props.$mode) {
      return css`
        background-color: #304278;
        color: #ffffff;
      `;
    }
  }};
`;

const monthDate = Array.from({ length: 12 }, (_, i) => i + 1);
const dayDate = Array.from({ length: 31 }, (_, i) => i + 1);

export default function DatePicker({
  month,
  date,
}: {
  month: number;
  date: number;
}) {
  const [visible, setVisible] = useState(false);
  const [currentMode, setCurrentMode] = useState<SelectMode>("month");

  return (
    <>
      <ButtonWrapper onClick={() => setVisible(!visible)}>
        <Button>
          <ButtonIcon src={calendarIcon} />
        </Button>
        <p>아이콘을 눌러 날짜를 설정해보세요</p>
      </ButtonWrapper>
      <PickerWrapper $visible={visible}>
        <Picker>
          <p>아이콘을 다시 클릭해 창을 닫을 수 있습니다.</p>
          <div>
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
            <button>선택</button>
          </div>
          <p>
            {month}월 {date}일
          </p>
          <div>
            {monthDate.map((m) => {
              return <button key={m}>{m}월</button>;
            })}
            {dayDate.map((d) => {
              return <button key={d}>{d}일</button>;
            })}
          </div>
        </Picker>
      </PickerWrapper>
    </>
  );
}
