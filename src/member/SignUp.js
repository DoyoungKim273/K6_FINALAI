import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MainHeader from "../main/MainHeader";
import MainFooter from "../main/MainFooter";
import signUpIcon from "../img/signUpIcon.png";
import carMiddleChars from "../data/carMiddleChars.json";

export default function SignUp() {
  const isPcOrMobile = useMediaQuery({ query: "(max-width: 400px)" });
  // useState는 초기 값을 인수로 받아들이고 현재 값과 상태를 업데이트 하는 함수를 반환
  // 함수형 컴포넌트에서 상태를 관리하기 위해 사용되는 Hook
  const [username, setUsername] = useState("");
  const [carNumA, setCarNumA] = useState("");
  const [carMiddleChar, setCarMiddleChar] = useState("");
  const [carNumB, setCarNumB] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [emailId, setEmailId] = useState("");
  const [emailDomain, setEmailDomain] = useState("");

  const emailDomains = ["naver.com", "gmail.com", "kakao.com", "yahoo.com"];

  const navigate = useNavigate();
  
  // emailId 또는 emailDomain 변경될때마다 상태 업데이트
  useEffect(() => {
    if (emailId && emailDomain) {
      setEmail(`${emailId}@${emailDomain}`);
    }
  }, [emailId, emailDomain]);

  useEffect(() => {
    if (carNumA && carMiddleChar && carNumB) {
      setUsername(`${carNumA}${carMiddleChar}${carNumB}`);
    }
  }, [carNumA, carMiddleChar, carNumB]);
  // 의존성 배열 - carNumA, carMiddleChar, carNumB 가 변경될때마다 useEffect 실행됨

  // handleSubmit라는 비동기 함수 정의, 이 함수는 이벤트 객체 e를 매개변수로 받음
  const handleSubmit = async (e) => {
    // 이벤트 기본 동작(페이지 새로고침 등) 방지
    e.preventDefault();

    const requestData = {
      username,
      password,
      email,
    };

    console.log("백으로 전송할 데이터", requestData);
    try {
      // Axios 사용하여 '/signUp' 엔드 포인트로 POST 요청을 보냄
      // 전송할 데이터는 username(차량번호이자 아이디), password, email(아이디 / 비밀번호 찾기 목적)
      const response = await axios.post(
        //env에 환경변수를 사용할때는 REACT_APP_ 접두사를 사용해야함
        `http://${process.env.REACT_APP_BACK_END_SERVER}/signUp`,
        requestData
      );
      // 서버로부터의 응답 알림창으로 표시
      console.log(response.data);
      alert("회원가입에 성공하였습니다.");
      navigate("/Login");
    } catch (error) {
      //에러 발생 시 콘솔에 표시 및 알림창 표시
      console.error("회원가입 실패", error);
      alert("회원가입 실패");
    }
  };

  return (
    <div className={`w-full h-screen relative flex flex-col`}>
      <MainHeader />
      <div className="flex-grow flex flex-col justify-center items-center">
        <div
          className={`bg-gradient-to-b from-slate-700 via-slate-600 to-slate-700 opacity-80 rounded-3xl mt-5 ${
            isPcOrMobile ? "w-11/12" : "w-2/5 "
          }`}
        >
          <div
            className={`flex-grow flex flex-col justify-center items-center`}
          >
            <img
              src={signUpIcon}
              alt="signUpIcon"
              className={` mt-14  ${isPcOrMobile ? "w-14 mb-2" : "w-20 mb-5"}`}
            />
            <h2
              className={`text-white font-semibold mt-2 ml-3 text-center ${
                isPcOrMobile ? "text-xl mb-10" : "text-2xl mb-10"
              }`}
            >
              회원가입
            </h2>
          </div>
          <form
            className={`flex-grow flex flex-col justify-center items-center`}
            onSubmit={handleSubmit}
          >
            <div className={`flex-grow flex flex-row m-2`}>
              <label
                className={`text-white mx-8 mt-2 ${
                  isPcOrMobile ? "" : "text-lg"
                }`}
              >
                이메일
              </label>
              <div>
                <input
                  type="text"
                  value={emailId}
                  // onChange 이벤트 핸들러
                  // 화살표 함수 - e.target 은 이벤트가 발생한 DOM 요소 의미(여기서는 input 요소)
                  // e.target.value 는 input 요소의 현재값 의미
                  onChange={(e) => setEmailId(e.target.value)}
                  placeholder="이메일"
                  className={`rounded-md p-2 ${isPcOrMobile ? "w-20" : "w-24"}`}
                  required
                />
                <span
                  className={`text-white font-semibold text-lg ${
                    isPcOrMobile ? "m-2" : "m-1"
                  }`}
                >
                  @
                </span>
                <select
                  value={emailDomain}
                  onChange={(e) => setEmailDomain(e.target.value)}
                  className={`rounded-md p-2 text-slate-400 ${
                    isPcOrMobile ? "w-24" : ""
                  }`}
                  required
                >
                  <option value="" disabled selected>
                    email.com
                  </option>
                  {emailDomains.map((domain) => (
                    <option key={domain} value={domain}>
                      {domain}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={`flex-grow flex flex-row m-2`}>
              <label
                className={`text-white mx-6 mt-2 ${
                  isPcOrMobile ? "" : "text-lg"
                }`}
              >
                차량번호
              </label>
              <div>
                <input
                  type="number"
                  value={carNumA}
                  // 음수 입력 방지
                  onChange={(e) => {
                    const value = e.target.value;
                    // 사용자가 오타 내서 지울때 alert 창 뜨는 문제 해결
                    if (value === "") {
                      setCarNumA("");
                    } else if (isNaN(value) || Number(value) <= 0) {
                      alert("유효한 숫자를 입력해주세요.");
                    } else {
                      setCarNumA(value);
                    }
                  }}
                  placeholder="앞번호"
                  className={`rounded-md p-2 mr-2 ${
                    isPcOrMobile ? "w-16" : "w-20"
                  }`}
                  required
                />
                <select
                  value={carMiddleChar}
                  onChange={(e) => setCarMiddleChar(e.target.value)}
                  className={`rounded-md p-2 text-slate-400 w-16`}
                  required
                >
                  <option value="" disabled selected>
                    가
                  </option>
                  {carMiddleChars.map((char) => (
                    <option key={char} value={char}>
                      {char}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={carNumB}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "") {
                      setCarNumB("");
                    } else if (isNaN(value) || Number(value) <= 0) {
                      alert("유효한 숫자를 입력해주세요.");
                    } else {
                      setCarNumB(value);
                    }
                  }}
                  placeholder="뒷번호"
                  className={`rounded-md p-2 ml-2 ${
                    isPcOrMobile ? "w-16" : "w-20"
                  }`}
                  required
                />
              </div>
            </div>

            <div className={`flex-grow flex flex-row m-2`}>
              <label
                className={`text-white mt-2 ${
                  isPcOrMobile ? "ml-5" : "text-lg ml-5"
                }`}
              >
                비밀번호
              </label>
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호"
                  className={`rounded-md p-2 ml-6 ${
                    isPcOrMobile ? "w-52" : "w-60"
                  }`}
                  required
                />
              </div>
            </div>

            <div className={`m-7`}>
              <button
                type="submit"
                className={`bg-slate-300 text-sky-950 hover:bg-sky-300 px-7 py-2 rounded-2xl text-xl font-semibold mt-10 mb-5`}
              >
                가입
              </button>
            </div>
          </form>
        </div>
      </div>
      <MainFooter />
    </div>
  );
}
