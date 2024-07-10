import React, { useContext, useEffect, useState } from "react";
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
    } catch (error) {
      console.error("질문 제출 실패", error);
      alert("질문 제출 실패");
    }
  };
  return (
    <div className={`w-full h-screen relative flex flex-col`}>
      <MainHeader />
      <div className={`flex-grow flex flex-col items-center justify-center`}>
        <div
          className={`bg-gradient-to-b from-slate-200 via-slate-50 to-slate-200 round-2xl ${
            isPcOrMobile ? "w-5/6" : "w-3/5"
          } `}
        >
          {/* handleSubmit 함수를 onSubmit 이벤트와 연결 */}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            ></textarea>
            <button
              type="submit"
              className={`bg-slate-300 text-sky-950 hover:bg-sky-300 px-7 py-2 rounded-2xl text-xl font-semibold mt-10 mb-5`}
            >
              제출
            </button>
          </form>
        </div>
      </div>
      <MainFooter />
    </div>
  );
}
