let usersDataTable = null;

function loadUsers() {
    const loadingMessage = document.getElementById('loadingMessage');
    const errorMessage = document.getElementById('errorMessage');

    loadingMessage.classList.remove('d-none');
    errorMessage.classList.add('d-none');

    fetch('https://dummyjson.com/users?limit=30')
        .then(response => {
            if (!response.ok) {
                throw new Error('API response was not successful.');
            }

            return response.json();
        })
        .then(data => {
            const users = data.users;
            const tableBody = document.querySelector('#usersTable tbody');

            tableBody.innerHTML = '';

            users.forEach(user => {
                const row = document.createElement('tr');

                row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.firstName} ${user.lastName}</td>
                    <td>${user.age}</td>
                    <td>${user.email}</td>
                    <td>${user.phone}</td>
                    <td>${user.username}</td>
                    <td>${user.gender}</td>
                `;

                tableBody.appendChild(row);
            });

            if (usersDataTable !== null) {
                usersDataTable.destroy();
            }

            usersDataTable = $('#usersTable').DataTable({
                pageLength: 5,
                lengthMenu: [5, 10, 15, 30],
                order: [[0, 'asc']],
                language: {
                    search: "Search:",
                    lengthMenu: "Show _MENU_ records",
                    info: "Showing _START_ to _END_ of _TOTAL_ records",
                    infoEmpty: "No records available",
                    infoFiltered: "(filtered from _MAX_ total records)",
                    zeroRecords: "No matching records found",
                    paginate: {
                        first: "First",
                        last: "Last",
                        next: "Next",
                        previous: "Previous"
                    }
                }
            });

            loadingMessage.classList.add('d-none');
        })
        .catch(error => {
            console.error(error);
            loadingMessage.classList.add('d-none');
            errorMessage.classList.remove('d-none');
        });
}

document.addEventListener('DOMContentLoaded', function () {
    loadUsers();

    document.getElementById('reloadButton').addEventListener('click', function () {
        loadUsers();
    });
});