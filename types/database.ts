export type Shop = {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  photo_url: string | null;
  category: string | null;
  contact: string | null;
  created_at: string;
};

export type MenuItem = {
  id: string;
  shop_id: string;
  name: string;
  description: string | null;
  price: number | null;
  photo_url: string | null;
  ingredients_text: string | null;
  ingredients_image_url: string | null;
  allergens: string[];
  created_at: string;
};

export type ShopWithMenus = Shop & {
  menu_items: MenuItem[];
};
