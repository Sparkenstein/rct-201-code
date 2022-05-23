import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Link,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import "./App.css";
import { addProduct, setProducts } from "./Redux/actions";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    axios.get("http://localhost:8080/products").then(({ data }) => {
      dispatch(setProducts(data));
    });
  }, []);

  return (
    <div className="App">
      <Nav />
      <Routes>
        <Route path="/" element={<Body />}></Route>
        <Route path="/:id" element={<CardDetails />}>
          {" "}
        </Route>
        <Route path="checkout" element={<Checkout />}></Route>
      </Routes>
    </div>
  );
}

function CardDetails() {
  const { id } = useParams();
  const [data, setData] = useState({});
  useEffect(() => {
    axios.get(`http://localhost:8080/products/${id}`).then(({ data }) => {
      setData(data);
    });
  }, []);

  return (
    <div className="product">
      <span>
        <h4 className="detailsTitle">{data.product_name}</h4>
      </span>{" "}
      <img
        className="detailsImage"
        src="https://picsum.photos/600/400 "
        alt=""
      />
      <span className="detailsPrice">Price: ${data.price}</span>
      <span className="detailsPrice">{data.desc}</span>
      <div>
        <h5>Reviews:</h5>
        {data.reviews?.map((r) => (
          <div className="review">
            <span className="reviewBy">{r.by}</span>
            <span className="reviewDesc">{r.review}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Body() {
  const data = useSelector((store) => store.productsList);

  return (
    <div className="container" style={{ display: "flex", flexWrap: "wrap" }}>
      {data.map((d) => (
        <Card key={d.id} d={d} />
      ))}
    </div>
  );
}
function Checkout() {
  const cartIds = useSelector((state) => state.cartIds);
  const [data, setData] = useState([]);
  useEffect(() => {
    axios
      .get(
        `http://localhost:8080/products?${cartIds
          .map((e) => `id=${e}`)
          .join("&")}`,
        {}
      )
      .then(({ data }) => {
        setData(data);
      });
  }, []);
  if (cartIds.length < 1) {
    return <div className="emptyCart">Nothing in cart</div>;
  }

  return (
    <div style={{ padding: 10 }}>
      <h4>Checkout:</h4>
      <div className="checkoutWrapper">
        {data.map((i) => (
          <div className="checkoutItem">
            <span>{i.product_name}</span>
            <span>${i.price}</span>
          </div>
        ))}
      </div>
      <hr className="hr" />
      <div className="totalContainer">
        <span>Total:</span>
        <span className="total">{data.reduce((a, c) => a + c.price, 0)}</span>
      </div>
    </div>
  );
}

function Nav() {
  const location = useLocation();
  const cartCount = useSelector((store) => store.cartCount);
  const nav = useNavigate();

  return (
    <div className="nav">
      <span>
        <h3>
          <Link to={"/"}>Shopper</Link>
        </h3>
      </span>
      {location.pathname !== "/checkout" && (
        <div className="navCartStatus">
          Cart: <span className="navCartCount">{cartCount}</span>
          <button
            className="navCartCheckout"
            onClick={() => {
              nav("/checkout");
            }}
          >
            Checkout
          </button>
        </div>
      )}
    </div>
  );
}

function Card({ d }) {
  const dispatch = useDispatch();
  const cartIds = useSelector((state) => state.cartIds);

  return (
    <div className="item">
      <img src="https://picsum.photos/200/300" className="productImage" />
      <span>
        <Link className="productLink" to={`/${d.id}`}>
          {d.product_name}
        </Link>
      </span>
      <span className="productCategory">{d.category}</span>
      <span className="productPrice">${d.price}</span>
      <span className="productRating">Ratings: {d.rating}</span>
      {cartIds.includes(d.id) ? (
        "Item Already in cart"
      ) : (
        <button
          className="productAddtoCart"
          onClick={() => {
            dispatch(addProduct(d.id));
          }}
        >
          Add to cart
        </button>
      )}
    </div>
  );
}

export default App;
