# Orderbook UI Component

This project implements a real-time orderbook UI component that synchronizes with WebSocket updates using the `centrifuge-js` SDK. It efficiently displays bids and asks with enhanced performance features and optimized data handling.

---

## 🚀 Approach Taken

1. **WebSocket Connection with `centrifuge-js` SDK**

   - Established a WebSocket connection using the `Centrifuge` SDK with JWT authentication.
   - Implemented automatic reconnection logic to ensure the system recovers gracefully from network issues.

2. **Data Structure Optimization**

   - `Map` was chosen for its ordered storage and faster `.get()`, `.set()` and `.delete()` operations, making it ideal for real-time orderbook updates.

3. **Orderbook Update Logic**

   - Implemented logic to merge incoming WebSocket data with the existing `bids` and `asks`.
   - Ensured updates respected the correct **sequence number** to handle lost or out-of-order packets.

4. **Rendering Logic**

   - Used `[...map].map()` to iterate over `bids` and `asks` for rendering.
   - Ensured data was sorted.

5. **UI Enhancements**

   - Added color-coded prices for better visibility (green for bids, red for asks).

---

## ⚠️ Challenges Faced

1. **WebSocket Duplication Issue**

   - Faced the warning `"Subscription to this channel already exists"` due to multiple subscriptions.
   - Resolved by ensuring the subscription logic runs only once and implementing a proper cleanup process.

2. **Incorrect Sequence Handling**

   - Some updates arrived with missing sequence numbers, requiring logic to discard outdated data and request a full snapshot if a significant gap occurred.

---

## 🔧 Possible Improvements

✅ **Batch Processing:** Instead of processing every individual update, group updates in batches for better performance.  
✅ **Virtualized List Rendering:** Implement a virtualized list (e.g., `react-window` or `react-virtualized`) to efficiently render large orderbook data.
✅ **Enhanced Error Handling:** Add UI indicators for connection issues, data gaps, or corrupted data.
✅ **Better UI:** Limiting no. of bids and asks rendered.

---
