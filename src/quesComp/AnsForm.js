import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { AuthContext } from "../context/AuthContext";
import MainHeader from "../main/MainHeader";
import MainFooter from "../main/MainFooter";
import axios from "axios";
import { createAns, getQnAById } from "./QnAService";

export default function AnsForm() {
  const isPcOrMobile = useMediaQuery({ query: "(max-width: 400px)" });
  const { username } = useContext(AuthContext);
  // AuthContext에서 username을 가져옴
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [quess, setQuess] = useState("");
  const navigate = useNavigate();
  // navigate 기능 사용
  const { id } = useParams();

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const data = await getQnAById(id);
        setQuess(data);
      } catch (error) {
        console.log("질문 정보를 가져오는 중 에러 발생", error);
      }
    };
    fetchQuestion();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestData = {
      content,
      question: {
        id: parseInt(id),
      },
    };

    console.log("백으로 전송할 데이터", requestData);

    try {
      const response = await createAns(requestData);
      console.log("답변 제출 성공", response);
      alert("답변 제출 성공");
      navigate(`/qna/questions/${id}`);
    } catch (error) {
      console.log("답변 제출 실패", error);
      alert("답변 제출 실패");
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
          <div className={`relative ${isPcOrMobile ? "w-96" : "w-4/6 m-5 "} `}>
            <div className="absolute inset-0 bg-gradient-to-b from-slate-700 via-slate-600 to-slate-700 rounded-2xl opacity-80"></div>

            <div
              className={`relative flex flex-col items-center justify-center`}
            >
              <h1
                className={`text-center text-2xl font-bold mx-7 my-9 text-white`}
              >
                 관리자의 답변 작성란 
              </h1>
              <div className="text-white">- 질문 내용 -</div>
              <div
                className={`rounded-2xl px-4 py-2 mt-3 bg-yellow-100 ${
                  isPcOrMobile ? "w-5/6 mb-3" : "w-4/6 mb-3"
                }`}
              >
                {quess.content}
              </div>
              <textarea
                value={content}
                placeholder="자유롭게 답변 내용을 입력해주세요."
                onChange={(e) => setContent(e.target.value)}
                required
                className={`rounded-2xl px-4 py-2 mt-3 ${
                  isPcOrMobile ? "w-5/6 h-56 mb-14" : "w-4/6 h-56 mb-14"
                }`}
              ></textarea>
            </div>
          </div>
          <div className={`flex flex-row`}>
            <Link
              to="/QnAPage"
              className={`bg-slate-200 text-sky-950 hover:bg-sky-300 rounded-2xl font-semibold mt-5 mb-5 mx-1 opacity-85
                  ${isPcOrMobile ? "px-7 py-2" : "text-xl px-14 py-3"}`}
            >
              목록으로 돌아가기
            </Link>
            <button
              type="submit"
              className={`bg-yellow-100 text-sky-950 hover:bg-sky-300  rounded-2xl font-semibold mt-5 mb-5 mx-1 opacity-85
                   ${isPcOrMobile ? "px-7 py-2" : "text-xl px-14 py-3"}`}
            >
              작성한 답변 제출
            </button>
          </div>
        </form>
      </div>
      <MainFooter />
    </div>
  );
}
