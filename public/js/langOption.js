const amharic = document.getElementById("amh");
const english = document.getElementById("en");

amharic.addEventListener("click", () => {
    amharic.style.borderBottom = "0.1em solid white";
    english.style.borderBottom = "none";
});

english.addEventListener("click", () => {
    english.style.borderBottom = "0.1em solid black";
    amharic.style.borderBottom = "none";
});

export {amharic, english};