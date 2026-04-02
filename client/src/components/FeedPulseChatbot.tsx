import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';

declare const puter: any;

const FeedPulseChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
        { role: 'ai', text: 'Hi! I am the FeedPulse AI assistant. How can I help you today?' }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const newMessages = [...messages, { role: 'user', text: input } as { role: 'user' | 'ai', text: string }];
        setMessages(newMessages);
        setInput('');
        setIsTyping(true);

        try {
            const aiResponse = await puter.ai.chat(
                `You are a helpful customer support assistant for a web app called FeedPulse (a smart feedback analytics platform). CRITICAL RULE: You MUST keep your answers EXTREMELY short and concise. You MUST format your response using brief bullet points. Do not write long paragraphs.\nUser: ${input}`
            );

            setMessages([...newMessages, { role: 'ai', text: aiResponse.message.content }]);
        } catch (error) {
            console.error("Chatbot Error:", error);
            setMessages([...newMessages, { role: 'ai', text: "Sorry, I'm offline right now. Please try again later." }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {isOpen ? (
                <div className="bg-background border rounded-2xl shadow-xl w-80 sm:w-96 h-[500px] flex flex-col mb-4 overflow-hidden animate-in slide-in-from-bottom-5">
                    {/* Header */}
                    <div className="bg-primary text-primary-foreground p-4 flex justify-between items-center">
                        <div className="font-semibold flex items-center gap-2 font-display">
                            <MessageSquare className="w-5 h-5" />
                            FeedPulse AI
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-primary-foreground/80 hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.role === 'user'
                                    ? 'bg-primary text-primary-foreground rounded-br-sm'
                                    : 'bg-muted text-foreground rounded-bl-sm'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-muted text-muted-foreground p-3 rounded-2xl rounded-bl-sm flex gap-1.5 items-center h-10 w-16 justify-center">
                                    <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce"></span>
                                    <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                                    <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-3 border-t bg-background flex gap-2">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                            className="flex-1 bg-muted border-0 focus:ring-1 ring-primary p-2 px-4 rounded-full text-sm outline-none"
                            placeholder="Ask me anything..."
                        />
                        <button
                            onClick={sendMessage}
                            disabled={!input.trim() || isTyping}
                            className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground p-2 rounded-full cursor-pointer transition-colors flex items-center justify-center w-10 h-10 shrink-0"
                        >
                            <Send className="w-4 h-4 ml-0.5" />
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105"
                >
                    <MessageSquare className="w-6 h-6" />
                </button>
            )}
        </div>
    );
};

export default FeedPulseChatbot;
