/**
 * BookingStore — global state for the 3-step quote request funnel.
 *
 * State flows:  step 1 (vehicle) → step 2 (contact) → step 3 (confirmation)
 * Persistence:  sessionStorage (key: "qf_booking") — survives page refresh, cleared on tab close
 * Session ID:   generated once per tab, stored in sessionStorage as "qf_session_id"
 *
 * To access state anywhere inside the funnel:
 *   const { state, dispatch, goToStep, sessionId } = useBooking();
 */
"use client";

import React, { createContext, useContext, useReducer, useEffect, useCallback } from "react";
import type { BookingState } from "@/types";
import { generateSessionId } from "@/lib/utils";
import { getStoredAttribution } from "@/lib/attribution";

type Action =
  | { type: "SET_STEP"; step: BookingState["step"] }
  | { type: "SET_VEHICLE"; year: number; make: string; model: string; glassType: "front" | "rear" }
  | { type: "SET_CONTACT"; customerName: string; customerPhone: string; customerEmail?: string }
  | { type: "SET_REFERENCE"; referenceId: string }
  | { type: "SET_SESSION"; sessionId: string };

const initialState: BookingState = { step: 1 };

function reducer(state: BookingState, action: Action): BookingState {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, step: action.step };
    case "SET_VEHICLE":
      return {
        ...state,
        vehicleYear: action.year,
        vehicleMake: action.make,
        vehicleModel: action.model,
        glassType: action.glassType,
      };
    case "SET_CONTACT":
      return {
        ...state,
        customerName: action.customerName,
        customerPhone: action.customerPhone,
        customerEmail: action.customerEmail,
      };
    case "SET_REFERENCE":
      return { ...state, referenceId: action.referenceId };
    case "SET_SESSION":
      return { ...state };
    default:
      return state;
  }
}

interface BookingContextValue {
  state: BookingState;
  sessionId: string;
  dispatch: React.Dispatch<Action>;
  goToStep: (step: BookingState["step"]) => void;
}

const BookingContext = createContext<BookingContextValue | null>(null);

const STORAGE_KEY = "qf_booking";

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState, (): BookingState => {
    if (typeof window === "undefined") return initialState;
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as BookingState;
        // Always start at step 1 on fresh load
        return { ...parsed, step: 1 };
      }
    } catch {
      // ignore
    }
    return initialState;
  });

  const [sessionId, setSessionId] = React.useState<string>("");

  useEffect(() => {
    let sid = sessionStorage.getItem("qf_session_id");
    if (!sid) {
      sid = generateSessionId();
      sessionStorage.setItem("qf_session_id", sid);
    }
    setSessionId(sid);

    // Capture attribution on mount
    const params = new URLSearchParams(window.location.search);
    const { captureAttribution } = require("@/lib/attribution");
    captureAttribution(params);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state]);

  const goToStep = useCallback((step: BookingState["step"]) => {
    dispatch({ type: "SET_STEP", step });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <BookingContext.Provider value={{ state, sessionId, dispatch, goToStep }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
}
