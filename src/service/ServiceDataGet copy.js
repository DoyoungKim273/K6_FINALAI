import React, { useState, useEffect } from "react";
import axios from "axios";
import { useMediaQuery } from "react-responsive";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { fetchData, countOccurrencesInXml } from "./ServiceFlsk";
// 함수 가져오기

const ServiceDataGet = () => {
  const [formData, setFormData] = useState({
    year: 2024,
    month: "",
    day: "",
    truck_type: "", // 초기값을 빈 문자열로 설정
  });
  const [hourlyPredictedTimes, setHourlyPredictedTimes] = useState([]);
  const [docksCount, setDocksCount] = useState(0);
  const isPcOrMobile = useMediaQuery({ query: "(max-width: 400px)" });

  // 트럭 유형 선택지 배열
  const truckTypes = [
    "컨테이너차량",
    "특수차량(중장비)",
    "화물 대형(5t이상)",
    "화물 중형(1t이상~5t미만)",
    "화물 소형(1t미만)",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // 시간별 예측 데이터를 가져오는 함수
  const fetchHourlyPredictions = async () => {
    const predictions = [];
    for (let hour = 0; hour <= 24; hour++) {
      try {
        const response = await axios.post("http://localhost:5000/predict", {
          ...formData,
          hour,
          ship_count: docksCount,
        });
        const roundedPredictedTime =
          Math.round(response.data.predicted_time * 100) / 100;
        // 소수점 둘째자리 반올림
        predictions.push({
          hour,
          predicted_time: roundedPredictedTime,
        });
        console.log(`시간 ${hour}에 대한 예측:`, roundedPredictedTime);
      } catch (error) {
        console.error(
          `시간 ${hour}에 대한 예측을 가져오는 중 오류 발생:`,
          error
        );
        predictions.push({ hour, predicted_time: null });
      }
    }
    setHourlyPredictedTimes(predictions);
  };

  // 날짜가 변경될 때마다 데이터를 가져옴
  useEffect(() => {
    fetchData(formData, setDocksCount);
    // 함수 호출
  }, [formData.year, formData.month, formData.day]);

  // 부두의 개수를 가져온 후 예측 데이터를 가져옴
  useEffect(() => {
    if (docksCount > 0) {
      fetchHourlyPredictions();
    }
  }, [docksCount]);

  // 0시부터 12시까지의 데이터와 13시부터 24시까지의 데이터를 분리
  const morningData = hourlyPredictedTimes.filter((data) => data.hour <= 12);
  const afternoonData = hourlyPredictedTimes.filter((data) => data.hour > 12);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.month || !formData.day || !formData.truck_type) {
      alert("월, 일, 차량 유형을 모두 입력해주세요.");
    } else {
      fetchHourlyPredictions();
    }
  };

  const graphColor = (value) => {
    if (value > 70) {
      return "#8884d8";
    } else if (value > 35) {
       return "#b0a058";
    } else {
      return "#82ca9d";
    }
  };
  
  return (
    <div
      className={`bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100 rounded-2xl ${
        isPcOrMobile
          ? " overflow-y-auto h-[calc(100vh-200px)] w-96 m-5 "
          : "w-4/6 m-10 "
      } `}
    >
      <div className={`flex flex-col items-center justify-center`}>
        <h1 className={`text-center text-2xl font-bold mx-7 my-9 text-sky-950`}>
          화물차 소요시간 예측
        </h1>
        <form onSubmit={handleSubmit} className={`mb-8`}>
          {/* 년도도 입력하고 싶으면 주석처리 해제 */}
          {/* <input type="number" name="year" value={formData.year} onChange={handleChange} placeholder="Year" /> */}
          <input
            type="number"
            name="month"
            value={formData.month}
            onChange={handleChange}
            placeholder="월"
            className={`rounded-md ml-3 mr-1 hover:bg-sky-200 ${
              isPcOrMobile ? "w-10 h-10" : "w-12 h-10"
            }`}
          />
          <input
            type="number"
            name="day"
            value={formData.day}
            onChange={handleChange}
            placeholder="일"
            className={`rounded-md mx-1 hover:bg-sky-200 ${
              isPcOrMobile ? "w-10 h-10" : "w-12 h-10"
            }`}
          />
          <select
            name="truck_type"
            value={formData.truck_type}
            onChange={handleChange}
            placeholder="Truck Type"
            className={`rounded-md mx-1 hover:bg-sky-200 text-slate-400 ${
              isPcOrMobile ? "w-24 h-10" : "w-32 h-10"
            }`}
          >
            <option value="" disabled>
              차량 유형
            </option>
            {truckTypes.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>
          <button
            type="submit"
            onClick={fetchHourlyPredictions}
            className={`bg-slate-300 rounded-3xl py-2 px-3 text-sky-950 font-bold hover:bg-sky-200 mx-3`}
          >
            검색하기
          </button>
        </form>
        <div
          className={`flex mb-10 ${
            isPcOrMobile ? "mr-10 flex-col" : "mr-16 flex-row"
          }`}
        >
          {/* 0시부터 12시까지의 데이터를 위한 BarChart */}
          <div className={`flex flex-col justify-center items-center`}>
            <div className={`${isPcOrMobile ? " " : "mt-3 ml-16"}`}>오전</div>
            <BarChart
              width={350}
              height={400}
              data={morningData}
              margin={{ top: 10, right: 0, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis domain={[0, 130]} />
              <Tooltip />
              <Bar dataKey="predicted_time" fill={graphColor(morningData)} />
            </BarChart>
          </div>

          {/* 13시부터 24시까지의 데이터를 위한 BarChart */}
          <div className={`flex flex-col justify-center items-center`}>
            <div className={`${isPcOrMobile ? " " : "mt-3 ml-16"}`}>오후</div>
            <BarChart
              width={350}
              height={400}
              data={afternoonData}
              margin={{ top: 10, right: 0, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis domain={[0, 130]} />
              <Tooltip />
              <Bar dataKey="predicted_time" fill={graphColor(afternoonData)} />
            </BarChart>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDataGet;
