import React, { useEffect, useState } from "react";
import oilbankData from "../data/oilbank.json"; // 데이터 가져오기
import AdBox from "./AdBox";
import { useMediaQuery } from "react-responsive"; // 반응형 구현

export default function AdList() {
  const [cards, setCards] = useState([]); // 카드 컴포넌트 구현
  const [isPaused, setIsPaused] = useState(false);
  const isPcOrMobile = useMediaQuery({ query: "(max-width: 400px)" }); // 모바일 환경 설정

  useEffect(() => {
    setCards(oilbankData);
  }, []);

  // 마우스 올라갈 시 애니메이션 중지
  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  // 마우스 벗어나면 애니메이션 진행
  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  return (
    // 컨베이어 벨트형 무한 롤링 배너 생성
    <div
      className={`bg-slate-700 relative overflow-hidden opacity-80 
        ${isPcOrMobile ? "my-6 pb-32" : "my-6 pt-1 pb-40"}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
    >
      {/* 전체 div 설정 */}
      {/* 애니메이션 슬라이더 - 마우스 올리면 (처음으로 돌아가 멈추지 않고) 그 시점, 상태 그대로 멈추도록 */}
      <div 
      className={`flex flex-row mb-10 absolute animate-slider`}
      style={{animationPlayState : isPaused ?  'paused' : 'running'}}
      >
        
        {/* 무한 반복 착시 위해 3번 동일 컴포넌트 반복 */}
        {/* map 통해서 같은 카드 10개 생성 */}
        {cards.map((oilbank, index) => (
          <div
            key={index}
            className={`min-w-max bg-yellow-300 hover:bg-yellow-200 m-4 px-4 py-4 rounded-xl text-center text-gray-900 ${
              isPcOrMobile ? "w-32 h-24" : "text-xl w-60 h-32"
            } `}
          >
            <AdBox oilbank={oilbank} />
          </div>
        ))}
        {cards.map((oilbank, index) => (
          <div
            key={index}
            className="min-w-max bg-yellow-300 hover:bg-yellow-200 w-60 h-32 m-4 px-4 py-4 rounded-xl text-center text-xl text-gray-900"
          >
            <AdBox oilbank={oilbank} />
          </div>
        ))}
        {cards.map((oilbank, index) => (
          <div
            key={index}
            className="min-w-max bg-yellow-300 hover:bg-yellow-200 w-60 h-32 m-4 px-4 py-4 rounded-xl text-center text-xl text-gray-900"
          >
            <AdBox oilbank={oilbank} />
          </div>
        ))}
      </div>
    </div>
  );
}
