import { Platforms } from "../enums/platforms.enum";

export interface Link {
  id: string;
  title: string;
  url: string;
  platform: Platforms;
  description?: string;
  is_active: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Platform {
  id: string;
  name: string;
  display_name: string;
  url_pattern?: string;
  icon_url?: string;
  base_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
