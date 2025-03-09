import React, { useState, useEffect } from "react";
import EntryDetails from "../components/EntryDetails";
import { connectSocket, handleSubscription } from "../utils/websocket";

const OrderBook = () => {
  const [bids, setBids] = useState([]);
  const [asks, setAsks] = useState([]);
  const [lastSequence, setLastSequence] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState();

  useEffect(() => {
    const centrifuge = connectSocket({ setConnectionStatus });
    const sub = handleSubscription(
      centrifuge,
      "orderbook:BTC-USD",
      setBids,
      setAsks,
      setLastSequence,
      lastSequence
    );

    return () => {
      centrifuge.disconnect();
      sub.unsubscribe();
    };
  }, []);

  return (
    <div className="orderbook-container">
      <h2>Orderbook - BTC/USD</h2>
      {connectionStatus === "connected" ? (
        <div className="orderbook">
          <div className="asks">
            {asks.map(([price, amount], index) => (
              <EntryDetails type="ask" price={price} amount={amount} />
            ))}
          </div>

          <div className="bids">
            {bids.map(([price, amount], index) => (
              <EntryDetails type="bid" price={price} amount={amount} />
            ))}
          </div>
        </div>
      ) : connectionStatus === "disconnected" ? (
        "Connection lost! Trying again..."
      ) : (
        "Connecting..."
      )}
    </div>
  );
};

export default OrderBook;
