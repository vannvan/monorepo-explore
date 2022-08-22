declare global {
    interface Window {
        returnCitySN: any;
    }
}
export declare interface ConfigProps {
    org: string;
    project: string;
    token: string;
    server_url: string;
    is_single_page: boolean;
    send_type: 'image';
    show_log?: boolean;
    heatmap?: {
        clickmap?: string;
        track_attr?: string[];
    };
}
declare class Web {
    [key: string]: any;
    constructor();
    /**
     * SDK 初始化
     */
    init: (props: ConfigProps) => Promise<void>;
    /**
     * 初始化全局参数
     * @param props
     */
    initPara: (props: ConfigProps) => void;
    /**
     * 初始化系统事件
     */
    initSystemEvent: () => void;
    /**
     * 设置属性参数
     */
    setInitVar: () => void;
    /**
     * 登录
     */
    login: (distinct_id: string, user: any) => Promise<void>;
    /**
     * 主动埋点事件
     * @param event
     * @param para
     */
    track: (event: string, para: any) => Promise<void>;
    /**
     * 设置预设属性
     */
    setPresetProperties: (param?: any) => void;
    saEvent: {
        check: (p: any, onComplete?: any) => boolean;
        sendItem: (params: any) => any;
        send: (params: any) => void;
    };
}
export default Web;
