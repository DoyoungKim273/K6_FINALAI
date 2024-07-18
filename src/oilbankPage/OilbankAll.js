import React, { useEffect, useRef } from "react";
import { useMediaQuery } from "react-responsive";
import MainHeader from "../main/MainHeader";
import MainFooter from "../main/MainFooter";
import AdList2 from "../main/AdList2";
import oilbankMarker from "../img/oilbankMarker.png";

export default function Aca() {
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
            center: new window.kakao.maps.LatLng(35.487195, 129.420864),
            level: 8,
          };

          const map = new window.kakao.maps.Map(
            mapContainer.current,
            mapOption
          );

          const mapTypeControl = new window.kakao.maps.MapTypeControl();
          map.addControl(
            mapTypeControl,
            window.kakao.maps.ControlPosition.TOPRIGHT
          );

          const zoomControl = new window.kakao.maps.ZoomControl();
          map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

          // 마커를 표시할 위치와 title 객체 배열
          const positions = [
            {
              title: "아카데미주유소",
              latlng: new window.kakao.maps.LatLng(35.487195, 129.420864),
            },
            {
              title: "현대오일뱅크직영 울산대교셀프주유소",
              latlng: new window.kakao.maps.LatLng(35.507576, 129.417733),
            },
            {
              title: "동주유소",
              latlng: new window.kakao.maps.LatLng(35.488481, 129.415362),
            },
            {
              title: "동울산주유소",
              latlng: new window.kakao.maps.LatLng(35.509008, 129.429959),
            },
            {
              title: "그린주유소",
              latlng: new window.kakao.maps.LatLng(35.489519, 129.413194),
            },
            {
              title: "한마음주유소",
              latlng: new window.kakao.maps.LatLng(35.47013, 129.216662),
            },
            {
              title: "한마음새마을금고주유소",
              latlng: new window.kakao.maps.LatLng(35.48896, 129.413934),
            },
            {
              title: "남목주유소",
              latlng: new window.kakao.maps.LatLng(35.536823, 129.41769),
            },
            {
              title: "현대오일뱅크직영 울산대교셀프주유소",
              latlng: new window.kakao.maps.LatLng(35.532583, 129.43222),
            },
            {
              title: "소나타주유소",
              latlng: new window.kakao.maps.LatLng(35.53242, 129.411995),
            },
          ];

          // 이미지 마커 설정
          const imageSrc = oilbankMarker;
          const imageSize = new window.kakao.maps.Size(69, 69);
          const imageOption = { offset: new window.kakao.maps.Point(27, 69) };

          // 마커를 배열을 반복하여 생성합니다
          for (let i = 0; i < positions.length; i++) {
            // 마커 이미지의 이미지 크기 입니다
            const imageSize = new window.kakao.maps.Size(35, 35);

            // 마커 이미지를 생성합니다
            const markerImage = new window.kakao.maps.MarkerImage(
              imageSrc,
              imageSize,
              imageOption
            );

            // 마커를 생성합니다
            const marker = new window.kakao.maps.Marker({
              map: map, // 마커를 표시할 지도
              position: positions[i].latlng, // 마커를 표시할 위치
              title: positions[i].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
              image: markerImage, // 마커 이미지
            });

            // 마커에 커스텀 오버레이를 추가합니다
            // const content = `<div class="customoverlay p-2 opacity-90 font-bold bg-red-300 rounded-3xl ml-2 mb-20">
            //                   <span class="title">${positions[i].title}</span>
            //                 </div>`;

            const customOverlay = new window.kakao.maps.CustomOverlay({
              position: positions[i].latlng,
              //   content: content,
              yAnchor: 1,
            });

            customOverlay.setMap(map);
          }
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
      <div ref={mapContainer} className="w-full h-full" />
      <div className="bg-gradient-to-b from-slate-600 via-slate-500 to-slate-600 opacity-90">
        <AdList2 />
      </div>
      <MainFooter />
    </div>
  );
}
