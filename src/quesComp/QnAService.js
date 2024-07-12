import axios from "axios";

// 서비스 레이어 작성 -> API 호출을 담당

// 질의응답 게시판에 올라오는 모든 데이터 호출
// 비동기 함수, await 통해 비동기 작업 기다림
export const getAllQnA = async () => {
  try {
    const response = await axios.get(
      `http://${process.env.REACT_APP_BACK_END_SERVER}/qna`
    );
    return response.data;
  } catch (error) {
    console.error("전체 질의응답 패치 실패", error);
    throw error;
  }
};

// 질의응답 게시판의 질문만 모두 호출
export const getAllQuess = async () => {
  try {
    const response = await axios.get(
      `http://${process.env.REACT_APP_BACK_END_SERVER}/qna/questions`
    );
    return response.data;
  } catch (error) {
    console.log("전체 질문 패치 실패", error);
    throw error;
  }
};

// 나의 질문만을 호출
export const getQuessByUsername = async (username) => {
  try {
    const response = await axios.get(
      `http://${process.env.REACT_APP_BACK_END_SERVER}/qna/myQuestions`
    );
    return response.data;
  } catch (error) {
    console.log("개인별 질문 패치 실패", error);
    throw error;
  }
};

export const createQuess = async (question) => {
  try {
    console.log("백으로 넘어갈 예정인 생성된 질문", question);
    const response = await axios.post(
      `http://${process.env.REACT_APP_BACK_END_SERVER}/qna/questions`,
      question
    );
    // question 객체를 요청의 본문으로 보냄
    return response.data;
    // 요청이 성공하면 응답 객체의 data 속성을 반환
  } catch (error) {
    console.log("질문 생성 실패", error);
    throw error;
  }
};

// export const createQuess = async ()
