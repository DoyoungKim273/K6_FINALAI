import React, { useState, useEffect } from "react";
import axios from "axios";
import { useMediaQuery } from "react-responsive";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { fetchData, countOccurrencesInXml } from "./ServiceFlsk";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../App.css";
import logo from "../img/portluckLogoCircle.png";

const ServiceDataGet = () => {
  const [formData, setFormData] = useState({
    year: 2024,
    month: "",
    day: "",
    truck_type: "",
    // 초기값을 빈 문자열로 설정
  });

  // 초기 날짜 - 오늘의 날짜로 설정
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [hourlyPredictedTimes, setHourlyPredictedTimes] = useState([]);
  const [docksCount, setDocksCount] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const isPcOrMobile = useMediaQuery({ query: "(max-width: 400px)" });
  const [isBlink, setIsBlink] = useState(false);
  const [resetOnce, setResetOnce] = useState(false);

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
      alert("1일부터 31일 사이의 숫자를 입력해주세요.");
      return;
    }

    if (name === "hour" && (value < 0 || value > 24)) {
      alert("0시부터 24시 사이의 숫자를 입력해주세요.");
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
    if (isSubmitted && !resetOnce) {
      handleReset();
      setResetOnce(true);
      // submit 후 날짜 변경될 때 reset 호출
    }
  };

  // 시간별 예측 데이터를 가져오는 함수
  const fetchHourlyPredictions = async () => {
    // 시간 예측 데이터를 저장할 빈 배열을 선언
    const predictions = [];
    for (let hour = 0; hour <= 24; hour++) {
      try {
        const response = await axios.post("http://localhost:5000/predict", {
          ...formData,
          // 스프레드 연산자
          hour,
          ship_count: docksCount,
        });
        const roundedPredictedTime = Math.round(response.data.predicted_time);
        // 정수 반올림
        predictions.push({
          hour,
          predicted_time: roundedPredictedTime,
        });
        // 예측 데이터를 predictions 배열에 추가
        console.log(`시간 ${hour}에 대한 예측:`, roundedPredictedTime);
      } catch (error) {
        console.error(
          `시간 ${hour}에 대한 예측을 가져오는 중 오류 발생:`,
          error
        );
        predictions.push({ hour, predicted_time: null });
        // 오류가 발생한 데이터에 대해서는 predicted_time을 null로 설정하여 predictions 배열에 추가
      }
    }
    setHourlyPredictedTimes(predictions);
    // 최종적으로 예측 데이터를 hourlyPredictedTime 상태로 저장 -> 컴포넌트에서 예측 데이터로 사용할 수 있게 함
  };

  // 날짜가 변경될 때마다 데이터를 가져옴
  useEffect(() => {
    fetchData(formData, setDocksCount);
    // formData를 사용하여 데이터를 가져오고 부두의 개수를 설정
  }, [formData.year, formData.month, formData.day]);
  // 배열 안 값이 변경될 때마다 fetchData 함수를 호출

  // formData.hour이 존재하는지에 따라 filter 진행
  const filterData = formData.hour
    ? hourlyPredictedTimes.filter((data) => data.hour == formData.hour)
    : hourlyPredictedTimes;
  // 존재하지 않는 경우 배열 전체를 반환

  // 특정 시간에 대한 예측 시간 반환
  const getPredictedTimeHour = (hour) => {
    const result = hourlyPredictedTimes.find((data) => data.hour == hour);
    return result ? result.predicted_time : null;
  };

  // 60분 미만은 분만 표현, 60분 이상은 시간 & 분 표현
  const minsToHours = (mins) => {
    if (mins < 60) {
      return `${mins}분`;
    } else {
      const hours = Math.floor(mins / 60);
      const remainMins = Math.round(mins % 60);
      return `${hours}시간 ${remainMins}분`;
    }
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
      setResetOnce(false);
      setIsBlink(true);
    }
  };

  // 새로고침 누르면 입력 항목 리셋
  const handleReset = () => {
    // e.preventDefault();
    setFormData({
      year: 2024,
      month: "",
      day: "",
      hour: "",
      truck_type: "",
    });
    setSelectedDate(new Date());
    setIsSubmitted(false);
    // 리셋하면 반짝거림 초기화
    setIsBlink(false);
    setHourlyPredictedTimes([]);
    // setResetOnce(true);
  };

  // 모든 요소의 값이 null이 아닌지 검증
  const hasValidValues = hourlyPredictedTimes.every(
    (data) => data.predicted_time !== null
  );

  // 값에 따른그래프 봉 컬러 변경
  const graphColor = (value) => {
    if (value > 70) {
      return "#ed8282";
    } else if (value > 35) {
      return "#fae187";
    } else {
      return "#90ed82";
    }
  };

  return (
    <div
      className={`relative bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100 rounded-2xl ${
        isPcOrMobile
          ? " overflow-y-auto h-[calc(100vh-200px)] w-96 mx-5 opacity-95"
          : "w-4/6 m-10 opacity-90"
      } `}
    >
      <div
        className={`relative flex flex-col items-center justify-center ${
          isPcOrMobile ? "" : ""
        }`}
      >
        <h1 className={`text-center text-2xl font-bold mx-7 my-9 text-sky-950`}>
          화물차 소요시간 예측
        </h1>
        <div
          className={`text-sky-900 mb-2 font-semibold text-center ${
            isPcOrMobile ? "text-sm" : "text-sm"
          }`}
        >
          {isPcOrMobile ? (
            <p>
              소요 시간 예측 근거 : <br /> 울산 본항 2개년 선박 입출항 및 <br />{" "}
              차량 출입 기록과 실시간 선박 입출항 내역
            </p>
          ) : (
            <p>
              소요 시간 예측 근거 : 울산 본항 2개년 선박 입출항 및 차량 출입
              기록과 실시간 선박 입출항 내역
            </p>
          )}
        </div>
        <form
          onSubmit={handleSubmit}
          className={`mb-3 flex  items-center ${
            isPcOrMobile ? "" : "flex-row"
          }`}
        >
          {/* DatePicker 사용하여 날짜 선택 */}
          <div
            className={`${isPcOrMobile ? "flex flex-col" : "flex flex-row"}`}
          >
            <div className="relative m-2">
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="MM/dd"
                showMonthDropdown
                showDayDropdown
                dropdownMode="select"
                className={`rounded-md p-2 hover:bg-sky-200 text-slate-400 ${
                  isPcOrMobile ? "w-32 h-10" : "w-16 h-10"
                }`}
                popperProps={{
                  placement: "bottom-end",
                  // 팝업 위치 설정
                }}
              />
            </div>
            <input
              type="number"
              name="hour"
              value={formData.hour}
              onChange={handleChange}
              placeholder=" 시간 (0 ~ 24시)"
              className={`rounded-md p-1  hover:bg-sky-200 text-slate-400 ${
                isPcOrMobile ? "w-32 h-10 ml-2 mb-1 " : "w-16 h-10 mt-2 mx-1"
              }`}
            />
            <select
              name="truck_type"
              value={formData.truck_type}
              onChange={handleChange}
              placeholder="Truck Type"
              className={`rounded-md mx-2 hover:bg-sky-200 text-slate-400 ${
                isPcOrMobile ? "w-32 h-10 my-1" : "w-56 h-10 mt-2"
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
            className={`bg-slate-300 rounded-3xl  text-sky-950 font-bold hover:bg-sky-200  
              ${isPcOrMobile ? "py-14 px-2 m-1" : "py-2 px-3 ml-3"}`}
          >
            검색하기
          </button>
          <button
            type="button"
            onClick={handleReset}
            className={`bg-slate-400 rounded-3xl  text-sky-950 font-bold hover:bg-sky-200 
              ${isPcOrMobile ? "py-14 px-2 m-1" : "py-2 px-3 ml-3 mr-6"}`}
          >
            새로고침
          </button>
        </form>
        <div
          className={`flex mb-10 ${
            isPcOrMobile ? "flex-col" : "mr-16 flex-col"
          }`}
        >
          <div
            className={`flex flex-col items-center justify-center text-center bg-sky-800 text-slate-50 rounded-lg
              ${isPcOrMobile ? "w-72 text-sm px-0 py-3 " : "ml-14 mb-1 py-2 px-3"}`}
          >
            {/* 예측된 시간 배열의 길이가 25보다 긴가 ? ( 모바일인가 ? (예상입출문~1) : (예상입출문2)) : (모바일인가 ? (예측한다~1) : (예측한다~2) */}
            {hourlyPredictedTimes.length >= 25 && hasValidValues ? (
              isPcOrMobile ? (
                <p>
                  " {formData.hour} " 시의 예상 입출문 소요시간은 약 "
                  {minsToHours(getPredictedTimeHour(formData.hour))} " 입니다.
                </p>
              ) : (
                <p>
                  " {formData.hour} " 시의 예상 입출문 소요시간은 약 "
                  {minsToHours(getPredictedTimeHour(formData.hour))} " 입니다.
                </p>
              )
            ) : isPcOrMobile ? (
              <p>
                0시부터 24시 중 원하는 시간을 입력하면, <br />
                예상 입출문 소요시간을 예측합니다.
              </p>
            ) : (
              <p>
                0시부터 24시 중 원하는 시간을 입력하면, 해당 시의 입출문
                소요시간을 예측합니다.
              </p>
            )}
          </div>
          <div
            className={`flex justify-center items-center ${
              isPcOrMobile ? "flex-col" : "flex-row"
            }`}
          >
            {/* 연산자 주의 !== */}
            {/* 유효한 값이 넘어오지 않거나 배열의 길이가 충족되지 않는 경우 이미지 깜빡깜빡 */}
            {!hasValidValues ||
              (hourlyPredictedTimes <= 25 && (
                <div className={`flex flex-col justify-center items-center`}>
                  <img
                    src={logo}
                    alt="logo"
                    className={`
                    ${isBlink ? "blinking" : ""}
                    ${
                      isPcOrMobile
                        ? "ml-0 mt-5 w-52 h-52"
                        : "mb-20 ml-14 mt-20 w-64 h-64"
                    } `}
                  ></img>
                </div>
              ))}

            {/* 0시부터 12시까지의 데이터를 위한 BarChart */}
            {hasValidValues && hourlyPredictedTimes.length >= 24 && (
              <div className={`flex flex-col justify-center items-center ${isPcOrMobile ? "mr-10" : ""}`}>
                <div
                  className={` text-gray-600
                    ${isPcOrMobile ? "mt-5 ml-10 " : "mt-3 ml-16"}`}
                >
                  오전
                </div>
                <ResponsiveContainer width={400} height={400}>
                  <AreaChart
                    data={morningData}
                    margin={{ top: 10, right: 20, left: 20, bottom: 15 }}
                  >
                    <defs>
                      <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="10%"
                          stopColor="#fa6b05"
                          stopOpacity={10}
                        />
                        <stop
                          offset="90%"
                          stopColor="#fae97d"
                          stopOpacity={0.4}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="hour"
                      label={{
                        value: "예측 시간 (시)",
                        position: "insideBottomRight",
                        dx: 5,
                        dy: 13,
                      }}
                    />
                    <YAxis
                      domain={[0, 130]}
                      label={{
                        value: "예상 시간 (분)",
                        angle: -90,
                        position: "outsideLeft",
                        dx: 5,
                        dy: -90,
                      }}
                    />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="predicted_time"
                      stroke="#696969"
                      fill="url(#colorUv)"
                      strokeWidth={2}
                      dot={true}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* 모두 유효한 값이면서 배열의 길이도 충족되었을 때 그래프 띄우기 */}
            {hasValidValues && hourlyPredictedTimes.length >= 24 && (
              // 13시부터 24시까지의 데이터를 위한 BarChart
              <div className={`flex flex-col justify-center items-center ${isPcOrMobile ? "mr-10" : ""}`}>
                <div
                  className={` text-gray-600 ${
                    isPcOrMobile ? "ml-10" : "mt-3 ml-16"
                  }`}
                >
                  오후
                </div>
                <ResponsiveContainer width={400} height={400}>
                  <AreaChart
                    data={afternoonData}
                    margin={{ top: 10, right: 20, left: 20, bottom: 15 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="hour"
                      label={{
                        value: "예측 시간 (시)",
                        position: "insideBottomRight",
                        dx: 5,
                        dy: 13,
                      }}
                    />
                    <YAxis
                      domain={[0, 130]}
                      label={{
                        value: "예상 시간 (분)",
                        angle: -90,
                        position: "outsideLeft",
                        dx: 5,
                        dy: -90,
                      }}
                    />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="predicted_time"
                      stroke="#696969"
                      fill="url(#colorUv)"
                      strokeWidth={2}
                      dot={true}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDataGet;
