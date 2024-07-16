import React from "react";
import { useMediaQuery } from "react-responsive";
import MainHeader from "../main/MainHeader";
import MainFooter from "../main/MainFooter";
import ServiceDataGet from "./ServiceDataGet";

export default function ServicePage() {
    const isPcOrMobile = useMediaQuery({query: "(max-width: 400px)"})
  return (
    <>
    <MainHeader />
    {/* <div className={`w-full h-screen relative flex flex-col mt-10`}> */}
      
      {/* 스크롤 설정 밖에서 한번 감싸고 안에서 한번 더 */}
      <div className={`flex-grow flex justify-center items-center h-screen ${isPcOrMobile ? "" : "" }`}>
        <ServiceDataGet />
      </div>
      
    {/* </div> */}
    <MainFooter />
    </>
  );
}
