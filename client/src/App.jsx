import { Provider } from "react-redux";
import { ThemeProviderWrapper } from "./context/ThemeContext";
import AppRoutes from "./Routing";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./redux/store";
import { SpinnerMd } from "./components/Spinner";

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<SpinnerMd />} persistor={persistor}>
        <ThemeProviderWrapper>
          <AppRoutes />
        </ThemeProviderWrapper>
      </PersistGate>
    </Provider>
  );
}

export default App;
