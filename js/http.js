const BASE_URL = "https://study.duyiedu.com/api";

const fetchFn = async ({ url, method = "GET", params = {} }) => {
  let result = null;
  // 判断sessionStorage.token是否有值
  const extendsObj = {};
  sessionStorage.token &&
    (extendsObj.authorization = "Bearer " + sessionStorage.token);
  if (method === "GET" && Object.keys(params).length) {
    url +=
      "?" +
      Object.keys(params)
        .map((key) => {
          return `${key}=${params[key]}`;
        })
        .join("&");
  }
  try {
    const response = await fetch(BASE_URL + url, {
      method,
      headers: {
        "Content-Type": "application/json",
        // 如果有sessionStorage.token 传参数 如果没有是空对象
        ...extendsObj,
      },
      body: method === "GET" ? null : JSON.stringify(params),
    });
    // 获取后端token值 保存用户标识到sessionStorage 用户关闭浏览器后清空sessionStorage
    const token = response.headers.get("Authorization");
    token && (sessionStorage.token = token);

    result = await response.json();
    if (result.code === 0) {
      // hasOwnProperty 是否有chatTotal属性
      if (result.hasOwnProperty("chatTotal")) {
        result.data = { chatTotal: result.chatTotal, data: result.data };
      }
      return result.data;
    } else {
      // token错误(修改token后) 提示权限有误 移除sessionStorage的token 同时返回到登录页
      console.log(result);
      if (result.status === 401) {
        window.alert("权限token不正确！");
        sessionStorage.removeItem("token");
        window.location.replace("login.html");
        return;
      }
      window.alert(result.msg);
    }
  } catch (error) {
    console.log(error);
  }
};
