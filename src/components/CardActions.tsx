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
      <p className="text-center text-xl">Owned: {quantity}</p>
      <div className='text-center'>
      <button className="text-xl border-black border-2 shadow-[2px_2px_0px_rgba(0,0,0,1)] bg-green-300 text-center w-1/2" onClick={handleAdd} disabled={isLoading}>
        Add
      </button>
    
      <button className="text-xl text-center border-black border-2 shadow-[2px_2px_0px_rgba(0,0,0,1)] bg-red-300 w-1/2"  onClick={handleRemove} disabled={isLoading || quantity === 0}>
        Remove
      </button>
      </div>
    </div>
  );
};

export default CardActions;