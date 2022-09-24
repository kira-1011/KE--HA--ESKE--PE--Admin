import 'compressorjs';
import "./watermarkjs/watermark.js"

const mainCategory = document.getElementById("mainCategory");
const form = document.getElementById('myform');
let imageFiles = []

const loadImage = (inputFile, container) => {
    let file = inputFile.files[0];

    if(file){
        const reader = new FileReader();

        console.log(file.size);

        reader.readAsDataURL(file);

        reader.addEventListener("load", function() {

            //Add watermark and compress image
            watermark([reader.result])
            .image(watermark.text.lowerRight('ከ ሀ - ፐ', '10em Josefin Slab', '#fff', 0.6))
            .then(function (img) {

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
                            console.log(`name: ${result.name}`)
            
                            imageFiles.push(result);

                            console.log(result.size);
                        },
                        error(err) {
                          console.log(err.message);
                        },
                    });

                });
            });

            if(container.lastElementChild.id == "mainImg")
            {
                container.style.maxWidth = "100%";
                container.style.width = "fit-content";
            }
            container.children[1].style.display = "none";
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

document.forms.myForm.addEventListener("submit", (e) => {
   
    e.preventDefault();
    
    const form_data = new FormData(e.target);

    for (let i = 0; i < imageFiles.length; i++)
        form_data.append('image', imageFiles[i],imageFiles[i].name);

    fetch("/project/add", { 
    method: 'POST',
    body: form_data
  })
  .then((url) => url.json())
  .then((url) => { 
    window.location.href = url;
  });
});

// document.getElementById("save").addEventListener("click", () => {
//     fetch("/project/add", { 
//     method: 'POST',
//     body: formData
//   });

// });

window.addEventListener("unload", () => {
    mainCategory.value = "Design";

    form.reset();
});