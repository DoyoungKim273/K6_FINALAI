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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ServiceDataGet = () => {
  const [formData, setFormData] = useState({
    year: 2024,
    month: "",
    day: "",
    truck_type: "",
    // 초기값을 빈 문자열로 설정
  });

  // 초기 날짜 설정
  const [selectedDate, setSelectedDate] = useState(new Date(2024, 0, 1));
  const [hourlyPredictedTimes, setHourlyPredictedTimes] = useState([]);
  const [docksCount, setDocksCount] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
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
    // 이벤트 객체에서 name과 value값 추출
    const { name, value } = e.target;

    // 월 입력 숫자 제한
    if (name === "month" && (value < 1 || value > 12)) {
      alert("1월부터 12월까지의 숫자를 입력해주세요.");
      return;
    }

    // 일 입력 숫자 제한
    if (name === "day" && (value < 1 || value > 31)) {
      alert("1일 부터 31일 사이의 숫자를 입력해주세요.");
      return;
    }

    // formData 상태를 업데이트, 기존의 상태를 복사하고 변경된 값을 덮어씀
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // 날짜 변경 핸들러 정의
  const handleDateChange = (date) => {
    setSelectedDate(date); // 선택된 날짜를 상태로 설정
    setFormData((prevData) => ({
      ...prevData,
      month: date.getMonth() + 1, // 월 설정 (0부터 시작하므로 +1)
      day: date.getDate(), // 일 설정
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

  const filterData = formData.hour
    ? hourlyPredictedTimes.filter((data) => data.hour == formData.hour)
    : hourlyPredictedTimes;

  const getPredictedTimeHour = (hour) => {
    const result = hourlyPredictedTimes.find((data) => data.hour == hour);
    return result ? result.predicted_time : null;
  };

  // 부두의 개수를 가져온 후 예측 데이터를 가져옴
  useEffect(() => {
    if (docksCount > 0) {
      fetchHourlyPredictions();
    }
  }, [docksCount]);

  // 0시부터 12시까지의 데이터와 13시부터 24시까지의 데이터를 분리
  const morningData = hourlyPredictedTimes.filter((data) => data.hour <= 12);
  const afternoonData = hourlyPredictedTimes.filter((data) => data.hour > 12);

  // 입력 항목 모두 입력 되도록 제한
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.month || !formData.day || !formData.truck_type) {
      alert("월, 일, 차량 유형을 모두 입력해주세요.");
    } else {
      fetchHourlyPredictions();
      setIsSubmitted(true);
    }
  };

  // 값에 따른그래프 봉 컬러 변경
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
        <div>
          소요 시간 예측 근거 : 울산 본항 2개년 선박 입출항 및 차량 출입 기록 +
          실시간 선박 입출항 내역{" "}
        </div>
        <form
          onSubmit={handleSubmit}
          className={`mb-8 flex  items-center ${
            isPcOrMobile ? "" : "flex-row"
          }`}
        >
          {/* DatePicker 사용하여 날짜 선택 */}
          <div className={`${isPcOrMobile ? "" : "flex flex-row"}`}>
            <div className="relative m-2">
              <DatePicker
                selected={selectedDate}
                // 선택된 날짜 설정
                onChange={handleDateChange}
                // 날짜 변경 핸들러 설정
                dateFormat="MM/dd"
                showMonthDropdown
                showDayDropdown
                dropdownMode="select"
                className={`rounded-md p-2 hover:bg-sky-200 text-slate-400 ${
                  isPcOrMobile ? "w-32 h-10" : "w-40 h-10"
                }`}
              />
            </div>
            <input
              type="number"
              name="hour"
              value={formData.hour}
              onChange={handleChange}
              placeholder="시간"
              className={`rounded-md mx-1 hover:bg-sky-200 ${
                isPcOrMobile ? "w-32 h-10" : "w-40 h-10 mt-2"
              }`}
            />
            <select
              name="truck_type"
              value={formData.truck_type}
              onChange={handleChange}
              placeholder="Truck Type"
              className={`rounded-md mx-2 hover:bg-sky-200 text-slate-400 ${
                isPcOrMobile ? "w-32 h-10" : "w-40 h-10 mt-2"
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
          </div>
          <button
            type="submit"
            className={`bg-slate-300 rounded-3xl  text-sky-950 font-bold hover:bg-sky-200 mx-3 
              ${isPcOrMobile ? "py-7 px-5" : "py-2 px-3"}`}
          >
            검색하기
          </button>
        </form>
        <div
          className={`flex mb-10 ${
            isPcOrMobile ? "mr-10 flex-col" : "mr-16 flex-col"
          }`}
        >
          <div
            className={`flex flex-col items-center justify-center text-center`}
          >
            {isSubmitted ? (
              <p>
                {formData.hour}시의 예상 입출문 소요시간은
                {getPredictedTimeHour(formData.hour)}분입니다.
              </p>
            ) : (
              <p>
                원하는 시간을 입력하면 해당 시의 예상 입출문 소요시간을
                계산합니다.
              </p>
            )}
          </div>
          <div className={`flex flex-row`}>
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
                <Bar dataKey="predicted_time">
                  {morningData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={graphColor(entry.predicted_time)}
                    />
                  ))}
                </Bar>
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
                <Bar dataKey="predicted_time">
                  {afternoonData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={graphColor(entry.predicted_time)}
                    />
                  ))}
                </Bar>
              </BarChart>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDataGet;
