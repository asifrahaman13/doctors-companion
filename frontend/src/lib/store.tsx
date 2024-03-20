import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "@reduxjs/toolkit";
import workSpaceHeaderSlice from "./features/workspace/workSpaceHeaderSlice";
import pollsSlice from "./features/dashboard/pollsSlice";
import historySlice from "./features/history/historySlice";
import allHistorySlice from "./features/history/allHistorySlice";

export default configureStore({
  reducer: {
    workspaceHeader: workSpaceHeaderSlice,
    polls: pollsSlice,
    history: historySlice,
    allHistory: allHistorySlice
  },
});

const rootReducer = combineReducers({
  workspaceHeader: workSpaceHeaderSlice,
  polls: pollsSlice,
  history: historySlice,
  allHistory: allHistorySlice
});

export type RootState = ReturnType<typeof rootReducer>;
