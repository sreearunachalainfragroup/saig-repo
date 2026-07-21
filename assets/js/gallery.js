const GALLERY_API = API_BASE;

function getImageUrl(url) {

    if (!url) return "";

    // Already a thumbnail URL
    if (url.includes("thumbnail?id=")) {
        return url;
    }

    // Google Drive share URL
    if (url.includes("/file/d/")) {

        const id = url.match(/\/d\/([^/]+)/)?.[1];

        if (id) {
            return `https://drive.google.com/thumbnail?id=${id}&sz=w2000`;
        }
    }

    // Google Drive uc URL
    if (url.includes("uc?export=view&id=")) {

        const id = new URL(url).searchParams.get("id");

        if (id) {
            return `https://drive.google.com/thumbnail?id=${id}&sz=w2000`;
        }
    }

    return url;
}

async function loadGallery() {

    const loading = document.getElementById("galleryLoading");
    const content = document.getElementById("galleryContent");

    try {

        const response =
            await fetch(GALLERY_API + "?action=gallery");

        const data = await response.json();

        let gallery = data.gallery || [];

        gallery = gallery.filter(
            img => img.showOnWebsite === "Yes"
        );

        if (loading)
            loading.style.display = "none";

        if (content)
            content.style.display = "block";

        renderGallery(gallery);

    }
    catch (err) {

        console.error(err);

        if (loading) {

            loading.innerHTML = `
                <div class="text-center py-5">

                    <i class="bi bi-images"
                       style="font-size:3rem;color:var(--saig-logo-brown-dark);">
                    </i>

                    <h4 class="custom-font-headings custom-font-bold mt-3">
                        Gallery will be available soon
                    </h4>

                    <p class="custom-font-paras">
                        Stay tuned for latest moments from
                        Sree Arunachala Infra Group.
                    </p>

                </div>
            `;

        }

    }

}

function renderGallery(images) {

    const container =
        document.getElementById("galleryContent");

    if (!container) return;

    if (images.length === 0) {

        container.innerHTML = `
            <div class="text-center py-5">

                <i class="bi bi-images"
                   style="font-size:3rem;color:var(--saig-logo-brown-dark);">
                </i>

                <h4 class="custom-font-headings custom-font-bold mt-3">
                    Gallery will be available soon
                </h4>

                <p class="custom-font-paras">
                    Stay tuned for latest moments from
                    Sree Arunachala Infra Group.
                </p>

            </div>
        `;

        return;
    }

    // Group by Category

    const categories = {};

    images.forEach(img => {

        if (!categories[img.category]) {

            categories[img.category] = [];

        }

        categories[img.category].push(img);

    });

    let html = "";

    const categoryOrder = [
        "SAIG Moments",
        "Customer Registration Moments",
        "Site Gatherings"
    ];

    categoryOrder.forEach(category => {

        if (!categories[category]) return;

        categories[category].sort(
            (a, b) => Number(a.displayOrder) - Number(b.displayOrder)
        );

        html += `
        <h1 class="custom-font-headings custom-font-bold text-center mt-5 mb-4">
            ${category}
        </h1>

        <div class="row g-3">
    `;

        categories[category].forEach(img => {

            html += `
            <div class="col-sm-6 col-md-3">

                <div class="card gallerycard-custom-border">

                    <img
                        src="${getImageUrl(img.image)}"
                        alt="${img.title}"
                        class="card-img-top img-fluid gallery-img"

                        data-bs-toggle="modal"
                        data-bs-target="#imageModal"
                        data-bs-src="${getImageUrl(img.image)}">

                </div>

            </div>
        `;

        });

        html += `</div>`;

    });

    container.innerHTML = html;

    initGalleryModal();

}

function initGalleryModal() {

    const modalImage =
        document.getElementById("modalImage");

    document
        .querySelectorAll(".gallery-img")
        .forEach(img => {

            img.addEventListener("click", function () {

                modalImage.src =
                    this.dataset.bsSrc;

            });

        });

}