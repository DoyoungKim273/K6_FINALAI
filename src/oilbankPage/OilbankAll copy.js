import React from "react";
import { useEffect, useRef } from "react";
import { useMediaQuery } from "react-responsive";
import MainHeader from "../main/MainHeader";
import MainFooter from "../main/MainFooter";
import oilbankMarker from "../img/oilbankMarker.png";

export default function OilbankAll() {
  const mapContainer = useRef(null);
  const isPcOrMobile = useMediaQuery({ query: "(max-width : 400px)" });

  return (
    <div>
      <div className={`w-full h-screen relative flex flex-col`}>
        <MainHeader />
        <div ref={mapContainer} className="w-full h-full" />
        <MainFooter />
      </div>
    </div>
  );
}
