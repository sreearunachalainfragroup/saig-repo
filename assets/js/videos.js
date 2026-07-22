const VIDEO_API = API_BASE;

function getNoVideosHtml(title = "Videos will be available soon") {

    return `
        <div class="text-center pt-2 pb-4">

            <i class="bi bi-camera-video"
                style="font-size:3rem;color:var(--saig-logo-brown-dark);">
            </i>

            <h4 class="custom-font-headings custom-font-bold mt-3">
                ${title}
            </h4>

            <p class="custom-font-paras">
                Stay tuned for the latest project videos from
                Sree Arunachala Infra Group.
            </p>

        </div>
    `;
}

async function loadVideos() {

    try {

        const response = await fetch(`${VIDEO_API}?action=videos&key=${API_KEY}`);
        const data = await response.json();

        let videos = data.videos || [];

        const loading = document.getElementById("videosLoading");
        const content = document.getElementById("videosContent");

        const container = document.getElementById("videosContainer");
        if (!container) return;

        // Read project from URL
        const project = getProjectFromUrl();

        // Update page heading
        if (project) {

            // Browser tab title
            document.title = `${project} Videos | Sree Arunachala Infra Group`;

            const title = document.getElementById("projectTitle");
            if (title) {
                title.textContent = `— ${project.toUpperCase()} VIDEOS —`;
            }

            const subtitle = document.getElementById("projectSubtitle");

            if (subtitle) {

                const firstVideo = videos.find(
                    v => v.project === project && v.active === "Yes"
                );

                if (firstVideo) {

                    subtitle.textContent =
                        firstVideo.pageDescription || "";

                }

            }
        }

        // Home Page
        if (container.dataset.page === "home") {

            videos = videos.filter(v =>
                (v.showOnHome || "").trim().toLowerCase() === "yes" &&
                (v.active || "").trim().toLowerCase() === "yes"
            );

            if (videos.length === 0) {

                if (loading) loading.style.display = "none";
                if (content) content.style.display = "block";

                renderVideos([]);

                return;
            }
        }

        // Project Videos Page
        if (project) {

            videos = videos.filter(v =>
                v.project === project &&
                v.active === "Yes"
            );

        }

        videos.sort((a, b) =>
            Number(a.displayOrder) - Number(b.displayOrder)
        );

        if (loading) loading.style.display = "none";
        if (content) content.style.display = "block";

        renderVideos(videos);

    }
    catch (err) {

        console.error("Video Error:", err);

        if (loading) loading.style.display = "none";

        if (content) {

            content.style.display = "block";

            document.getElementById("videosContainer").innerHTML = `
            <div class="text-center py-5">

                <p class="custom-font-paras">
                    Unable to load videos.
                </p>

            </div>
        `;
        }

    }

}

function renderVideos(videos) {

    const activeProjects = new Set(
        videos
            .filter(v => v.active === "Yes")
            .map(v => v.project)
    );
    const container = document.getElementById("videosContainer");
    if (!container) return;

    const isHomePage = container.dataset.page === "home";

    let html = "";
    if (isHomePage && videos.length > 0) {

        html += `
        <div class="text-center mb-5">
            <h2 class="custom-font-headings custom-font-bold">
                VIDEOS @ SAIG
            </h2>

            <p class="custom-font-paras">
                Explore our corporate updates, project walkthroughs,
                customer stories and event highlights.
            </p>
        </div>
    `;
    }

    if (!videos || videos.length === 0) {
        container.innerHTML = getNoVideosHtml();
        return;
    }

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
            ${isHomePage && video.category === "Projects"
                ? video.project
                : video.title}
        </h5>
        <p class="custom-font-paras">
        ${video.description}
        </p>

        <div class="mt-3">

            ${isHomePage && video.category === "Projects"
                ? activeProjects.has(video.project)
                    ? `
                <a href="project-videos.html?project=${encodeURIComponent(video.project)}"
                class="btn btn-sm text-white px-3"
                style="background:var(--saig-logo-brown-dark);border:none;">
                View Videos
                </a>
                `
                    : `
                <button
                class="btn btn-sm text-white px-3"
                style="background:#999;border:none;"
                disabled>
                Videos Coming Soon
                </button>
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