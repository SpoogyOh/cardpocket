// src/components/CardActions.jsx
import React, { useState } from 'react';
import { supabase } from '../lib/supabase'; // Adjust path if needed

const CardActions = ({ cardId, initialQuantity, userId }) => {
  console.log("CardActions rendered with props:", { cardId, initialQuantity, userId });
  
  const [quantity, setQuantity] = useState(initialQuantity);
  const [isLoading, setIsLoading] = useState(false);

  const handleAdd = async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('user_cards')
        .upsert({ user_id: userId, card_id: cardId, quantity: quantity + 1 }, { onConflict: ['user_id', 'card_id'] });
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
        .upsert({ user_id: userId, card_id: cardId, quantity: newQuantity }, { onConflict: ['user_id', 'card_id'] });
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