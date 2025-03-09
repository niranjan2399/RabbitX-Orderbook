import { Centrifuge } from "centrifuge";
let retryDelay = 3000;

const mergeOrderbook = (existing, updates) => {
  const updatedMap = new Map(
    existing.map(([price, amount]) => [price, amount])
  );

  updates.forEach(([price, amount]) => {
    if (parseFloat(amount) === 0) {
      updatedMap.delete(price); // Remove entries with zero volume
    } else {
      updatedMap.set(price, amount); // Add or update
    }
  });

  return Array.from(updatedMap.entries()).sort(
    (a, b) => parseFloat(a[0]) - parseFloat(b[0])
  );
};

export const connectSocket = ({ setConnectionStatus }) => {
  const centrifuge = new Centrifuge(process.env.REACT_APP_SOCKET_URL, {
    token: process.env.REACT_APP_SOCKET_TOKEN,
  });

  centrifuge.connect();
  centrifuge.on("connecting", () => {
    setConnectionStatus("connecting");
  });
  centrifuge.on("connected", () => setConnectionStatus("connected"));

  centrifuge.on("disconnected", () => {
    setConnectionStatus("disconnected");

    const reconnect = () => {
      console.warn(`Reconnecting in ${retryDelay / 1000} seconds...`);

      setTimeout(() => {
        centrifuge.connect();
        retryDelay = Math.min(retryDelay * 2, 30000); // Max delay = 30 sec
      }, retryDelay);
    };

    reconnect();
  });

  return centrifuge;
};

export const handleSubscription = (
  centrifuge,
  channel,
  setBids,
  setAsks,
  setLastSequence,
  lastSequence
) => {
  const sub = centrifuge.newSubscription(channel);

  sub.on("publication", ({ data }) => {
    const { bids: newBids, asks: newAsks, sequence } = data;

    if (lastSequence && sequence !== lastSequence + 1) {
      console.warn("Sequence gap detected — resubscribing...");
      centrifuge.disconnect();
      connectSocket(); // Reconnect
      return;
    }

    setLastSequence(sequence);

    setBids((prevBids) => mergeOrderbook(prevBids, newBids));
    setAsks((prevAsks) => mergeOrderbook(prevAsks, newAsks));
  });

  sub.subscribe();
  return sub;
};
