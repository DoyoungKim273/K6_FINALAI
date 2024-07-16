import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { AuthContext } from "../context/AuthContext";
import MainHeader from "../main/MainHeader";
import MainFooter from "../main/MainFooter";
import QnAListCard from "../quesComp/QnAListCard";
export default function QnAPage() {
  const isPcOrMobile = useMediaQuery({ query: "(max-width: 400px)" });
  const { username, role } = useContext(AuthContext);
  const [viewAll, setViewAll] = useState(true);

  useEffect(() => {
    console.log("현재 role", role);
  }, [role]);

  return (
    <div className={`w-full h-screen relative flex flex-col`}>
      <MainHeader />
      <div className={`flex-grow flex flex-col items-center justify-center`}>
        {/* rounded 오타 주의 */}
        <div
          className={`relative ${
            isPcOrMobile ? "w-5/6 m-10 " : "w-4/6 m-10 "
          } `}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-slate-700 via-slate-600 to-slate-700 rounded-2xl opacity-80"></div>
          <h2 className={`relative text-center text-2xl font-bold mx-7 my-10 text-slate-50`}>
            질의응답 게시판
          </h2>
          <div
            className={`flex relative ${
              isPcOrMobile
                ? " justify-center flex-row"
                : " flex-row justify-end mr-5"
            }`}
          >
            <button
              // 전체 질문 보기 함수 true
              onClick={() => setViewAll(true)}
              className={`bg-slate-200 rounded-3xl py-2 px-3 text-sky-950 font-bold hover:bg-sky-300 mx-3
                            ${isPcOrMobile ? "text-sm w-32" : ""}`}
            >
              전체 질문 조회
            </button>
            <button
              onClick={() => setViewAll(false)}
              className={`bg-slate-200 rounded-3xl py-2 px-3 text-sky-950 font-bold hover:bg-sky-300 mx-3
                              ${isPcOrMobile ? "text-sm w-32" : ""}`}
            >
              나의 질문 조회
            </button>
          </div>
          <div className=" relative flex flex-row overflow-y-scroll h-96 m-3">
            <QnAListCard viewAll={viewAll} username={username} />
            {/* 상태와 사용자 이름 전달 */}
          </div>
        </div>
        <div>
          <Link to="/QuessForm">
            <button
              type="submit"
              className={`bg-slate-50 text-sky-950 hover:bg-sky-300 px-16 py-3 rounded-2xl text-xl font-semibold mt-5 mx-3 mb-12 opacity-85`}
            >
              질문 작성
            </button>
          </Link>
        </div>
      </div>
      <MainFooter />
    </div>
  );
}
