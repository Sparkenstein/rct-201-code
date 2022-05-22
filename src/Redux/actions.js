export const SET_PRODUCTS = "SET_PRODUCTS";
export const ADD_PRODUCT = "ADD_PRODUCT";

export const setProducts = (list) => {
  return {
    type: SET_PRODUCTS,
    payload: list,
  };
};

export const addProduct = (productId) => {
  return {
    type: ADD_PRODUCT,
    payload: productId,
  };
};
