import React from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import './Homepage.css';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { EffectCoverflow, Pagination, Navigation, Autoplay } from 'swiper/modules';

import slide_image_1 from './images/img1.jpg';
import slide_image_2 from './images/img2.jpg';
import slide_image_3 from './images/img3.jpg';
import slide_image_4 from './images/img4.jpg';
import slide_image_5 from './images/img5.jpg';
import slide_image_6 from './images/img6.jpg';
import slide_image_7 from './images/img7.jpg';


function Homepage() {
  return (
    <div className="container"style={{marginTop:"80px"}}>
      <h1 className="heading">WELCOME TO AICS-CAMEROON</h1>
      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        loop={true}
        slidesPerView={'auto'}
        cubeEffect={{
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 2.5,
        }}
        pagination={{ el: '.swiper-pagination', clickable: true }}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
          clickable: true,
        }}
        autoplay={{
          delay: 1500, // Time in milliseconds between transitions
          disableOnInteraction: false, // Continue autoplay after user interactions
        }}
        speed={1000} 
        modules={[EffectCoverflow, Pagination, Navigation,Autoplay]}
        className="swiper_container"
      >
        <SwiperSlide>
          <img src={slide_image_1} alt="slide_image" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={slide_image_2} alt="slide_image" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={slide_image_3} alt="slide_image" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={slide_image_4} alt="slide_image" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={slide_image_5} alt="slide_image" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={slide_image_6} alt="slide_image" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={slide_image_7} alt="slide_image" />
        </SwiperSlide>

        <div className="slider-controler">
          <div className="swiper-button-prev slider-arrow">
            <ion-icon name="arrow-back-outline"></ion-icon>
          </div>
          <div className="swiper-button-next slider-arrow">
            <ion-icon name="arrow-forward-outline"></ion-icon>
          </div>
          <div className="swiper-pagination"></div>
        </div>
      </Swiper>
    </div>
  );
}

export default Homepage;
