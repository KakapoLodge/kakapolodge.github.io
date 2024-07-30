const main = () => {
  enableMenuButton();
};

const enableMenuButton = () => {
  const menuButton = document.getElementById("mobile-menu-button");
  const mainNav = document.getElementById("mobile-main-nav");
  const mainMenu = document.getElementById("mobile-main-menu");
  const bookDirectButton = document.getElementById("mobile-book-direct-button");

  if (menuButton) {
    closeMobileMenu(mainNav, mainMenu, bookDirectButton);

    menuButton.onclick = () =>
      toggleMobileMenu(menuButton, mainNav, mainMenu, bookDirectButton);
  }
};

const toggleMobileMenu = (menuButton, mainNav, mainMenu, bookDirectButton) => {
  menuButton.disabled = true;
  setTimeout(() => (menuButton.disabled = false), 1000);

  if (mainNav.style.height === "0px") {
    openMobileMenu(mainNav, mainMenu, bookDirectButton);
  } else {
    closeMobileMenu(mainNav, mainMenu, bookDirectButton);
  }
};

const openMobileMenu = (mainNav, mainMenu, bookDirectButton) => {
  mainNav.style.height = "200px";
  mainMenu.style.display = "flex";

  bookDirectButton.style.display = "flex";
  bookDirectButton.style.transition = "1.0s";
};

const closeMobileMenu = (mainNav, mainMenu, bookDirectButton) => {
  mainNav.style.height = "0px";
  mainMenu.style.display = "none";

  bookDirectButton.style.display = "none";
};

main(); // code is ran here
