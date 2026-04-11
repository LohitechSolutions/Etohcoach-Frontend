import MessageEnum, {
  getName,
} from '../../../framework/src/Messages/MessageEnum';
import { IBlock } from '../../../framework/src/IBlock';
import { runEngine } from '../../../framework/src/RunEngine';
import { Message } from '../../../framework/src/Message';
import { Block } from '../../../framework/src/Block';

let config = require('../config');

function normalizeFetchHeaders(headers: any): Record<string, string> {
  if (headers == null || headers === '') {
    return {};
  }
  if (typeof headers === 'string') {
    try {
      const parsed = JSON.parse(headers);
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
      runEngine.debugLog('RestApiClient', 'Invalid JSON in request headers; sending without custom headers');
      return {};
    }
  }
  if (typeof headers === 'object') {
    return headers as Record<string, string>;
  }
  return {};
}

function describeFetchError(error: unknown, attemptedUrl: string): string {
  const msg = error instanceof Error ? error.message : String(error);
  const isNetworkFailed =
    msg === 'Network request failed' ||
    msg.includes('Network request failed') ||
    (error instanceof TypeError && msg.toLowerCase().includes('network'));

  if (isNetworkFailed) {
    return [
      'Could not reach the server (network/TLS).',
      'Try: open this URL in Chrome on the same device;',
      'switch Wi‑Fi ↔ mobile data; turn off VPN and Android “Private DNS”;',
      'confirm the Railway app is running.',
      `Request: ${attemptedUrl}`
    ].join(' ');
  }
  if (error instanceof Error) {
    return `${error.message} (${attemptedUrl})`;
  }
  return `Request failed: ${msg}`;
}

export default class RestApiClientBlock<Entity> extends Block {
  private props: any;

  private static instance: RestApiClientBlock<any>;

  private constructor() {
    super();
    runEngine.attachBuildingBlock(this as IBlock, [
      getName(MessageEnum.RestAPIRequestMessage),
    ]);
  }

  static getInstance(): RestApiClientBlock<any> {
    if (!RestApiClientBlock.instance) {
      RestApiClientBlock.instance = new RestApiClientBlock();
    }
    return RestApiClientBlock.instance;
  }

  async receive(from: string, message: Message) {
    console.log('API Rquest Message' + JSON.stringify(message));
    if (getName(MessageEnum.RestAPIRequestMessage) === message.id) {
      const uniqueApiCallId = message.messageId;
      const {
        RestAPIRequestMethodMessage: method,
        RestAPIResponceEndPointMessage: endpoint,
        RestAPIRequestHeaderMessage: headers,
        RestAPIRequestBodyMessage: body,
        NavigationPropsMessage: props,
      } = message.properties;
      this.props = props;
      this.makeApiCall(uniqueApiCallId, method, endpoint, headers, body);
    }
  }

  async makeApiCall(
    uniqueApiCallId: string,
    method: string,
    endpoint: string,
    headers: any,
    body: string
  ) {
    const base = config.baseURL || '';
    let fullURL: string;
    if (endpoint.indexOf('://') !== -1) {
      fullURL = endpoint;
    } else if (base) {
      fullURL = `${base.replace(/\/$/, '')}/${String(endpoint).replace(/^\//, '')}`;
    } else {
      fullURL = String(endpoint).replace(/^\//, '');
    }

    let apiResponseMessage = new Message(
      getName(MessageEnum.RestAPIResponceMessage)
    );
    apiResponseMessage.addData(
      getName(MessageEnum.RestAPIResponceDataMessage),
      uniqueApiCallId
    );

    console.log('@@@ API URL ======================', fullURL);
    console.log('@@@ REQUEST BODY ======================', body);
    console.log('@@@ METHOD TYPE ======================', method);
    console.log('@@@ API CALL ID ======================', uniqueApiCallId);
    console.log('@@@ API HEADERS ======================', headers);

    if (endpoint.indexOf('://') === -1 && !base) {
      apiResponseMessage.addData(
        getName(MessageEnum.RestAPIResponceErrorMessage),
        'API base URL is empty. Set EXPO_PUBLIC_API_URL in react-native/.env and restart Expo with a clean cache (npx expo start --clear).'
      );
      if (this.props) {
        apiResponseMessage.addData(
          getName(MessageEnum.NavigationPropsMessage),
          this.props
        );
      }
      this.send(apiResponseMessage);
      return;
    }

    try {
      const headerObj = normalizeFetchHeaders(headers);
      const init: RequestInit = {
        method: method.toUpperCase(),
      };
      if (Object.keys(headerObj).length > 0) {
        init.headers = headerObj;
      }
      if (body) {
        init.body = body;
      }

      const response = await fetch(fullURL, init);
      const rawText = await response.text();
      const trimmed = rawText.trim();

      let responseJson: unknown = null;
      if (trimmed.length > 0) {
        try {
          responseJson = JSON.parse(trimmed);
        } catch {
          const looksHtml = trimmed.startsWith('<') || trimmed.startsWith('<!');
          const hint = looksHtml
            ? ' Server returned HTML instead of JSON — wrong URL, proxy error, or app down.'
            : '';
          apiResponseMessage.addData(
            getName(MessageEnum.RestAPIResponceErrorMessage),
            `Could not parse API response (HTTP ${response.status}).${hint}`
          );
          if (this.props) {
            apiResponseMessage.addData(
              getName(MessageEnum.NavigationPropsMessage),
              this.props
            );
          }
          this.send(apiResponseMessage);
          return;
        }
      }

      apiResponseMessage.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        responseJson
      );
    } catch (error) {
      const errLog =
        error instanceof Error
          ? `${error.name}: ${error.message}`
          : typeof error === 'object' && error !== null
            ? JSON.stringify(error)
            : String(error);
      runEngine.debugLog('RestApiClient Error', errLog);
      console.warn('RestApiClient fetch failed', fullURL, errLog, error);
      apiResponseMessage.addData(
        getName(MessageEnum.RestAPIResponceErrorMessage),
        describeFetchError(error, fullURL)
      );
    }

    if (this.props) {
      apiResponseMessage.addData(
        getName(MessageEnum.NavigationPropsMessage),
        this.props
      );
    }
    this.send(apiResponseMessage);
  }
}
