import React from "react";
import { useEffect, useRef } from "react";
import { useMediaQuery } from "react-responsive";
import MainHeader from "../main/MainHeader";
import MainFooter from "../main/MainFooter";
import GreenCard from "./GreenCard";
import oilbankMarker from "../img/oilbankMarker.png";

export default function Green() {
  const mapContainer = useRef(null);
  const isPcOrMobile = useMediaQuery({ query: "(max-width : 400px)" });

  useEffect(() => {
    // 환경 변수가 올바르게 설정되었는지 확인
    console.log("Kakao API Key:", process.env.REACT_APP_KAKAO_API_KEY);

    if (!process.env.REACT_APP_KAKAO_API_KEY) {
      console.error("Kakao API Key is missing");
      return;
    }

    // Kakao Maps API 스크립트를 동적으로 로드
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_API_KEY}&autoload=false`;
    script.async = true;

    // 스크립트가 로드되었을 때 실행할 함수를 설정
    script.onload = () => {
      // window.kakao가 로드되었는지 확인
      if (window.kakao && window.kakao.maps) {
        console.log("Kakao Maps API loaded successfully");

        // Kakao Maps API가 로드되었으므로 지도를 초기화
        window.kakao.maps.load(() => {
          const mapOption = {
            center: new window.kakao.maps.LatLng(35.489519, 129.413194),
            level: 2,
          };

          const map = new window.kakao.maps.Map(
            mapContainer.current,
            mapOption
          );

          const mapTypeControl = new window.kakao.maps.MapTypeControl();

          // 지도에 컨트롤을 추가해야 지도위에 표시됨
          // kakao.maps.ControlPosition은 컨트롤이 표시될 위치를 정의하는데 TOPRIGHT는 오른쪽 위를 의미합니다
          map.addControl(mapTypeControl, window.kakao.maps.ControlPosition.TOPRIGHT);

          // 지도 확대 축소를 제어할 수 있는 줌 컨트롤을 생성
          var zoomControl = new window.kakao.maps.ZoomControl();
          map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);
          
          // 이미지 마커 설정
          const imageSrc = oilbankMarker;
          const imageSize = new window.kakao.maps.Size(64, 69);
          const imageOption = { offset: new window.kakao.maps.Point(27, 69) };

          const markerImage = new window.kakao.maps.MarkerImage(
            imageSrc,
            imageSize,
            imageOption
          );
          const markerPosition = new window.kakao.maps.LatLng(
            35.489519,
            129.413194
          );

          const marker = new window.kakao.maps.Marker({
            position: markerPosition,
            image: markerImage,
          });

          marker.setMap(map);

          // 마커 주변 콘텐츠 박스 설정
          const content =
            '<div class="customoverlay p-2 opacity-90 font-bold bg-red-300 rounded-3xl ml-2 mb-20">' +
            '    <span class="title">그린주유소</span>' +
            "</div>";

          // 커스텀 오버레이가 표시될 위치 설정
          const customOverlayPosition = new window.kakao.maps.LatLng(
            35.489519,
            129.413194
          );

          // 커스텀 오버레이 생성 및 설정
          const customOverlay = new window.kakao.maps.CustomOverlay({
            position: customOverlayPosition,
            content: content,
            yAnchor: 1,
          });

          // 오버레이를 지도에 설정
          customOverlay.setMap(map);
        });
      } else {
        console.error("Kakao Maps API is not loaded.");
      }
    };

    // 스크립트를 document head에 추가
    document.head.appendChild(script);

    // 컴포넌트가 언마운트될 때 스크립트를 제거
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className={`w-full h-screen relative flex flex-col`}>
      <MainHeader />
      <div ref={mapContainer} className="w-full h-4/5" />
      <GreenCard />
      <MainFooter />
    </div>
  );
}
