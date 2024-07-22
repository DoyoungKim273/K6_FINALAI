  import React, { useEffect, useState } from "react";
  import oilbankData from "../data/oilbank.json"; // 데이터 가져오기
  import AdBox from "./AdBox";
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

    // 마우스 올라갈 시 애니메이션 중지
    const handleMouseEnter = () => {
      console.log("마우스 호버 중지")
      setIsPaused(true);
    };

    // 마우스 벗어나면 애니메이션 진행
    const handleMouseLeave = () => {
      console.log("마우스 호버 아웃")
      setIsPaused(false);
    };

    // 애니메이션 속도 증가
    const increaseSpeed = () => {
      console.log("애니메이션 속도 증가")
      setAnimationSpeed((prevSpeed) => Math.max(prevSpeed - 20, 20));
      // 최소 속도 제한
    };

    // 애니메이션 속도 감소
    const decreaseSpeed = () => {
      console.log("애니메이션 속도 감소")
      setAnimationSpeed((prevSpeed) => prevSpeed + 15);
    };

    return (
      <div>
        <div className="flex justify-end my-2 mr-1">
          <button className="text-sm font-bold mx-1 px-6 py-1 text-white bg-slate-700 opacity-85 rounded-full">
            <Link to="/OilbankAll">주유소 전체보기</Link>
          </button>
          <button
            onClick={decreaseSpeed}
            className=" text-sm mx-1 px-5 py-1 text-white  bg-slate-700 opacity-85 rounded-full"
          >
            ▶
          </button>
          <button
            onClick={increaseSpeed}
            className="text-sm mx-1 px-4 py-1 text-white bg-slate-700 opacity-85 rounded-full"
          >
            ▶▶
          </button>
        </div>
        <div
          className={`bg-slate-700 relative overflow-hidden opacity-80 
            ${isPcOrMobile ? "mb-6 pb-32" : "mb-6 pt-1 pb-40"}`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* 전체 div 설정 */}
          {/* 애니메이션 슬라이더 - 마우스 올리면 (처음으로 돌아가 멈추지 않고) 그 시점, 상태 그대로 멈추도록 */}
          <div
            className={`flex flex-row mb-10 absolute`}
            style={{
              animation: `slider ${animationSpeed}s linear infinite`,
              animationPlayState: isPaused ? "paused" : "running",
            }}
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
      </div>
    );
  }
