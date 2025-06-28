import React, { useState } from 'react';
import './About.css';

const About = () => {
  // महिला हक्कांवरील माहिती डेटाबेस
  const knowledge_base = {
    "हक्क": [
      "महिलांना समानतेचा मूलभूत हक्क आहे. भारतीय संविधानाच्या कलम 14 नुसार सर्व नागरिकांना समानता हा मूलभूत हक्क आहे.",
      "महिलांना कामाच्या ठिकाणी लैंगिक छळापासून संरक्षण मिळावे हा हक्क आहे. कामाच्या ठिकाणी महिलांच्या लैंगिक छळाचा प्रतिबंध (POSH) कायदा, 2013 या कायद्याने हे सुनिश्चित केले आहे.",
      "महिलांना संपत्तीचा हक्क आहे. हिंदू उत्तराधिकार कायदा (2005 सुधारणा) नुसार मुलीला वडिलांच्या संपत्तीत मुलासारखाच हिस्सा मिळतो."
    ],
    "कायदे": [
      "दहेज प्रतिबंधक कायदा (1961) - दहेज देणे किंवा घेणे हे गुन्हा आहे.",
      "घटस्फोट विरोधी कायदा (2005) - बायकोची संमती न घेता घटस्फोट देणे बेकायदेशीर आहे.",
      "महिला विरुद्ध घरगुती हिंसाचार कायदा (2005) - घरातील कोणत्याही प्रकारच्या हिंसाचाराविरुद्ध महिलांना संरक्षण देते."
    ],
    "मदत": [
      "राष्ट्रीय महिला आयोग हेल्पलाइन: 7827170170",
      "महिला संकट सेवा: 1091 (24 तास)",
      "सर्वात जवळची पोलिस स्टेशन किंवा महिला सेल संपर्क करा."
    ]
  };

  // मराठी भाषेतील सलामी व प्रतिसाद
  const greetings = ["नमस्कार", "हॅलो", "नमस्ते", "कसा आहेस"];
  const farewells = ["धन्यवाद", "बाय", "पुन्हा भेटू", "निरोप"];
  const help_responses = ["मी तुम्हाला कशी मदत करू शकते?", "तुम्हाला कोणती माहिती हवी आहे?", "काय विचारता?"];

  const getRandomResponse = (responses) => {
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const getResponse = (user_input) => {
    user_input = user_input.toLowerCase();
    
    if (greetings.some(word => user_input.includes(word))) {
      return getRandomResponse([
        "नमस्कार! मी महिला हक्क बॉट आहे. तुम्हाला कशी मदत करू?", 
        "हॅलो! महिला हक्कांबद्दल माहिती घ्यायची आहे?"
      ]);
    }
    
    if (farewells.some(word => user_input.includes(word))) {
      return getRandomResponse([
        "पुन्हा भेटू! सुरक्षित रहा!", 
        "बाय! आणखी काही मदत हवी असेल तर विचारा."
      ]);
    }
    
    if (user_input.includes("हक्क")) {
      return getRandomResponse(knowledge_base["हक्क"]);
    }
    
    if (user_input.includes("कायदे") || user_input.includes("कायदा")) {
      return getRandomResponse(knowledge_base["कायदे"]);
    }
    
    if (user_input.includes("मदत") || user_input.includes("आपत्कालीन")) {
      return knowledge_base["मदत"].join("\n");
    }
    
    return getRandomResponse(help_responses);
  };

  const [messages, setMessages] = useState([
    { text: "महिला हक्क चॅटबॉट: नमस्कार! मी तुम्हाला महिला हक्क, कायदे आणि मदत याबद्दल माहिती देऊ शकते.", isUser: false }
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (inputValue.trim() === '') return;
    
    // Add user message
    setMessages(prev => [...prev, { text: inputValue, isUser: true }]);
    
    // Get and add bot response
    const response = getResponse(inputValue);
    setTimeout(() => {
      setMessages(prev => [...prev, { text: response, isUser: false }]);
    }, 500);
    
    setInputValue('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h2>महिला हक्क चॅटबॉट</h2>
      </div>
      
      <div className="chatbot-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.isUser ? 'user' : 'bot'}`}>
            {msg.text.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        ))}
      </div>
      
      <div className="chatbot-input">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="तुमचा प्रश्न टाइप करा..."
        />
        <button onClick={handleSend}>पाठवा</button>
      </div>
    </div>
  );
};

export default About;