export type RequestLog = {
  id?: null | number;
  method: string;
  url: string;
  user_agent: null | string;
};

export type DBProxy = {
  request_log: RequestLog[];
};

export type JWT_Payload = {
  role: 'member' | 'admin';
  user_id: number;
  username: string;
};
