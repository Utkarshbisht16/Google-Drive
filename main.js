let btnfolder = document.querySelector("#addFolder");
let btnfile = document.querySelector("#addTextFile");
let divContainer = document.querySelector("#container");
let divBreadcrum = document.querySelector("#breadcrum");
let divpreview = document.querySelector("#preview");
let Resource = [];
let cfid = -1; // initially we are at root which has pid of -1.(Current folder id)
let rid = 0;

// persist(save) - ram, storage, HTML
// validation - unique name, non-blank

btnfolder.addEventListener("click",
    function addfolder(e) {
        let rname = prompt("Enter folder's name");
        if(rname != null){
            rname = rname.trim();
        }
        if (!rname) { // empty name validation
            alert("Empty name folder can not be created");
            return;
        }
        //unique validation
        let alreadyExist = Resource.some(r => r.rname == rname && r.pid == cfid);
        if (alreadyExist == true) {
            alert(rname + " is already in use. Try some other name");
            return;
        }
        let pid = cfid;
        rid++;
        //HTML save
        addfolderHTML(rname, rid, pid);
        //RAM save
        Resource.push({
            rid: rid,
            rname: rname,
            rtype: "folder",
            pid: cfid

        });
        //Storage save
        saveToStorage();
    })

btnfile.addEventListener("click",
    function addfile(e) {
        let TFname = prompt("Enter text files's name");
        console.log(TFname);
    })

function addfolderHTML(rname, rid, pid) {
    // taking template and making a clone of it.
    let divFolderTemplate = template.content.querySelector(".folder");
    let divFolder = document.importNode(divFolderTemplate, true); // makes a copy

    let spanrename = divFolder.querySelector("[action=Rename]");
    let spandelete = divFolder.querySelector("[action=Delete]");
    let spanview = divFolder.querySelector("[action=View]");

    //setting the name of folder
    let divName = divFolder.querySelector("[purpose=name]");
    divName.innerHTML = rname;
    divFolder.setAttribute("pid", pid);
    divFolder.setAttribute("rid", rid);

    spanrename.addEventListener("click", renameFolder);
    spandelete.addEventListener("click", deleteFolder);
    spanview.addEventListener("click", viewFolder);

    divContainer.appendChild(divFolder);
}

function deleteFolder() {
    let FN = Fname;
    console.log(FN);
    console.log("folder delete of" + FN);
}

function deleteTextFile() {

}
function viewFolder() {
    console.log("folder view");
}
function viewTextFile() {

}
function renameFolder() {
    let Nrname = prompt("Enter a new name of folder.");
        if(Nrname != null){
            Nrname = Nrname.trim();
        }
        if (!Nrname) { // empty name validation
            alert("Empty name folder can not be created");
            return;
        } 

        let spanRename = this;
        let divFolder = spanRename.parentNode;
        let divName = divFolder.querySelector("[purpose=name]");
        let Orname = divName.innerHTML;
        let ridTBU = parseInt(divFolder.getAttribute("rid"));

        if(Orname == Nrname){
            alert("Please enter a new name");
            return;
        }

        let alreadyExist = Resource.some(r => r.rname == Nrname && r.pid == cfid);
        if(alreadyExist == true){
            alert(Nrname + " already exist. Please enter a new name");
            return;
        }

        //Change HTML
        divName.innerHTML = Nrname;
        //change RAM
        let r = Resource.find(r=> r.rid == ridTBU);
        r.rname = Nrname;
        // change in storage
        saveToStorage();
}
function renameTextFile() {

}
function saveToStorage() {
    //use to create jso to a json string which can be saved
    let rjson = JSON.stringify(Resource);
    localStorage.setItem("data", rjson);
}
function loadFromStorage() {
    let rjson = localStorage.getItem("data");
    if (!rjson){
        return;
    }
    Resource = JSON.parse(rjson);
    for (let i = 0; i < Resource.length; i++) {
        if (Resource[i].pid == cfid) { // only show folders which pid = cfid
            addfolderHTML(Resource[i].rname, Resource[i].rid, Resource[i].pid);
        }
        if (Resource[i].rid > rid) { // setting rid to max rid.(so new rid's can be assign)
            rid = Resource[i].rid;
        }
    }

}
loadFromStorage();
saveToStorage();