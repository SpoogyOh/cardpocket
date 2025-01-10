import  { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase'; // Adjust path as needed


export default function CardActions({ cardId, initialQuantity = 0, userId }) {
  const [quantity, setQuantity] = useState(initialQuantity);

  useEffect(() => {
    // You might fetch the initial quantity here if you didn't pass it as a prop
    // Or, you can rely on the initialQuantity prop
  }, [cardId, userId]);

  const handleAddCard = async () => {
    if (!userId) {
      alert('Please log in to track your collection.');
      return;
    }
    try {
      const { error } = await supabase
        .from('user_cards')
        .upsert(
          { user_id: userId, card_id: cardId, quantity: quantity + 1 },
          { onConflict: ['user_id', 'card_id'] }
        );
      if (error) {
        console.error('Error adding card:', error);
      } else {
        setQuantity(quantity + 1);
      }
    } catch (error) {
      console.error('Unexpected error adding card:', error);
    }
  };

  const handleRemoveCard = async () => {
    if (!userId) return;
    if (quantity === 0) return;

    try {
      const newQuantity = quantity - 1;
      if (newQuantity === 0) {
        const { error } = await supabase
          .from('user_cards')
          .delete()
          .eq('user_id', userId)
          .eq('card_id', cardId);
        if (error) {
          console.error('Error removing card:', error);
        } else {
          setQuantity(0);
        }
      } else {
        const { error } = await supabase
          .from('user_cards')
          .update({ quantity: newQuantity })
          .eq('user_id', userId)
          .eq('card_id', cardId);
        if (error) {
          console.error('Error updating quantity:', error);
        } else {
          setQuantity(newQuantity);
        }
      }
    } catch (error) {
      console.error('Unexpected error removing card:', error);
    }
  };

  return (
    <div className="collection-actions">
      <button onClick={handleAddCard}>Add</button>
      <span>Owned: {quantity}</span>
      <button onClick={handleRemoveCard}>Remove</button>
    </div>
  );
}