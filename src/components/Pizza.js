import React, { useState } from "react";

export default function Pizza({ pizzaObj, onDelete }) {
  const [ordering, setOrdering] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [orderError, setOrderError] = useState(null);

  const handleOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setOrderError("Please log in to place an order");
        return;
      }

      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = payload.id;

      const response = await fetch("http://localhost:5000/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          pizzaId: pizzaObj.id,
          quantity,
        }),
      });

      if (!response.ok) throw new Error("Failed to place order");

      setOrdering(false);
      setQuantity(1);
      alert("Order placed successfully!");
    } catch (err) {
      setOrderError(err.message);
    }
  };

  return (
    <li className={`pizza ${pizzaObj.soldOut ? "sold-out" : ""}`}>
      <img src={pizzaObj.photoName} alt={pizzaObj.name} />
      <div>
        <h3>{pizzaObj.name}</h3>
        <p>{pizzaObj.ingredients}</p>
        <span>{pizzaObj.soldOut ? "SOLD OUT" : `$${pizzaObj.price}`}</span>

        {!pizzaObj.soldOut && (
          <div className="order-section">
            {ordering ? (
              <div>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="quantity-input"
                />
                <button className="btn" onClick={handleOrder}>
                  Confirm Order
                </button>
                <button className="btn" onClick={() => setOrdering(false)}>
                  Cancel
                </button>
              </div>
            ) : (
              <button className="btn" onClick={() => setOrdering(true)}>
                Order Now
              </button>
            )}
          </div>
        )}

        {orderError && <p className="error">{orderError}</p>}

        {onDelete && (
          <button
            className="btn delete-btn"
            onClick={() => onDelete(pizzaObj.id)}
          >
            Delete Pizza
          </button>
        )}
      </div>
    </li>
  );
}
