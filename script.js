
const EnregistrerBtn = document.querySelector(".EnregistrerBtn");
const AnnuleBtn = document.querySelector(".AnnuleBtn");
const addModal = document.querySelector("#addModal");
const workerContainer = document.querySelector(".workerCountainer");
const btnAjouter = document.querySelector(".btnAjouter");
const inputName = document.querySelector("#workerName");
const inputEmail = document.querySelector("#workerEmail");
const workerCard = document.querySelector(".workerCard");
const selectWorker = document.querySelector("#selectWorker");
const inputEntreprise = document.querySelector(".inputEntreprise");
const inputPost = document.querySelector(".inputPost");
const inputPhone = document.querySelector("#inputPhone");
const inputURL = document.querySelector("#urlInput");
const infoBox = document.querySelector(".infoBox");
const userSelect = document.querySelector(".userSelect");
const nonEffectSelect = document.querySelector(".nonEffectSelect");
const emptyP = document.querySelector(".emptyP");
const workerPlace = document.querySelector(".workerPlace");
const box = document.querySelector(".box")



let assignedWorkers = JSON.parse(localStorage.getItem('assignedWorkers')) || [];

let currentElementToRemove = null;

const salleSpecialMap = {
    "receptionDiv": "Réceptionniste",
    "conferenceDiv": "Manager",
    "serveursDiv": "Technicien",
    "securiteDiv": "Agents de sécurité",
    "personnelDiv": "Nettoyage",
    "archivesDiv": "Manager"
};

let nonEffect = JSON.parse(localStorage.getItem("employees")) || [];


function isWorkerAssigned(workerId) {
    return assignedWorkers.includes(workerId.toString());
}

function assignWorker(workerId) {
    if (!isWorkerAssigned(workerId)) {
        assignedWorkers.push(workerId.toString());
        localStorage.setItem('assignedWorkers', JSON.stringify(assignedWorkers));
    }
}

function unassignWorker(workerId) {
    assignedWorkers = assignedWorkers.filter(id => id !== workerId.toString());
    localStorage.setItem('assignedWorkers', JSON.stringify(assignedWorkers));
}

btnAjouter.addEventListener("click", function addOne(){
    addModal.style.display = "flex";
});

AnnuleBtn.addEventListener("click", function annuleAction(){
    addModal.style.display = "none";
});

const addExpBtn = document.querySelector("#addExpBtn")
const expContainer = document.querySelector("#expContainer")

addExpBtn.addEventListener("click", function() {
    const entreprise = document.querySelector(".inputEntreprise").value
    const post = document.querySelector(".inputPost").value
    const dateDebut = document.querySelector(".inputDateDebut").value;
    const dateFin = document.querySelector(".inputDateFin").value;

     if (!dateDebut || !dateFin) {
        alert("You must enter date !");
        return;
    }

    if (new Date(dateDebut) >= new Date(dateFin)) {
        alert("Your date is wrong");
        return;
    }

    if(entreprise === "" || post === ""){
        alert("Entrer toutes les informations de l'expérience")
        return
    }

    const expDiv = document.createElement("div")
    expDiv.innerHTML = `
        <p>Entreprise: ${entreprise}</p>
        <p>Poste: ${post}</p>
        <p>Période: ${dateDebut} to ${dateFin}</p>
    `
    expDiv.style = "background-color: #ffffffff; border: 1px solid gray; margin: 5px; padding: 5px; border-radius:5px"
    expContainer.appendChild(expDiv)

    document.querySelector(".inputEntreprise").value = ""
    document.querySelector(".inputPost").value = ""
    document.querySelector(".inputDateDebut").value = ""
    document.querySelector(".inputDateFin").value = ""
})

const expContainerModal = document.querySelector("#expInfoContainer");
expContainerModal.innerHTML = "";

EnregistrerBtn.addEventListener("click", function saveUser(){
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const namePattern = /^[a-zA-Z\s]{2,30}$/;
    const phonePattern = /^\d{10}$/;
    const urlPattern = /^https?:\/\/[^\s]+\.(png|jpg|jpeg|gif|svg)(\?.*)?$/;

    if(!namePattern.test(inputName.value)){
        alert("Nom invalide");
        return;
    }
    if(!emailPattern.test(inputEmail.value)){
        alert("Email invalide");
        return;
    }
    if(selectWorker.value === "Selectionner"){
        alert("Sélectionner un rôle");
        return;
    }
    if(!phonePattern.test(inputPhone.value)){
        alert("Numéro de téléphone invalide");
        return;
    }
    if(!urlPattern.test(inputURL.value)){
        alert("URL invalide (doit être une image)");
        return;
    }

    const savedEmployees = localStorage.getItem("employees");

    const OneCard = document.createElement("div");
    const userImg = document.createElement("img")
    userImg.src = inputURL.value
    userImg.style = "width: 100px; border-radius: 100%; height: 100px;"
    const OneName = document.createElement("h3");
    OneName.textContent = inputName.value;
    OneCard.style = "display: flex; flex-direction: column; align-items: center; justify-content: center; border: 1px solid gray; padding: 5px; border-radius: 10px; margin: 10px; cursor: pointer;";
    const special = document.createElement("p");
    special.textContent = selectWorker.value;
    special.style = "font-size: smaller;";
    const OneEmail = document.createElement("p");
    OneEmail.textContent = inputEmail.value;

    workerCard.appendChild(OneCard);
    OneCard.appendChild(userImg);
    OneCard.appendChild(OneName);
    OneCard.appendChild(special);
    OneCard.appendChild(OneEmail);
    
    addModal.style.display = "none";

    const usersObj = {
        id: Date.now(), 
        name: inputName.value,
        email: inputEmail.value,
        special: selectWorker.value,
        phone: inputPhone.value,
        urlImg: inputURL.value,

        expArray: Array.from(expContainer.querySelectorAll('div')).map(expDiv => ({
            entreprise: expDiv.querySelector('p:nth-child(1)').textContent.replace('Entreprise: ', ''),
            post: expDiv.querySelector('p:nth-child(2)').textContent.replace('Poste: ', ''),
            periode: expDiv.querySelector('p:nth-child(3)').textContent.replace('Période: ', '')
        }))
    };

    nonEffect.push(usersObj);
    localStorage.setItem("employees", JSON.stringify(nonEffect));

    console.log(nonEffect);

    inputName.value = "";      
    inputEmail.value = "";
    selectWorker.value = "Selectionner";
    inputEntreprise.value = "";
    inputPost.value = "";
    document.querySelector(".inputDateDebut").value = "";
    document.querySelector(".inputDateFin").value = "";
    inputURL.value = "";
    inputPhone.value = "";

    OneCard.onclick = function(){
        document.querySelector("#infoImgModal").src = usersObj.urlImg
        document.querySelector("#infoImgModal").style = "width: 100px; border-radius: 100%; height: 100px;"
        document.querySelector("#infoSpecialModal").textContent = "Role : " + usersObj.special
        document.querySelector("#infoNumberModal").textContent = "Phone : " + usersObj.phone
        document.querySelector("#infoNameModal").textContent = "Name : "+ usersObj.name;

        console.log(usersObj.name);
        document.querySelector("#infoEmailModal").textContent = "Email : " +  usersObj.email;
        document.querySelector("#infoModal").style.display = "grid";

        if (usersObj.expArray.length > 0) {
            expContainerModal.innerHTML = '<h4>Experience :</h4>';
            usersObj.expArray.forEach(exp => {
            expContainerModal.innerHTML += `
            <p>Entreprise: ${exp.entreprise}</p>
            <p>Poste: ${exp.post}</p>
            <p>Période: ${exp.periode}</p>
            <hr>`;
        });
    }

    currentElementToRemove = OneCard;
    };
});

const receptionDiv = document.querySelector(".receptionDiv");
const recDiv = document.querySelector(".recDiv");

receptionDiv.addEventListener("click", function(){
    const roleNeeded = ["Réceptionniste" , "Manager"];
    const receptionUsers = nonEffect.filter(user => roleNeeded.includes(user.special));

    const select = receptionDiv.querySelector(".userSelect"); 
    const workerPlace = receptionDiv.querySelector(".workerPlace"); 
    const emptyP = workerPlace.querySelector(".emptyP"); 

    select.innerHTML = `<option value="">Selectionner</option>`;
    
    receptionUsers.forEach(user => {
        const opt = document.createElement("option");
        opt.value = user.id;
        opt.textContent = user.name + " - " + user.special;
        select.appendChild(opt);
    });

select.onchange = function() {
    const RecMaxLimit = 3;
    const currentCount = workerPlace.querySelectorAll(".worker-info").length;

    if (currentCount == 0) {
        receptionDiv.style.border = "2px solid red";
        receptionDiv.style.boxShadow = " 0 0 15px 8px solid red";
    }

    if (currentCount >= 0) {
        receptionDiv.style.border = "none";
        receptionDiv.style.boxShadow = "none";

    }

    if (currentCount >= RecMaxLimit) {
        alert("You cannot add more than 3");
        return;
    }

    const selectedUserId = this.value;

    if (selectedUserId) {


        if (isWorkerAssigned(selectedUserId)) {
            alert("This worker has already been assigned to another room!");
            this.value = "";
            return;
        }

        const selectedUser = receptionUsers.find(user => user.id == selectedUserId);
        if (!selectedUser) return;

        
        assignWorker(selectedUserId);

        if (emptyP) emptyP.style.display = "none";

        const workerInfo = document.createElement("div");
        workerInfo.className = "worker-info";
        workerInfo.innerHTML = `
            <h3>${selectedUser.name}</h3>
            <p>${selectedUser.special}</p>
        `;
        workerInfo.style.cursor = "pointer";

        workerInfo.onclick = function() {
            currentElementToRemove = workerInfo;

            document.querySelector("#infoNameModal").textContent = selectedUser.name
            document.querySelector("#infoEmailModal").textContent = selectedUser.email
            document.querySelector("#infoModal").style.display = "grid"
        }

        workerPlace.appendChild(workerInfo);
        localStorage.setItem("employees", JSON.stringify(nonEffect));

        select.querySelector(`option[value="${selectedUserId.toString()}"]`).remove();

        
    }
};

});

const conferenceDiv = document.querySelector(".conferenceDiv");

conferenceDiv.addEventListener("click", function() {
    const roleNeeded = ["Manager" , "Réceptionniste" , "Technicien" , "Agents de sécurité" , "Nettoyage"];
    const conferenceUsers = nonEffect.filter(user => roleNeeded.includes(user.special));

    const select = conferenceDiv.querySelector(".userSelect"); 
    const workerPlace = conferenceDiv.querySelector(".workerPlace"); 
    const emptyP = workerPlace.querySelector(".emptyP"); 

    select.innerHTML = `<option value="">Selectionner</option>`;

    conferenceUsers.forEach(user => {
        const opt = document.createElement("option");
        opt.value = user.id;
        opt.textContent = user.name + " - " + user.special;
        select.appendChild(opt);
    });

    select.onchange = function() {
        const ConfMaxLimit = 10;
        const currentCount = workerPlace.querySelectorAll(".worker-info").length;

        if (currentCount >= 0) {
        conferenceDiv.style.border = "2px solid rgba(51, 255, 0, 0.62)";
        conferenceDiv.style.boxShadow = "0 0 13px 1px rgba(51, 255, 0, 0.62)";
    }
        if (currentCount >= ConfMaxLimit) {
            alert("You cannot add more than " + ConfMaxLimit);
            return;
        }

        const selectedUserId = this.value;
        
        if (selectedUserId) {
           

            if (isWorkerAssigned(selectedUserId)) {
                alert("This worker has already been assigned to another room!");
                this.value = "";
                return;
            }

            const selectedUser = conferenceUsers.find(user => user.id == selectedUserId);
            
            
            assignWorker(selectedUserId);
            
            if (emptyP) emptyP.style.display = "none";
            
            const workerInfo = document.createElement("div");
            
            workerInfo.className = "worker-info";
            workerInfo.innerHTML = `
                <h3>${selectedUser.name}</h3>
                <p>${selectedUser.special}</p>
            `;
            workerInfo.style.cursor = "pointer";

            workerInfo.onclick = function() {
                currentElementToRemove = workerInfo;

                document.querySelector("#infoNameModal").textContent = selectedUser.name
                document.querySelector("#infoEmailModal").textContent = selectedUser.email
                document.querySelector("#infoModal").style.display = "grid"
            }

            workerPlace.appendChild(workerInfo);

            select.querySelector(`option[value="${selectedUserId}"]`).remove();
            
        } else {
            if (emptyP) emptyP.style.display = "block";
        }
    };
});

const serveursDiv = document.querySelector(".serveursDiv");

serveursDiv.addEventListener("click", function() {
    const roleNeeded = ["Technicien" , "Manager" , "Nettoyage" ];
    const serveursUsers = nonEffect.filter(user => roleNeeded.includes(user.special));

    const select = serveursDiv.querySelector(".userSelect"); 
    const workerPlace = serveursDiv.querySelector(".workerPlace"); 
    const emptyP = workerPlace.querySelector(".emptyP"); 

    select.innerHTML = `<option value="">Selectionner</option>`;

    serveursUsers.forEach(user => {
        const opt = document.createElement("option");
        opt.value = user.id;
        opt.textContent = user.name + " - " + user.special;
        select.appendChild(opt);
    });

    select.onchange = function() {
        const ServeursMaxLimit = 2;
        const currentCount = workerPlace.querySelectorAll(".worker-info").length;

        if (currentCount >= 0) {
        serveursDiv.style.border = "2px solid rgba(51, 255, 0, 0.62)";
        serveursDiv.style.boxShadow = "0 0 13px 1px rgba(51, 255, 0, 0.62)";
    }
        if (currentCount >= ServeursMaxLimit) {
            alert("You cannot add more than " + ServeursMaxLimit);
            return;
        }

        const selectedUserId = this.value;

        if (selectedUserId) {
            
            
            if (isWorkerAssigned(selectedUserId)) {
                alert("This worker has already been assigned to another room!");
                this.value = "";
                return;
            }

            const selectedUser = serveursUsers.find(user => user.id == selectedUserId);

                    
            assignWorker(selectedUserId);

            if (emptyP) emptyP.style.display = "none";

            const workerInfo = document.createElement("div");
            workerInfo.className = "worker-info";
            workerInfo.innerHTML = `
                <h3>${selectedUser.name}</h3>
                <p>${selectedUser.special}</p>
            `;
            workerInfo.style.cursor = "pointer";

            workerInfo.onclick = function() {
                currentElementToRemove = workerInfo;

                document.querySelector("#infoNameModal").textContent = selectedUser.name;
                document.querySelector("#infoEmailModal").textContent = selectedUser.email;
                document.querySelector("#infoModal").style.display = "grid";
            }

            workerPlace.appendChild(workerInfo);

            select.querySelector(`option[value="${selectedUserId}"]`).remove();
        } else {
            if (emptyP) emptyP.style.display = "block";
        }
    };
});

const securiteDiv = document.querySelector(".securiteDiv");

securiteDiv.addEventListener("click", function() {
    const roleNeeded = ["Agents de sécurité" , "Manager" , "Agents de sécurité" ,"Nettoyage"];
    const securiteUsers = nonEffect.filter(user => roleNeeded.includes(user.special));

    const select = securiteDiv.querySelector(".userSelect"); 
    const workerPlace = securiteDiv.querySelector(".workerPlace"); 
    const emptyP = workerPlace.querySelector(".emptyP"); 

    select.innerHTML = `<option value="">Selectionner</option>`;

    securiteUsers.forEach(user => {
        const opt = document.createElement("option");
        opt.value = user.id;
        opt.textContent = user.name + " - " + user.special;
        select.appendChild(opt);
    });

    select.onchange = function() {
        const SecuriteMaxLimit = 3;
        const currentCount = workerPlace.querySelectorAll(".worker-info").length;

        if (currentCount >= 0) {
        securiteDiv.style.border = "2px solid rgba(51, 255, 0, 0.62)";
        securiteDiv.style.boxShadow = "0 0 13px 1px rgba(51, 255, 0, 0.62)";
    }
        if (currentCount >= SecuriteMaxLimit) {
            alert("You cannot add more than " + SecuriteMaxLimit);
            return;
        }

        const selectedUserId = this.value;

        if (selectedUserId) {
            
            
            if (isWorkerAssigned(selectedUserId)) {
                alert("This worker has already been assigned to another room!");
                this.value = "";
                return;
            }

            const selectedUser = securiteUsers.find(user => user.id == selectedUserId);

            
            assignWorker(selectedUserId);

            if (emptyP) emptyP.style.display = "none";

            const workerInfo = document.createElement("div");
            workerInfo.className = "worker-info";
            workerInfo.innerHTML = `
                <h3>${selectedUser.name}</h3>
                <p>${selectedUser.special}</p>
            `;
            workerInfo.style.cursor = "pointer";

            workerInfo.onclick = function() {
                currentElementToRemove = workerInfo;

                document.querySelector("#infoNameModal").textContent = selectedUser.name;
                document.querySelector("#infoEmailModal").textContent = selectedUser.email;
                document.querySelector("#infoModal").style.display = "grid";
            }

            workerPlace.appendChild(workerInfo);

            select.querySelector(`option[value="${selectedUserId}"]`).remove();
        } else {
            if (emptyP) emptyP.style.display = "block";
        }
    };
});

const personnelDiv = document.querySelector(".personnelDiv");

personnelDiv.addEventListener("click", function() {
    const roleNeeded = ["Nettoyage" , "Manager" , "Technicien" , "Agents de sécurité" , "Réceptionniste"];
    const personnelUsers = nonEffect.filter(user => roleNeeded.includes(user.special));

    const select = personnelDiv.querySelector(".userSelect"); 
    const workerPlace = personnelDiv.querySelector(".workerPlace"); 
    const emptyP = workerPlace.querySelector(".emptyP"); 

    select.innerHTML = `<option value="">Selectionner</option>`;

    personnelUsers.forEach(user => {
        const opt = document.createElement("option");
        opt.value = user.id;
        opt.textContent = user.name + " - " + user.special;
        select.appendChild(opt);
    });

    select.onchange = function() {
        const PersonnelMaxLimit = 5;
        const currentCount = workerPlace.querySelectorAll(".worker-info").length;

        if (currentCount >= 0) {
        personnelDiv.style.border = "2px solid rgba(51, 255, 0, 0.62)";
        personnelDiv.style.boxShadow = "0 0 13px 1px rgba(51, 255, 0, 0.62)";
    }

    if (currentCount >= 0) {
        receptionDiv.style.border = "2px solid rgba(51, 255, 0, 0.62)";
        receptionDiv.style.boxShadow = "0 0 13px 1px rgba(51, 255, 0, 0.62)";
    }
        if (currentCount >= PersonnelMaxLimit) {
            alert("You cannot add more than " + PersonnelMaxLimit);
            return;
        }

        const selectedUserId = this.value;

        if (selectedUserId) {
            
            if (isWorkerAssigned(selectedUserId)) {
                alert("This worker has already been assigned to another room!");
                this.value = "";
                return;
            }

            const selectedUser = personnelUsers.find(user => user.id == selectedUserId);




            assignWorker(selectedUserId);

            if (emptyP) emptyP.style.display = "none";

            const workerInfo = document.createElement("div");
            workerInfo.className = "worker-info";
            workerInfo.innerHTML = `
                <h3>${selectedUser.name}</h3>
                <p>${selectedUser.special}</p>
            `;
            workerInfo.style.cursor = "pointer";

            workerInfo.onclick = function() {
                currentElementToRemove = workerInfo;

                document.querySelector("#infoNameModal").textContent = selectedUser.name;
                document.querySelector("#infoEmailModal").textContent = selectedUser.email;
                document.querySelector("#infoModal").style.display = "grid";
            }

            workerPlace.appendChild(workerInfo);

            select.querySelector(`option[value="${selectedUserId}"]`).remove();
        } else {
            if (emptyP) emptyP.style.display = "block";
        }
    };
});

const archivesDiv = document.querySelector(".archivesDiv");

archivesDiv.addEventListener("click", function() {
    const roleNeeded = ["Manager" , "Technicien" , "Agents de sécurité" , "Réceptionniste" ];
    const archivesUsers = nonEffect.filter(user => roleNeeded.includes(user.special));

    const select = archivesDiv.querySelector(".userSelect"); 
    const workerPlace = archivesDiv.querySelector(".workerPlace"); 
    const emptyP = workerPlace.querySelector(".emptyP"); 

    select.innerHTML = `<option value="">Selectionner</option>`;

    archivesUsers.forEach(user => {
        const opt = document.createElement("option");
        opt.value = user.id;
        opt.textContent = user.name + " - " + user.special;
        select.appendChild(opt);
    });

    select.onchange = function() {
        const ArchivesMaxLimit = 2;
        const currentCount = workerPlace.querySelectorAll(".worker-info").length;

        if (currentCount >= 0) {
        receptionDiv.style.border = "2px solid rgba(51, 255, 0, 0.62)";
        receptionDiv.style.boxShadow = "0 0 13px 1px rgba(51, 255, 0, 0.62)";
    }
        if (currentCount >= ArchivesMaxLimit) {
            alert("You cannot add more than " + ArchivesMaxLimit);
            return;
        }

        const selectedUserId = this.value;

        if (selectedUserId) {
            
            if (isWorkerAssigned(selectedUserId)) {
                alert("This worker has already been assigned to another room!");
                this.value = "";
                return;
            }

            const selectedUser = archivesUsers.find(user => user.id == selectedUserId);

            
            assignWorker(selectedUserId);

            if (emptyP) emptyP.style.display = "none";

            const workerInfo = document.createElement("div");
            workerInfo.className = "worker-info";
            workerInfo.innerHTML = `
                <h3>${selectedUser.name}</h3>
                <p>${selectedUser.special}</p>
            `;
            workerInfo.style.cursor = "pointer";

            workerInfo.onclick = function() {
                currentElementToRemove = workerInfo;

                document.querySelector("#infoNameModal").textContent = selectedUser.name;
                document.querySelector("#infoEmailModal").textContent = selectedUser.email;
                document.querySelector("#infoModal").style.display = "grid";
            }

            workerPlace.appendChild(workerInfo);

            select.querySelector(`option[value="${selectedUserId}"]`).remove();
        } else {
            if (emptyP) emptyP.style.display = "block";
        }
    };
});


document.getElementById("closeInfo1").addEventListener("click", function() {
    document.getElementById("infoModal").style.display = "none";
});
document.getElementById("closeInfo2").addEventListener("click", function() {
    document.getElementById("infoModal").style.display = "none";
});

document.getElementById("removeCard").addEventListener("click", function(){
    if(currentElementToRemove){
        
        const workerName = currentElementToRemove.querySelector('h3').textContent;
        const worker = nonEffect.find(w => w.name === workerName);
        if (worker) {
            unassignWorker(worker.id);
        }

        currentElementToRemove.remove();
        currentElementToRemove = null;
    }
    document.getElementById("infoModal").style.display = "none";
});