export const setLastOrder = (order) => {
  sessionStorage.setItem("lastOrder", JSON.stringify(order));
};

export const getLastOrder = () => {
  return JSON.parse(sessionStorage.getItem("lastOrder"));
};
