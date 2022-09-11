const imageContainer = document.getElementById("imgContainer");
const filesContainer = document.getElementById("filesContainer");
const altImagesContainer = document.querySelector(".altImagesContainer");
const mainImageContainer = document.querySelector(".mainImageContainer");
const imagesContainers = document.getElementsByClassName("imagesContainer");
const mainCategory = document.getElementById("mainCategory");

const loadImage = (inputFile, container) => {
    let file = inputFile.files[0];

    if(file){
        const reader = new FileReader();

        reader.readAsDataURL(file);
        
        reader.addEventListener("load", function() {
            if(container.lastElementChild.id == "mainImg")
            {
                container.style.maxWidth = "100%";
                container.style.width = "fit-content";
            }
            container.children[1].style.display = "none";
            container.lastElementChild.src = `${reader.result}`;
            container.lastElementChild.style.display = "inline";
        });
    }
};

const unloadImage = (container) => {

    if(container.lastElementChild.src == "")
        return;

    if(container.lastElementChild.id == "mainImg")
        container.style.width = "100%";

    container.lastElementChild.src = "";
    container.lastElementChild.style.display = "none";
    container.children[1].style.display = "inline";
};


document.addEventListener("change", (event) => {

    const elemnentId = event.target.id;

    if(elemnentId.indexOf("Image") > 0)
    {
        const container = event.target.parentElement.parentElement;
        loadImage(event.target, container);
    }
    else
        return;
});


document.querySelector(".container").addEventListener("click",  (event) => {

    const elemnentClass = event.target.className;

    if(elemnentClass == "delete")
    {
        const container = event.target.parentElement.parentElement;
        unloadImage(container);
        event.target.parentElement.lastElementChild.value = "";
    }
    else
        return;
    
});

mainCategory.addEventListener("change", () => {
    if(mainCategory.value == "Build")
    {
        document.getElementById("subCategory").setAttribute("disabled",true);
        document.getElementById("subSubCategory").setAttribute("disabled",true);
    }
    else{
        document.getElementById("subCategory").removeAttribute("disabled");
        document.getElementById("subSubCategory").removeAttribute("disabled");
    }
});

window.addEventListener("unload", () => {
    mainCategory.value = "Design";

    document.getElementById('myform').reset();
});