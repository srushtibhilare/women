import React, { useState, useEffect, useRef } from 'react';
import './Chatbot.css';
import womenright from './womenright.json';

const Chatbot = () => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastMessage, setLastMessage] = useState('');
  const speechRecognitionRef = useRef(null);
  const speechSynthesisRef = useRef(null);
  const [conversationContext, setConversationContext] = useState(null);
  const [categoryHelp, setCategoryHelp] = useState(null);

  useEffect(() => {
    speechSynthesisRef.current = window.speechSynthesis;

    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.trim();
        setLastMessage(transcript);
        setIsProcessing(true);
        setTimeout(() => {
          handleResponse(transcript);
          setIsProcessing(false);
        }, 500);
      };

      recognition.onerror = (event) => {
        console.error('Recognition error:', event.error);
        setIsListening(false);
        setIsProcessing(false);
        speak("Sorry, I didn't catch that. Could you please repeat?");
      };

      speechRecognitionRef.current = recognition;
    } else {
      console.warn('Speech recognition not supported');
      speak("This browser doesn't support voice recognition. Please use Chrome or Edge.");
    }

    return () => {
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop();
      }
    };
  }, []);

  const speak = (text, urgent = false) => {
    if (speechSynthesisRef.current.speaking) {
      speechSynthesisRef.current.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = urgent ? 1 : 0.9;
    utterance.pitch = urgent ? 1.1 : 1;
    utterance.lang = 'en-IN';
    speechSynthesisRef.current.speak(utterance);
  };

  const detectLegalCategories = (input) => {
    const lowerInput = input.toLowerCase();
    for (const category in womenright.categories) {
      if (womenright.categories[category].keywords.some(keyword => lowerInput.includes(keyword))) {
        return category;
      }
    }
    return null;
  };

  const getCategoryResponse = (category, input) => {
    const categoryData = womenright.categories[category];
    const relevantActs = womenright.acts.filter(act =>
      act.Category.replace('/', ' ').toLowerCase().includes(category.toLowerCase())
    );

    let responseData = {
      category,
      relevantActs,
      helpline: categoryData.helpline,
      immediateSteps: Array.isArray(categoryData.immediateSteps) ?
        categoryData.immediateSteps.join('. ') : '',
      legalProcess: categoryData.legalProcess || '',
      specificAdvice: ''
    };

    if (category === 'marriage') {
      const lowerInput = input.toLowerCase();
      if (lowerInput.includes('child marriage')) {
        responseData = {
          ...responseData,
          immediateSteps: categoryData.subCategories.childMarriage.immediateSteps.join('. '),
          legalProcess: categoryData.subCategories.childMarriage.legalProcess
        };
      } else if (lowerInput.includes('triple talaq')) {
        responseData = {
          ...responseData,
          immediateSteps: categoryData.subCategories.tripleTalaq.immediateSteps.join('. '),
          legalProcess: categoryData.subCategories.tripleTalaq.legalProcess
        };
      } else {
        responseData = {
          ...responseData,
          immediateSteps: categoryData.subCategories.general.immediateSteps.join('. '),
          legalProcess: categoryData.subCategories.general.legalProcess
        };
      }
    } else if (category === 'health') {
      const lowerInput = input.toLowerCase();
      if (lowerInput.includes('abortion') || lowerInput.includes('termination')) {
        responseData = {
          ...responseData,
          immediateSteps: categoryData.subCategories.abortion.immediateSteps.join('. '),
          legalProcess: categoryData.subCategories.abortion.legalProcess
        };
      } else if (lowerInput.includes('maternity')) {
        responseData = {
          ...responseData,
          immediateSteps: categoryData.subCategories.maternity.immediateSteps.join('. '),
          legalProcess: categoryData.subCategories.maternity.legalProcess
        };
      }
    }

    return responseData;
  };

  const handleResponse = (input) => {
    const lowerInput = input.toLowerCase();

    // Stop speech if user says to stop
    const stopKeywords = ['okay', 'ok', 'understand', 'stop', 'thank you', 'thanks', 'enough', 'i got it'];
    if (stopKeywords.some(keyword => lowerInput.includes(keyword))) {
      if (speechSynthesisRef.current.speaking) {
        speechSynthesisRef.current.cancel();
        speak("Okay, stopping.", true);
      }
      return;
    }

    const detectedCategory = detectLegalCategories(input);
    if (detectedCategory) {
      setConversationContext(detectedCategory);
      setCategoryHelp(detectedCategory);
      const categoryResponse = getCategoryResponse(detectedCategory, input);
      let response = `I understand you're asking about ${detectedCategory.replace(/([A-Z])/g, ' $1').toLowerCase()} issues. `;
      if (categoryResponse.relevantActs.length > 0) {
        response += `Relevant laws include: `;
        categoryResponse.relevantActs.forEach(act => {
          response += `${act["Act/Law"]} (${act.Year}) which addresses ${act.Problem}. Key provisions: ${act["Key Provisions"]}. `;
        });
      }
      response += `Immediate steps: ${categoryResponse.immediateSteps}. Legal process: ${categoryResponse.legalProcess}. For help, contact: ${categoryResponse.helpline}.`;
      speak(response, true);
      return;
    }

    const yearMatch = input.match(/\b(19|20)\d{2}\b/);
    if (yearMatch) {
      const year = yearMatch[0];
      setConversationContext(null);
      const matchedActs = womenright.acts.filter(act => act.Year.toString() === year);
      if (matchedActs.length > 0) {
        let response = `In ${year}, these laws were enacted: `;
        matchedActs.forEach((act) => {
          response += `${act["Act/Law"]}. It addresses ${act.Problem}. Key provisions: ${act["Key Provisions"]}. Current status: ${act.Status}. `;
        });
        speak(response);
      } else {
        speak(`No laws found for ${year}. Try between 1929-2025.`);
      }
      return;
    }

    const actMatch = womenright.acts.find(act => 
      input.toLowerCase().includes(act["Act/Law"].toLowerCase().split(' ')[0]) ||
      (act["Act/Law"].includes('(') && input.toLowerCase().includes(act["Act/Law"].toLowerCase().split('(')[1].replace(')', '')))
    );

    if (actMatch) {
      const response = `The ${actMatch["Act/Law"]} (${actMatch.Year}) addresses ${actMatch.Problem}. It provides ${actMatch["Key Provisions"]}. Current status: ${actMatch.Status}. More details: ${actMatch.Explanation}`;
      speak(response);
      return;
    }

    if (lowerInput.includes('list') || lowerInput.includes('all')) {
      const categories = [...new Set(womenright.acts.map(act => act.Category))];
      speak(`Available categories: ${categories.join(', ')}. Say a category name for specific help.`);
    } else if (lowerInput.includes('help') || lowerInput.includes('what can you do')) {
      speak("I can help with: domestic violence, dowry, workplace issues, property rights, marriage laws, health rights, and cyber crimes. Try saying 'I need help with dowry' or 'Explain POSH Act'.");
    } else if (lowerInput.includes('thank')) {
      speak("You're welcome. Stay safe and know your rights. I'm here if you need more help.");
    } else {
      speak("I didn't understand. You can mention a problem like 'dowry demands' or say a year like '2005' for laws. Say 'help' for options.");
    }
  };

  const toggleListening = () => {
    if (!speechRecognitionRef.current) return;
    if (isListening) {
      speechRecognitionRef.current.stop();
    } else {
      speechRecognitionRef.current.start();
    }
  };

  return (
    <div className="chatbot-wrapper">
      <div
        className={`blob ${isListening ? 'listening' : ''} ${categoryHelp ? 'category-' + categoryHelp : ''}`}
        onClick={toggleListening}
        title={isListening ? "Listening..." : "Click to speak"}
      >
        <p className="intro">AI <span className="name">Women's Rights</span></p>
        <p className="role">Legal <span className="tag">Protection</span></p>
        {isListening && <div className="pulse-ring"></div>}
        {isProcessing && (
          <div className="typing-indicator">
            <span></span><span></span><span></span>
          </div>
        )}
        {lastMessage && (
          <div className="last-message">
            <p>You said: {lastMessage}</p>
          </div>
        )}
        {categoryHelp && (
          <div className="category-help">
            <p>Helping with: {categoryHelp.replace(/([A-Z])/g, ' $1')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chatbot;