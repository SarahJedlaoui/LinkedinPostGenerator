import "../styles/globals.css";
import { ThemeProvider } from "next-themes";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';


const App = ({ Component, pageProps }) => {
  return (
    <ThemeProvider attribute="class" forcedTheme="light">
      <Component {...pageProps} />
    </ThemeProvider>
  );
};

export default App;
