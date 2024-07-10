import React, { useContext } from "react";
import { useMediaQuery } from "react-responsive";
import { Link, useNavigate } from "react-router-dom";
import logo from "../img/portluckLogoCircle.png";
import { useState } from "react";
import { AuthContext } from "../context/AuthContext";

export default function MainHeader() {
  const isPcOrMobile = useMediaQuery({ query: "(max-width: 400px)" }); // 반응형 구현
  const [menuOpen, setMenuOpen] = useState(false); // 햄버거 메뉴 오픈 관련
  const { username, setUsername } = useContext(AuthContext);
  const navigate = useNavigate();

  const toggleMenu = () => {
    // 햄버거 버튼 오픈 관련
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    setUsername(null);
    localStorage.removeItem("jwt");
    localStorage.removeItem("username");
    navigate("/");
  };

  return (
    // z-index 높게 설정하여 하단의 div에 가리지 않도록 함
    <div className="relative z-10">
      <header className={isPcOrMobile ? "text-center" : "text-left"}>
        {/* 기본 헤더 디자인 */}
        <div className="flex flex-row justify-between">
          <div
            className={` opacity-90 bg-sky-900 h-20 flex flex-row items-center w-full `}
          >
            {/* 메인 바로가기 */}
            <Link to="/" className="flex flex-row">
              <img
                src={logo}
                alt="weblogo"
                className={`${
                  isPcOrMobile ? "w-20 h-20 mx-1" : "w-20 h-20 mx-3"
                }`}
              ></img>
              <div
                className={`text-white font-bold mt-4 ${
                  isPcOrMobile ? "text-3xl" : "text-4xl"
                }`}
              >
                Port-Luck ™
              </div>
            </Link>

            {/* 햄버거 버튼 아이콘 */}
            {isPcOrMobile ? (
              <div className="ml-auto mr-5">
                <button
                  onClick={toggleMenu}
                  className="text-white focus:outline-none"
                >
                  <svg
                    className="w-10 h-10"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16m-7 6h7"
                    />
                  </svg>
                </button>

                {/* 햄버거 메뉴 오픈 시 (모바일에서의) 설정 */}
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                    <div>
                      {/* 로그인 안 된 경우 : 로그인 된 경우 노출되는 리스트 다르게 */}
                      {username === null ? (
                        <>
                          <a
                            href="/SignUp"
                            className="block px-4 py-2 text-sky-950 font-bold hover:bg-sky-200 mx-3"
                          >
                            회원가입
                          </a>
                          <a
                            href="/Login"
                            className="block px-4 py-2 text-sky-950 font-bold hover:bg-sky-200 mx-3"
                          >
                            로그인
                          </a>
                        </>
                      ) : (
                        <>
                          <div
                            onClick={handleLogout}
                            className="block px-4 py-2 text-sky-950 font-bold hover:bg-sky-200 mx-3"
                          >
                            로그아웃
                          </div>
                          <a
                            href="/QnAPage"
                            className="block px-4 py-2 text-sky-950 font-bold hover:bg-sky-200 mx-3"
                          >
                            질의응답
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // PC 모드에서의 설정
              <div className="flex flex-row ml-auto mr-7">
                {username === null ? (
                  <>
                    <a
                      href="/SignUp"
                      className="bg-slate-300 rounded-3xl py-2 px-3 text-sky-950 font-bold hover:bg-sky-200 mx-3"
                    >
                      회원가입
                    </a>
                    <a
                      href="/Login"
                      className="bg-slate-300 rounded-3xl py-2 px-3 text-sky-950 font-bold hover:bg-sky-200 mx-3"
                    >
                      로그인
                    </a>
                  </>
                ) : (
                  <>
                    <button
                      className="bg-slate-300 rounded-3xl py-2 px-3 text-sky-950 font-bold hover:bg-sky-200 mx-3"
                      onClick={handleLogout}
                    >
                      로그아웃
                    </button>
                    <a
                      href="/QnAPage"
                      className="bg-slate-300 rounded-3xl py-2 px-3 text-sky-950 font-bold hover:bg-sky-200 mx-3"
                    >
                      질의응답
                    </a>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}
