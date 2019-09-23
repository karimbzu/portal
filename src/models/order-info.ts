export interface OrderInfo {
  id: number;
  user: string;
  scanType: string;
  type: string;
  uploadId: number;
  repoURL: string;
  tokenId: number;
  optService: object;
  dateTime: string;
  status: string;
  project: string;
  description: string;
  reportId: number;
  originalName: string;
  logDateTime: string;
  /*
  "id": 7,
            "user": "R10054",
            "scanType": "source_code",
            "type": "repo",
            "uploadId": 10,
            "repoURL": "https://github.com/WebGoat/WebGoat.git",
            "tokenId": 1,
            "optService": "{}",
            "price": 1,
            "dateTime": "2019-07-24T06:47:24.000Z",
            "status": "done",
            "project": "WebGoat",
            "description": "Amir Testing",
            "reportId": 22,
            "originalName": "7-190731101954-report.zip",
            "logDateTime": "2019-07-31T02:23:17.000Z"
   */
}
