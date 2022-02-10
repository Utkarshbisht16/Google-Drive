let btnfolder = document.querySelector("#addFolder");
let btnfile = document.querySelector("#addTextFile");
let divContainer = document.querySelector("#container");
let divBreadcrum = document.querySelector("#breadcrum");
let aRoothPath = divBreadcrum.querySelector("a[purpose='path']");
let divpreview = document.querySelector("#preview");
let template = document.querySelector("#template");

let divApp = document.querySelector("#app");
let AppClose = document.querySelector("#close-app");
let divAppTitleBar = document.querySelector("#app-title-bar");
let divAppTitle = document.querySelector("#app-title");
let divAppMenuBar = document.querySelector("#app-menu-bar");
let divAppBody = document.querySelector("#app-body");

let Resource = [];
let cfid = -1; // initially we are at root which has pid of -1.(Current folder id)
let rid = 0;

//folder
// persist(save) - ram, storage, HTML
// validation - unique name, non-blank
btnfolder.addEventListener("click",
    function addfolder(e) {
        let rname = prompt("Enter folder's name");
        if (rname != null) {
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
    });

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

//text File
btnfile.addEventListener("click",
    function addfile(e) {
        let rname = prompt("Enter Text File's name");
        if (rname != null) {
            rname = rname.trim();
        }
        if (!rname) { // empty name validation
            alert("Empty name Text File's can not be created");
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
        addTextFileHTML(rname, rid, pid);
        //RAM save
        Resource.push({
            rid: rid,
            rname: rname,
            rtype: "text-file",
            pid: cfid,
            isBold: false,
            isItalic: false,
            isUnderline: false,
            BGcolor: "#000000",
            FGcolor: "#FFFFFF",
            fontFamily: "serif",
            fontSize: 22,
            content: "Hi, write here..."

        });
        //Storage save
        saveToStorage();
    });
function addTextFileHTML(rname, rid, pid) {
    // taking template and making a clone of it.
    let divTextFileTemplate = template.content.querySelector(".text-file");
    let divTextFile = document.importNode(divTextFileTemplate, true); // makes a copy

    let spanrename = divTextFile.querySelector("[action=Rename]");
    let spandelete = divTextFile.querySelector("[action=Delete]");
    let spanview = divTextFile.querySelector("[action=View]");

    //setting the name of folder
    let divName = divTextFile.querySelector("[purpose=name]");
    divName.innerHTML = rname;
    divTextFile.setAttribute("pid", pid);
    divTextFile.setAttribute("rid", rid);

    spanrename.addEventListener("click", renameTextFile);
    spandelete.addEventListener("click", deleteTextFile);
    spanview.addEventListener("click", viewTextFile);

    divContainer.appendChild(divTextFile);
}

aRoothPath.addEventListener("click", viewFromBreadcrum);
AppClose.addEventListener("click", appclose);

function viewFromBreadcrum() {
    let apath = this;
    let fid = parseInt(apath.getAttribute("rid"));

    // set breadcrum
    while (apath.nextSibling) {
        apath.parentNode.removeChild(apath.nextSibling);
    }

    // set the container
    cfid = fid;
    divContainer.innerHTML = "";
    for (let i = 0; i < Resource.length; i++) {
        if (Resource[i].pid == cfid) { // only show folders which pid = cfid
            if (Resource[i].rtype == "folder") {
                addfolderHTML(Resource[i].rname, Resource[i].rid, Resource[i].pid);
            } else if (Resource[i].rtype == "text-file") {
                addTextFileHTML(Resource[i].rname, Resource[i].rid, Resource[i].pid);
            }
        }
    }

}
function deleteFolder() {
    let spandelete = this;
    let divFolder = spandelete.parentNode;
    let divName = divFolder.querySelector("[purpose='name']");

    let fname = divName.innerHTML;
    let FidTBD = divFolder.getAttribute("rid");

    let sure = confirm(`Are you sure that you want to delete ${fname} ?`);
    if (!sure) {
        return;
    }

    //delete from HTML
    divContainer.removeChild(divFolder);

    // delete from RAM
    deleteHelper(FidTBD);
    //delete from storage
    saveToStorage();
}
function deleteHelper(FidTBD) {
    let Children = Resource.filter(r => r.pid == FidTBD);
    for (let i = 0; i < Children.length; i++) {
        //assume that it will delete child and their children recursively
        deleteHelper(Children[i].rid);
    }

    let ridx = Resource.findIndex(r => r.rid == FidTBD);
    Resource.splice(ridx, 1);
}

function deleteTextFile() {
    let spandelete = this;
    let divTextFile = spandelete.parentNode;
    let divName = divTextFile.querySelector("[purpose='name']");

    let fname = divName.innerHTML;
    let FidTBD = divTextFile.getAttribute("rid");

    let sure = confirm(`Are you sure that you want to delete ${fname} ?`);
    if (!sure) {
        return;
    }

    //delete from HTML
    divContainer.removeChild(divTextFile);

    // delete from RAM
    let ridx = Resource.findIndex(r => r.rid == FidTBD);
    Resource.splice(ridx, 1);
    //delete from storage
    saveToStorage();
}
function viewFolder() {
    let spanview = this;
    let divFolder = spanview.parentNode;
    let divName = divFolder.querySelector("[purpose='name']");

    let fname = divName.innerHTML;
    let fid = parseInt(divFolder.getAttribute("rid"));

    let aPathTemplate = template.content.querySelector("a[purpose='path']");
    let apath = document.importNode(aPathTemplate, true);

    apath.innerHTML = fname;
    apath.setAttribute("rid", fid);
    apath.addEventListener("click", viewFromBreadcrum);
    divBreadcrum.appendChild(apath);

    cfid = fid;
    divContainer.innerHTML = "";
    for (let i = 0; i < Resource.length; i++) {
        if (Resource[i].pid == cfid) { // only show folders which pid = cfid
            if (Resource[i].rtype == "folder") {
                addfolderHTML(Resource[i].rname, Resource[i].rid, Resource[i].pid);
            } else if (Resource[i].rtype == "text-file") {
                addTextFileHTML(Resource[i].rname, Resource[i].rid, Resource[i].pid);
            }
        }
    }
}
function viewTextFile() {
    let spanview = this;
    let divFile = spanview.parentNode;
    let divName = divFile.querySelector("[purpose=name]");
    let fname = divName.innerHTML;
    let fid = parseInt(divFile.getAttribute("rid"));

    let divNotepadMenuTemp = template.content.querySelector("[purpose=notepad-menu]");
    let divNotepadMenu = document.importNode(divNotepadMenuTemp, true);
    divAppMenuBar.innerHTML = "";
    divAppMenuBar.appendChild(divNotepadMenu);

    let divNotepadBodyTemp = template.content.querySelector("[purpose=notepad-body]");
    let divNotepadBody = document.importNode(divNotepadBodyTemp, true);
    divAppBody.innerHTML = "";
    divAppBody.appendChild(divNotepadBody);

    divAppTitle.innerHTML = fname;
    divAppTitle.setAttribute("rid", fid);

    let spansave = divAppMenuBar.querySelector("[action=save]");
    let spanbold = divAppMenuBar.querySelector("[action=bold]");
    let spanitalic = divAppMenuBar.querySelector("[action=italic]");
    let spanunderline = divAppMenuBar.querySelector("[action=underline]");
    let inputBGcolour = divAppMenuBar.querySelector("[action=bg-color]");
    let inputFGcolour = divAppMenuBar.querySelector("[action=fg-color]");
    let selectFontFamily = divAppMenuBar.querySelector("[action=font-family]");
    let selectFontSize = divAppMenuBar.querySelector("[action=font-size]");
    let spanDownload = divAppMenuBar.querySelector("[action=download]");
    let inputUpload = divAppMenuBar.querySelector("[action=upload]");
    let textarea = divAppBody.querySelector("textArea");


    spansave.addEventListener("click", saveNotepad);
    spanbold.addEventListener("click", makeNotepadBold)
    spanitalic.addEventListener("click", makeNotepadItalic)
    spanunderline.addEventListener("click", makeNotepadUnderline)
    inputBGcolour.addEventListener("change", ChangeNotepadBGcolour)
    inputFGcolour.addEventListener("change", ChangeNotepadFGcolour)
    selectFontFamily.addEventListener("change", ChangeNotepadFontFamily)
    selectFontSize.addEventListener("change", ChangeNotepadFontSize)
    spanDownload.addEventListener("click", downloadNotepad)
    inputUpload.addEventListener("change", uploadNotepad)

    let resource = Resource.find(r => r.rid == fid);
    spanbold.setAttribute("pressed", !resource.isBold)
    spanitalic.setAttribute("pressed", !resource.isItalic)
    spanunderline.setAttribute("pressed", !resource.isUnderline)
    inputBGcolour.value = resource.BGcolor;
    inputFGcolour.value = resource.FGcolor;
    selectFontFamily.value = resource.fontFamily;
    selectFontSize.value = resource.fontSize;
    textarea.value = resource.content;

    spanbold.dispatchEvent(new Event("click"))
    spanitalic.dispatchEvent(new Event("click"))
    spanunderline.dispatchEvent(new Event("click"))
    inputBGcolour.dispatchEvent(new Event("change"))
    inputFGcolour.dispatchEvent(new Event("change"))
    selectFontFamily.dispatchEvent(new Event("change"))
    selectFontSize.dispatchEvent(new Event("change"))



}

function saveNotepad() {
    let fid = parseInt(divAppTitle.getAttribute("rid"));
    let resource = Resource.find(r => r.rid == fid);

    let spanbold = divAppMenuBar.querySelector("[action=bold]");
    let spanitalic = divAppMenuBar.querySelector("[action=italic]");
    let spanunderline = divAppMenuBar.querySelector("[action=underline]");
    let inputBGcolour = divAppMenuBar.querySelector("[action=bg-color]");
    let inputFGcolour = divAppMenuBar.querySelector("[action=fg-color]");
    let selectFontFamily = divAppMenuBar.querySelector("[action=font-family]");
    let selectFontSize = divAppMenuBar.querySelector("[action=font-size]");
    let textarea = divAppBody.querySelector("textArea")

    resource.isBold = spanbold.getAttribute("pressed") == "true";
    resource.isItalic = spanitalic.getAttribute("pressed") == "true";
    resource.isUnderline = spanunderline.getAttribute("pressed") == "true";
    resource.BGcolor = inputBGcolour.value;
    resource.FGcolor = inputFGcolour.value;
    resource.fontFamily = selectFontFamily.value;
    resource.fontSize = selectFontSize.value;
    resource.content = textarea.value;
    saveToStorage();

}
function makeNotepadBold() {
    let textArea = divAppBody.querySelector("textArea");
    let isPressed = this.getAttribute("pressed") == "true";
    if (isPressed == false) {
        this.setAttribute("pressed", true);
        textArea.style.fontWeight = "bold";
    } else {
        this.setAttribute("pressed", false);
        textArea.style.fontWeight = "normal";
    }
}
function makeNotepadItalic() {
    let textArea = divAppBody.querySelector("textArea");
    let isPressed = this.getAttribute("pressed") == "true";
    if (isPressed == false) {
        this.setAttribute("pressed", true);
        textArea.style.fontStyle = "italic";
    } else {
        this.setAttribute("pressed", false);
        textArea.style.fontStyle = "normal";
    }
}
function makeNotepadUnderline() {
    let textArea = divAppBody.querySelector("textArea");
    let isPressed = this.getAttribute("pressed") == "true";
    if (isPressed == false) {
        this.setAttribute("pressed", true);
        textArea.style.textDecoration = "underline";
    } else {
        this.setAttribute("pressed", false);
        textArea.style.textDecoration = "none";
    }
}
function ChangeNotepadBGcolour() {
    let colour = this.value;
    let textArea = divAppBody.querySelector("textArea");
    textArea.style.background = colour;
}
function ChangeNotepadFGcolour() {
    let colour = this.value;
    let textArea = divAppBody.querySelector("textArea");
    textArea.style.color = colour;
}
function ChangeNotepadFontFamily() {
    let fontFamily = this.value;
    let textArea = divAppBody.querySelector("textArea");
    textArea.style.fontFamily = fontFamily;
}
function ChangeNotepadFontSize() {
    let fontSize = this.value;
    let textArea = divAppBody.querySelector("textArea");
    textArea.style.fontSize = fontSize;
}
function uploadNotepad() {
    let file = window.event.target.files[0];
    let reader = new FileReader();
    reader.addEventListener("load",
        function upload() {
            let data = window.event.target.result;
            //creating obj. of data
            let resource = JSON.parse(data);

            let spanbold = divAppMenuBar.querySelector("[action=bold]");
            let spanitalic = divAppMenuBar.querySelector("[action=italic]");
            let spanunderline = divAppMenuBar.querySelector("[action=underline]");
            let inputBGcolour = divAppMenuBar.querySelector("[action=bg-color]");
            let inputFGcolour = divAppMenuBar.querySelector("[action=fg-color]");
            let selectFontFamily = divAppMenuBar.querySelector("[action=font-family]");
            let selectFontSize = divAppMenuBar.querySelector("[action=font-size]");
            let textarea = divAppBody.querySelector("textArea")

            spanbold.setAttribute("pressed", !resource.isBold)
            spanitalic.setAttribute("pressed", !resource.isItalic)
            spanunderline.setAttribute("pressed", !resource.isUnderline)
            inputBGcolour.value = resource.BGcolor;
            inputFGcolour.value = resource.FGcolor;
            selectFontFamily.value = resource.fontFamily;
            selectFontSize.value = resource.fontSize;
            textarea.value = resource.content;

            spanbold.dispatchEvent(new Event("click"))
            spanitalic.dispatchEvent(new Event("click"))
            spanunderline.dispatchEvent(new Event("click"))
            inputBGcolour.dispatchEvent(new Event("change"))
            inputFGcolour.dispatchEvent(new Event("change"))
            selectFontFamily.dispatchEvent(new Event("change"))
            selectFontSize.dispatchEvent(new Event("change"))
            // viewTextFile();
        })
    reader.readAsText(file);
}
function downloadNotepad() {
    let fid = parseInt(divAppTitle.getAttribute("rid"));
    let resource = Resource.find(r => r.rid == fid);
    let divNotepadMenu = this.parentNode;

    let setToDownload = JSON.stringify(resource); // download in string formt
    let encodedData = encodeURIComponent(setToDownload); //downloaded file have some secret char so they need to be encoded before using

    let adownload = divNotepadMenu.querySelector("a[purpose=download]")
    // json command for download operation
    // adownload.setAttribute("href", "data:text/json; charset=utf-8," + JSON.stringify(resource)); -> without encoding it will download half of the data only

    adownload.setAttribute("href", "data:," + encodedData);
    // setting download attribute
    // download attribute is used to decided the name of file after the download.
    adownload.setAttribute("download", resource.rname + ".json");

    adownload.click();
}
function renameFolder() {
    let Nrname = prompt("Enter a new name of folder.");
    if (Nrname != null) {
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

    if (Orname == Nrname) {
        alert("Please enter a new name");
        return;
    }

    let alreadyExist = Resource.some(r => r.rname == Nrname && r.pid == cfid);
    if (alreadyExist == true) {
        alert(Nrname + " already exist. Please enter a new name");
        return;
    }

    //Change HTML
    divName.innerHTML = Nrname;
    //change RAM
    let r = Resource.find(r => r.rid == ridTBU);
    r.rname = Nrname;
    // change in storage
    saveToStorage();
}
function renameTextFile() {
    let Nrname = prompt("Enter a new name of Text file.");
    if (Nrname != null) {
        Nrname = Nrname.trim();
    }
    if (!Nrname) { // empty name validation
        alert("Empty name text file can not be created");
        return;
    }

    let spanRename = this;
    let divTextFile = spanRename.parentNode;
    let divName = divTextFile.querySelector("[purpose=name]");
    let Orname = divName.innerHTML;
    let ridTBU = parseInt(divTextFile.getAttribute("rid"));

    if (Orname == Nrname) {
        alert("Please enter a new name");
        return;
    }

    let alreadyExist = Resource.some(r => r.rname == Nrname && r.pid == cfid);
    if (alreadyExist == true) {
        alert(Nrname + " already exist. Please enter a new name");
        return;
    }

    //Change HTML
    divName.innerHTML = Nrname;
    //change RAM
    let r = Resource.find(r => r.rid == ridTBU);
    r.rname = Nrname;
    // change in storage
    saveToStorage();
}
function appclose(){
    divAppTitle.innerHTML = "Title will come here...";
    divAppTitle.setAttribute("rid","");
    divAppMenuBar.innerHTML = "";
    divAppBody.innerHTML = "";
}
function saveToStorage() {
    //use to create jso to a json string which can be saved
    let rjson = JSON.stringify(Resource);
    localStorage.setItem("data", rjson);
}
function loadFromStorage() {
    let rjson = localStorage.getItem("data");
    if (!rjson) {
        return;
    }
    Resource = JSON.parse(rjson);
    for (let i = 0; i < Resource.length; i++) {
        if (Resource[i].pid == cfid) { // only show folders which pid = cfid
            if (Resource[i].rtype == "folder") {
                addfolderHTML(Resource[i].rname, Resource[i].rid, Resource[i].pid);
            } else if (Resource[i].rtype == "text-file") {
                addTextFileHTML(Resource[i].rname, Resource[i].rid, Resource[i].pid);
            }
        }
        if (Resource[i].rid > rid) { // setting rid to max rid.(so new rid's can be assign)
            rid = Resource[i].rid;
        }
    }

}
loadFromStorage();
saveToStorage();