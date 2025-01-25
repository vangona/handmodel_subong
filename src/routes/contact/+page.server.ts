export const load = async () => {
  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "손모델 심수연 연락처",
    "description": "손모델 심수연과 협업 문의를 위한 연락처 페이지입니다.",
    "mainEntity": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "url": "https://open.kakao.com/o/sBSr9QCc",
      "availableLanguage": ["Korean"]
    }
  };

  return {
    contactSchema
  };
}; 