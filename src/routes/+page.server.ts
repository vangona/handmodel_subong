export const load = async () => {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "손모델 심수연 | 포트폴리오",
    "url": "https://subong.vercel.app",
    "description": "손모델 심수연의 포트폴리오 사이트입니다.",
    "publisher": {
      "@type": "Person",
      "name": "심수연",
      "jobTitle": "손모델"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://subong.vercel.app/?category={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return {
    websiteSchema
  };
}; 