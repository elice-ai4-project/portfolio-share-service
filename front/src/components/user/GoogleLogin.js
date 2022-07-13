import React, { useContext } from "react";
import { GoogleLogin } from "react-google-login";
import { useNavigate } from "react-router-dom";

import * as Api from "../../api";
// import * as Keys from "../../keys.js";
import { DispatchContext } from "../../App";

function GLogin() {
  const navigate = useNavigate();
  const dispatch = useContext(DispatchContext);

  const clientId = process.env.GOOGLE_CLIENT_ID;

  async function onSuccess(googleData) {
    try {
      // "auth/google" 엔드포인트로 post 요청함.
      const res = await Api.post("auth/google", {
        token: googleData.tokenId,
      });

      // 유저 정보는 response의 data임.
      const user = res.data;

      // JWT 토큰은 유저 정보의 token임.
      const jwtToken = user.token;
      // sessionStorage에 "userToken"이라는 키로 JWT 토큰을 저장함.
      sessionStorage.setItem("userToken", jwtToken);

      // dispatch 함수를 이용해 로그인 성공 상태로 만듦.
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: user,
      });

      // portfolio 페이지로 이동함.
      navigate("/", { replace: true });
    } catch (err) {
      console.log("구글 로그인에 실패했습니다2 :", err);
    }
  }

  async function onFailure(res) {
    console.log("구글 로그인에 실패했습니다1 ", res);
  }

  return (
    <GoogleLogin
      className="google-button"
      clientId={clientId}
      buttonText="구글 로그인" // 버튼에 뜨는 텍스트
      onSuccess={onSuccess}
      onFailure={onFailure}
      cookiePolicy={"single_host_origin"}
    />
  );
}

export default GLogin;
