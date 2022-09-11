import {dropMenu, hideMenu} from "./menuAnimation.js";
import {subMenu} from "./subMenu.js";
import {amharic, english} from "./langOption.js";


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


