// src/components/CardActions.tsx
import React, { useState } from 'react';
import { supabase } from '../lib/supabase'; // Import the client-side instance

interface CardActionsProps {
  cardId: string; // Or number, depending on your database schema
  initialQuantity: number;
  userId: string | null;
}

const CardActions: React.FC<CardActionsProps> = ({ cardId, initialQuantity, userId }) => {
  console.log("CardActions rendered with props:", { cardId, initialQuantity, userId });

  const [quantity, setQuantity] = useState(initialQuantity);
  const [isLoading, setIsLoading] = useState(false);

  const handleAdd = async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('user_cards')
        .upsert(
          { user_id: userId, card_id: cardId, quantity: quantity + 1 },
          { onConflict: 'user_id,card_id' } // Ensure this matches your DB constraint name
        );
      if (error) {
        console.error("Error adding card:", error);
        // Handle error (e.g., show a message)
      } else {
        setQuantity(quantity + 1);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const newQuantity = Math.max(0, quantity - 1);
      const { error } = await supabase
        .from('user_cards')
        .upsert(
          { user_id: userId, card_id: cardId, quantity: newQuantity },
          { onConflict: 'user_id,card_id' } // Ensure this matches your DB constraint name
        );
      if (error) {
        console.error("Error removing card:", error);
        // Handle error
      } else {
        setQuantity(newQuantity);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card-actions">
      <p>Owned: {quantity}</p>
      <button onClick={handleAdd} disabled={isLoading}>
        Add
      </button>
      <button onClick={handleRemove} disabled={isLoading || quantity === 0}>
        Remove
      </button>
    </div>
  );
};

export default CardActions;