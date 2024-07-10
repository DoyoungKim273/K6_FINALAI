import React, { useState, useEffect } from 'react';
import axios from 'axios';



const APICode = () => {
  const [formData, setFormData] = useState({
    year: 2024,
    month: 7,
    day: 1,
    hour: 1,
    truck_type: '화물 대형(5t이상)',
    ship_count: 8,
  });
  const [predictedTime, setPredictedTime] = useState(null);
  const [docksCount, setDocksCount] = useState(0);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/predict', formData);
      setPredictedTime(response.data.predicted_time);
    } catch (error) {
      console.error('에러:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const apiUrl = `https://apis.data.go.kr/1192000/VsslEtrynd3/Info3?serviceKey=7r%2F%2BsHa7ayRgT4p6wOJjP9zgT6XD3QbW%2BIWezbPsGmaoUrgXGZ%2BUqzsyRHymwtSDvocby94XmQNN4Rie5kxopw%3D%3D&pageNo=10&numOfRows=5&prtAgCd=820&sde=20240707&ede=20240720`;
    
      try {
        const response = await fetch(apiUrl);
        const xmlText = await response.text();

        // XML 파싱을 위한 DOMParser 사용
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

        // XML에서 특정 태그 내 울산본항 부두가 들어간 단어의 개수 세기
        const dockOccurrences = countOccurrencesInXml(xmlDoc, 'laidupFcltyNm', /제\d*부두|일반부두|석탄부두|자동차부두|염포부두|SK\d* 부두|용잠부두|UTT부두|양곡부두|가스부두|남화부두|SK1부두\d*/);

        setDocksCount(dockOccurrences);
      } catch (error) {
        console.error('Error fetching or parsing data:', error);
      }
    };

    fetchData();
  }, []);

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

  return (
    <div>
      <h1>화물차 소요시간 예측</h1>
      <form onSubmit={handleSubmit}>
        <input type="number" name="year" value={formData.year} onChange={handleChange} placeholder="Year" />
        <input type="number" name="month" value={formData.month} onChange={handleChange} placeholder="Month" />
        <input type="number" name="day" value={formData.day} onChange={handleChange} placeholder="Day" />
        <input type="number" name="hour" value={formData.hour} onChange={handleChange} placeholder="Hour" />
        <input type="text" name="truck_type" value={formData.truck_type} onChange={handleChange} placeholder="Truck Type" />
        {/* <input type="number" name="ship_count" value={formData.ship_count} onChange={handleChange} placeholder="Ship Count" /> */}
        <button type="submit">Predict</button>
      </form>
      <div>
        <h2>울산항오는 선박 수: {docksCount}</h2>
      </div>
      {predictedTime !== null && (
        <div>
          <h2>예측시간: {predictedTime} 분</h2>
        </div>
      )}
    </div>
  );
};

export default APICode;
