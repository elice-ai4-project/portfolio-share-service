import React from "react";
import styles from "../../styles/mystyle.module.css";
// import * as Keys from "../../keys.js";

function KakaoLogin() {
  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.KAKAO_CLIENT_ID}&redirect_uri=${process.env.KAKAO_REDIRECT_URI}&response_type=code`;

  return (
    <>
      <a href={KAKAO_AUTH_URL}>
        <div className={styles.kakao_btn}></div>
      </a>
    </>
  );
}

export default KakaoLogin;
