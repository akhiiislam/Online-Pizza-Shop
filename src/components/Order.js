import React from "react";

export default function Order({ pizzas, currentTime }) {
  const numPizza = Array.isArray(pizzas) ? pizzas.length : 0;

  return numPizza > 0 ? (
    <footer className="footer">
      {currentTime > 10 && currentTime < 22 ? (
        <div className="order">
          <p>We are open until 22:00. Come visit us or order online!</p>
          <button className="btn">Order</button>
        </div>
      ) : (
        <div className="order">
          <p>
            Now it is {new Date().toLocaleString()}. The restaurant is closed.
            You can preorder.
          </p>
          <button className="btn">PreOrder</button>
        </div>
      )}

      {/* Display the pizzas */}
      <ul className="pizzas">
        {pizzas.map((pizza) => (
          <li
            key={pizza.id}
            className={`pizza ${pizza.soldOut ? "sold-out" : ""}`}
          >
            <img src={pizza.photoName} alt={pizza.name} />
            <h3>{pizza.name}</h3>
            <p>{pizza.ingredients}</p>
            <span>{pizza.soldOut ? "SOLD OUT" : `$${pizza.price}`}</span>
          </li>
        ))}
      </ul>
    </footer>
  ) : (
    <p>No pizzas available at the moment.</p>
  );
}

// export default function Order({pizzas, currentTime }) {

//   const pizzas = pizzaData;
//   const numPizza = pizzas.length;
//   return numPizza > 0 ? (
//     <footer className="footer">
//       {currentTime > 10.0 && currentTime < 22.0 ? (
//         <div className="order">
//           <p>we are open until 22.00. Come visit us or order Online</p>
//           <button className="btn">Order</button>
//         </div>
//       ) : (
//         <div className="order">
//           Now it is {new Date().toLocaleString()}. The restaurant is closed.You
//           can Preorder
//           <button className="btn">PreOrder</button>
//         </div>
//       )}
//     </footer>
//   ) : null;
// }
