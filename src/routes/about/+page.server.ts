export const load = async () => {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "심수연",
    "jobTitle": "손모델",
    "url": "https://subong.vercel.app/about",
    "image": "https://umpactdflfdhwbufbzzp.supabase.co/storage/v1/object/public/post-images/0.6739137500664765.jpg",
    "description": "다년 간의 촬영 경험과 다양한 제품을 다뤄본 노하우를 바탕으로 원활한 소통과 만족스러운 결과물을 약속드립니다.",
    "sameAs": [
      "https://open.kakao.com/o/sBSr9QCc"
    ]
  };

  return {
    personSchema
  };
}; 