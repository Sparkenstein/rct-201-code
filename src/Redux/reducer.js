import { ADD_PRODUCT, SET_PRODUCTS } from "./actions";

const init = {
  productsList: [],
  cartCount: 0,
  cartIds: [],
};

export const reducer = (state = init, { type, payload }) => {
  switch (type) {
    case SET_PRODUCTS:
      return { ...state, productsList: payload };
    case ADD_PRODUCT:
      return {
        ...state,
        cartCount: state.cartCount + 1,
        cartIds: [...state.cartIds, payload],
      };
    default:
      return state;
  }
};
