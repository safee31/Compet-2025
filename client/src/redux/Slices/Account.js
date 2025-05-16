import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { employeeApi } from "../../apis/Employee/auth";
import { errorMessages } from "../../apis/messageHandler";

// Initial state
const initialState = {
  details: {},
  isOnboarded: false,
  isAuth: false,
  loading: false,
  error: null,
};

// Utility function to set authentication and onboarding state
const setAuthAndOnboarding = (state, account) => {
  const {
    // role,
    // user,
    // onboarding,
    isAuth = false,
    isOnboarded = false,
  } = account || {};
  // const isEmployeeORManager = role?.type === 3 || role?.type === 2;

  // state.isAuth = [1, 2, 3].includes(role?.type) && user ? true : false;

  // const userAnswers = onboarding.answers;
  // const employeeAnswers = Array.isArray(userAnswers) && userAnswers?.length > 0;
  // state.isOnboarded = isEmployeeORManager
  //   ? onboarding?.personalInfo &&
  //     onboarding?.workInfo &&
  //     onboarding?.forms &&
  //     employeeAnswers
  //     ? true
  //     : false
  //   : true;
  state.details = account;
  state.isOnboarded = isOnboarded;
  state.isAuth = isAuth;
  if (!state.isAuth) {
    state.error = "Role authentication failed. Please log in to continue.";
  } else if (!state.isOnboarded) {
    state.error =
      "Onboarding incomplete. Please fill out all required details.";
  } else {
    state.error = null;
  }
  return state;
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    // Set account data to state (modular function to avoid repetition)
    updateAccountOnbaording: (state, action) => {
      state.isOnboarded = action.payload.isOnboarded ? true : false;
      return state;
    },
    setAccountData: (state, action) => {
      return setAuthAndOnboarding(state, action.payload?.account);
    },
    resetAccountData: (state, action) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register employee
      .addCase(registerEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isAuth = false;
      })
      .addCase(registerEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuth = false;
        state.isOnboarded = false;
        state.error = null;
      })
      .addCase(registerEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuth = false;
      })

      // Login employee
      .addCase(loginEmployee.pending, (state) => {
        // state.loading = true;
        state.error = null;
        state.isAuth = false;
      })
      .addCase(loginEmployee.fulfilled, (state, action) => {
        state = setAuthAndOnboarding(state, action.payload.account);
        state.error = null;
        state.loading = false;
      })
      .addCase(loginEmployee.rejected, (state, action) => {
        state.error = action.payload;
        state.isAuth = false;
        state.loading = false;
      })

      // Authenticate employee
      .addCase(authenticateEmployee.pending, (state) => {
        state.loading = true;
        // state.isAuth = false;
      })
      .addCase(authenticateEmployee.fulfilled, (state, action) => {
        state = setAuthAndOnboarding(state, action.payload.account);
        state.loading = false;
        state.error = null;
      })
      .addCase(authenticateEmployee.rejected, (state, action) => {
        state.error = action?.payload;
        state.details = {};
        state.isAuth = false;
        state.loading = false;
      })

      // Logout employee
      .addCase(logoutEmployee.pending, (state) => {
        state.isAuth = false;
        state.loading = true;
      })
      .addCase(logoutEmployee.fulfilled, (state) => {
        state.details = {};
        state.error = null;
        state.isOnboarded = false;
        state.isAuth = false;
        state.loading = false;
      })
      .addCase(logoutEmployee.rejected, (state, action) => {
        state.error = action.payload;
        state.isAuth = state?.isAuth;
        state.loading = false;
      });
  },
});

// Thunks (register, login, authenticate, logout)
export const registerEmployee = createAsyncThunk(
  "account/registerEmployee",
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      const response = await dispatch(
        employeeApi.endpoints.registerEmployee.initiate(credentials)
      ).unwrap();
      return response?.data;
    } catch (error) {
      errorMessages(error);
      return rejectWithValue(error);
    }
  }
);

// Login Employee
export const loginEmployee = createAsyncThunk(
  "account/loginEmployee",
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      const response = await dispatch(
        employeeApi.endpoints.loginEmployee.initiate(credentials)
      ).unwrap();
      return response?.data;
    } catch (error) {
      errorMessages(error);
      return rejectWithValue(error);
    }
  }
);

// Authenticate Employee (after login, fetch account info)
export const authenticateEmployee = createAsyncThunk(
  "account/authenticateEmployee",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await dispatch(
        employeeApi.endpoints.readEmployee.initiate(
          {},
          {
            subscriptionOptions: {
              pollingInterval: 120000,
              refetchOnReconnect: true,
            },
          }
        )
      ).unwrap();
      return response;
    } catch (error) {
      errorMessages(error);
      dispatch(employeeApi.util.resetApiState());
      return rejectWithValue(error);
    }
  }
);

// Logout Employee
export const logoutEmployee = createAsyncThunk(
  "account/logoutEmployee",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await dispatch(
        employeeApi.endpoints.logoutEmployee.initiate({})
      ).unwrap();
      dispatch(employeeApi.util.resetApiState());
      return initialState;
    } catch (error) {
      errorMessages(error);
      return rejectWithValue(error);
    }
  }
);

export const { setAccountData, resetAccountData, updateAccountOnbaording } =
  accountSlice.actions;

export default accountSlice.reducer;
