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

export{dropMenu, hideMenu};