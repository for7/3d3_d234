// eventBusTest.tsx
import React, { useEffect, useState } from 'react';
import { onEvent, emitEvent } from '@/common/eventBus';

export default function EventBusTest() {
    const [messList, setMessList] = useState<any[]>([]);
  useEffect(() => {
    const subscription = onEvent('myEvent', payload => {
      console.log('Received event:', payload.message);
      setMessList(prev => [...prev, payload]);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleClick = () => {
    emitEvent('myEvent', { message: `Hello from EventBusTest ${new Date().getTime()}` });
  };

  return (
    <div>
      <button onClick={handleClick}>Send Event</button>
      <ul>
        {messList.map((item, index) => (
          <li key={index}>{item.message}</li>
        ))}
      </ul>
    </div>
  );
}