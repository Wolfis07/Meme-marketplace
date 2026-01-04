export interface Meme {
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
  box_count: number;
  captions: number;
  // Naše přidané vlastnosti
  rating?: number;
  category?: string;
  price?: number;
  quantity?: number; // Pro košík
}

export const CATEGORIES = ["animals", "celebrities", "gaming", "school", "random"];

const stringToHash = (string: string): number => {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
};

export const enrichMeme = (meme: Meme): Meme => {
  const hash = Math.abs(stringToHash(meme.id));
  const rating = (hash % 5) + 1;
  const categoryIndex = hash % CATEGORIES.length;
  const category = CATEGORIES[categoryIndex];
  const price = rating * 25;

  return {
    ...meme,
    rating,
    category,
    price
  };
};