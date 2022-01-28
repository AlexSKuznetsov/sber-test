import { QueueItem } from '../context/timerContex';
import { useMemo } from 'react';

type QueueProp = {
  queue: Array<QueueItem> | [];
};

export const Queue: React.FC<QueueProp> = ({ queue }) => {
  const values = useMemo(() => {
    const arr = queue.map((item: QueueItem) => {
      let val = [];
      val.push(item.timer);
      return val;
    }, []);
    return arr.join('\n');
  }, [queue]);

  return (
    <div>
      <p>Очередь</p>
      <textarea className='textArea' value={values} readOnly />
    </div>
  );
};
