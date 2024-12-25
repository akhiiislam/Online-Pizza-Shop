import React, { useState, useEffect } from "react";
import Pizza from "./Pizza";

export default function Menu() {
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [newPizza, setNewPizza] = useState({
    name: "",
    ingredients: "",
    price: "",
    photoName: "",
    soldOut: false,
  });

  useEffect(() => {
    fetchPizzas();
    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setIsAdmin(payload.isAdmin);
    }
  }, []);

  const fetchPizzas = async () => {
    try {
      const response = await fetch("http://localhost:5000/pizza");
      if (!response.ok) throw new Error("Failed to fetch pizzas");
      const data = await response.json();
      setPizzas(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPizza = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/pizza", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newPizza),
      });
      if (!response.ok) throw new Error("Failed to add pizza");
      await fetchPizzas();
      setNewPizza({
        name: "",
        ingredients: "",
        price: "",
        photoName: "",
        soldOut: false,
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeletePizza = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/pizza/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to delete pizza");
      await fetchPizzas();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="menu">Loading...</div>;
  if (error) return <div className="menu">Error: {error}</div>;

  return (
    <main className="menu">
      <h2>Our Menu</h2>
      {pizzas.length > 0 ? (
        <>
          <p>
            Authentic Italian cuisine & creative dishes from. All from our stone
            oven. All organic, all delicious
          </p>
          <ul className="pizzas">
            {pizzas.map((pizza) => (
              <Pizza
                key={pizza.id}
                pizzaObj={pizza}
                onDelete={isAdmin ? handleDeletePizza : null}
              />
            ))}
          </ul>
        </>
      ) : (
        <p>We are still working on Our Menu. Please Come Back Later</p>
      )}

      {isAdmin && (
        <div className="add-pizza-form">
          <h3>Add New Pizza</h3>
          <form onSubmit={handleAddPizza}>
            <div>
              <label>Name:</label>
              <input
                type="text"
                value={newPizza.name}
                onChange={(e) =>
                  setNewPizza({ ...newPizza, name: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label>Ingredients:</label>
              <input
                type="text"
                value={newPizza.ingredients}
                onChange={(e) =>
                  setNewPizza({ ...newPizza, ingredients: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label>Price:</label>
              <input
                type="number"
                value={newPizza.price}
                onChange={(e) =>
                  setNewPizza({
                    ...newPizza,
                    price: parseFloat(e.target.value),
                  })
                }
                required
              />
            </div>
            <div>
              <label>Photo Name:</label>
              <input
                type="text"
                value={newPizza.photoName}
                onChange={(e) =>
                  setNewPizza({ ...newPizza, photoName: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label>
                <input
                  type="checkbox"
                  checked={newPizza.soldOut}
                  onChange={(e) =>
                    setNewPizza({ ...newPizza, soldOut: e.target.checked })
                  }
                />
                Sold Out
              </label>
            </div>
            <button type="submit" className="btn">
              Add Pizza
            </button>
          </form>
        </div>
      )}
    </main>
  );
}
