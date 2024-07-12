import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import MainHeader from "../main/MainHeader";
import MainFooter from "../main/MainFooter";
import { getAllQuess } from "../quesComp/QnAService";

export default function QnAView() {
  const isPcOrMobile = useMediaQuery({ query: "(max-width: 400px)" });
  const { id } = useParams();
  const [quess, setQuess] = useState(null);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const data = await getAllQuess(id);
        setQuess(data);
      } catch (error) {
        console.error("질문 상세내용 보기 중 에러 발생", error);
      }
    };
    fetchQuestion();
  }, [id]);

  return (
    <div className={`w-full h-screen relative flex flex-col`}>
      <MainHeader />
      <div className={`flex-grow flex flex-col items-center justify-center`}>
        <div className={`w-full flex flex-col items-center justify-center`}>
          <div
            className={`bg-gradient-to-b from-slate-200 via-slate-100 to-slate-200 rounded-2xl ${
              isPcOrMobile ? "w-96" : "w-4/6 m-5 "
            } `}
          >
            <div className={`flex flex-col items-center justify-center`}>
              <h1
                className={`text-center text-2xl font-bold mx-7 my-9 text-sky-950`}
              >
                📄 질문 상세보기 📄
              </h1>
              <div
                className={`rounded-2xl p-2 m-3 bg-white ${
                  isPcOrMobile ? "w-5/6" : "w-4/6"
                }`}
              >
                {quess.title}
              </div>
              <div
                className={`rounded-2xl p-2 mt-3 bg-white ${
                  isPcOrMobile ? "w-5/6 h-56 mb-14" : "w-4/6 h-56 mb-14"
                }`}
              >
                {quess.content}
              </div>
              <div
                className={`rounded-2xl p-2 mt-3 bg-white ${
                  isPcOrMobile ? "w-5/6 h-56 mb-14" : "w-4/6 h-56 mb-14"
                }`}
              >
                {quess.answers.content}
              </div>
            </div>
          </div>
          <div className={`flex flex-row`}>
            <Link
              to="/QnAPage"
              className={`bg-slate-200 text-sky-950 hover:bg-sky-300  rounded-2xl font-semibold mt-5 mb-5 mx-1
              ${isPcOrMobile ? "px-7 py-2" : "text-xl px-14 py-3"}`}
            >
              목록으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
      <MainFooter />
    </div>
  );
}
