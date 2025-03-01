const jsonConfig = {
  API_URL: "https://api.satlaa.com",
  CMS_URL: "https://cms.satlaa.com/api/",
  WEBSITE_URL: "https://satlaa.com",
  IMG_URL: "https://api.satlaa.com/",
  VIDEO_URL: "https://satlaa.s3.ap-south-1.amazonaws.com/",

 
  languageData: [
    {
      languageId: "english",
      locale: "en",
      name: "English",
      icon: "us",
    },
    {
      languageId: "hindi",
      locale: "hi",
      name: "हिंदी",
      icon: "hi",
    },
  ],

  defaultLanguage: {
    languageId: "english",
    locale: "en",
    name: "English",
    icon: "us",
  },
};

if (process.env.NODE_ENV === "development") {
  jsonConfig.API_URL = "https://uat.satlaa.com";
  jsonConfig.WEBSITE_URL = "http://localhost:3000";
  jsonConfig.IMG_URL = "https://uat.satlaa.com";
} else if (process.env.VERCEL_ENV === "fullstack"){
  
  jsonConfig.API_URL = "http://localhost:5002";
  jsonConfig.WEBSITE_URL = "http://localhost:3000";
  jsonConfig.IMG_URL = "http://localhost:5002";
}
else if (process.env.VERCEL_ENV === "production") {
  jsonConfig.API_URL = "https://uat.satlaa.com";
  jsonConfig.WEBSITE_URL = "https://satlaa.vercel.app";
  jsonConfig.IMG_URL = "https://uat.satlaa.com";
}

module.exports = jsonConfig;
