import { Configuration } from "@azure/msal-browser";

export const msalConfig: Configuration = {
  auth: {
    clientId: "0d16cb3b-8f27-4e95-9a27-f93cf67ab051",
    authority: "https://login.microsoftonline.com/8b429d1a-74b0-4d77-8bc0-46497daeee71",
    redirectUri: "http://localhost:5173/Ticketing",
    //navigateToLoginRequestUrl: false
  },
  cache: { 
    cacheLocation: "sessionStorage" 
  }
};

export const loginRequest = { 
  scopes: ["api://e1709cbf-5ac7-45dd-b932-736744fcb4d0/API.ACCESS"] 
};
