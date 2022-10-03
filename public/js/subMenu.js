import {dropMenu, hideMenu} from "./menuAnimation.js";

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

const subMenu = {
    designSubList,
    designSubListChildren: designSubList.children,
    exteriorSubList,
    exteriorSubListChildren: exteriorSubList.children,
    interiorSubList,
    interiorSubListChildren: interiorSubList.children,
    contactSubList,
    contactSubListChildren: contactSubList.children,
    dropped,
    reset,
    dropSubMenu,
    hideSubMenu,
    chooseKeyFrame
};

export{subMenu};