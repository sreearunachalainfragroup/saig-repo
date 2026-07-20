const PROJECT_API = API_BASE;

async function loadProjects() {

    const loading = document.getElementById("projectsLoading");
    const content = document.getElementById("projectsContent");

    try {

        const response = await fetch(PROJECT_API + "?action=projects");
        const data = await response.json();

        let projects = data.projects || [];

        projects = projects
            .filter(p => p.showOnHome === "Yes")
            .sort((a, b) => Number(a.displayOrder) - Number(b.displayOrder));

        if (loading) loading.style.display = "none";
        if (content) content.style.display = "block";

        renderProjects(projects);

    } catch (err) {

        console.error("Projects Error:", err);

        if (loading) {
            loading.innerHTML = `
                <p class="custom-font-paras text-danger">
                    Unable to load projects.
                </p>
            `;
        }
    }
}

function renderProjects(projects) {

    const ongoingProjects =
        projects.filter(p => p.status === "Ongoing");

    const completedProjects =
        projects.filter(p => p.status === "Completed");

    renderProjectSection(
        "ongoingSection",
        "ONGOING PROJECTS",
        "ongoingProjects",
        ongoingProjects
    );

    renderProjectSection(
        "completedSection",
        "COMPLETED PROJECTS",
        "completedProjects",
        completedProjects
    );

    // If no projects at all
    if (ongoingProjects.length === 0 &&
        completedProjects.length === 0) {

        document.getElementById("projectsContent").innerHTML = `
            <div class="text-center py-5">

                <i class="bi bi-building"
                   style="font-size:3rem;color:var(--saig-logo-brown-dark);">
                </i>

                <h4 class="custom-font-headings custom-font-bold mt-3">
                    Projects will be available soon
                </h4>

                <p class="custom-font-paras">
                    Stay tuned for exciting investment opportunities from
                    Sree Arunachala Infra Group.
                </p>

            </div>
        `;
    }

}

function renderProjectSection(containerId, heading, carouselId, projects) {

    const container = document.getElementById(containerId);

    if (!container) return;

    // If no projects, hide this section
    if (projects.length === 0) {
        container.innerHTML = "";
        return;
    }

    let items = "";

    projects.forEach((project, index) => {

        items += `
            <div class="carousel-item ${index === 0 ? "active" : ""}">

                <div class="row justify-content-center">

                    <div class="col-lg-6 col-md-8">

                        <div class="text-center">

                            <a href="${project.page}" class="text-decoration-none">

                                <img src="${project.image}"
                                     class="d-block w-100 rounded shadow"
                                     alt="${project.title}">

                                <div class="mt-2">

                                    <h5 class="custom-font-headings custom-font-bold">
                                        ${project.title}
                                    </h5>

                                    <p class="custom-font-paras">
                                        ${project.subtitle}
                                    </p>

                                </div>

                            </a>

                        </div>

                    </div>

                </div>

            </div>
        `;
    });

    container.innerHTML = `
        <h2 class="custom-font-headings custom-font-bold text-center mb-4">
            ${heading}
        </h2>

        <div id="${carouselId}"
             class="carousel slide"
             data-bs-ride="carousel"
             data-bs-interval="4000">

            <div class="carousel-inner">
                ${items}
            </div>

            ${projects.length > 1 ? `
            <button class="carousel-control-prev"
                    type="button"
                    data-bs-target="#${carouselId}"
                    data-bs-slide="prev">

                <span class="carousel-control-prev-icon"></span>

            </button>

            <button class="carousel-control-next"
                    type="button"
                    data-bs-target="#${carouselId}"
                    data-bs-slide="next">

                <span class="carousel-control-next-icon"></span>

            </button>
            ` : ""}

        </div>
    `;

    // Initialize Bootstrap Carousel
    if (projects.length > 1) {

        new bootstrap.Carousel(
            document.getElementById(carouselId),
            {
                interval: 4000,
                ride: "carousel",
                pause: false,
                wrap: true,
                touch: true
            }
        );

    }

}