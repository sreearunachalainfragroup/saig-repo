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
    if (document.getElementById("videosContainer")) {
        loadVideos();
    }

    // Load Gallery Image Full Screen
    const imageModal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    if (imageModal && modalImage) {
        const galleryImages = document.querySelectorAll('.gallery-img');
        galleryImages.forEach(function (img) {
            img.addEventListener('click', function () {
                const src = img.getAttribute('data-bs-src');
                modalImage.src = src;
            });
        });
    }
}

const VIDEO_API = "https://script.google.com/macros/s/AKfycbwTbZPfYIWFNReB065yt4HbpwxII6u4JDvgkz7Hb0tFmnDp8hiEC9xexLP0kHuFhBRwrw/exec";

async function loadVideos() {

    console.log("Loading videos...");

    try {

        const response = await fetch(VIDEO_API + "?action=videos");
        const text = await response.text();
        console.log(text);

        const data = JSON.parse(text);
        let videos = data.videos;

        const container = document.getElementById("videosContainer");
        if (!container) return;

        // Read project from URL
        const project = getProjectFromUrl();

        // Update page heading
        // Update page heading
        if (project) {

            // Browser tab title
            document.title = `${project} Videos | Sree Arunachala Infra Group`;

            const title = document.getElementById("projectTitle");
            if (title) {
                title.textContent = `${project} Videos`;
            }

            const subtitle = document.getElementById("projectSubtitle");
            if (subtitle) {
                const firstVideo = videos.find(v => v.project === project);
                if (firstVideo) {
                    subtitle.textContent = firstVideo.projectSubtitle;
                }
            }
        }

        // Home Page
        if (container.dataset.page === "home") {
            videos = videos.filter(v => v.showOnHome === "Yes");
        }

        // Project Videos Page
        if (project) {
            videos = videos.filter(v => v.project === project);
            videos = videos.filter(v => v.active === "Yes");
        }

        videos.sort((a, b) =>
            Number(a.displayOrder) - Number(b.displayOrder)
        );
        renderVideos(videos);

    }
    catch (err) {
        console.error("Video Error:", err);
    }

}

function getYoutubeId(url) {

    if (!url) return "";

    const patterns = [

        /youtu\.be\/([^?&]+)/,

        /youtube\.com\/watch\?.*v=([^&]+)/,

        /youtube\.com\/shorts\/([^?&]+)/,

        /youtube\.com\/embed\/([^?&]+)/,

        /youtube\.com\/live\/([^?&]+)/

    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }

    return "";
}

function renderVideos(videos) {
    const container = document.getElementById("videosContainer");
    if (!container) return;

    const isHomePage = container.dataset.page === "home";

    if (!videos || videos.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5">
                <p class="custom-font-paras">
                    Videos will be available soon.
                </p>
            </div>
        `;
        return;
    }
    let html = "";
    videos.forEach(video => {

        const showPlayIcon =
            !(isHomePage && video.category === "Projects");

        // Extract YouTube Video ID
        const videoId = getYoutubeId(video.youtubeUrl);
        const thumbnail = videoId
            ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
            : "assets/img/saig-card-openplot.jpg";

        const buttonText =
            (isHomePage && video.category === "Projects")
                ? "View Videos"
                : "Watch Video";
        html += `
        <div class="project-category mb-5">
        <div class="row justify-content-center">
        <div class="col-lg-6 col-md-8">
        <div class="card projectcard-custom-border shadow-sm overflow-hidden">
        <div class="row g-0">
        <div class="col-md-4 position-relative">
        <img src="${thumbnail}"
             class="img-fluid w-100 rounded-start video-thumb"
             alt="${video.title}">
             ${videoId && showPlayIcon ? `
            <button
                class="video-play-btn"
                onclick="playVideo('${videoId}')">
                <i class="bi bi-play-fill"></i>
            </button>
            ` : ""}
        </div>
        <div class="col-md-8
        p-3
        project-card-textcolor
        d-flex
        flex-column
        justify-content-center"
        style="background:var(--saig-projectscard-color);">
        <h5 class="custom-font-paras custom-font-bold mb-2">
        ${video.title}
        </h5>
        <p class="custom-font-paras">
        ${video.description}
        </p>

        <div class="mt-3">

            ${isHomePage && video.category === "Projects"
                ? `
            <a href="project-videos.html?project=${encodeURIComponent(video.project)}"
            class="btn btn-sm text-white px-3"
            style="background:var(--saig-logo-brown-dark);border:none;">
            View Videos
            </a>
            `
                : videoId
                    ? `
            <button
                class="btn btn-sm video-btn text-white px-3"
                style="background:var(--saig-logo-brown-dark);border:none;"
                onclick="playVideo('${videoId}')">
                ▶ Watch Now
            </button>
            `
                    : `
            <button
                class="btn btn-sm text-white px-3"
                style="background:#999;border:none;"
                disabled>
                Coming Soon Video will be uploaded shortly.
            </button>
            `
            }

        </div>
        </div>
        </div>
        </div>
        </div>
        </div>
        </div>
        `;
    });
    container.innerHTML = html;
}

function getProjectFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("project");
}

function playVideo(videoId) {

    const iframe = document.getElementById("youtubePlayer");

    iframe.src =
        `https://www.youtube.com/embed/${videoId}?autoplay=1`;

    const modal = new bootstrap.Modal(
        document.getElementById("videoModal")
    );

    modal.show();
}

// document.addEventListener("DOMContentLoaded", loadNavbarAndFooter);
// // Handle back/forward navigation to avoid duplicates
// window.addEventListener('pageshow', function (event) {
//     if (event.persisted) {
//         window.location.reload();
//     }
// });

document.addEventListener("DOMContentLoaded", () => {
    loadNavbarAndFooter();
    const videoModal = document.getElementById("videoModal");
    if (videoModal) {
        videoModal.addEventListener("hidden.bs.modal", function () {
            document.getElementById("youtubePlayer").src = "";
        });
    }
});
