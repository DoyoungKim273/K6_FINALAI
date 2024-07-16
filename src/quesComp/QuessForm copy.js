import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { AuthContext } from "../context/AuthContext";
import MainHeader from "../main/MainHeader";
import MainFooter from "../main/MainFooter";
import axios from "axios";

export default function QuessForm() {
  const isPcOrMobile = useMediaQuery({ query: "(max-width: 400px)" });
  const { username } = useContext(AuthContext);
  // AuthContext에서 username을 가져옴
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();
  // navigate 기능 사용

  useEffect(() => {
    console.log("현재 username", localStorage.getItem("username"));
  }, [localStorage.getItem("username")]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestData = {
      // localStorage에 저장된 username을 가져옴 -- 주의 : 로그아웃 할 때 localStorage 지워줘야함
      username: localStorage.getItem("username"),
      title,
      content,
    };

    console.log("백으로 전송할 데이터", requestData);
    try {
      const response = await axios.post(
        `http://${process.env.REACT_APP_BACK_END_SERVER}/qna/questions`,
        requestData
      );
      console.log("질문 제출 성공", response.data);
      alert("질문 제출 성공");
      navigate("/QnAPage")
    } catch (error) {
      console.error("질문 제출 실패", error);
      alert("질문 제출 실패");
    }
  };
  return (
    <div className={`w-full h-screen relative flex flex-col`}>
      <MainHeader />
      <div className={`flex-grow flex flex-col items-center justify-center`}>
        {/* handleSubmit 함수를 onSubmit 이벤트와 연결 */}
        <form
          onSubmit={handleSubmit}
          className={`w-full flex flex-col items-center justify-center`}
        >
          <div
            className={`bg-gradient-to-b from-slate-200 via-slate-100 to-slate-200 rounded-2xl opacity-95 ${
              isPcOrMobile ? "w-96" : "w-4/6 m-5 "
            } `}
          >
            <div className={`flex flex-col items-center justify-center`}>
              <h1
                className={`text-center text-2xl font-bold mx-7 my-9 text-sky-950`}
              >
                 질문 작성란 
              </h1>
              <input
                type="text"
                value={title}
                placeholder="제목을 입력해주세요."
                onChange={(e) => setTitle(e.target.value)}
                required
                className={`rounded-2xl p-2 m-3 ${
                  isPcOrMobile ? "w-5/6" : "w-4/6"
                }`}
              />
              <textarea
                value={content}
                placeholder="자유롭게 질문 내용을 입력해주세요."
                onChange={(e) => setContent(e.target.value)}
                required
                className={`rounded-2xl p-2 mt-3 ${
                  isPcOrMobile ? "w-5/6 h-56 mb-14" : "w-4/6 h-56 mb-14"
                }`}
              ></textarea>
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
            <button
              type="submit"
              className={`bg-yellow-100 text-sky-950 hover:bg-sky-300  rounded-2xl font-semibold mt-5 mb-5 mx-1
                 ${isPcOrMobile ? "px-7 py-2" : "text-xl px-14 py-3"}`}
            >
              작성한 질문 제출
            </button>
          </div>
        </form>
      </div>
      <MainFooter />
    </div>
  );
}
