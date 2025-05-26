'use client';

export default function ClientOnlyTime({ timestamp }) {
  const time = new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return <p className='text-[10px] mt-1 text-right'>{time}</p>;
}
