export interface Set {
  code: string;
  name: string;
  game_id: string;
  // ... other properties of your 'sets' table
}

export interface BaseCard {
  number: string;
  name: string;
  type: string;
  set: string;
  // ... other properties of your 'base_cards' table
}

export interface Card {
  id: number; 
  version: string;
  rarity: string;
  img_url: string;
  base_number: string;
  base_cards?: BaseCard; // Use the BaseCard interface
  // ... other properties of your 'cards' table
}