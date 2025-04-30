import "../styles/globals.css";
import { ThemeProvider } from "next-themes";

const App = ({ Component, pageProps }) => {
  return (
    <ThemeProvider attribute="class" forcedTheme="light">
      <Component {...pageProps} />
    </ThemeProvider>
  );
};

export default App;
