let btnfolder = document.querySelector("#addFolder");
let btnfile = document.querySelector("#addTextFile");
let divContainer =  document.querySelector("#container");
let divBreadcrum =  document.querySelector("#breadcrum");
let divpreview =  document.querySelector("#preview");


btnfolder.addEventListener("click",
function addfolder(e){
    let Fname = prompt("Enter folder's name");
    // taking template and making a clone of it.
    let divFolderTemplate = template.content.querySelector(".folder");
    let divFolder =  document.importNode(divFolderTemplate, true); // makes a copy
    
    //setting the name of folder
    let divName = divFolder.querySelector("[purpose=name]");
    divName.innerHTML = Fname;
    divContainer.appendChild(divFolder);
})

btnfile.addEventListener("click",
function addfile(e){
    let TFname = prompt("Enter text files's name");
    console.log(TFname);
})

function deleteFolder(){

}

function deleteTextFile(){

}
function viewFolder(){

}
function viewTextFile(){

}
function renameFolder(){

}
function renameTextFile(){

}
function saveToStorage(){

}
saveToStorage();