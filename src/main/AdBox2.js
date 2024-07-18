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
        <img src={oImg} alt={altle} className={isPcOrMobile ? "w-7 h-5 my-1" : "ml-1 mt-1 w-6 h-4" }/>
        <div className={`font-bold text-center ${isPcOrMobile ? "mx-2" : "mt-1 mx-2 text-sm"}`}>
            {oilbank["주유소명"]}
        </div>
      </div>
    </a>
  )
}
