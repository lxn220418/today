(() => {
  // 定义变量 用户昵称是否存在已被注册 默认为未注册
  let isRepeat = false;
  const init = function () {
    initEvent();
  };

  function initEvent() {
    userName.addEventListener("blur", onBlurEvent);
    formContainer.addEventListener("submit", onFormSubmit);
  }
  //   表单提交
  function onFormSubmit(e) {
    // 阻止默认事件
    e.preventDefault();
    // 获取表单数据
    const loginId = userName.value.trim();
    const nickname = userNickname.value.trim();
    const loginPwd = userPassword.value.trim();
    const confirmPwd = userConfirmPassword.value.trim();
    if (!checkForm(loginId, nickname, loginPwd, confirmPwd)) {
      return;
    }
    onRegisteEvent(loginId, nickname, loginPwd);
  }
  //   注册事件
  async function onRegisteEvent(loginId, nickname, loginPwd) {
    const res = await fetchFn({
      url: "/user/reg",
      method: "POST",
      params: {
        loginId,
        nickname,
        loginPwd,
      },
    });

    res && window.location.replace("index.html");
  }

  //   验证表单  有问题 最后返回undefined
  function checkForm(loginId, nickname, loginPwd, confirmPwd) {
    switch (true) {
      case !loginId: {
        window.alert("用户名不能为空！");
        return;
      }
      case !nickname: {
        window.alert("昵称不能为空！");
        return;
      }
      case !loginPwd: {
        window.alert("密码不能为空！");
        return;
      }
      case !confirmPwd: {
        window.alert("确认密码不能为空！");
        return;
      }
      case loginPwd !== confirmPwd: {
        window.alert("两次输入的密码不一致！");
        return;
      }
      case isRepeat: {
        window.alert("用户名已存在，请修改！");
        return;
      }
      default:
        return true;
    }
  }

  //   失去焦点事件 如果账号存在  打印错误信息
  async function onBlurEvent() {
    const loginId = userName.value.trim();
    if (!loginId) {
      return;
    }
    // result.data 为false 账号不存在  为true 账号存在
    isRepeat = await fetchFn({ url: "/user/exists", params: { loginId } });
  }
  init();
})();
