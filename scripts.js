const main = () => {
  enableMenuButton();
};

const enableMenuButton = () => {
  const menuButton = document.getElementById("mobile-menu-button");
  const mainNav = document.getElementById("mobile-main-nav");
  const mainMenu = document.getElementById("mobile-main-menu");

  if (menuButton) {
    closeMobileMenu(mainNav, mainMenu);

    menuButton.onclick = () =>
      toggleMobileMenu(menuButton, mainNav, mainMenu);
  }
};

const toggleMobileMenu = (menuButton, mainNav, mainMenu) => {
  menuButton.disabled = true;
  setTimeout(() => (menuButton.disabled = false), 1000);

  if (mainNav.style.height === "0px") {
    openMobileMenu(mainNav, mainMenu);
  } else {
    closeMobileMenu(mainNav, mainMenu);
  }
};

const openMobileMenu = (mainNav, mainMenu) => {
  mainNav.style.height = "161px";
  mainMenu.style.display = "flex";
};

const closeMobileMenu = (mainNav, mainMenu) => {
  mainNav.style.height = "0px";
  mainMenu.style.display = "none";
};

main(); // code is ran here
