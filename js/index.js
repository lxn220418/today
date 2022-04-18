(() => {
  let page = 0;
  let size = 10;
  let chatTotal = 0;
  let sendType = "enter";
  const init = function () {
    //获取用户信息
    getUserInfo();
    //初始化聊天记录
    initChatList("bottom");
    // 事件入口函数
    initEvent();
  };

  // 事件入口函数
  const initEvent = () => {
    sendBtn.addEventListener("click", onSendBtnClick);
    contentBody.addEventListener("scroll", onContentBodyScroll);
    arrowBtn.addEventListener("click", onArrowBtnClick);
    clearBtn.addEventListener("click", onClearBtnClick);
    closeBtn.addEventListener("click", onCloseClick);

    document
      .querySelectorAll(".select-item")
      .forEach((item) => item.addEventListener("click", onSelectItemClick));

    inputContainer.addEventListener("keydown", onInputContainerKeyDown);
  };

  // 点击关闭事件
  const onCloseClick = () => {
    console.log(0);
    sessionStorage.token = "";
    window.location.replace("login.html");
  };

  // 点击清除事件
  const onClearBtnClick = () => {
    inputContainer.value = "";
  };

  // 输入信息框键盘按下事件
  const onInputContainerKeyDown = (e) => {
    if (
      (e.keyCode === 13 && e.ctrlKey === false && sendType === "enter") ||
      (e.keyCode === 13 && e.ctrlKey === true && sendType === "ctrlEnter")
    ) {
      sendBtn.click();
    }
  };

  // 箭头下拉框选项点击事件
  const onSelectItemClick = function () {
    // 获取点击类型 enter ctrl+enter
    sendType = this.getAttribute("type");
    // 高亮显示
    let checked = document.querySelector(".select-item.on");
    checked.classList.remove("on");
    this.classList.add("on");
    // 箭头下拉框隐藏
    selectContainer.style.display = "none";
  };

  // 点击箭头事件
  const onArrowBtnClick = () => {
    selectContainer.style.display = "block";
  };
  // contentBody滚动事件
  const onContentBodyScroll = function () {
    if (this.scrollTop === 0) {
      page++;
      if (page * size > chatTotal) {
        return;
      }
      initChatList("top");
    }
    console.log(this.scrollTop);
  };

  // 发送点击 事件
  const onSendBtnClick = async () => {
    const content = inputContainer.value.trim();
    if (!content) {
      window.alert("发送消息不能为空！");
      return;
    }
    // 调用渲染函数 将发送的消息渲染到页面
    renderChatForm([{ from: "user", content }], "bottom");
    inputContainer.value = " ";
    // 发送数据到后端
    const res = await fetchFn({
      url: "/chat",
      method: "POST",
      params: { content },
    });
    renderChatForm([{ from: "robot", content: res.content }], "bottom");
  };

  //初始化聊天记录
  const initChatList = async (direcation) => {
    const res = await fetchFn({
      url: "/chat/history",
      params: {
        page,
        size,
      },
    });
    chatTotal = res.chatTotal;
    renderChatForm(res.data, direcation);
  };

  // 渲染聊天记录
  const renderChatForm = (list, direcation) => {
    // list长度为0时 加载默认数据
    if (!list.length) {
      document.querySelector(
        ".content-body"
      ).innerHTML = `<div class="chat-container robot-container">
      <img src="./img/robot.jpg" alt="" />
      <div class="chat-txt">
        您好！我是腾讯机器人，非常欢迎您的到来，有什么想和我聊聊的吗？
      </div>
    </div>`;
    }
    // 默认有4条数
    list.reverse();
    const chatData = list.map((item) => {
      return item.from === "user"
        ? `<div class="chat-container avatar-container">
        <img src="./img/avtar.png" alt="" />
        <div class="chat-txt">${item.content}</div>
      </div>`
        : `       
      <div class="chat-container robot-container">
              <img src="./img/robot.jpg" alt="" />
              <div class="chat-txt">
              ${item.content}
              </div>
            </div>`;
    });
    if (direcation === "bottom") {
      // 在下方添加
      document.querySelector(".content-body").innerHTML += chatData.join(" ");
      // 最后一个元素距离顶部位置 offsetTop
      const bottomDistance =
        document.querySelectorAll(".chat-container")[
          document.querySelectorAll(".chat-container").length - 1
        ].offsetTop;
      // 滚动条在最下面
      document.querySelector(".content-body").scrollTo(0, bottomDistance);
    } else {
      // 在最顶部添加
      document.querySelector(".content-body").innerHTML =
        chatData.join(" ") + document.querySelector(".content-body").innerHTML;
    }
  };

  // 获取用户信息
  const getUserInfo = async () => {
    const res = await fetchFn({
      url: "/user/profile",
    });
    document.querySelector(".nick-name").innerHTML = res.nickname;
    document.querySelector(".account-name").innerHTML = res.loginId;
    document.querySelector(".login-time").innerHTML = formatTime(
      res.lastLoginTime
    );
  };

  //   格式化最后登录时间
  const formatTime = (time) => {
    const date = new Date(time);
    return `
    ${date.getFullYear()}-${fill0(date.getMonth() + 1)}-${fill0(
      date.getDate()
    )} ${fill0(date.getHours())}:${fill0(date.getMinutes())}:${fill0(
      date.getSeconds()
    )}`;
  };

  //   补零操作
  const fill0 = (num) => {
    return num < 10 ? "0" + num : num;
  };
  init();
})();
