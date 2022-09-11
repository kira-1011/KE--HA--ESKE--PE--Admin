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

// projectcategory.onchange = disableDropMenu;
projectcategory.addEventListener("change", switchDropMenu);

document.getElementById("choose_image_main").addEventListener("click",()=>{
    document.getElementById("choose_image_main").setAttribute("value", `/images/Uploads/p.jpg`);
    
    console.log(projectcategory.value,
        sub_category.value,
        sub_sub_category.value);
});


del.addEventListener("click", () => {
    
    fetch("/project/delete/" + del.dataset.id, {
        method: "DELETE"
    })
    .then((project) => project.json())
    .then((result) => {
        console.log(result.mainCategory);
        let subRoutes = (result.mainCategory != "build")?  "/" + result.subCategory.toLowerCase() + "/" + result.subSubCategory.toLowerCase() : "";
        window.location.href = "/" + result.mainCategory.toLowerCase() + subRoutes;
    });
});

