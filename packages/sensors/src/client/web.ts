
import { v4 as uuidv4 } from 'uuid'

import { getHostname, getReferrer, loadScript, kit, checkOption, addSinglePageEvent, trim, isArray } from "../utils";
import { version } from '../../package.json'
import { EventEmitter } from '../utils/saEvent';

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
  }
}

class Web {
  [key: string]: any;
  constructor() {
    this.sa = {
      preset_properties: {
        url: true,
        title: true
      },
      login_id_key: '$identity_login_id',
      img_use_crossorigin: false,
  
      name: 'sa',
      show_log: false,
      is_debug: false,
  
      send_type: 'image',
  
      callback_timeout: 200,
      datasend_timeout: 8000,
    };

    try {
      // 获取IP
      loadScript({
        url: 'https://pv.sohu.com/cityjson?ie=utf-8',
        type: 'js',
        success: () => {
          this.citySN = window.returnCitySN;
          this.setPresetProperties();
        }
      })
    } catch (error) {
      this.citySN = {};
      this.setPresetProperties();
    }
  }

  /**
   * SDK 初始化
   */
  init = async (props: ConfigProps) => {
    console.info('init event tracking', `版本号：${version}`);

    const distinct_id = localStorage.getItem('distinct_id');
    if(!distinct_id) {
      localStorage.setItem('distinct_id', uuidv4());
    }

    this.initSystemEvent();
    this.setInitVar();

    this.initPara(props);
  }

  /**
   * 初始化全局参数
   * @param props 
   */
  initPara = (props: ConfigProps) => {
    this.sa = { ...this.sa, ...props };

    if (typeof this.sa.server_url === 'string') {
      this.sa.server_url = trim(this.sa.server_url);
      if (this.sa.server_url) {
        if (this.sa.server_url.slice(0, 3) === '://') {
          this.sa.server_url = location.protocol.slice(0, -1) + this.sa.server_url;
        } else if (this.sa.server_url.slice(0, 2) === '//') {
          this.sa.server_url = location.protocol + this.sa.server_url;
        } else if (this.sa.server_url.slice(0, 4) !== 'http') {
          this.sa.server_url = '';
        }
      }
    }

    if (isArray(this.sa.server_url) && this.sa.server_url.length) {
      for (let i = 0; i < this.sa.server_url.length; i++) {
        if (!/s\.gif[^\/]*$/.test(this.sa.server_url[i])) {
          this.sa.server_url[i] = this.sa.server_url[i].replace(/\/s$/, '/s.gif').replace(/(\/s)(\?[^\/]+)$/, '/s.gif$2');
        }
      }
    } else if (!/s\.gif[^\/]*$/.test(this.sa.server_url) && typeof this.sa.server_url === 'string') {
      this.sa.server_url = this.sa.server_url.replace(/\/s$/, '/s.gif').replace(/(\/s)(\?[^\/]+)$/, '/s.gif$2');
    }
  }

  /**
   * 初始化系统事件
   */
  initSystemEvent = () => {
    this.spa = new EventEmitter();
    addSinglePageEvent((url: string) => {
      this.spa.emit('switch', url);
    })
  }

  /**
   * 设置属性参数
   */
  setInitVar = () => {
    this.sa._t = this.sa._t || 1 * new Date().getTime();
    this.sa.lib_version = version;
    this.sa.is_first_visitor = false;
  }

  /**
   * 登录
   */
  login = async (distinct_id: string, user: any) => {
    console.info('login event tracking...');

    localStorage.setItem('distinct_id', distinct_id)
    this.saEvent.send({
      type: 'profile_set',
      properties: { ...user }
    });
  }

  /**
   * 主动埋点事件
   * @param event 
   * @param para 
   */
  track = async (event: string, para: any) => {
    const properties = { ...this.sa, ...para };

    this.saEvent.send({
      type: 'track',
      event: event,
      properties,
    });
  }

  /**
   * 设置预设属性
   */
  setPresetProperties = (param?: any) => {
    const $referrer = getReferrer() || '';

    const properties = {
      $sdk: param && param.$sdk || '取值异常',
      $sdk_version: version,
      $sdk_method: param && param.$sdk_method || '取值异常',
      $referrer: $referrer,
      $referrer_host: getHostname($referrer) || '',
      $screen_width: window.innerWidth, // 屏幕宽度
      $screen_height: window.innerHeight,	// 屏幕高度

      $app_type: 'pc',
      $app_version: param && param.$app_version || '取值异常',	// 应用版本号

      $url_host: document.location.host,		// 页面地址域名
      $ip: this.citySN.cip || '取值异常',
      $area_code: this.citySN.cid || '取值异常',
      $user_agent: window.navigator.userAgent,
      $country: this.citySN.cname || '取值异常',			// 国家
      $province: this.citySN.cname || '取值异常',			// 省份
      $city: this.citySN.cname || '取值异常',			// 城市
    }

    this.sa = { ...this.sa, ...properties };
  }

  saEvent = {
    check: (p: any, onComplete?: any) => {
      for (let i in p) {
        if (Object.prototype.hasOwnProperty.call(p, i) && !checkOption.check(i, p[i], onComplete)) {
          return false
        }
      }
      return true;
    },
    sendItem: (params: any) => {
      const data = {
        lib: {
          $lib: 'js',
          $lib_method: 'code',
          $lib_version: version
        },
        time: new Date().getTime() * 1
      }
      return Object.assign(data, params)
    },
    send: (params: any) => {
      const data = kit.buildData(params)
      kit.sendData(this.sa, data);
    }
  }
}

export default Web;