// hooks/useAudioPlayback.ts

import { useEffect, useRef, useState, useCallback } from 'react';

export function useAudioPlayback(audioFiles: string[]) {
    const audioRefs = useRef<HTMLAudioElement[]>([]);
    const [currentAudioIndex, setCurrentAudioIndex] = useState(0);

    useEffect(() => {
        audioRefs.current = audioFiles.map(file => {
            const audio = new Audio(file);
            audio.preload = 'auto';
            return audio;
        });

        // Cleanup function to remove audio elements when component unmounts
        return () => {
            audioRefs.current.forEach(audio => {
                audio.pause();
                audio.src = '';
            });
            audioRefs.current = [];
        };
    }, [audioFiles]);

    const initializeAudio = useCallback(() => {
        // This function can remain empty now as we're preloading in useEffect
    }, []);

    const playAudio = useCallback((index: number) => {
        const audio = audioRefs.current[index];
        if (audio) {
            audio.play().catch(error => console.error(`Failed to play audio ${index}:`, error));
        }
    }, []);

    const playInitialAudios = useCallback(() => {
        playAudio(0);
        audioRefs.current[0].onended = () => {
            playAudio(1);
            setCurrentAudioIndex(2);
        };
    }, [playAudio]);

    const playNextAudio = useCallback(() => {
        if (currentAudioIndex < audioFiles.length) {
            playAudio(currentAudioIndex);
            setCurrentAudioIndex(prevIndex => prevIndex + 1);
        }
    }, [currentAudioIndex, audioFiles.length, playAudio]);

    return { initializeAudio, playInitialAudios, playNextAudio };
}
