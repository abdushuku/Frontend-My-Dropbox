/** @format */

import { configureStore } from "@reduxjs/toolkit";
import filesSlice from './config'
const store = configureStore({
  reducer: {
    files: filesSlice
  },
});

export default store;
