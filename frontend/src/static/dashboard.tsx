const navigation = [{ name: "Visits", href: "visits.svg", current: false }];

const user = {
  name: "John Doe",
  email: "tom@example.com",
  imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
};


const userNavigation = [{ name: "Profile", href: "#" },  { name: "Log out", href: "#" }];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export { navigation, userNavigation, classNames , user};
