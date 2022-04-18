(() => {
  const init = () => {
    initEvent();
  };
  // 默认事件
  const initEvent = () => {
    // form表单添加提交事件
    formContainer.addEventListener("submit", (e) => {
      // 取消默认事件 组织页面跳转
      e.preventDefault();
      const loginId = userName.value.trim();
      const loginPwd = userPassword.value.trim();
      if (!loginId || !loginPwd) {
        window.alert("用户账号密码不能空！");
      } else {
        //   登录事件
        loginEvent(loginId, loginPwd);
      }
    });
  };
  async function loginEvent(loginId, loginPwd) {
    const res = await fetchFn({
      url: "/user/login",
      method: "POST",
      params: { loginId, loginPwd },
    });

    res && window.location.replace("index.html");
  }

  init();
})();
