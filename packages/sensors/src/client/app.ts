
class App {
  [key: string]: any;
  constructor() {
    this.sa = {};
  }

  /**
   * SDK 初始化
   */
  init = (props: any) => {}

  /**
   * 登录
   */
  login = () => {}

  /**
   * 主动埋点事件
   * @param event 
   * @param para 
   */
  track = (event: string, para: any) => {}
}

export default App;