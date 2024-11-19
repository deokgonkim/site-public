export const setLastOrder = (order) => {
  sessionStorage.setItem("lastOrder", JSON.stringify(order));
};

export const getLastOrder = () => {
  return JSON.parse(sessionStorage.getItem("lastOrder"));
};

export const Header = () => {
  const nameOf = (index, str) => {
    if (index === 2) {
      return "breadcrumb.shop";
    } else {
      return "breadcrumb." + str;
    }
  };

  const b = [];
  const pathElements = window.location.pathname.split("/");
  for (let i = 2; i < pathElements.length; i++) {
    const currentPath = pathElements[i];
    const prevPath = pathElements[i - 1];
    let label = nameOf(i, pathElements[i]);
    let link = pathElements.slice(2, i + 1).join("/");
    if (currentPath === "payment" || currentPath === "callback") {
      continue;
    }
    if (prevPath === "payment") {
      label = "breadcrumb.payment";
    }
    b.push({
      label,
      link,
    });
  }
  return b;
};
