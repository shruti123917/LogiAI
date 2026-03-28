import { Bot, SendHorizonal, User } from 'lucide-react';
import { useState } from 'react';

const quickPrompts = ['Where is my shipment?', 'Is my shipment approved?'];

const resolveResponse = (prompt, shipments) => {
  const latestShipment = shipments[0];

  if (!latestShipment) {
    return 'No shipment data is available yet. Add one to start tracking.';
  }

  if (prompt.toLowerCase().includes('where')) {
    return `${latestShipment.id} is currently ${latestShipment.status.toLowerCase()} from ${latestShipment.source} to ${latestShipment.destination}.`;
  }

  if (prompt.toLowerCase().includes('approved')) {
    return latestShipment.status === 'Approved'
      ? `${latestShipment.id} has been approved and is ready for dispatch.`
      : `${latestShipment.id} is currently marked as ${latestShipment.status}.`;
  }

  return 'I can help with shipment status, approvals, risk, and delay insights.';
};

const Chatbot = ({ shipments }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      text: 'Hello, I am your LogiAI assistant. Ask about shipment approvals, location, or risks.',
    },
  ]);
  const [input, setInput] = useState('');

  const submitPrompt = (promptText) => {
    if (!promptText.trim()) {
      return;
    }

    const userMessage = { id: Date.now(), role: 'user', text: promptText };
    const assistantMessage = {
      id: Date.now() + 1,
      role: 'assistant',
      text: resolveResponse(promptText, shipments),
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setInput('');
  };

  return (
    <div className="glass-panel flex h-full flex-col p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-display text-xl font-bold">LogiAI Assistant</h3>
          <p className="text-sm text-steel">Simulated chat support for shipment visibility.</p>
        </div>
        <div className="rounded-2xl bg-slate-950 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white">
          AI Chat
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {quickPrompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => submitPrompt(prompt)}
            className="rounded-full bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-950 hover:text-white"
          >
            {prompt}
          </button>
        ))}
      </div>

      <div className="mb-4 flex-1 space-y-3 overflow-y-auto rounded-3xl bg-slate-50/80 p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'assistant' && (
              <div className="mt-1 rounded-2xl bg-slate-950 p-2 text-white">
                <Bot size={16} />
              </div>
            )}
            <div
              className={`max-w-[85%] rounded-3xl px-4 py-3 text-sm font-medium ${
                message.role === 'user'
                  ? 'bg-signal text-white'
                  : 'bg-white text-slate-700 shadow-sm'
              }`}
            >
              {message.text}
            </div>
            {message.role === 'user' && (
              <div className="mt-1 rounded-2xl bg-slate-200 p-2 text-slate-700">
                <User size={16} />
              </div>
            )}
          </div>
        ))}
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          submitPrompt(input);
        }}
        className="flex gap-3"
      >
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask about status, approvals, or delays..."
          className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
        />
        <button
          type="submit"
          className="rounded-2xl bg-slate-950 px-4 py-3 text-white transition hover:opacity-90"
        >
          <SendHorizonal size={18} />
        </button>
      </form>
    </div>
  );
};

export default Chatbot;
