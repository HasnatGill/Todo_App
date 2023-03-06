import React from 'react';
import AuthContextPovider from './context/AuthContext';
import './App.scss';
import Routes from './pages/Routes'
import '../node_modules/bootstrap/dist/js/bootstrap.bundle'
import ReactGA from "react-ga4";

ReactGA.initialize("G-WENWWJCX8W");


function App() {

  // ReactGA.event({
  //   category: "APP",
  //   action: "VIEW",
  //   label: "APP PAGE",
  // });

  return (
    <AuthContextPovider>
      <Routes />
    </AuthContextPovider>
  );
}

export default App;
