/** @type {import('tailwindcss').Config} */
module.exports = {
   content: ["./src/**/*.{js,jsx,ts,tsx}"],
   theme: {
     extend: {
       keyframes: {
         slider: { // 슬라이더 자체
           '0%': { // 시작 지점
             transform: 'translateX(0px)'
           },
           '100%': { // 끝 지점
             transform: 'translateX(-6000px)'
           }
         },
       },
       animation: { // 슬라이더 애니메이션
         slider: 'slider 70s linear infinite' // 흐르는 초, 방향, 무한의 설정
       }
     },
   },
   plugins: [],
 }