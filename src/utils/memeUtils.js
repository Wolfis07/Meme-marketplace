// Tyto kategorie se používají v celé aplikaci
export const CATEGORIES = ["animals", "celebrities", "gaming", "school", "random"];

// Funkce pro převod ID na číslo (hash)
const stringToHash = (string) => {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
};

// Funkce, která přidá fiktivní data k memu
export const enrichMeme = (meme) => {
  // Zajistíme, že hash je kladné číslo
  const hash = Math.abs(stringToHash(meme.id));
  
  // Vypočítáme rating 1-5
  const rating = (hash % 5) + 1;
  
  // Vybereme kategorii deterministicky podle ID
  // (vždy stejná kategorie pro stejný obrázek)
  const categoryIndex = hash % CATEGORIES.length;
  const category = CATEGORIES[categoryIndex];
  
  // Vypočítáme cenu
  const price = rating * 25;

  return {
    ...meme,
    rating,
    category,
    price
  };
};