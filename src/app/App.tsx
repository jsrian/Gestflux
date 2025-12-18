import "../presentation/styles/App.css";
import Home from "../presentation/pages/Home";
import Questionario from "@/presentation/pages/Questionario";
import Principal from "@/presentation/pages/Principal";

function App() {
  return (
    <>
      <Home />
      <Principal></Principal>
      <Questionario></Questionario>
    </>
  );
}

export default App;
