import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import background_mobile from "./img/background_mobile.png";
import background_web from "./img/background_web.png";
import PortLuckMain from "./main/PortLuckMain";
import Nammok from "./oilbankPage/Nammok";
import DongUlsan from "./oilbankPage/DongUlsan";
import Sonata from "./oilbankPage/Sonata";
import HanSae from "./oilbankPage/HanSae";
import Han from "./oilbankPage/Han";
import Green from "./oilbankPage/Green";
import Self from "./oilbankPage/Self";
import DaeSelf from "./oilbankPage/DaeSelf";
import Aca from "./oilbankPage/Aca";
import Dong from "./oilbankPage/Dong";
import Login from "./member/Login";
import SignUp from "./member/SignUp";
import QnAPage from "./quesPage/QnAPage";
import QuessForm from "./quesComp/QuessForm";
import ServicePage from "./service/ServicePage";
import ServiceDataGet from "./service/ServiceDataGet";
import QnAView from "./quesPage/QnAView";
import AnsForm from "./quesComp/AnsForm";

function App() {
  // 반응형 구현
  const isPcOrMobile = useMediaQuery({ query: "(max-width: 400px)" });

  const backgroundStyle = {
    // 배경 이미지 크기 반응형 조절
    backgroundImage: `url(${
      isPcOrMobile ? background_mobile : background_web
    })`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "100vh",
    height: "100vh",
  };

  return (
    <>
      <BrowserRouter>
        <div style={backgroundStyle} className="flex flex-col min-h-screen">
          {/* 경로 설정 */}
          <Routes>
            <Route path="/" element={<PortLuckMain />} />
            <Route path="/Nammok" element={<Nammok />} />
            <Route path="/DongUlsan" element={<DongUlsan />} />
            <Route path="/Sonata" element={<Sonata />} />
            <Route path="/HanSae" element={<HanSae />} />
            <Route path="/Han" element={<Han />} />
            <Route path="/Green" element={<Green />} />
            <Route path="/Self" element={<Self />} />
            <Route path="/DaeSelf" element={<DaeSelf />} />
            <Route path="/Aca" element={<Aca />} />
            <Route path="/Dong" element={<Dong />} />
            <Route path="/SignUp" element={<SignUp />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/QnAPage" element={<QnAPage />} />
            <Route path="/QnAView" element={<QnAView />} />
            <Route path="/QuessForm" element={<QuessForm />} />
            <Route path="/AnsForm" element={<AnsForm />} />
            <Route path="/ServicePage" element={<ServicePage />} />
            <Route path="/ServiceDataGet" element={<ServiceDataGet />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
