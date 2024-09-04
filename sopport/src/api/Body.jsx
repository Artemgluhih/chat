import React, { useEffect, useState, useRef } from "react";
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const SupportChat = ({ selectedDialog }) => {
    const [message, setMessage] = useState([]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        socket.on('message', (message) => {
            setMessage((prevMessage) => [...prevMessage, message]);
        });

        return () => {
            socket.off('message');
        };
    }, []);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [message]);

    useEffect(() => {
        setMessage([]); // Очищаем чат при выборе нового диалога
    }, [selectedDialog]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim() === '') return;

        const newMessage = {
            text: input,
            timestamp: new Date().toISOString(),
            sender: 'Поддержка',
        };

        socket.emit('sendMessage', newMessage);
        setInput('');
    };

    return (
        <div className="flex flex-col h-screen">
            <div className="flex-1 overflow-y-auto bg-gray-300" style={{ height: 'calc(100% - 60px)', padding: '10px' }}>
                {message.map((msg, index) => {
                    const isClientMessage = msg.sender === 'Поддержка';
                    const initials = "ИФ";

                    return (
                        <div
                            key={index}
                            className={`message-wrapper flex items-center mb-2`}
                        >
                            <div
                                className={`flex-shrink-0 w-8 h-8 text-white rounded-full flex items-center justify-center mr-2 ${isClientMessage ? 'bg-blue-400' : 'bg-gray-400'}`}
                            >
                                {initials}
                            </div>
                            <div
                                className={` message-item overflow-hidden whitespace-normal break-words p-2 rounded-lg ${isClientMessage ? 'bg-blue-400 text-white' : 'bg-gray-200 text-black'}`}
                                style={{ maxWidth: '70%' }}
                            >
                                <div>
                                    <strong></strong> {msg.text}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="flex items-center">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 p-2 h-12 overflow-hidden break-words focus:outline-none"
                    placeholder="Написать сообщение..."
                />
                <button
                    type="submit"
                    className={`p-2 flex items-center justify-center ${!input.trim() ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    disabled={!input.trim()}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`w-8 h-8 ${input.trim() ? 'text-blue-500' : 'text-gray-500'}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" fillRule="evenodd" clipRule="evenodd" d="M18.9486 6.31625C19.0739 5.94037 18.9655 5.52597 18.6721 5.25964C18.3788 4.99331 17.9559 4.92529 17.5938 5.08621L4.92082 10.7187C3.61718 11.298 3.78221 13.1986 5.16622 13.5446L7.2927 14.0762C7.9053 14.2294 8.55425 14.0842 9.04323 13.6847L14.4913 9.23314C14.6777 9.08084 14.9248 9.32698 14.7732 9.51396L10.7598 14.4648C10.2656 15.0744 10.1736 15.9168 10.5246 16.6187L11.899 19.3676C12.4967 20.5628 14.2411 20.4389 14.6637 19.1711L18.9486 6.31625Z" />
                    </svg>
                </button>
            </form>
        </div>
    );
};

const Body = () => {
    const [selectedDialog, setSelectedDialog] = useState(null);
    const dialogs = [
        { id: 1, name: 'Имя Фамилия', initials: 'ИФ', lastMessage: 'Сообщение и что с ним происходит, если оно не влезло сообщений' },
        { id: 2, name: 'Имя Фамилия', initials: 'ИФ', lastMessage: 'Сообщение и что с ним происходит, если оно не влезло сообщений' },
        { id: 3, name: 'Имя Фамилия', initials: 'ИФ', lastMessage: 'Сообщение и что с ним происходит, если оно не влезло сообщений' },
        { id: 4, name: 'Имя Фамилия', initials: 'ИФ', lastMessage: 'Сообщение и что с ним происходит, если оно не влезло сообщений' },
        { id: 5, name: 'Имя Фамилия', initials: 'ИФ', lastMessage: 'Сообщение и что с ним происходит, если оно не влезло сообщений' },
        { id: 6, name: 'Имя Фамилия', initials: 'ИФ', lastMessage: 'Сообщение и что с ним происходит, если оно не влезло сообщений' },
        { id: 7, name: 'Имя Фамилия', initials: 'ИФ', lastMessage: 'Сообщение и что с ним происходит, если оно не влезло сообщений' },
        { id: 8, name: 'Имя Фамилия', initials: 'ИФ', lastMessage: 'Сообщение и что с ним происходит, если оно не влезло сообщений' },
        { id: 9, name: 'Имя Фамилия', initials: 'ИФ', lastMessage: 'Сообщение и что с ним происходит, если оно не влезло сообщений' },
        { id: 10, name: 'Имя Фамилия', initials: 'ИФ', lastMessage: 'Сообщение и что с ним происходит, если оно не влезло сообщений' },
        { id: 11, name: 'Имя Фамилия', initials: 'ИФ', lastMessage: 'Сообщение и что с ним происходит, если оно не влезло сообщений' },

    ];

    useEffect(() => {
        const handleNewMessage = (msg) => {
            setDialogs((prevDialogs) => prevDialogs.map((dialog) => 
                dialog.id === msg.dialogId
                    ? { ...dialog, lastMessage: msg.text }
                    : dialog
            ));
        };

        socket.on('message', handleNewMessage);

        return () => {
            socket.off('message', handleNewMessage);
        };
    }, []);

    return (
        <div className="flex h-screen">
            <div className="flex-1 w-[360px] bg-gray-200 ">
                <div className="p-4 ">
                    {dialogs.map((dialog) => (
                        <div
                            key={dialog.id}
                            onClick={() => setSelectedDialog(dialog.id)}
                            className={`flex items-center p-4 mb-2 rounded-lg cursor-pointer transition-colors duration-300 ${
                                selectedDialog === dialog.id
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white text-black hover:bg-gray-300'
                            }`}
                        >
                            <div
                                className="flex-shrink-0 w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center mr-2"
                                style={{ backgroundColor: '#6b7280' }}
                            >
                                {dialog.initials}
                            </div>
                            <div className="flex-1 truncate">
                                <div className="">{dialog.name}</div>
                                <div className="text-gray-600 text-sm ">{dialog.lastMessage}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex-1 w-5/6">
                {selectedDialog ? (
                    <SupportChat selectedDialog={selectedDialog} />
                ) : (
                    <div className="flex items-center justify-center h-full text-xl">
                        Выберите диалог для начала общения
                    </div>
                )}
            </div>
        </div>
    );
};

export default Body;
