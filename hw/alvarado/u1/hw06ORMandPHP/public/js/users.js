// JavaScript Document

document.addEventListener("DOMContentLoaded", () => {

    initTabs();
    loadUsers(); 

});

function initTabs(){

    const tabs = document.querySelectorAll(".tab");
    const contents = document.querySelectorAll(".tab-content");

    tabs.forEach(tab => {

        tab.addEventListener("click", () => {

            tabs.forEach(t => t.classList.remove("active"));
            contents.forEach(c => c.classList.remove("active"));

            tab.classList.add("active");

            const target = tab.getAttribute("data-tab");
            document.getElementById(target).classList.add("active");

            if(target === "tableTab"){
                loadUsers();
            }

        });

    });
}


function loadUsers(){

    fetch("../app/getUsers.php")
    .then(response => response.json())
    .then(data => renderUsers(data))
    .catch(error => {
        console.error("Error loading users:", error);
    });

}


function renderUsers(users){

    const tbody = document.querySelector("#usersTable tbody");
    tbody.innerHTML = "";

    if(!users || users.length === 0){
        tbody.innerHTML = `
            <tr>
                <td colspan="5">No users found</td>
            </tr>
        `;
        return;
    }

    users.forEach(user => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${user.first_name ?? ""}</td>
            <td>${user.last_name ?? ""}</td>
            <td>${user.id_number ?? ""}</td>
            <td>${user.age ?? ""}</td>
            <td>${user.phone ?? ""}</td>
        `;

        tbody.appendChild(row);
    });

}
