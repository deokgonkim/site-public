export const setLastOrder = (order) => {
  sessionStorage.setItem("lastOrder", JSON.stringify(order));
};

export const getLastOrder = () => {
  return JSON.parse(sessionStorage.getItem("lastOrder"));
};

export const Header = () => {
  const nameOf = (index, str) => {
    if (index == 2) {
      return "홈";
    } else {
      return "상세";
    }
  };

  const b = [
    {
      label: "Home",
      link: "/",
    },
  ];
  const pathElements = window.location.pathname.split("/");
  for (let i = 2; i < pathElements.length; i++) {
    b.push({
      label: nameOf(i, pathElements[i]),
      link: pathElements.slice(2, i + 1).join("/"),
    });
  }
  return b;
};
