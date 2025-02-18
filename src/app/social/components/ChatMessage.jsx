export default function ChatMessage({ message, user, isOwnMessage }) {
  return (
    <div
      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isOwnMessage ? 'bg-blue-500 text-white' : 'bg-gray-200'
        }`}
      >
        <p className='font-bold'>{user.name}</p>
        <p>{message}</p>
      </div>
    </div>
  );
}
