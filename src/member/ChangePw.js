import React, { useState, useEffect, useContext } from "react";
import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";
import axios from "axios";
import MainHeader from "../main/MainHeader";
import MainFooter from "../main/MainFooter";
import passwordChange from "../img/passwordChange.png";
import carMiddleChars from "../data/carMiddleChars.json";
import { useNavigate } from "react-router-dom";

export default function ChangePw() {
  const isPcOrMobile = useMediaQuery({ query: "(max-width: 400px" });
  const [carNumA, setCarNumA] = useState("");
  const [carMiddleChar, setCarMiddleChar] = useState("");
  const [carNumB, setCarNumB] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const getUsername = () => `${carNumA}${carMiddleChar}${carNumB}`;

  const username = getUsername();
  // handleSubmit라는 비동기 함수 정의, 이 함수는 이벤트 객체 e를 매개변수로 받음
  const handleSubmit = async (e) => {
    // 이벤트 기본 동작(페이지 새로고침 등) 방지
    e.preventDefault();

    const requestData = {
      username,
      oldPassword,
      newPassword,
    };

    console.log("백으로 전송할 데이터", requestData);
    try {
      const response = await axios.post(
        //env에 환경변수를 사용할때는 REACT_APP_ 접두사를 사용해야함
        `http://${process.env.REACT_APP_BACK_END_SERVER}/changePW`,
        requestData
      );
      // 서버로부터의 응답 알림창으로 표시
      console.log(response.data);
      alert("비밀번호 변경이 성공적으로 이루어졌습니다.");
      navigate("/Login");
    } catch (error) {
      //에러 발생 시 콘솔에 표시 및 알림창 표시
      console.error("비밀번호 변경 실패", error);
      alert("비밀번호 변경을 실패하였습니다.");
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
              src={passwordChange}
              alt="passwordChange"
              className={` mt-14  ${isPcOrMobile ? "w-20 mb-5" : "w-24 mb-5"}`}
            />
            <h2
              className={`text-white font-semibold mt-2 text-center ${
                isPcOrMobile ? "text-xl mb-10" : "text-2xl mb-10"
              }`}
            >
              비밀번호 변경
            </h2>
          </div>
          <form
            className={`flex-grow flex flex-col justify-center items-center`}
            onSubmit={handleSubmit}
          >
            <div className={`flex-grow flex flex-row`}>
              <label
                className={`text-white mx-5 mt-2 ${
                  isPcOrMobile ? "" : "text-lg"
                }`}
              >
                차량번호
              </label>
              <div className="mb-3">
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
                />
              </div>
            </div>

            <div className={`flex-grow flex flex-row `}>
              <label
                className={`text-white mt-2 mr-3 ${
                  isPcOrMobile ? "ml-3" : "text-lg ml-5"
                }`}
              >
                임시 비밀번호
              </label>
              <div className="flex flex-col">
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="임시 비밀번호"
                  className={`rounded-md p-2  ${
                    isPcOrMobile ? "w-52 mr-5" : "w-60  mr-8"
                  }`}
                  required
                />
              </div>
            </div>
            <div className={`flex-grow flex flex-row`}>
              <label
                className={`text-white mt-5 mr-3 ${
                  isPcOrMobile ? "ml-6" : "text-lg ml-5"
                }`}
              >
                새 비밀번호
              </label>
              <div className="flex flex-col">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="새 비밀번호"
                  className={`rounded-md p-2 mr-4 mt-3 ${
                    isPcOrMobile ? "w-52" : "w-60"
                  }`}
                  required
                />
              </div>
            </div>

            <div className={`mx-7  mb-5 ${isPcOrMobile ? "mt-10" : "mt-7"}`}>
              <button
                className={`bg-slate-300 text-sky-950 hover:bg-sky-300  py-2 rounded-2xl text-lg font-semibold 
                    ${isPcOrMobile ? "px-4 ml-1" : "px-10 mt-10 mb-5 mx-2"}`}
              >
                <Link to="/SearchPw">임시 비밀번호 재발급</Link>
              </button>
              <button
                type="submit"
                className={`bg-yellow-200 text-sky-950 hover:bg-sky-300  py-2 rounded-2xl text-lg font-semibold 
                    ${
                      isPcOrMobile ? "px-5 ml-3 mr-3" : "px-10 mt-10 mb-5 mx-2"
                    }`}
              >
                변경
              </button>
            </div>
          </form>
        </div>
      </div>
      <MainFooter />
    </div>
  );
}
