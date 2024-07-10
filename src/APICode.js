
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const APICode = () => {
  const [formData, setFormData] = useState({
    year: 2024,
    month: 7,
    day: 1,
    truck_type: '', // 초기값을 빈 문자열로 설정
  });
  const [hourlyPredictedTimes, setHourlyPredictedTimes] = useState([]);
  const [docksCount, setDocksCount] = useState(0);

  // 트럭 유형 선택지 배열
  const truckTypes = [
    '컨테이너차량',
    '특수차량(중장비)',
    '화물 대형(5t이상)',
    '화물 중형(1t이상~5t미만)',
    '화물 소형(1t미만)',
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
    for (let hour = 0; hour < 24; hour++) {
      try {
        const response = await axios.post('http://localhost:5000/predict', { ...formData, hour, ship_count: docksCount });
        predictions.push({ hour, predicted_time: response.data.predicted_time });
      } catch (error) {
        console.error(`시간 ${hour}에 대한 예측을 가져오는 중 오류 발생:`, error);
        predictions.push({ hour, predicted_time: null });
      }
    }
    setHourlyPredictedTimes(predictions);
  };

  useEffect(() => {
    const fetchData = async () => {
      const year = parseInt(formData.year, 10);
      const month = parseInt(formData.month, 10) - 1;
      const day = parseInt(formData.day, 10);

      const startDate = new Date(year, month, day);
      const sde = startDate.toISOString().slice(0, 10).replace(/-/g, '');

      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 13);
      const ede = endDate.toISOString().slice(0, 10).replace(/-/g, '');

      const apiUrl = `https://apis.data.go.kr/1192000/VsslEtrynd3/Info3?serviceKey=7r%2F%2BsHa7ayRgT4p6wOJjP9zgT6XD3QbW%2BIWezbPsGmaoUrgXGZ%2BUqzsyRHymwtSDvocby94XmQNN4Rie5kxopw%3D%3D&pageNo=10&numOfRows=5&prtAgCd=820&sde=${sde}&ede=${ede}`;

      try {
        const response = await fetch(apiUrl);
        const xmlText = await response.text();

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

        const dockOccurrences = countOccurrencesInXml(xmlDoc, 'laidupFcltyNm', /제\d*부두|일반부두|석탄부두|자동차부두|염포부두|SK\d* 부두|용잠부두|UTT부두|양곡부두|가스부두|남화부두|SK1부두\d*/);

        setDocksCount(dockOccurrences);
      } catch (error) {
        console.error('데이터를 가져오거나 분석하는 중 오류 발생:', error);
      }
    };

    fetchData();
  }, [formData.year, formData.month, formData.day]);

  // XML에서 태그명에 따른 특정 패턴의 출현 횟수를 계산하는 함수
  const countOccurrencesInXml = (xmlDoc, tagName, pattern) => {
    const nodes = xmlDoc.getElementsByTagName(tagName);
    let count = 0;

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const text = node.textContent.trim();
      const matches = text.match(pattern);
      if (matches) {
        count += matches.length;
      }
    }

    return count;
  };

  useEffect(() => {
    if (docksCount > 0) {
      fetchHourlyPredictions();
    }
  }, [docksCount]);

  return (
    <div>
      <h1>화물차 소요시간 예측</h1>
      <form onSubmit={(e) => { e.preventDefault(); }}>
        {/* 년도도 입력하고 싶으면 주석처리 해제 */}
        {/* <input type="number" name="year" value={formData.year} onChange={handleChange} placeholder="Year" /> */}
        <input type="number" name="month" value={formData.month} onChange={handleChange} placeholder="Month" />
        <input type="number" name="day" value={formData.day} onChange={handleChange} placeholder="Day" />
        <select name="truck_type" value={formData.truck_type} onChange={handleChange} placeholder="Truck Type">
          <option value="">트럭 유형 선택</option>
          {truckTypes.map((type, index) => (
            <option key={index} value={type}>{type}</option>
          ))}
        </select>
        <button type="button" onClick={fetchHourlyPredictions}>검색하기</button>
      </form>
      <div>
        <BarChart
          width={800}
          height={500}
          data={hourlyPredictedTimes}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hour" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="predicted_time" fill="#8884d8" />
        </BarChart>
      </div>
    </div>
  );
};

export default APICode;
