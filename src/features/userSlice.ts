import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "../store/store";
import { User } from "../types/userTypes";

interface UserState {
  users: User[];
  currentPage: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  currentPage: 1,
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    fetchUsersStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    fetchUsersSuccess(state, action: PayloadAction<{ results: User[] }>) {
      state.isLoading = false;
      state.users = action.payload.results;
    },
    fetchUsersFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
  },
});

export const {
  fetchUsersStart,
  fetchUsersSuccess,
  fetchUsersFailure,
  setCurrentPage,
} = userSlice.actions;

export default userSlice.reducer;

export const fetchUsers =
  (page: number): AppThunk =>
  async (dispatch) => {
    dispatch(fetchUsersStart());
    try {
      const response = await fetch(
        `https://randomuser.me/api?page=${page}&results=10`
      );
      const data = await response.json();
      dispatch(fetchUsersSuccess({ results: data.results }));
    } catch (error: any) {
      dispatch(fetchUsersFailure(error.message));
    }
  };
