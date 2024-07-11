import React from "react";
import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";
import AdList from "./AdList";
import MainHeader from "./MainHeader";
import MainFooter from "./MainFooter";

export default function PortLuckMain() {
  // 반응형 구현
  const isPcOrMobile = useMediaQuery({ query: "(max-width: 400px)" });
  return (
    <div className="flex flex-col min-h-screen">
      <MainHeader/>
      {/* header 와 footer 제외한 모든 공간 차지하기 위해 flex-grow 활용 */}
      <div className="flex-grow flex flex-col">
        {/* 박스 상단 ~ 하단 그라데이션 추가 */}
        <div className="bg-gradient-to-b from-slate-800 via-slate-700 to-slate-800 opacity-70 flex-grow mt-6 items-center justify-center flex flex-col">
          {/*  flex-grow를 추가하여 해당 div 요소가 부모 요소의 남는 공간을 채우도록 설정 */}
          <Link to="/ServicePage" className="bg-white p-5 rounded-3xl font-bold text-2xl opacity-100 hover:bg-sky-200">
            입출문 소요 시간 조회
          </Link>
          <div
            className={`mt-5 font-medium text-white opacity-100 ${
              isPcOrMobile ? "text-xs" : "text-xl"
            }`}
          >
            울산 본항의 선박 입출항 기록과 차량 입출문 기록을 바탕으로
          </div>
          <div
            className={`mt-1 font-medium text-white opacity-100 ${
              isPcOrMobile ? "text-xs" : "text-xl"
            }`}
          >
            ' 입출문 소요 예상 시간 ' 을 예측해드립니다.
          </div>
        </div>
        <div>
          <AdList />
        </div>
      </div>
      <MainFooter />
    </div>
  );
}
