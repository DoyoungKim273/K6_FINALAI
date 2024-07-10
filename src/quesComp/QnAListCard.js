import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { getAllQnA } from "./QnAService";
import answered from "../img/answered.png";
import ongoing from "../img/ongoing.png"
export default function QnAListCard() {
  const [allQnA, setAllQnA] = useState([]);
  const isPcOrMobile = useMediaQuery({ query: "(max-width: 400px)" });

  // 컴포넌트가 마운트 될 때 특정 작업 수행
  useEffect(() => {
    const fetchAllQnA = async () => {
      try {
        const data = await getAllQnA();
        setAllQnA(data);
        console.log(data);
      } catch (error) {
        console.error("전체 질의응답 패치 실패", error);
      }
    };
    fetchAllQnA();
    // 정의된 fetchAllQnA() 함수를 호출, 데이터 가져오는 작업 수행
  }, []);
  // 빈 배열을 두번째 인수로 전달
  // 이 useEffect 훅이 컴포넌트가 처음 마운트 될 때 한번만 수행되도록

  return (
    // pc 모드에서는 2행으로 배치
    <div className={`my-2 flex flex-grow justify-center ${isPcOrMobile ? "flex-col" : ""}`}>
      {/* 스크롤 안에서 한번 더 감싸기 */}
      <div className={` ${isPcOrMobile ? " overflow-y-auto h-[calc(100vh-200px)]" : "grid grid-cols-2 place-items-center gap-1"}`}>
      <div
        className={`bg-yellow-200 hover:bg-yellow-300 rounded-2xl ${isPcOrMobile ? "mx-3 my-2" : "w-11/12 h-11/12 m-2"}`}
        >
        <div className={`flex flex-row ${isPcOrMobile ? " " : ""}`}>
          <img
            src={answered}
            alt={answered}
            className={isPcOrMobile ? "my-4 ml-4 mr-2 w-10 h-10" : "m-5 w-14 h-14"}
          />
          <div
            className={`font-bold  ${
              isPcOrMobile ? "mt-6 mx-3" : "mt-8 mx-3 text-lg"
            }`}
          >
            제목 : 여기는 제목이 오는 자리
          </div>
        </div>
        <div className={`flex flex-col text-end mr-5 mb-3 ${isPcOrMobile ? "text-sm" : ""}`}>
          <div>12가1234</div>
          <div>2024-07-09 04:29:00</div>
        </div>
      </div>
      <div
        className={`bg-yellow-200 hover:bg-yellow-300 rounded-2xl ${isPcOrMobile ? "mx-3 my-2" : "w-11/12 h-11/12 m-2"}`}
        >
        <div className={`flex flex-row ${isPcOrMobile ? " " : ""}`}>
          <img
            src={ongoing}
            alt={ongoing}
            className={isPcOrMobile ? "my-4 ml-4 mr-2 w-10 h-10" : "m-5 w-14 h-14"}
          />
          <div
            className={`font-bold ${
              isPcOrMobile ? "mt-6 mx-3" : "mt-8 mx-3 text-lg "
            }`}
          >
            제목 : 여기는 제목이 오는 자리인데 제목이 이렇게 길어진다면 이런 모습이겠죠
          </div>
        </div>
        <div className={`flex flex-col text-end mr-5 mb-3 ${isPcOrMobile ? "text-sm" : ""}`}>
          <div>12가1234</div>
          <div>2024-07-09 04:29:00</div>
        </div>
      </div>
      <div
        className={`bg-yellow-200 hover:bg-yellow-300 rounded-2xl ${isPcOrMobile ? "mx-3 my-2" : "w-11/12 h-11/12 m-2"}`}
        >
        <div className={`flex flex-row ${isPcOrMobile ? " " : ""}`}>
          <img
            src={ongoing}
            alt={ongoing}
            className={isPcOrMobile ? "my-4 ml-4 mr-2 w-10 h-10" : "m-5 w-14 h-14"}
          />
          <div
            className={`font-bold ${
              isPcOrMobile ? "mt-6 mx-3" : "mt-8 mx-3 text-lg "
            }`}
          >
            제목 : 여기는 제목이 오는 자리인데 제목이 이렇게 길어진다면 이런 모습이겠죠 제목이 정말 이렇게 길어질 수 있을까요?
          </div>
        </div>
        <div className={`flex flex-col text-end mr-5 mb-3 ${isPcOrMobile ? "text-sm" : ""}`}>
          <div>12가1234</div>
          <div>2024-07-09 04:29:00</div>
        </div>
      </div>
      <div
        className={`bg-yellow-200 hover:bg-yellow-300 rounded-2xl ${isPcOrMobile ? "mx-3 my-2" : "w-11/12 h-11/12 m-2"}`}
        >
        <div className={`flex flex-row ${isPcOrMobile ? " " : ""}`}>
          <img
            src={ongoing}
            alt={ongoing}
            className={isPcOrMobile ? "my-4 ml-4 mr-2 w-10 h-10" : "m-5 w-14 h-14"}
          />
          <div
            className={`font-bold ${
              isPcOrMobile ? "mt-6 mx-3" : "mt-8 mx-3 text-lg "
            }`}
          >
            제목 : 여기는 제목이 오는 자리인데 제목이 이렇게 길어진다면 이런 모습이겠죠 제목이 정말 이렇게 길어질 수 있을까요?
          </div>
        </div>
        <div className={`flex flex-col text-end mr-5 mb-3 ${isPcOrMobile ? "text-sm" : ""}`}>
          <div>12가1234</div>
          <div>2024-07-09 04:29:00</div>
        </div>
      </div>
      <div
        className={`bg-yellow-200 hover:bg-yellow-300 rounded-2xl ${isPcOrMobile ? "mx-3 my-2" : "w-11/12 h-11/12 m-2"}`}
        >
        <div className={`flex flex-row ${isPcOrMobile ? " " : ""}`}>
          <img
            src={ongoing}
            alt={ongoing}
            className={isPcOrMobile ? "my-4 ml-4 mr-2 w-10 h-10" : "m-5 w-14 h-14"}
          />
          <div
            className={`font-bold ${
              isPcOrMobile ? "mt-6 mx-3" : "mt-8 mx-3 text-lg "
            }`}
          >
            제목 : 여기는 제목이 오는 자리인데 제목이 이렇게 길어진다면 이런 모습이겠죠 제목이 정말 이렇게 길어질 수 있을까요?
          </div>
        </div>
        <div className={`flex flex-col text-end mr-5 mb-3 ${isPcOrMobile ? "text-sm" : ""}`}>
          <div>12가1234</div>
          <div>2024-07-09 04:29:00</div>
        </div>
      </div>
      </div>
    </div>
  );
}
