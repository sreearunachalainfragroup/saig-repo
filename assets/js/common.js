function initNavbarScroll() {
    const navbar = document.querySelector('.custom-navbar');
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

function loadNavbarAndFooter() {
    // Load Navbar
    const navbarContainer = document.getElementById('navbar');
    navbarContainer.innerHTML = '';
    fetch('navbar.html')
        .then(response => response.text())
        .then(data => {
            navbarContainer.innerHTML = data;
            initNavbarScroll();
            initDropdowns();

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
});


