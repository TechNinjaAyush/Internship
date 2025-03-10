import { createSlice } from "@reduxjs/toolkit";

const POSITION_STATES = ["start", "mid", "end"];
const POSITION_VALUES = { start: 0, mid: 50, end: 100 };

const loadSavedState = () => {
  const savedState = localStorage.getItem("sliderPositions");
  return savedState ? JSON.parse(savedState) : POSITION_STATES.map(() => "start");
};

const loadConnections = () => {
  return JSON.parse(localStorage.getItem("connectedPairs")) || { "0-1": false, "0-2": false, "1-2": false };
};

const counterSlice = createSlice({
  name: "counter",
  initialState: {
    positions: loadSavedState(),
    connectedPairs: loadConnections(),
  },
  reducers: {
    nextPosition: (state, action) => {
      const index = action.payload;
      const currentPos = state.positions[index];
      const nextIndex = (POSITION_STATES.indexOf(currentPos) + 1) % POSITION_STATES.length;
      const newPos = POSITION_STATES[nextIndex];

      // Find sliders that are still connected
      const slidersToUpdate = new Set([index]);

      Object.entries(state.connectedPairs).forEach(([pair, isConnected]) => {
        if (isConnected) {
          const [a, b] = pair.split("-").map(Number);
          if (slidersToUpdate.has(a)) slidersToUpdate.add(b);
          if (slidersToUpdate.has(b)) slidersToUpdate.add(a);
        }
      });

      // **Fix: Ensure only currently linked sliders move together**
      slidersToUpdate.forEach((i) => {
        if (i === index || Object.values(state.connectedPairs).some(Boolean)) {
          state.positions[i] = newPos;
        }
      });

      localStorage.setItem("sliderPositions", JSON.stringify(state.positions));
    },

    toggleConnection: (state, action) => {
      const pairKey = action.payload;

      // Fix: If unlinking, ensure sliders no longer move together
      if (state.connectedPairs[pairKey]) {
        state.connectedPairs[pairKey] = false;
      } else {
        state.connectedPairs[pairKey] = true;
      }

      localStorage.setItem("connectedPairs", JSON.stringify(state.connectedPairs));
    },
  },
});

export const { nextPosition, toggleConnection } = counterSlice.actions;
export const selectPosition = (state) => state.counter.positions.map(pos => POSITION_VALUES[pos]);
export const selectConnectedPairs = (state) => state.counter.connectedPairs;
export default counterSlice.reducer;
