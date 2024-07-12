import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { getAllQnA, getQuessByUsername } from "./QnAService";
import answered from "../img/answered.png";
import ongoing from "../img/ongoing.png";
import { AuthContext } from "../context/AuthContext";

export default function QnAListCard({ viewAll, username }) {
  const [quess, setQuess] = useState([]);
  const isPcOrMobile = useMediaQuery({ query: "(max-width: 400px)" });

  // 컴포넌트가 마운트 될 때 특정 작업 수행
  useEffect(() => {
    const fetchAllQnA = async () => {
      try {
        // 데이터를 보는데 viewAll 이면 ? 모든 질문 가져옴 : 유저별 질문 가져옴 
        const data = viewAll
          ? await getAllQnA()
          : await getQuessByUsername(username);
        // 혹시 데이터 형태가 배열이 아니면 배열로 변환
        setQuess(Array.isArray(data) ? data : [data]);
        console.log(data);
      } catch (error) {
        console.error("전체 질의응답 패치 실패", error);
        setQuess([]);
      }
    };
    fetchAllQnA();
    // 정의된 fetchAllQnA() 함수를 호출, 데이터 가져오는 작업 수행
  }, [viewAll, username]);
  // viewAll과 username이 바뀔때마다 데이터 다시 로드
  // 이 useEffect 훅이 컴포넌트가 처음 마운트 될 때 한번만 수행되도록

  return (
    // pc 모드에서는 2행으로 배치
    <div
      className={`flex flex-grow justify-center ${
        isPcOrMobile ? "flex-col" : ""
      }`}
    >
      {/* 스크롤 안에서 한번 더 감싸기 */}
      <div
        className={` ${
          isPcOrMobile
            ? "overflow-y-auto h-[calc(100vh-200px)]"
            : "w-full grid grid-cols-2 place-items-center gap-1"
        }`}
      >
        {quess.map((item, index) => {
          // allQnA.map 내부에서 JSX를 반환하기 위해 return 키워드를 사용해줘야함
          return (
            <div
              key={index}
              className={`bg-yellow-200 hover:bg-yellow-300 rounded-2xl ${
                isPcOrMobile ? "mx-3 my-2" : "w-11/12 h-11/12 m-2"
              }`}
            >
              <div className={`flex flex-row ${isPcOrMobile ? " " : ""}`}>
                <img
                  // true or false로 값이 넘어오므로 boolean으로 조건문 생성
                  src={item.answered ? answered : ongoing}
                  alt={item.answers ? answered : ongoing}
                  className={
                    isPcOrMobile ? "my-4 ml-4 mr-2 w-10 h-10" : "m-5 w-14 h-14"
                  }
                />
                <div
                  className={`font-bold  ${
                    isPcOrMobile ? "mt-6 mx-3" : "mt-8 mx-3 text-lg"
                  }`}
                >
                  {item.title}
                </div>
              </div>
              <div
                className={`flex flex-col text-end mr-5 mb-3 ${
                  isPcOrMobile ? "text-sm" : ""
                }`}
              >
                <div>{item.authorUsername}</div>
                <div>{item.questionDate}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
