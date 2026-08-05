async function fetchJson(path) {

    const response = await fetch(path);

    console.log("response josn---",response)

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
}