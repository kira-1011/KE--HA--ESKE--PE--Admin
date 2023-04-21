/////////////////////////////////////////////////

//langOption.js
const amharic = document.getElementById("amh");
const english = document.getElementById("en");

//must be deleted, when language is enabled
amharic.addEventListener("click", () => {
    amharic.style.borderBottom = "0.1em solid white";
    english.style.borderBottom = "none";
  });

english.addEventListener("click", () => {
    english.style.borderBottom = "0.1em solid black";
    amharic.style.borderBottom = "none";
  });

/////////////////////////////////////////////////

//menuAnimation.js

//For toggeling on and off the visibility
const toggleVisibility = (menuLists, opacity, visibility) => {
    for (const element of menuLists) {
        element.style.opacity = opacity;
    }

    for (const element of menuLists) {
        element.style.visibility = visibility;
    }
}

//For dropping the menu lists
const dropMenu = (menuLists) => {

    let i = 0.1;

    for (const element of menuLists) {
        element.style. animation = `dropMenu 1s ${i}s ease forwards`;
        i = i + 0.05;   
    }

    setTimeout(() => {
        toggleVisibility(menuLists, 1, "visible");
    }, 400);
}


//For hiding back the menu lists
const hideMenu = (menuLists) => {

    let i = 0.3;

    for (const element of menuLists) {
        element.style. animation = `hideMenu 0.5s ${i}s ease forwards`;
        i = i - 0.05;
    }

    
    setTimeout(() => {
        toggleVisibility(menuLists, 0, "hidden");
    }, 700);

}
/////////////////////////////////////////////////

// submenu.js

//Grab all the needed HTML Elements
const exterior = document.getElementById("exterior");
const interior = document.getElementById("interior"); 
const exteriorSubList = document.getElementById("exteriorSubList");  
const interiorSubList = document.getElementById("interiorSubList")
const contact = document.getElementById("contact")
const contactSubList = document.getElementById("contactSubList");
const design = document.getElementById("design")
const designSubList = document.getElementById("designSubList");


var dropped = [false,false,false,false];
var dropIdx = 0;

const reset = (boolArray) => {

    for(let i = 0, n = boolArray.length; i < n; i++)
        boolArray[i] = false;
}

const dropSubMenu = (menuLists, listContainer, droppedIdx, keyFrame = "subListDropDown", height = "9em") => {
    listContainer.style.display = "flex";

    listContainer.style.animation = `${keyFrame} 0.8s 0.1s ease forwards`;

    dropMenu(menuLists);

    //Sustain the changed height property of the sub list
    //and set dropped at droppedIdx to true
    setTimeout(() => {
        listContainer.style.height = height;
        dropped[droppedIdx] = true;
    },200);
};

const hideSubMenu = (menuLists, listContainer, droppedIdx, keyFrame = "subListHide") => {

    hideMenu(menuLists);

    listContainer.style.animation = `${keyFrame} 0.8s 0.3s ease forwards`;

    //Sustain the changed height property of the sub list
    //and set dropped at droppedIdx to false
    setTimeout(() => {
        listContainer.style.height = "0";
        dropped[droppedIdx] = false;
    },400);
};


const clickHandler = (subListChildren, subListContainer, droppedIndex = 0) => {

    if(dropped[droppedIndex])
        hideSubMenu(subListChildren, subListContainer, droppedIndex);
    else
        dropSubMenu(subListChildren, subListContainer, droppedIndex);
}

const chooseKeyFrame = (dropped) => {
    let keyframe;

        if(dropped[1] && dropped[2])
            keyframe = 3;

        else if(dropped[1] || dropped[2])
            keyframe = 2;
 
        else
            keyframe = 1;

        setTimeout(() => {
            dropped[1] = false;
            dropped[2] = false;
        },400);

    return keyframe;

}


//When cursor on top of the "Exterior" text drop the menu


design.addEventListener("click", () => {
    dropIdx = 0;

    if(dropped[dropIdx])
    {
        const keyFrame = chooseKeyFrame(dropped);

        hideSubMenu(interiorSubList.children, interiorSubList);
        hideSubMenu(exteriorSubList.children, exteriorSubList);
        hideSubMenu(designSubList.children, designSubList, dropIdx, `designListHide${keyFrame}`);

    }
    else
        dropSubMenu(designSubList.children, designSubList, dropIdx, "designListDropDown", "fit-content");
});



//When the "Exterior" text is clicked hide the menu if dropped is 
//true else drop the menu
exterior.addEventListener("click", () => {
    dropIdx = 1;
    clickHandler(exteriorSubList.children,exteriorSubList, dropIdx);
});

//When the "Interior" text is clicked hide the menu if dropped is 
//true else drop the menu.
interior.addEventListener("click", () => {
    dropIdx = 2;
    clickHandler(interiorSubList.children,interiorSubList, dropIdx);
});

//When the "Contacts" text is clicked hide the menu if dropped is 
//true else drop the menu.
contact.addEventListener("click", () => {
    dropIdx = 3;
    clickHandler(contactSubList.children,contactSubList, dropIdx);
});

/////////////////////////////////////////////////

//main.js

const burgerMenu = document.getElementById("burgerMenu");
const menuLists = document.getElementById("mnuList").children;
const main = document.getElementById("main");

var iconClicked = false;

const hideAll = () => {
    const keyFrame = subMenu.chooseKeyFrame(subMenu.dropped);
    const isDesignClicked = subMenu.dropped[0];
    subMenu.reset(subMenu.dropped);
    subMenu.hideSubMenu(subMenu.contactSubListChildren, subMenu.contactSubList);
    subMenu.hideSubMenu(subMenu.interiorSubListChildren, subMenu.interiorSubList);
    subMenu.hideSubMenu(subMenu.exteriorSubListChildren, subMenu.exteriorSubList);
    if(isDesignClicked)
        subMenu.hideSubMenu(subMenu.designSubListChildren, subMenu.designSubList, 0, `designListHide${keyFrame}`);
    hideMenu(menuLists);
};



//Trigger drop menu when burger menu icon is clicked


burgerMenu.addEventListener("click", () => {
   
    if(!iconClicked)
    {
        dropMenu(menuLists);
        iconClicked = true;
    }
    else
    {
        hideAll()
        iconClicked = false;
    }
});


main.addEventListener('click', function(event) {
    const isAmharicClicked = amharic.contains(event.target);
    const isEnglishClicked = english.contains(event.target);
    const isNavClicked = document.getElementById("nav").contains(event.target);

    if (!(isAmharicClicked || isEnglishClicked || isNavClicked))
    {
        hideAll();
        iconClicked = false;
    }
});
