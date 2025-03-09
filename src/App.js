import { Routes, Route } from "react-router-dom";
import OrderBook from "./containers/OrderBook";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<OrderBook />} />
      </Routes>
    </>
  );
}

export default App;
