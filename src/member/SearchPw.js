import React, { useState, useEffect, useContext } from "react";
import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import MainHeader from "../main/MainHeader";
import MainFooter from "../main/MainFooter";
import passwordSearch from "../img/passwordSearch.png";
import carMiddleChars from "../data/carMiddleChars.json";
import { useNavigate } from "react-router-dom";

export default function SearchPw() {
  const isPcOrMobile = useMediaQuery({ query: "(max-width: 400px" });
  const { username, setUsername, setRole } = useContext(AuthContext);
  const [carNumA, setCarNumA] = useState("");
  const [carMiddleChar, setCarMiddleChar] = useState("");
  const [carNumB, setCarNumB] = useState("");
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [emailId, setEmailId] = useState("");
  const [emailDomain, setEmailDomain] = useState("");

  //   const usernameValue = `${carNumA}${carMiddleChar}${carNumB}`;
  const emailDomains = ["naver.com", "gmail.com", "kakao.com", "yahoo.com"];

  useEffect(() => {
    console.log("context로 전달된 username", username);
  }, [username]);

  // emailId 또는 emailDomain 변경될때마다 상태 업데이트
  useEffect(() => {
    if (emailId && emailDomain) {
      setEmail(`${emailId}@${emailDomain}`);
    }
  }, [emailId, emailDomain]);

  //   useEffect(() => {
  //     if (carNumA && carMiddleChar && carNumB) {
  //       setUsername(`${carNumA}${carMiddleChar}${carNumB}`);
  //     }
  //   }, [carNumA, carMiddleChar, carNumB]);
  // 의존성 배열 - carNumA, carMiddleChar, carNumB 가 변경될때마다 useEffect 실행됨

  // handleSubmit라는 비동기 함수 정의, 이 함수는 이벤트 객체 e를 매개변수로 받음
  const handleSubmit = async (e) => {
    // 이벤트 기본 동작(페이지 새로고침 등) 방지
    e.preventDefault();

    const requestData = {
      //   username,
      email,
    };

    console.log("백으로 전송할 데이터", requestData);
    try {
      const response = await axios.post(
        //env에 환경변수를 사용할때는 REACT_APP_ 접두사를 사용해야함
        `http://${process.env.REACT_APP_BACK_END_SERVER}/temPW`,
        requestData
      );
      // 서버로부터의 응답 알림창으로 표시
      alert(
        `발급된 임시 비밀번호는 ${response.data} 입니다. 번호를 복사하여 사용하시길 바랍니다. `
      );
    } catch (error) {
      //에러 발생 시 콘솔에 표시 및 알림창 표시
      console.error("비밀번호 찾기 실패", error);
      alert("비밀번호 찾기 실패");
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
              src={passwordSearch}
              alt="passwordSearch"
              className={` mt-14  ${
                isPcOrMobile ? "w-20 mb-1" : "w-28 mb-1 mr-3"
              }`}
            />
            <h2
              className={`text-white font-semibold mt-2 text-center ${
                isPcOrMobile ? "text-xl mb-10" : "text-2xl mb-10"
              }`}
            >
              임시 비밀번호 발급
            </h2>
          </div>
          <form
            className={`flex-grow flex flex-col justify-center items-center`}
            onSubmit={handleSubmit}
          >
            <div className={`flex-grow flex flex-row m-2`}>
              <label
                className={`text-white ml-4 mr-5 mt-2 ${
                  isPcOrMobile ? "" : "text-lg"
                }`}
              >
                차량번호
              </label>
              <div>
                <input
                  type="number"
                  value={carNumA}
                  onChange={(e) => {
                    const value = e.target.value;
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
                  isPcOrMobile ? "ml-6 mr-7" : "ml-7 mr-8 text-lg"
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
                    isPcOrMobile ? "m-2" : "m-2"
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

            <div className={`mx-7 mt-0 mb-5`}>
              <button
                type="submit"
                className={`bg-yellow-200 text-sky-950 hover:bg-sky-300 px-10 py-2 rounded-2xl text-lg font-semibold 
                  ${isPcOrMobile ? "mt-10 ml-3 ": "mt-10 mb-5 ml-7 mr-2"}`}
              >
                발급
              </button>
              <button
                className={`bg-slate-300 text-sky-950 hover:bg-sky-300 px-7 py-2 rounded-2xl text-lg font-semibold 
                  ${isPcOrMobile ? "mt-10 ml-3" : "mt-10 mb-5 mx-2"}`}
              >
                <Link to="/ChangePw">비밀번호 변경</Link>
              </button>
            </div>
          </form>
        </div>
      </div>
      <MainFooter />
    </div>
  );
}
