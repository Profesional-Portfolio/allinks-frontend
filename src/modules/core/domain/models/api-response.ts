export interface ApiResponse<T = unknown> {
  status?: string;
  message?: string;
  statusCode?: number;
  timestamp?: string;
  meta?: Record<string, unknown>;
  data?: T;
  error?: string;
}

export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}
