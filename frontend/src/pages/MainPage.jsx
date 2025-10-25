import React from "react";
import "../styles/MainPage.css";

export default function MainPage() {
  return (
    <div className="main-container">
      {/* 개인 맞춤 취미 */}
      <div className="main-wrapper">
        <h2 className="main-title">개인 맞춤 취미</h2>
        <div className="main-card">
          <div className="main-list">
            <div className="main-item">
              <img src="/images/bike.png" alt="자전거 타기" />
              <p>자전거 타기</p>
            </div>
            <div className="main-item">
              <img src="/images/guitar.png" alt="기타 연주" />
              <p>기타 연주</p>
            </div>
            <div className="main-item">
              <img src="/images/painting.png" alt="그림 그리기" />
              <p>그림 그리기</p>
            </div>
          </div>
        </div>
      </div>

      {/* 새로운 취미 */}
      <div className="main-wrapper">
        <h2 className="main-title">새로운 취미</h2>
        <div className="main-card">
          <div className="main-list">
            <div className="main-item">
              <img src="/images/yoga.png" alt="요가" />
              <p>요가</p>
            </div>
            <div className="main-item">
              <img src="/images/baking.png" alt="베이킹" />
              <p>베이킹</p>
            </div>
            <div className="main-item">
              <img src="/images/hiking.png" alt="하이킹" />
              <p>하이킹</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
