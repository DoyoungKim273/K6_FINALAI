import React, { useEffect, useState, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { AuthContext } from "../context/AuthContext";
import MainHeader from "../main/MainHeader";
import MainFooter from "../main/MainFooter";
import { getQnAById, deleteQuess } from "../quesComp/QnAService";

export default function QnAView() {
  const isPcOrMobile = useMediaQuery({ query: "(max-width: 400px)" });
  const { role } = useContext(AuthContext);
  const { id } = useParams();
  const [quess, setQuess] = useState(null);
  // useNavigate 사용하려면 임포트 & 선언 해줘야함
  const navigate = useNavigate();

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

  const handleDelete = async () => {
    const confirmDelete = window.confirm("질문을 삭제하시겠습니까?");
    if (confirmDelete) {
      try {
        // 질문 삭제 api 호출
        await deleteQuess(id);
        navigate(`/QnaPage`);
      } catch (error) {
        console.log("질문 삭제 중 에러 발생", error);
        alert("질문 삭제중 에러가 발생하였습니다.");
      }
    }
  };
  // 답변 작성 페이지로 이동하는 함수
  const goToAnsFrom = () => {
    // 질문 id를 파라미터로 전달
    navigate(`/AnsForm/${id}`);
  };

  return (
    <div className={`w-full h-screen relative flex flex-col`}>
      <MainHeader />
      <div className={`flex-grow flex flex-col items-center justify-center`}>
        <div className={`w-full flex flex-col items-center justify-center`}>
          <div
            className={`relative  ${
              isPcOrMobile ? "w-5/6 mb-5" : "w-4/6 m-5 "
            } `}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-slate-700 via-slate-600 to-slate-700 rounded-2xl opacity-80"></div>
            <div className={`relative flex flex-col items-center justify-center`}>
              <h1
                className={`text-center text-2xl font-bold mx-7 my-10 text-white`}
              >
                 질문 상세보기 
              </h1>
              {quess && (
                <div
                  className={`flex flex-col items-center ${
                    isPcOrMobile ? "overflow-y-auto max-h-96 px-4 " : "w-5/6"
                  }`}
                >
                  <div className="text-white">- 제목 -</div>
                  <div
                    className={`rounded-2xl px-5 py-3 mt-3 mb-5 bg-white ${
                      isPcOrMobile ? "w-5/6" : "w-4/6"
                    }`}
                  >
                    {quess.title}
                  </div>
                  <div className=" text-white">- 내용 -</div>
                  <div
                    className={`rounded-2xl px-5 py-3 mt-3 bg-white ${
                      isPcOrMobile ? "w-5/6 mb-5" : "w-4/6 mb-5"
                    }`}
                  >
                    {quess.content}
                  </div>
                  <div className="text-white">- 답변 -</div>
                  <div
                    className={`rounded-2xl px-5 py-3 mt-3 bg-yellow-100 ${
                      isPcOrMobile ? "w-5/6 mb-10" : "w-4/6 mb-10"
                    }`}
                  >
                    {quess.answers && quess.answers.length > 0 ? (
                      quess.answers.map((answer, index) => (
                        <div>
                          <div>{answer.content}</div>
                          <div className="text-end text-sm mt-5">
                            {answer.answerDate}
                          </div>
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
          <div className={`relative flex flex-row`}>
            <Link
              to="/QnAPage"
              className={`bg-slate-50 text-sky-950 hover:bg-sky-300 rounded-2xl font-semibold mt-5 mb-5 mx-1 opacity-85
              ${isPcOrMobile ? "px-2 py-2" : "text-xl px-7 py-3"}`}
            >
              목록으로 돌아가기
            </Link>
            {role === "ROLE_ADMIN" && (
              <button
                onClick={handleDelete}
              className={`bg-slate-50 text-sky-950 hover:bg-sky-300 rounded-2xl font-semibold mt-5 mb-5 mx-1 opacity-85
              ${isPcOrMobile ? "px-3 py-2" : "text-xl px-14 py-3"}`}
              >
                질문 삭제
              </button>
            )}
            {role === "ROLE_ADMIN" && (
              <button
                onClick={goToAnsFrom}
              className={`bg-slate-50 text-sky-950 hover:bg-sky-300 rounded-2xl font-semibold mt-5 mb-5 mx-1 opacity-85
                ${isPcOrMobile ? "px-3 py-2" : "text-xl px-14 py-3"}`}
              >
                답변 작성
              </button>
            )}
          </div>
        </div>
      </div>
      <MainFooter />
    </div>
  );
}
