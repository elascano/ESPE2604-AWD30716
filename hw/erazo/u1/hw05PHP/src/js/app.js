function filterTable() {
    const input = document.getElementById('searchInput').value.toUpperCase();
    const trs = document.getElementById('tableBody').getElementsByTagName('tr');
    for (let i = 0; i < trs.length; i++) {
        trs[i].style.display = trs[i].innerText.toUpperCase().indexOf(input) > -1 ? "" : "none";
    }
}