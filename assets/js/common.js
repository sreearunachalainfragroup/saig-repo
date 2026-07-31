function initNavbarScroll() {
    const navbar = document.querySelector('.custom-navbar');

    if (!navbar) return;

    window.addEventListener("scroll", function () {
        if (window.scrollY > 50) {
            navbar.classList.add("navbar-scrolled");
        } else {
            navbar.classList.remove("navbar-scrolled");
        }
    });
}

function initDropdowns() {
    const dropdownElements = document.querySelectorAll('.dropdown-toggle');
    dropdownElements.forEach(dropdown => {
        new bootstrap.Dropdown(dropdown);
    });
}

function initNavbarAutoClose() {
    const navbarCollapse = document.querySelector(".navbar-collapse");
    const navbarToggler = document.querySelector(".navbar-toggler");

    if (!navbarCollapse || !navbarToggler) return;

    const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
        toggle: false
    });

    // Close the main menu when clicking outside it
    document.addEventListener("click", function (e) {

        const clickedInsideMenu = navbarCollapse.contains(e.target);
        const clickedToggler = navbarToggler.contains(e.target);

        if (
            navbarCollapse.classList.contains("show") &&
            !clickedInsideMenu &&
            !clickedToggler
        ) {
            bsCollapse.hide();
        }
    });

    // Close only when an actual page link is clicked
    document
        .querySelectorAll(".navbar-nav .nav-link:not(.dropdown-toggle), .dropdown-item")
        .forEach(item => {

            item.addEventListener("click", function () {

                setTimeout(() => {
                    bsCollapse.hide();
                }, 100);
            });
        });

    // Close the menu when the page is scrolled
    window.addEventListener("scroll", function () {
        if (navbarCollapse.classList.contains("show")) {
            bsCollapse.hide();
        }
    }, { passive: true });
}

function loadNavbarAndFooter() {
    // Load Navbar
    const navbarContainer = document.getElementById('navbar');
    navbarContainer.innerHTML = '';
    fetch('navbar.html')
        .then(response => response.text())
        .then(data => {
            navbarContainer.innerHTML = data;
            initNavbarScroll();
            //initDropdowns();
            initNavbarAutoClose();
        });
    // Load Footer
    const footerContainer = document.getElementById('footer');
    footerContainer.innerHTML = '';
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            footerContainer.innerHTML = data;
        });

    // Load Videos (Home page only)
    if (
        document.getElementById("videosContainer") &&
        typeof loadVideos === "function"
    ) {
        loadVideos();
    }

    // Load Gallery
    if (
        document.getElementById("galleryLoading") &&
        typeof loadGallery === "function"
    ) {
        loadGallery();
    }

    // Load Projects (Home & Projects page)
    if (
        (
            document.getElementById("ongoingSection") ||
            document.getElementById("projectsPageContainer")
        ) &&
        typeof loadProjects === "function"
    ) {
        loadProjects();
    }

}

document.addEventListener("DOMContentLoaded", () => {
    loadNavbarAndFooter();
    const videoModal = document.getElementById("videoModal");
    if (videoModal) {
        videoModal.addEventListener("hidden.bs.modal", function () {
            document.getElementById("youtubePlayer").src = "";
        });
    }

    // Protect selected images
    document.querySelectorAll(".protected-image").forEach(img => {

        img.addEventListener("contextmenu", function (e) {
            e.preventDefault();
        });

        img.addEventListener("dragstart", function (e) {
            e.preventDefault();
        });

    });

});


