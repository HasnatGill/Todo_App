import React,{useContext} from 'react';
// import AuthContextPovider from './context/AuthContext';
import './App.scss';
import Routes from './pages/Routes'
import '../node_modules/bootstrap/dist/js/bootstrap.bundle'
import ReactGA from "react-ga4";
import ScreenLoader from './component/ScreenLoader';
import { AuthContext } from './context/AuthContext';

ReactGA.initialize("G-WENWWJCX8W");


function App() {

  const { isAppLoading } = useContext(AuthContext)

  if (isAppLoading)
    return <ScreenLoader />

  return (
    <Routes />
  );
}

export default App;
