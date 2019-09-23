export interface Request {
  scanType: SCAN_TYPE;
  type: TYPE;
  uploadId: number;
  repoURL: string;
  tokenId: number;
  optService: OptService;
  price: number;
}

export enum SCAN_TYPE {
  source_code = 'source_code',
  mobile_app = 'mobile_app',
  web_app = 'web_app'
}

export enum TYPE {
  file = 'file',
  repo = 'repo'
}

export interface AccessToken {
  tokenId: number;
  label: string;
  token: string;
}

export interface OptService {
  security_vulnerability: boolean;
  web_app: boolean;
  android: boolean;
  continuous_scanning: boolean;
}
