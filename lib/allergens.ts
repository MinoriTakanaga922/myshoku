export const MANDATORY_ALLERGENS = [
  "卵", "乳", "小麦", "そば", "落花生（ピーナッツ）", "えび", "かに", "くるみ",
] as const;

export const RECOMMENDED_ALLERGENS = [
  "アーモンド", "あわび", "いか", "いくら", "オレンジ", "カシューナッツ",
  "キウイフルーツ", "牛肉", "ごま", "さけ", "さば", "大豆", "鶏肉",
  "バナナ", "豚肉", "まつたけ", "もも", "やまいも", "りんご", "ゼラチン",
  "マカダミアナッツ",
] as const;

export const ALLERGENS = [...MANDATORY_ALLERGENS, ...RECOMMENDED_ALLERGENS] as const;

export type Allergen = typeof ALLERGENS[number];

/** アレルゲン情報が不明な場合に使う特殊フラグ */
export const STAFF_CHECK = "スタッフにお聞きください" as const;
