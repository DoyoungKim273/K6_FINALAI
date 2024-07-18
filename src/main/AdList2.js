import React, { useEffect, useState } from "react";
import oilbankData from "../data/oilbank.json"; // 데이터 가져오기
import AdBox2 from "./AdBox2";
import { useMediaQuery } from "react-responsive"; // 반응형 구현
import { Link } from "react-router-dom";

export default function AdList() {
  const [cards, setCards] = useState([]); // 카드 컴포넌트 구현
  const [isPaused, setIsPaused] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(70); // 애니메이션 속도 state 추가
  const isPcOrMobile = useMediaQuery({ query: "(max-width: 400px)" }); // 모바일 환경 설정

  useEffect(() => {
    setCards(oilbankData);
  }, []);

  return (
    <div >
    <div className="flex flex-row h-full justify-between">
          {cards.map((oilbank, index) => (
            <div
              key={index}
              className={`min-w-max bg-yellow-300 hover:bg-yellow-200 my-4 mx-2 px-2 py-2 rounded-xl text-center text-gray-900 ${
                isPcOrMobile ? "w-10 h-10" : "w-10 h-10"
              } `}
            >
              <AdBox2 oilbank={oilbank} />
            </div>
          ))}
          </div>
        </div>

  );
}
