import React, {useEffect, useState, useRef} from "react";
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import io from 'socket.io-client';
import PrevArrowImg from '../assets/prev.png';
import NextArrowImg from '../assets/next.png'



const socket = io('http://localhost:5000');


const PrevArro = ({ className, onClick }) => (
    <button
        className={`absolute top-1/2 left-4 transform -translate-y-1/2  p-2  ${className} w-10 h-10`}
        onClick={onClick}
        style={{background: `url(${PrevArrowImg}) no-repeat center center`, backgroundSize: `contain`,
        border: 'none',
        zIndex: 10}}
    >
    </button>
);

const NextArro = ({ className, onClick }) => (
    <button
        className={`absolute top-1/2 right-4 transform -translate-y-1/2  p-2  ${className} w-10 h-10` }
        onClick={onClick}
        style={{
            background: `url(${NextArrowImg}) no-repeat center center`, 
            backgroundSize: 'contain',
            border: 'none',
            zIndex: 10}}
    >
    </button>
);

const ImageSlider = () => {
    const[slides, setSlides] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/slides')
        .then(response => {
            if(!response.ok){
                throw new Error('Http error! Status: ' + response.status);
            }
            return response.json()
        })  
        .then(data => {
            setSlides(data);
        })
        .catch(error => {
            console.error('Error fething slides: ', error);
 
        });
    }, []);

    const setting = {
        infinity: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,  
        autoplaySpeed: 2000,
        prevArrow: <PrevArro />,
        nextArrow: <NextArro/>,
  
    };

    return (
        <div className="  w-full h-screen  top-1/2 " >
            <Slider {...setting}>
                {slides.map((slide, index) => {
                    return (
                        <div key={index} className="relative " >
                            <img 
                            src={slide.url} 
                            alt={`Slide ${index}`}
                            className="w-full h-screen object-cover object-center " 
                            
                            />
                        </div>
                    );
                })}
            </Slider>
        </div>
    );  
};

const SupporChat = () => {
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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim() === '') return;
    
        const newMessage = {
            text: input,
            sender: 'client', 
        };
    
        socket.emit('sendMessage', newMessage);
        setInput('');
    };

    return (
        <div className="flex flex-col h-screen">
            <div className="text-xl font-semibold my-4 ml-4">
                Чат с поддержкой
            </div>
            <div className="flex-1 overflow-y-auto bg-gray-300" style={{ height: 'calc(100% - 60px)', padding: '10px' }}>
            {message.map((msg, index) => {
                const isClientMessage = msg.sender === 'client'; 
                const initials = "ИФ";

                return (
                    <div
                        key={index}
                        className={`message-wrapper flex items-center mb-2 `}
                    >

                        {!isClientMessage && (
                            <div
                                className={`flex-shrink-0 w-8 h-8 text-white rounded-full flex items-center justify-center mr-2 ${isClientMessage ? 'bg-blue-400' : 'bg-gray-400'}`} 
                            >
                                {initials}
                            </div>
                        )}
                        {isClientMessage && (
                            <div
                                className="flex-shrink-0 w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center mr-2"
                                style={{ backgroundColor: '#3b82f6' }} 
                            >
                                {initials}
                            </div>
                        )}                
                        
                        <div
                            className={`message-item overflow-hidden whitespace-normal break-words p-2 rounded-lg ${isClientMessage ? 'bg-blue-400 text-white' : 'bg-gray-200 text-black'}`}
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

            
                <form onSubmit={handleSubmit} className="flex items-center ">
                    
                    <input 
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1 p-2  h-12 overflow-hidden  break-words focus:outline-none" 
                        placeholder="Написать сообщение..."
                    />
                    <button 
                        type="submit"
                        className={`p-2 flex items-center justify-center ${!input.trim() ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    disabled = {!input.trim()}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`w-8 h-8 ${input.trim() ? 'text-blue-500' : 'text-gray-500'}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                        >
                        <path strokeLinecap="round" strokeLinejoin="round"  fill-rule="evenodd" clip-rule="evenodd" d="M18.9486 6.31625C19.0739 5.94037 18.9655 5.52597 18.6721 5.25964C18.3788 4.99331 17.9559 4.92529 17.5938 5.08621L4.92082 10.7187C3.61718 11.298 3.78221 13.1986 5.16622 13.5446L7.2927 14.0762C7.9053 14.2294 8.55425 14.0842 9.04323 13.6847L14.4913 9.23314C14.6777 9.08084 14.9248 9.32698 14.7732 9.51396L10.7598 14.4648C10.2656 15.0744 10.1736 15.9168 10.5246 16.6187L11.899 19.3676C12.4967 20.5628 14.2411 20.4389 14.6637 19.1711L18.9486 6.31625Z"  />    
                    </svg>
                </button>
            </form>
        </div>
    );
};


const Body = () => {
    return (
        <div className="flex  h-screen">
            <div className="flex-2 w-2/3">
                <ImageSlider />
            </div>
            <div className="flex-1 w-1/3">
                <SupporChat />
            </div>
        </div>
    )
}

export default Body