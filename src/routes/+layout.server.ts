export const load = async () => {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "손모델 심수연",
    "url": "https://subong.vercel.app",
    "logo": "https://subong.vercel.app/favicon.png",
    "sameAs": [
      "https://open.kakao.com/o/sBSr9QCc"
    ],
    "description": "손모델 심수연의 포트폴리오 사이트 | 다년 간의 촬영 경험과 다양한 제품을 다뤄본 노하우를 바탕으로 원활한 소통과 만족스러운 결과물을 약속드립니다."
  };

  return {
    organizationSchema
  };
}; 