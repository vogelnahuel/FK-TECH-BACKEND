export interface DatabaseUsers {
  document: string;
  country: string;
  stores: string[];
  user: LoginResponseUsers;
  status: LoginStatus;
  security_questions: LoginSecurityQuestions;
  sessions: LoginSessions;
}

export interface LoginResponseUsers {
  user_id: number;
  password: string[];
  creation_ts: string;
  active: number;
  system_pass: number;
  expirate: number;
  user_name: string;
  role_id: number;
  role_name: string;
  status_id: number;
  last_access_ts: string;
  lockable: number;
  retries: number;
  retries_timestamp: string;
  first_name: string;
  last_name: string;
  language_id: number;
}
export interface LoginResponseData {
  country: string;
  stores: string[];
  firstName: string;
  initialPass: boolean;
  lastAccessTs: string;
  lastName: string;
  loginRetries: number;
  nickName: string;
  passwordExpiredDate: number;
  passwordWhitening: boolean;
  role: LoginRole | Object;
  savedQuestions: boolean;
  token: string;
  userId: number;
  userName: string;
}

export interface LoginStatus {
  id: number;
  name: string;
}

export interface LoginSecurityQuestions {
  user_id: number;
  user_question: string;
  answer: string;
  system_question_key: string;
}

export interface LoginSessions {
  user_id: string;
  token: string;
  expiration: string;
}

export interface LoginRole {
  roleId: number;
  roleName: string;
  views: LoginViews[];
}
export interface LoginViews {
  children: any[];
  mobile: number;
  name: string;
  order: number;
  parentId: number;
  viewId: number;
  visibleTo: string;
}
export interface ExceptionsErrorMsg {
  message: string;
  value: number;
}
