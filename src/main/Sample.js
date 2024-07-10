import React, { useState, useEffect } from "react";
import MainHeader from "../components/main/MainHeader";
import CategoriesList from "../components/main/CategoriesList";
import SideCardList from "../components/main/SideCardList";
import MainFooter from "../components/main/MainFooter";
import MyMap from "../components/main/MapNaverDefault";
import ChatButton from "../components/main/ChatButton";
import ChatWindow from "../components/main/ChatWindow";
const MainPage = () => {
  const [chatOpen, setChatOpen] = useState(false); // State to manage chat window  const [messages, setMessages] = useState([]); // State to manage chat messages  const [input1, setInput1] = useState(""); // State to manage input value  const [input2, setInput2] = useState(""); // State to manage input value  const [edus, setEdus] = useState([]);  const [selectedAddress, setSelectedAddress] = useState(null);  const [part, setPart] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/v1/initialdata");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          console.log("Fetched data:", data);
          setEdus(data);
        } else {
          throw new Error("Received non-JSON response");
        }
      } catch (error) {
        console.error("Fetching data failed:", error.message);
      }
    };
    fetchData();
  }, []);
  const handleChatButtonClick = () => {
    setChatOpen(!chatOpen);
  };
  const handleSendMessage = async () => {
    if (input1.trim() === "" || input2.trim() === "") return;
    const combinedMessage = `${input1}에서 ${input2}에 관련된 교육 추천해줘`;
    const newMessage = { text: combinedMessage, sent: true };
    setMessages([...messages, newMessage]);
    setInput1("");
    setInput2("");
    try {
      const response = await fetch(
        `http://10.125.121.212:5000/api/chat/${encodeURIComponent(
          combinedMessage
        )}`
      );
      const data = await response.json();
      const formattedResponse = formatResponse(data.reply);
      const receivedMessage = { text: formattedResponse, sent: false };
      setMessages((prevMessages) => [...prevMessages, receivedMessage]);
      console.log(data);
    } catch (error) {
      console.error("에러 메세지:", error);
      const errorMessage = {
        text: "잘못된 메세지가 전달되었습니다.",
        sent: false,
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
  };
  const formatResponse = (response) => {
    const coursePattern =
      /output:\s(.*?)\s\((.*?)\)\s(.*?)\s(.*?)\s(\d{3}-\d{3}-\d{4})\s(.*?)\s(\d+,\d+\s원)\s(총\d+시간)/g;
    let formatted = "";
    let match;
    let courses = [];
    while ((match = coursePattern.exec(response)) !== null) {
      courses.push(match);
      if (courses.length === 5) break;
    }
    courses.forEach(
      (
        [_, title, code, address, institution, phone, email, cost, duration],
        index
      ) => {
        formatted += `\n교육과정 ${index + 1}\n\n`;
        formatted += `1. 교육과정명: ${title}\n`;
        formatted += `2. NCS코드: ${code}\n`;
        formatted += `3. 위치: ${address}\n`;
        formatted += `4. 상세주소: ${institution}\n`;
        formatted += `5. 연락처: ${phone}\n`;
        formatted += `6. E-mail: ${email}\n`;
        formatted += `7. 교육비용: ${cost}\n`;
        formatted += `8. 교육기간: ${duration}\n\n`;
      }
    );
    return formatted || "일치하는 교육과정이 없습니다.";
  };
  return (
    <div className="bg-white">
      {" "}
      <MainHeader />{" "}
      <div className="relative isolate overflow-hidden bg-gray-900 pb-16 pt-14 sm:pb-20">
        {" "}
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          {" "}
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />{" "}
        </div>{" "}
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {" "}
          <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
            {" "}
            <div className="hidden sm:mb-8 sm:flex sm:justify-center font-bold">
              {" "}
              <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-400 ring-1 ring-white/10 hover:ring-white/20">
                {" "}
                국비지원의 모든 것을 알고 싶다면{" "}
                <a href="#" className="font-semibold text-white px-3">
                  {" "}
                  <span className="absolute inset-0" aria-hidden="true" /> Read
                  more <span aria-hidden="true">&rarr;</span>{" "}
                </a>{" "}
              </div>{" "}
            </div>{" "}
            <div className="text-center">
              {" "}
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                {" "}
                국비 나침반{" "}
              </h1>{" "}
              <p className="mt-6 text-2xl leading-8 text-gray-300">
                {" "}
                Super 이끌림이 당신의 꿈을 응원합니다.{" "}
              </p>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
        <div
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          aria-hidden="true"
        >
          {" "}
          <div
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />{" "}
        </div>{" "}
      </div>
      <CategoriesList setEdus={setEdus} setPart={setPart} />{" "}
      <div className="flex justify-center mb-10 h-screen">
        {" "}
        <div className="w-full max-w-7xl px-6 py-4 flex h-full">
          {" "}
          <div className="w-full h-full overflow-y-auto">
            {" "}
            <SideCardList
              edus={edus}
              part={part}
              onSelectAddress={setSelectedAddress}
            />{" "}
          </div>{" "}
          <div className="w-1/2 h-full ml-5">
            {" "}
            <MyMap address={selectedAddress} />{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      <MainFooter /> <ChatButton handleClick={handleChatButtonClick} />{" "}
      {chatOpen && (
        <ChatWindow
          messages={messages}
          setMessages={setMessages}
          handleSendMessage={handleSendMessage}
        />
      )}{" "}
    </div>
  );
};
export default MainPage;
