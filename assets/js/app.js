const API_URL = "https://script.google.com/macros/s/AKfycbxHJZL8mewE6rgtS1-R7Hd1wF5_gnxUu2fszj3zGZfs2Ch983_aVMciCdn3nrAIJcgokg/exec";
// Deployment ID :
// AKfycbxHJZL8mewE6rgtS1-R7Hd1wF5_gnxUu2fszj3zGZfs2Ch983_aVMciCdn3nrAIJcgokg
// https://script.google.com/
// Web App Script URL :
// https://script.google.com/macros/s/AKfycbxHJZL8mewE6rgtS1-R7Hd1wF5_gnxUu2fszj3zGZfs2Ch983_aVMciCdn3nrAIJcgokg/exec
const colors = {
    Available: "#4ce16f",
    // Sold: "#9b59b6",
    Reserved: "#f4ca4b",
    Mortgage: "#73eed9",
    Registered: "#cdacdb"
};

async function loadPlots() {
    const res = await fetch(API_URL);
    const data = await res.json();

    // Apply colors
    Object.keys(data).forEach(plotNo => {
        const el = document.getElementById(`plot-${plotNo}`);

        if (el) {
            el.style.fill = colors[data[plotNo].status] || "#ccc";
            el.addEventListener("click", (e) => {
                e.stopPropagation();
                // console.log("Clicked plot:", plotNo); // debug
                showPopup(plotNo, data[plotNo], e); // pass event
            });
            // Click event
        }
    });
}

loadPlots();

function showPopup(id, plot, event) {
    const popup = document.getElementById("popup");
    const el = document.getElementById(`plot-${id}`);

    popup.innerHTML = `
    <h5>Plot No. ${id}</h5>
    <p><b>Dimension:</b> ${plot.dimension}</p>
    <p><b>Size:</b> ${plot.size} Sq.Yds</p>
    <p><b>Facing:</b> ${plot.facing}</p>
    <p><b>Status:</b> ${plot.status}</p>
    ${plot.status === "Registered" && plot.customerName
            ? `<p><b>Registered To:</b> ${plot.customerName}</p>`
            : ""
        }
    `;

    // Position centered above plot
    popup.style.transform = "none";
    popup.style.left = "0px";
    popup.style.top = "0px";

    const rect = el.getBoundingClientRect();
    let left = rect.left + rect.width / 2 + window.scrollX;
    let top = rect.top + window.scrollY;

    // Default: above
    let translateY = "-90%";

    // If near top → show below
    if (rect.top < 120) {
        top = rect.bottom + window.scrollY;
        translateY = "10%";
    }

    popup.style.left = left + "px";
    popup.style.top = top + "px";
    popup.style.transform = `translate(-50%, ${translateY})`;

    popup.style.display = "block";
    // console.log("Popup opened for:", id); // debug
}


// Close popup on outside click
window.addEventListener("click", (e) => {
    const popup = document.getElementById("popup");

    // If click is inside popup → do nothing
    if (popup.contains(e.target)) return;

    // If clicked on a plot → do nothing
    if (e.target.closest(".plot")) return;

    // Otherwise close
    popup.style.display = "none";
});



