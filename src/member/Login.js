import React, { useState, useEffect, useContext } from "react";
import { useMediaQuery } from "react-responsive";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import MainHeader from "../main/MainHeader";
import MainFooter from "../main/MainFooter";
import loginIcon from "../img/loginIcon.png";
import carMiddleChars from "../data/carMiddleChars.json";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const isPcOrMobile = useMediaQuery({ query: "(max-width: 400px" });
  const { username, setUsername, setRole } = useContext(AuthContext);
  const [carNumA, setCarNumA] = useState("");
  const [carMiddleChar, setCarMiddleChar] = useState("");
  const [carNumB, setCarNumB] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    console.log("context로 전달된 username", username);
  }, [username]);

  const usernameValue = `${carNumA}${carMiddleChar}${carNumB}`;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestDate = {
      username: usernameValue,
      password,
    };

    console.log("백으로 전송할 데이터", requestDate);

    try {
      const response = await axios.post(
        `http://${process.env.REACT_APP_BACK_END_SERVER}/login`,
        requestDate
      );

      // 응답 헤더에서 JWT 토큰을 가져옴
      const token = response.headers["authorization"];

      // 토큰이 존재하면 로컬 스토리지에 저장하고 성공 메시지 출력
      if (token) {
        localStorage.setItem("jwt", token);
        console.log("jwt 토큰", token);
        // 응답 데이터에서 role 추출
        const {role} = response.data;
        setUsername(usernameValue);
        setRole(role);
        console.log("context로 전달될 username", usernameValue);
        console.log("context로 전달될 role", role);
        // 로그인이 진행된 후 context에 username, role 저장
        alert("로그인 성공");
        navigate("/");
      } else {
        // 토큰이 응답에 포함되지 않은 경우
        console.log("jwt 토큰이 응답에 포함되지 않음");
      }
      // 응답 데이터를 json으로 변환하여 콘솔에 출력
      console.log(JSON.stringify(response.data));
    } catch (error) {
      // 요청이 실패한 경우 에러 처리
      // 에러가 응답 객체에 포함되어 있다면 응답 데이터를, 그렇지 않은 경우에는 에러 메시지를 출력
      console.error(
        "로그인 실패",
        error.response ? error.response.data : error.message
      );
      alert("로그인 실패");
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
              src={loginIcon}
              alt="loginIcon"
              className={` mt-14  ${isPcOrMobile ? "w-14 mb-2" : "w-20 mb-5"}`}
            />
            <h2
              className={`text-white font-semibold mt-2 text-center ${
                isPcOrMobile ? "text-xl mb-10" : "text-2xl mb-10"
              }`}
            >
              로그인
            </h2>
          </div>
          <form
            className={`flex-grow flex flex-col justify-center items-center`}
            onSubmit={handleSubmit}
          >
            <div className={`flex-grow flex flex-row m-2`}>
              <label
                className={`text-white mx-5 mt-2 ${
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
                    한
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
                  className={`rounded-md p-2 ml-5 ${
                    isPcOrMobile ? "w-52" : "w-60"
                  }`}
                  required
                />
              </div>
            </div>

            <div className={`m-7`}>
              <button
                type="submit"
                className={`bg-slate-300 text-sky-950 hover:bg-sky-300 px-7 py-2 rounded-2xl text-lg font-semibold mt-10 mb-5`}
              >
                입력
              </button>
            </div>
          </form>
        </div>
      </div>
      <MainFooter />
    </div>
  );
}
