import { useState, useEffect, useCallback } from 'react';
import { useKowboyKit } from './useKowboyKit';

interface Message {
    text: string;
    sender: 'bot' | 'user';
}

interface ChatStep {
    message: string;
    waitForInput: boolean;
}

export function useChatLogic(initialSteps: ChatStep[]) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentStep, setCurrentStep] = useState(-1);
    const [isTyping, setIsTyping] = useState(false);
    const [showButtons, setShowButtons] = useState(false);
    const [showEngagingButtons, setShowEngagingButtons] = useState(false);
    const [showCallToAction, setShowCallToAction] = useState(false);
    const [timeLeft, setTimeLeft] = useState(300);
    const { trackEvent } = useKowboyKit();

    const addBotMessage = useCallback((text: string) => {
        setMessages((prev) => [...prev, { text, sender: 'bot' }]);
    }, []);

    const handleChatStep = useCallback(() => {
        if (currentStep >= 0 && currentStep < initialSteps.length) {
            setIsTyping(true);
            setTimeout(() => {
                const currentMessage = initialSteps[currentStep];
                addBotMessage(currentMessage.message);
                setIsTyping(false);

                if (currentStep === 2) {
                    setShowEngagingButtons(true);
                } else if (currentMessage.waitForInput) {
                    setShowButtons(true);
                } else if (currentStep < initialSteps.length - 1) {
                    const delay = 1000;
                    setTimeout(() => setCurrentStep((prev) => prev + 1), delay);
                }

                if (currentMessage.message.includes("Congratulations")) {
                    setShowCallToAction(true);
                }
            }, 1000);
        }
    }, [currentStep, initialSteps, addBotMessage]);

    useEffect(() => {
        if (currentStep >= 0 && currentStep < initialSteps.length) {
            handleChatStep();
        }
    }, [currentStep, handleChatStep, initialSteps.length]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (showCallToAction && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [showCallToAction, timeLeft]);

    const handleResponse = useCallback((response: string) => {
        setShowButtons(false);
        setShowEngagingButtons(false);
        setMessages((prev) => [...prev, { text: response, sender: 'user' }]);
        if (currentStep < initialSteps.length - 1) {
            setCurrentStep((prev) => prev + 1);
        }

        // Track KowboyKit events
        if (currentStep === 2) {
            trackEvent({ eventType: 'lead' });
        } else if (currentStep === 3) {
            trackEvent({ eventType: 'add_to_cart' });
        } else if (currentStep === 4) {
            trackEvent({ eventType: 'purchase', price: 18 });
        } else if (currentStep === 5) {
            trackEvent({ eventType: 'purchase', price: 60 });
        }
    }, [currentStep, initialSteps.length, trackEvent]);

    return {
        messages,
        isTyping,
        showButtons,
        showEngagingButtons,
        showCallToAction,
        timeLeft,
        handleResponse,
        setCurrentStep,
    };
}
