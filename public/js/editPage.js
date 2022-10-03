import 'compressorjs';
import "./watermarkjs/watermark.js"

let imageFiles = [null, null, null, null, null];
let projectcategory = document.getElementById("projectcategory");
let sub_category = document.getElementById("sub_category");
let sub_sub_category = document.getElementById("sub_sub_category");
const del = document.getElementById("delete_button");

//disable drop down menu if value is build
window.onload = function()
{
    projectcategory.value = projectcategory.dataset.main;
    sub_category.value = sub_category.dataset.sub;
    sub_sub_category.value = sub_sub_category.dataset.subsub;
   
    let value = projectcategory.options[projectcategory.selectedIndex].value;
    if(value == "build")
    {
        sub_category.setAttribute("disabled", "disabled");
        sub_sub_category.setAttribute("disabled", "disabled");
    }   
}

//disable or enable drop down menu
function switchDropMenu()
{
    let value = projectcategory.options[projectcategory.selectedIndex].value;
    if(value == "build")
    {
        sub_category.setAttribute("disabled", "disabled");
        sub_sub_category.setAttribute("disabled", "disabled");
    }

    else
    {
        sub_category.removeAttribute("disabled");
        sub_sub_category.removeAttribute("disabled");
    }
}

const loadImage = (inputFile, container) => {
    let file = inputFile.files[0];

    if(file){
        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.addEventListener("load", function() {

            //Add watermark and compress image
            watermark([reader.result])
            .image(watermark.text.lowerRight('ከ ሀ - ፐ', '10em Josefin Slab', '#fff', 0.6))
            .then(function (img) {
                console.log(container.lastElementChild.id);

                document.getElementById(container.lastElementChild.id).src = img.src;

                fetch(img.src)
                .then((res) => res.blob())
                .then((myBlob) => {
                    const myFIle = new File([myBlob], file.name, {type: file.type});

                    new Compressor(myFIle, {
                        quality: 0.9,
                    
                        // The compression process is asynchronous,
                        // which means you have to access the `result` in the `success` hook function.
                        success(result) {
                            // The third parameter is required for server
                            const order = Number(container.lastElementChild.dataset.order);
                            imageFiles[order] = result;
                        },
                        error(err) {
                          console.log(err.message);
                        },
                    });

                });
            });
        });
    }
};

function uriToFile(dataURI, fileName, fileFormat){
    return new Promise((resolve, reject) =>{
        fetch(dataURI)
        .then((res) => res.blob())
        .then((myBlob) => {
            const myFIle = new File([myBlob], fileName, {type: `image/${fileFormat}`});
            resolve(myFIle);
        })
    });
}

async function submitHandler(e){
     
    e.preventDefault();

    const images =  document.getElementsByClassName("images");
    
    const form_data = new FormData(e.target);
    const id = document.forms.myForm.dataset.id;

    for (let i = 0; i < images.length; i++)
    {
        let src = images[i].getAttribute("src");

        if(src.indexOf("data") < 0 && src != '#')
        {
            let myArray = src.split("/");
            let fileName = decodeURIComponent(myArray[myArray.length - 1]);

            let myArr = fileName.split(".");
            let fileFormat = myArr[myArr.length - 1];

            const myFile = await uriToFile(src, fileName, fileFormat);
            const order = Number(images[i].dataset.order);
            imageFiles[order] = myFile;
        }
    }

    for (let i = 0; i < imageFiles.length; i++)
        if(imageFiles[i])  form_data.append('image', imageFiles[i],imageFiles[i].name);

    fetch("/project/edit/" + id, { 
    method: 'POST',
    body: form_data
  })
  .then((url) => url.json())
  .then((url) => { 
    window.location.href = url;
  });
}

projectcategory.addEventListener("change", switchDropMenu);

del.addEventListener("click", () => {

    fetch("/project/delete/" + del.dataset.id, {
        method: "DELETE"
    })
    .then((project) => project.json())
    .then((result) => {
        let subRoutes = (result.mainCategory != "build")?  "/" + result.subCategory.toLowerCase() + "/" + result.subSubCategory.toLowerCase() : "";
        window.location.href = "/" + result.mainCategory.toLowerCase() + subRoutes;
    });
});

//Add functionality to the delete buttons on the alternate images
document.getElementsByClassName("more_images")[0].addEventListener("click", (event) => {
  
    if(event.target.id.indexOf("deleteBtn") >= 0)
    {  
        const delBtn = event.target;
        const img = delBtn.parentElement.parentElement.parentElement.lastElementChild;
        const order = Number(img.dataset.order);
        imageFiles[order] = null;
        img.setAttribute("src", "#");
    }
});

document.addEventListener("change", (event) => {

    const elemnentId = event.target.id;
  

    if(elemnentId.indexOf("image") > 0)
    {
        const container = event.target.parentElement.parentElement;
        loadImage(event.target, container);
        
    }
    else
        return;
});

document.forms.myForm.addEventListener("submit", (e) => {
    submitHandler(e);
});
