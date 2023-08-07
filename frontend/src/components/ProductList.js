import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ProductList = () => {
  const [products, setProducts] = useState(["hi"]);
  const accessToken = localStorage.getItem("access");
  let { username } = useParams();
  useEffect(() => {
    // Fetch data from the API after the component mounts
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/products/", {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include the access token in the request header
          },
        });
        const data = await response.json();
        setProducts(data.results); // Update the state with the fetched product data
      } catch (error) {
        console.error("Error fetching products: ", error);
      }
    };

    fetchProducts();
  }, [accessToken]); // Run the effect whenever the access token changes

  return (
    <div>
      <h2> {username} Product List</h2>
      {products && products.length > 0 ? (
        <div>
          {products.map((product) => (
            <div key={product.id}>
              <h3>{product.title}</h3>
              <p>Price: {product.price}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );  
};

export default ProductList;