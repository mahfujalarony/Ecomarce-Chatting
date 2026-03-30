module.exports = {
  app: {
    nodeEnv: "production",
  },
  unified: {
    port: 3000,
    baseUrl: "http://localhost:3000",
  },
  web: {
    frontendOrigins: [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:5173",
      "http://192.168.0.106:5173",
    ],
    allowLocalAndLanOrigins: true,
  },




  // ata main backend er jeita ecomarce er backend chilo
  backend: {
    database: {
      name: "ecomarcebackend",
      user: "root",
      password: "",
      host: "localhost",
      dialect: "mysql",
    },
    jwtSecret: "secretkey",
    jwtExpiresIn: "30d",


    // home section jeheto proti user er jonno load hoy . ar load hole motamuti onek calculation kore top product gula dekanu hoy tai ata proti user er jonno rakle server er cap barar sombabona ace. tai atake protom akjon user home page e dukle db te queary kore top product ber kora hoy tarpor db er homecash namer table e cash kore raka hoy. tarpor pore joto jon user ei ei 2 minite er vitor visit korok ei cash theke dekanu hoy. ar por 2 minit por aber kunu user req korle punorai calculation kore top produt gula ber kora hoy abong punorai cash kroe raka hoy. akane default 2 minit dea rakci
    homeSectionsCacheTtlSeconds: 120,


    // admin history koto din por por auto delete hobe seta
    adminHistoryRetentionDays: 10,


    // google oauth er jonno ata
    googleClientId: "1026628002697-u8gfo9e2puk1id2a4u0il6qre4hqtfi1.apps.googleusercontent.com",
  },




  // eita ecomarce er backend er vitor jei chat ta chilo
  supportChat: {
    database: {
      host: "localhost",
      user: "root",
      password: "",
      name: "ecomarcechatbackend",
      dialect: "mysql",
    },
    jwtSecret: "secretkey",

    // ata akta demo id dea hoyce jeta kunu guest message korle ei id theke akta auto reply jabe
    supportAutoReplySenderId: 999999999999999,
  },



  // ar eita alada calling+chating er jonno jei backend oita
  // ar eita ei system e korci jate kunu protom kunu user account korbe pratomik obostai kawke admin banate chile database theke banate hobe.
  // ar kunu admin caile model admin banate parbe + admin site er user er nam agent user name dici. model admin ba admin caile jekunu user ke agent user banate parbe
  // ar sararon user jara ace tara admin/model_admin/agent er number ba mail contact e dia tar sate add hote parbe. kinto kunu sadaron user , arekjon sadaron user ke kuje pabe na contact e add o hote parbe na
  // aber admin caile jekunu user ke tar sate contact e addd korte parbe
  // admin ba model admin caile kunu conversation ke forword kore onno agent user ba nijer kace transfar korte parbe
  

  chatbackend: {
    database: {
      host: "127.0.0.1",
      port: 3306,
      name: "chatbacked",
      user: "root",
      password: "",
      syncMode: "safe",
    },


    // ata hoytece web push notification er jonno jate call er somoy client ke notificaion dea jai jodio se browser er baire take
    vapidSubject: "mailto:admin@example.com",
    vapidPublicKey: "BDzotGm1knBDNaNBuS4wfZmEKwhRpz5HqlVsEWUbhjuREzX7_dQm0eT_8AKco8I_PbopGLwzQvFGguIVUTxhDWc",
    vapidPrivateKey: "Gmn0D_qwAHTkA3L45zcejP8w5M8Y8W6-Ba5rt6tfl9U",






    jwtSecret: "ThisIsASecretKeyForJWT",
    jwtRefreshSecret: "ThisIsASecretKeyForJWTRefresh",
    refreshCookieName: "refreshToken",
    authCookieSecure: "",
    authCookieSameSite: "",


    // eta hoytece bar bar vul password dile kotokkoner jonno account theke jate ar login er try korte na pare
    loginRateLimitThreshold: 10,
    loginRateLimitCooldownMs: 15 * 60 * 1000,
    loginRateLimitMaxKeys: 50000,
    allowRoleBypassForTest: false,
    accessTokenExpiresIn: "15m",
    refreshTokenExpiresIn: "30d",
  },
};
