import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { AuthContext } from "../context/AuthContext";
import MainHeader from "../main/MainHeader";
import MainFooter from "../main/MainFooter";
import QnAListCard from "../quesComp/QnAListCard";
export default function QnAPage() {
  const isPcOrMobile = useMediaQuery({ query: "(max-width: 400px)" });
  const { username } = useContext(AuthContext);
  
  return (
    <div className={`w-full h-screen relative flex flex-col`}>
      <MainHeader />
      <div className={`flex-grow flex flex-col items-center justify-center`}>
        {/* rounded 오타 주의 */}
        <div
          className={`bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100 rounded-2xl ${
            isPcOrMobile ? "w-5/6 m-10 " : "w-4/6 m-10 "
          } `}
        >
          <h2 className={`text-center text-2xl font-bold m-7 text-sky-950`}>
            질의응답 게시판
          </h2>
          <div
            className={`flex  ${
              isPcOrMobile
                ? " justify-center flex-row"
                : " flex-row justify-end mr-5"
            }`}
          >
            <button
              className={`bg-slate-300 rounded-3xl py-2 px-3 text-sky-950 font-bold hover:bg-sky-200 mx-3
                            ${isPcOrMobile ? "text-sm w-32" : ""}`}
            >
              전체 질문 조회
            </button>
            <button
              className={`bg-slate-300 rounded-3xl py-2 px-3 text-sky-950 font-bold hover:bg-sky-200 mx-3
                              ${isPcOrMobile ? "text-sm w-32" : ""}`}
            >
              나의 질문 조회
            </button>
          </div>
          <div className="flex flex-row overflow-y-scroll h-96 m-3">
            <QnAListCard />
          </div>
        </div>
        <Link to="/QuessForm">
          <button
            type="submit"
            className={`bg-slate-200 text-sky-950 hover:bg-sky-200 px-16 py-3 rounded-2xl text-xl font-semibold mt-5 mb-12`}
          >
            질문 작성
          </button>
        </Link>
      </div>
      <MainFooter />
    </div>
  );
}
