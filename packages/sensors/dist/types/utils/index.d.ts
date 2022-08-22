export interface Props {
    [key: string]: any;
}
/**
 * script 动态加载 js
 * @param para
 */
export declare const loadScript: (para: any) => void;
/**
 * 判断是否字符串
 * @param obj
 * @returns
 */
export declare function isString(obj: any): boolean;
/**
 * 判断是否对象
 * @param obj
 * @returns
 */
export declare const isObject: (obj: any) => boolean;
/**
 * 判断是否函数方法
 * @param f
 * @returns
 */
export declare function isFunction(f: any): boolean;
/**
 * 判断是否数字类型
 * @param obj
 * @returns
 */
export declare function isNumber(obj: any): boolean;
/**
 * 判断是否 dom 类型
 * @param obj
 * @returns
 */
export declare function isElement(obj: any): boolean;
export declare function isEmptyObject(obj: any): boolean;
export declare function isUndefined(obj: any): boolean;
export declare function base64Encode(data: any): string;
/**
 * get userNative
 * @returns
 */
export declare function getUA(): any;
/**
 * 判断是否数组
 */
export declare const isArray: (arg: any) => arg is any[];
/**
 * 获取请求 url
 * @param para
 * @returns
 */
export declare function getURL(para?: any): any;
/**
 * 寻找数组对应下标
 * @param arr
 * @param target
 * @returns
 */
export declare function indexOf(arr: any[], target: any): number;
export declare function each(obj: any, iterator: any, context?: any): false | undefined;
export declare function filter(arr: any[], fn: any, self?: any): any[];
export declare function trim(str: string): string;
export declare function _decodeURIComponent(val: any): any;
export declare function _decodeURI(val: any): any;
export declare function urlParse(para: any): any;
export declare function _URL(url: string): any;
export declare function getURLSearchParams(queryString: string): any;
export declare const getReferrer: (referrer?: any, full?: any) => string;
export declare function getHostname(url: string, defaultValue?: any): any;
/**
 * 格式化 json 为字符串
 * @param obj
 * @returns
 */
export declare function formatJsonString(obj: any): string;
/**
 * 获取随机数
 * @returns
 */
export declare function getRandom(): number;
/**
 * 获取随机数
 */
export declare const getRandomBasic: (number: number) => number;
/**
 * 增加 hashEvent
 * @param callback
 */
export declare const addHashEvent: (callback: any) => void;
export declare const addEvent: (element: Window | any, type: any, handler: any) => void;
export declare function getElementContent(target: any, tagName: string): string;
export declare function getEleInfo(obj: any): any;
export declare function strip_empty_properties(p: any): any;
export declare function ry(dom: any): any;
export declare namespace ry {
    var init: any;
}
export declare const heatmap: {
    getElementPath: (element: any, ignoreID: any, rootElement?: any) => string;
    getClosestLi: (element: any) => any;
    getElementPosition: (element: any, elementPath: any, ignoreID: any) => number | "" | null;
    getDomIndex: (el: any) => number;
    selector: (el: any, notuseid: any) => string;
    getDomSelector: (this: any, el: any, arr?: any[], notuseid?: string) => any;
    getEleDetail: (target: any) => any;
    getPointerEventProp: (ev: any, target: any) => {};
};
export declare const checkOption: {
    distinct_id: {
        rules: string[];
        onComplete: (status: any, val: any, rule_type: any) => any;
    };
    event: {
        rules: string[];
        onComplete: (status: any, val: any, rule_type: any) => boolean;
    };
    propertyKey: {
        rules: string[];
        onComplete: (status: any, val: any, rule_type: any) => boolean;
    };
    propertyValue: {
        rules: string[];
        onComplete: (status: any, val: any, rule_type: any) => boolean;
    };
    properties: (p: any) => boolean;
    propertiesMust: (p: any) => boolean;
    item_type: {
        rules: string[];
        onComplete: (status: any, val: any, rule_type: any) => boolean;
    };
    item_id: {
        rules: string[];
        onComplete: (status: any, val: any, rule_type: any) => boolean;
    };
    loginIdKey: {
        rules: string[];
        onComplete: (status: any, val: any, rule_type: any) => any;
    };
    bindKey: {
        rules: string[];
        onComplete: (status: any, val: any, rule_type: any) => any;
    };
    bindValue: {
        rules: string[];
        onComplete: (status: any, val: any, rule_type: any) => any;
    };
    check: (this: any, a?: any, b?: any, onComplete?: any) => any;
};
export declare const kit: Props;
export declare function extend(obj: any): any;
export declare function getSendData(data: any): any;
export declare function getSendUrl(url: string, data: any, props: any): string;
export declare function isValidListener(listener: any): boolean;
export declare const pageInfo: any;
export declare function addSinglePageEvent(callback: any): void;
