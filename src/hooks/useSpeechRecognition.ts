"use client";

import { useState, useRef, useEffect, useCallback } from "react";

// ------------------------------------------------------------
// Web Speech API type declarations (not in standard TS lib)
// ------------------------------------------------------------

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent {
  error: string;
  message: string;
}

interface SpeechRecognitionInstance {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

// ------------------------------------------------------------
// Return type
// ------------------------------------------------------------

export interface UseSpeechRecognitionReturn {
  isSupported: boolean;
  isListening: boolean;
  transcript: string;
  finalTranscript: string;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

// ------------------------------------------------------------
// French error messages
// ------------------------------------------------------------

const ERROR_MESSAGES: Record<string, string> = {
  "not-allowed": "Autorisez l'acc\u00e8s au microphone dans les param\u00e8tres",
  "no-speech": "Aucune parole d\u00e9tect\u00e9e, r\u00e9essayez",
  "network": "Erreur r\u00e9seau, v\u00e9rifiez votre connexion",
};

const DEFAULT_ERROR_MESSAGE = "Erreur de reconnaissance vocale";

// ------------------------------------------------------------
// Helper: get the SpeechRecognition constructor (if available)
// ------------------------------------------------------------

function getSpeechRecognitionCtor(): (new () => SpeechRecognitionInstance) | null {
  if (typeof window === "undefined") return null;

  const w = window as unknown as Record<string, unknown>;
  const Ctor =
    (w.SpeechRecognition as new () => SpeechRecognitionInstance) ??
    (w.webkitSpeechRecognition as new () => SpeechRecognitionInstance) ??
    null;

  return Ctor ?? null;
}

// ------------------------------------------------------------
// Hook
// ------------------------------------------------------------

export function useSpeechRecognition(): UseSpeechRecognitionReturn {
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>("");
  const [finalTranscript, setFinalTranscript] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const accumulatedFinalRef = useRef<string>("");

  // ----------------------------------------------------------
  // Feature detection & instance creation (runs once on mount)
  // ----------------------------------------------------------

  useEffect(() => {
    const Ctor = getSpeechRecognitionCtor();

    if (!Ctor) {
      setIsSupported(false);
      return;
    }

    setIsSupported(true);

    const recognition = new Ctor();
    recognition.lang = "fr-FR";
    recognition.continuous = false;
    recognition.interimResults = true;

    // --- onresult ---
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimText = "";
      let finalText = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const text = result[0].transcript;

        if (result.isFinal) {
          finalText += text;
        } else {
          interimText += text;
        }
      }

      // Append any newly finalized text to the accumulated final
      if (finalText) {
        accumulatedFinalRef.current += finalText;
        setFinalTranscript(accumulatedFinalRef.current);
      }

      // Transcript always shows accumulated final + current interim
      setTranscript(accumulatedFinalRef.current + interimText);
    };

    // --- onerror ---
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      const message = ERROR_MESSAGES[event.error] ?? DEFAULT_ERROR_MESSAGE;
      setError(message);
      setIsListening(false);
    };

    // --- onend ---
    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    // Cleanup on unmount
    return () => {
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      try {
        recognition.abort();
      } catch {
        // Ignore — recognition may not be active
      }
      recognitionRef.current = null;
    };
  }, []);

  // ----------------------------------------------------------
  // startListening
  // ----------------------------------------------------------

  const startListening = useCallback(() => {
    const recognition = recognitionRef.current;

    if (!recognition) {
      setError(DEFAULT_ERROR_MESSAGE);
      return;
    }

    // Reset state before starting
    accumulatedFinalRef.current = "";
    setTranscript("");
    setFinalTranscript("");
    setError(null);

    try {
      recognition.start();
      setIsListening(true);
    } catch {
      // Can throw if already started or other browser issues
      setError(DEFAULT_ERROR_MESSAGE);
    }
  }, []);

  // ----------------------------------------------------------
  // stopListening
  // ----------------------------------------------------------

  const stopListening = useCallback(() => {
    const recognition = recognitionRef.current;

    if (recognition) {
      try {
        recognition.stop();
      } catch {
        // Ignore — recognition may not be active
      }
    }

    setIsListening(false);
  }, []);

  // ----------------------------------------------------------
  // resetTranscript
  // ----------------------------------------------------------

  const resetTranscript = useCallback(() => {
    accumulatedFinalRef.current = "";
    setTranscript("");
    setFinalTranscript("");
  }, []);

  return {
    isSupported,
    isListening,
    transcript,
    finalTranscript,
    error,
    startListening,
    stopListening,
    resetTranscript,
  };
}
