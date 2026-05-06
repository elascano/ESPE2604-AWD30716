import React, { useEffect, useState } from 'react';
import { supabase } from './supabase';

export function CreateTbody() {
  const [supplies, setSupplies] = useState([]);

  useEffect(() => {
    const getSupplies = async () => {
      const { data } = await supabase.from('Supply').select('*');
      setSupplies(data || []);
    };
    getSupplies();
  }, []);

  return (
    <>
      {supplies.map((item) => (
        <tr key={item.supplyId}>
          <td>{item.supplyId}</td>
          <td>{item.name}</td>
          <td>{item.quantity}</td>
          <td>{item.unitCost}</td>
          <td>{new Date(item.orderDate).toLocaleDateString()}</td>
          <td>{new Date(item.expirationDate).toLocaleDateString()}</td>
          <td>{item.status}</td>
        </tr>
      ))}
    </>
  );
}