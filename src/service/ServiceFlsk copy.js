// XML 문서에서 특정 태그 이름에 대한 패턴의 출현 횟수를 계산하는 함수
export const countOccurrencesInXml = (xmlDoc, tagName, pattern) => {
  // 주어진 태그 이름에 해당하는 모든 노드를 가져옴
  const nodes = xmlDoc.getElementsByTagName(tagName);
  let count = 0;

  // 각 노드를 순회하며 패턴과 일치하는 텍스트를 찾음
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]; // 현재 노드
    const text = node.textContent.trim(); // 노드의 텍스트 콘텐츠에서 공백 제거
    const matches = text.match(pattern); // 텍스트가 주어진 패턴과 일치하는지 확인
    if (matches) {
      count += matches.length; // 일치하는 패턴의 수만큼 카운트를 증가
    }
  }

  return count; // 총 출현 횟수를 반환
};

// 주어진 날짜와 관련된 데이터를 가져오는 함수
export const fetchData = async (formData, setDocksCount) => {
  // 월과 일이 제공되지 않으면 함수를 종료
  if (!formData.month || !formData.day) {
    return;
  }

  // 폼 데이터에서 연, 월, 일을 정수로 변환
  const year = parseInt(formData.year, 10);
  const month = parseInt(formData.month, 10) - 1; // JavaScript의 Date 객체는 0부터 시작하는 월을 사용
  const day = parseInt(formData.day, 10);

  // 시작 날짜 객체 생성
  const startDate = new Date(year, month, day);
  const sde = startDate.toISOString().slice(0, 10).replace(/-/g, ""); // 시작 날짜를 ISO 문자열로 변환하고 하이픈 제거

  // 종료 날짜 객체 생성 (시작 날짜로부터 13일 후)
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 13);
  const ede = endDate.toISOString().slice(0, 10).replace(/-/g, ""); // 종료 날짜를 ISO 문자열로 변환하고 하이픈 제거

  // API 요청 URL 생성
  const apiUrl = `https://apis.data.go.kr/1192000/VsslEtrynd3/Info3?serviceKey=${process.env.REACT_APP_API_KEY}&pageNo=10&numOfRows=5&prtAgCd=820&sde=${sde}&ede=${ede}`;

  try {
    // API에 요청을 보내고 응답을 텍스트로 변환
    const response = await fetch(apiUrl);
    const xmlText = await response.text();

    // XML 파서를 사용해 응답 텍스트를 XML 문서 객체로 변환
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");

    // 특정 패턴을 포함하는 부두의 출현 횟수를 계산
    const dockOccurrences = countOccurrencesInXml(
      xmlDoc,
      "laidupFcltyNm",
      /제\d*부두|일반부두|석탄부두|자동차부두|염포부두|SK\d* 부두|용잠부두|UTT부두|양곡부두|가스부두|남화부두|SK1부두\d*/
    );

    // 부두의 출현 횟수를 상태로 설정
    setDocksCount(dockOccurrences);
  } catch (error) {
    // 오류가 발생하면 콘솔에 오류 메시지를 출력
    console.error("데이터를 가져오거나 분석하는 중 오류 발생:", error);
  }
};
