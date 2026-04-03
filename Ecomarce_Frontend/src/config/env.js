const trimSlash = (v = "") => String(v || "").replace(/\/+$/, "");


// Backend Url

const UNIFIED_BASE_URL = trimSlash("https://server.nexusglobalshop.com");

export const API_BASE_URL = trimSlash(UNIFIED_BASE_URL);
export const API_BASE_PATH = trimSlash(`${API_BASE_URL}/api`);
export const CHAT_BASE_URL = trimSlash(UNIFIED_BASE_URL);
export const CHAT_API_BASE_URL = trimSlash(`${CHAT_BASE_URL}/api/chat`);
export const CHAT_SOCKET_PATH = "/socket.io/support-chat";
export const UPLOAD_BASE_URL = trimSlash(UNIFIED_BASE_URL);
export const UPLOAD_IMAGE_URL = trimSlash(`${UPLOAD_BASE_URL}/upload/image`);


// Google client id oauth er jonno 
export const GOOGLE_CLIENT_ID = "1026628002697-u8gfo9e2puk1id2a4u0il6qre4hqtfi1.apps.googleusercontent.com";

// home page er product  cash kore rakar somoy. ata 2 minit cash kore rakci jate bar bar serever req kore server er cap na barai
export const HOME_CACHE_TTL_SECONDS = 120;
