import React, { useEffect, useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { AuthContext } from "../context/AuthContext";
import MainHeader from "../main/MainHeader";
import MainFooter from "../main/MainFooter";
import { getQnAById } from "../quesComp/QnAService";

export default function QnAView() {
  const isPcOrMobile = useMediaQuery({ query: "(max-width: 400px)" });
  const { role } = useContext(AuthContext);
  const { id } = useParams();
  const [quess, setQuess] = useState(null);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        // 질문 인덱스로 단일 질문 가져오기
        const data = await getQnAById(id);
        setQuess(data);
        console.log(data);
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
              isPcOrMobile ? "w-5/6 mb-5" : "w-4/6 m-5 "
            } `}
          >
            <div className={`flex flex-col items-center justify-center`}>
              <h1
                className={`text-center text-2xl font-bold mx-7 my-9 text-sky-950`}
              >
                📄 질문 상세보기 📄
              </h1>
              {quess && (
                <div
                  className={`flex flex-col items-center ${
                    isPcOrMobile ? "overflow-y-auto max-h-96 px-4 " : "w-5/6"
                  }`}
                >
                  <div className="font-semibold">- 제목 -</div>
                  <div
                    className={`rounded-2xl px-5 py-3 mt-3 mb-5 bg-white ${
                      isPcOrMobile ? "w-5/6" : "w-4/6"
                    }`}
                  >
                    {quess.title}
                  </div>
                  <div className="font-semibold">- 내용 -</div>
                  <div
                    className={`rounded-2xl px-5 py-3 mt-3 bg-white ${
                      isPcOrMobile ? "w-5/6 mb-5" : "w-4/6 mb-5"
                    }`}
                  >
                    {quess.content}
                  </div>
                  <div className="font-semibold">- 답변 -</div>
                  <div
                    className={`rounded-2xl px-5 py-3 mt-3 bg-yellow-50 ${
                      isPcOrMobile ? "w-5/6 mb-10" : "w-4/6 mb-10"
                    }`}
                  >
                    {quess.answers && quess.answers.length > 0 ? (
                      quess.answers.map((answer, index) => (
                        <div>
                          <div>{answer.content}</div>
                          <div className="text-end text-sm mt-5">{answer.answerDate}</div>
                        </div>
                      ))
                    ) : (
                      <div>아직 답변이 작성되지 않았습니다.</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className={`flex flex-row`}>
            <Link
              to="/QnAPage"
              className={`bg-slate-200 text-sky-950 hover:bg-sky-300  rounded-2xl font-semibold mt-5 mb-5 mx-1
              ${isPcOrMobile ? "px-7 py-2 text-xl" : "text-xl px-14 py-3"}`}
            >
              목록으로 돌아가기
            </Link>
            {role === "ROLE_ADMIN" && (
              <Link to="/AnsForm">
                <button
                  type="submit"
                  className={`bg-slate-200 text-sky-950 hover:bg-sky-300  rounded-2xl font-semibold mt-5 mb-5 mx-1
                ${isPcOrMobile ? "px-7 py-2 text-xl" : "text-xl px-14 py-3"}`}
                >
                  답변 작성
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
      <MainFooter />
    </div>
  );
}
