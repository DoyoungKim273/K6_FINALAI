import React from 'react'
import { useMediaQuery } from 'react-responsive'
import { Link } from 'react-router-dom'
import altle from '../img/altle.png'
import gs from '../img/gs.png'
import hd from '../img/hd.png'
import sk from '../img/sk.png'

export default function AdBox({oilbank}) {

  const isPcOrMobile = useMediaQuery({query: "(max-width: 400px"}) // 반응형 구현
  
  // 상표 따른 로고 이미지 표시
  const oImg = oilbank["상표"] === "알뜰주유소"
    ? altle 
    : oilbank["상표"] === "HD현대오일뱅크"
    ? hd
    : oilbank["상표"] === "SK에너지"
    ? sk
    :gs

  // json의 페이지 주소 따른 링크 url 설정
  const linkPath = `/${oilbank["페이지"]}`;

  return (
    // 아예 박스 자체를 링크로 설정
    // 기본적인 광고판 배너 컴포넌트
    <a href={linkPath} className='cursor-pointer'
    target='_blank' rel="noopwnwe noreferrer"> 
      <div className='flex flex-row'>
        <img src={oImg} alt={altle} className={isPcOrMobile ? "w-7 h-5 my-1" : "w-14 h-10" }/>
        <div className={`font-bold text-center ${isPcOrMobile ? "mx-2" : "mt-1 mx-3 text-lg"}`}>
            {oilbank["주유소명"]}
        </div>
      </div>
      <div>
        <div className='my-1'>
          <div className={`text-start ${isPcOrMobile ? "text-sm" : "my-1"}`}>
            {oilbank["전화번호"]}
          </div>
          <div className={`text-start ${isPcOrMobile ? "text-xs" : "text-sm"}`}>
            {oilbank["주소"]}
          </div>
        </div>
      </div>
    </a>
  )
}
