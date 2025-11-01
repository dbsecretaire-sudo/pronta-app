// app/components/MessageList.tsx
import { Message } from './types';

interface MessageListProps {
  messages: Message[];
}

export const MessageList = ({ messages }: MessageListProps) => (
  <div className="divide-y divide-gray-200">
    {messages.slice(0, 3).map((message) => (
      <div key={message.id} className={`py-4 ${!message.isRead ? 'bg-blue-50' : ''}`}>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">{message.title}</h3>
            <p className="text-gray-600 text-sm mt-1 line-clamp-2">{message.content}</p>
          </div>
          <div className="text-xs text-gray-500 ml-4">
            {new Date(message.date).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </div>
        </div>
      </div>
    ))}
  </div>
);
