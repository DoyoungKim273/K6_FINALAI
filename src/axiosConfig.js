import axios from "axios";

// Axios 인터셉터를 설정하여 모든 요청에 JWT 토큰을 포함하도록 함
axios.interceptors.request.use(
    // 요청을 수정하는 함수, 요청이 서버로 전송되기 전 호출되는 함수
    // JWT 토큰을 요청 헤더에 추가하는 등의 작업 진행
    (config) => {
        // 로컬 스토리지에서 JWT 토큰을 가져옴
        const token = localStorage.getItem('jwt');
        if(token){
            // 요청 헤더에 Authorization 필드를 추가하여 JWT 토큰을 포함시킴
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;  
    },
    // 오류를 처리하는 함수, 요청중 발생한 오류를 처리함
    // Promise를 거부하여 오류를 호출한 코드로 전달함
    (error) => {
        // 요청 오류가 발생하면 Promise를 거부함
        // 요청이 이루어지기 전 발생한 오류를 처리
        return Promise.reject(error);
    }
)

export default axios;