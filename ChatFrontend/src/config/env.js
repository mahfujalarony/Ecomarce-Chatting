const trimSlash = (value = "") => String(value || "").replace(/\/+$/, "");

const SAME_ORIGIN = typeof window !== "undefined" ? trimSlash(window.location.origin) : "https://connect.nexusglobalshop.com";



// Backend Url
export const UNIFIED_BASE_URL = trimSlash("https://server.nexusglobalshop.com");
export const ZEGO_APP_ID = 1977442120;
export const ZEGO_SERVER_SECRET = "20294d45556bfd491ddad761d3d76cc0";



export const API_URL = trimSlash(`${UNIFIED_BASE_URL}/chatbackend`);
export const SOCKET_URL = UNIFIED_BASE_URL;
export const SOCKET_PATH = "/socket.io/chatbackend";
export const UPLOAD_SERVER_URL = UNIFIED_BASE_URL;
export const UPLOAD_FILE_FIELD = "file";

// ata notification er jonno jodi se browser er baire take
export const ENABLE_WEB_PUSH = true;
