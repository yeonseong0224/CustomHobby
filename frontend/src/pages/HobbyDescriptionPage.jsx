import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getHobby, getAllHobbies } from "../api/hobbyApi";
import "../styles/HobbyDescriptionPage.css";

export default function HobbyDescriptionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hobby, setHobby] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const [error, setError] = useState(null);

  // ✅ 현재 취미 데이터 + 같은 이름의 모임 불러오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 현재 취미 정보 가져오기
        const hobbyData = await getHobby(id);
        setHobby(hobbyData);

        // 모든 취미 가져오기
        const allHobbies = await getAllHobbies();
        
        // ✅ 동일한 취미 이름(hobbyName)을 가진 다른 모임만 필터링
        const sameHobbyMeetings = allHobbies.filter(
          (h) => h.hobbyName === hobbyData.hobbyName && h.id !== hobbyData.id
        );

        // ✅ 중복 제거
        const uniqueMeetings = sameHobbyMeetings.filter(
          (h, i, arr) =>
            arr.findIndex((o) => o.locationLink === h.locationLink) === i
        );

        setMeetings(uniqueMeetings);
      } catch (err) {
        console.error("❌ 취미 정보 불러오기 실패:", err);
        setError("취미 정보를 불러오는 중 오류가 발생했습니다.");
      }
    };

    fetchData();
  }, [id]);

  // ✅ 로딩 / 에러 처리
  if (error) return <p className="hd-loading">❌ {error}</p>;
  if (!hobby) return <p className="hd-loading">로딩 중입니다...</p>;

  return (
    <div className="hd-desc-container">
      {/* ✅ 왼쪽 영역 */}
      <div className="hd-desc-left">
        <h1 className="hd-main-title">{hobby.hobbyName}</h1>

        <div className="hd-desc-image-box">
          <img
            src={hobby.photo || "/images/default.png"}
            alt={hobby.hobbyName}
            className="hd-desc-image"
            onError={(e) => { e.target.src = "/images/art.png"; }}
          />
        </div>

        <div className="hd-desc-card">
          <h2>취미 설명</h2>
          <p>{hobby.description}</p>
        </div>

        <div className="hd-desc-card">
          <h2>준비물 / 대체 준비물</h2>
          <p>
            <strong>필요 준비물:</strong> {hobby.materials || "정보 없음"}
            <br />
            <strong>대체 가능:</strong> {hobby.haveMaterial || "정보 없음"}
          </p>
        </div>  
      </div>

      {/* ✅ 오른쪽 영역 */}
      <div className="hd-desc-right">
        <h2 className="hd-related-title">취미 모임</h2>

        {meetings.length > 0 ? (
          <div className="hd-related-grid">
            {meetings.map((meet) => (
              <div
                key={meet.id}
                className="hd-related-card"
                onClick={() => navigate(`/hobby-detail/${meet.id}`)}
              >
                <img
                  src={meet.photo || "/images/default.png"}
                  alt={meet.hobbyName}
                  className="hd-related-img"
                  onError={(e) => { e.target.src = "/images/art.png"; }}
                />
                <h3>{meet.oneLineDescription}</h3>
                <p>{meet.locationLink}</p>
                <p className="hd-related-sub">
                  💸 참가비 {meet.participationFee}원 · 📅 {meet.meetingDate}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="hd-empty-text">현재 등록된 취미 모임이 없습니다.</p>
        )}
      </div>
    </div>
  );
}

