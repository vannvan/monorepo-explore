declare class App {
    [key: string]: any;
    constructor();
    /**
     * SDK 初始化
     */
    init: (props: any) => void;
    /**
     * 登录
     */
    login: () => void;
    /**
     * 主动埋点事件
     * @param event
     * @param para
     */
    track: (event: string, para: any) => void;
}
export default App;
