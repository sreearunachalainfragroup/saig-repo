const PROJECT_API = API_BASE;

async function loadProjects() {
    // console.log("PROJECT_API =", PROJECT_API);

    const loading = document.getElementById("projectsLoading");
    const content = document.getElementById("projectsContent");

    try {

        const response = await fetch(`${PROJECT_API}?action=projects&key=${API_KEY}`);
        const data = await response.json();

        let projects = data.projects || [];

        // Show only active projects
        projects = projects.filter(
            p => p.showOnWebsite === "Yes"
        );

        // Sort after filtering
        projects.sort(
            (a, b) => Number(a.displayOrder) - Number(b.displayOrder)
        );

        if (loading) loading.style.display = "none";
        if (content) content.style.display = "block";

        // console.log(
        //     "Projects page?",
        //     !!document.getElementById("projectsPageContainer")
        // );

        // console.log(
        //     "Home page?",
        //     !!document.getElementById("ongoingSection")
        // );

        const isProjectsPage =
            document.getElementById("projectsPageContainer");

        if (isProjectsPage) {
            renderProjectsPage(projects);
        } else {
            renderProjects(projects);
        }

    } catch (err) {

        console.error("Projects Error:", err);

        alert(err);

        if (loading) {
            loading.innerHTML = `
            <p class="custom-font-paras text-danger">
                Unable to load projects.
            </p>
        `;
        }
    }
}

// Add here 👇
function getNoProjectsHtml() {

    return `
        <div class="text-center">

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

        document.getElementById("projectsContent").innerHTML =
            getNoProjectsHtml();
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


function renderProjectsPage(projects) {

    const loading = document.getElementById("projectsLoading");
    const container = document.getElementById("projectsPageContainer");

    if (!container) return;

    if (loading)
        loading.style.display = "none";

    container.style.display = "block";

    const ongoing =
        projects.filter(p => p.status === "Ongoing");

    const completed =
        projects.filter(p => p.status === "Completed");

    let html = "";

    // ================= Ongoing =================

    if (ongoing.length > 0) {

        html += `
        <div class="project-category mb-5">

            <h3 class="text-center custom-font-large custom-font-bold mt-3 mb-5">
                ONGOING
            </h3>
        `;

        ongoing.forEach(project => {

            html += `
            <div class="row justify-content-center mb-5">

                <div class="col-md-8">

                    <div class="card projectcard-custom-border shadow-sm overflow-hidden">

                        <div class="row g-0 align-items-stretch">

                            <div class="col-md-6">

                                <img
                                    src="${project.image}"
                                    class="img-fluid h-100 w-100 object-fit-cover rounded-start"
                                    alt="${project.title}">

                            </div>

                            <div class="col-md-6 p-4 project-card-textcolor d-flex flex-column justify-content-center"
                                style="background:var(--saig-projectscard-color);">

                                <h3 class="custom-font-paras custom-font-bold mb-2">

                                    ${project.title}

                                </h3>

                                <p class="custom-font-paras">

                                    ${project.subtitle}

                                </p>

                                <div class="mt-3">

                                    <a href="${project.page}"
                                        class="btn btn-sm text-white custom-font-paras px-3"
                                        style="background:var(--saig-logo-brown-dark);border:none;">

                                        Know More

                                    </a>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>
            `;

        });

        html += `</div>`;
    }

    // ================= Completed =================

    if (completed.length > 0) {

        html += `
        <div class="project-category">

            <h3 class="text-center custom-font-large custom-font-bold mt-5 mb-5">

                COMPLETED

            </h3>
        `;

        completed.forEach(project => {

            html += `
            <div class="row justify-content-center mb-5">

                <div class="col-md-8">

                    <div class="card projectcard-custom-border shadow-sm overflow-hidden">

                        <div class="row g-0 align-items-stretch">

                            <div class="col-md-6">

                                <img
                                    src="${project.image}"
                                    class="img-fluid h-100 w-100 object-fit-cover rounded-start"
                                    alt="${project.title}">

                            </div>

                            <div class="col-md-6 p-4 project-card-textcolor d-flex flex-column justify-content-center"
                                style="background:var(--saig-projectscard-color);">

                                <h3 class="custom-font-paras custom-font-bold mb-2">

                                    ${project.title}

                                </h3>

                                <p class="custom-font-paras">

                                    ${project.subtitle}

                                </p>

                                <div class="mt-3">

                                    <a href="${project.page}"
                                        class="btn btn-sm text-white custom-font-paras px-3"
                                        style="background:var(--saig-logo-brown-dark);border:none;">

                                        Know More

                                    </a>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>
            `;

        });

        html += `</div>`;
    }

    if (ongoing.length === 0 &&
        completed.length === 0) {

        html = `
        <div class="projects-empty-page">
            ${getNoProjectsHtml()}
        </div>
    `;
    }

    container.innerHTML = html;
}
