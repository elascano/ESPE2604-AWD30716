document.addEventListener('DOMContentLoaded', () => {
    const totalNotebooksEl = document.getElementById('total-notebooks');
    const smallCountEl = document.getElementById('small-count');
    const mediumCountEl = document.getElementById('medium-count');
    const largeCountEl = document.getElementById('large-count');
    const notebooksBody = document.getElementById('notebooks-body');

    const searchInput = document.getElementById('search-input');
    const categorySelect = document.getElementById('category-select');
    const deleteCategoryBtn = document.getElementById('delete-category-btn');
    const refreshBtn = document.getElementById('refresh-btn');

    const confirmModal = document.getElementById('confirm-modal');
    const confirmTitle = document.getElementById('confirm-title');
    const confirmMessage = document.getElementById('confirm-message');
    const confirmCancelBtn = document.getElementById('confirm-cancel-btn');
    const confirmOkBtn = document.getElementById('confirm-ok-btn');
    
    let onConfirmCallback = null;

    const API_BASE = '/notebookStore';
    let notebooksData = [];

    const init = async () => {
        await fetchAndRender();
    };

    const showConfirm = (title, message, callback) => {
        confirmTitle.textContent = title;
        confirmMessage.textContent = message;
        onConfirmCallback = callback;
        confirmModal.classList.remove('hidden');
    };

    const hideConfirm = () => {
        confirmModal.classList.add('hidden');
        onConfirmCallback = null;
    };

    confirmCancelBtn.addEventListener('click', hideConfirm);
    confirmOkBtn.addEventListener('click', async () => {
        if (onConfirmCallback) {
            await onConfirmCallback();
        }
        hideConfirm();
    });

    const fetchAndRender = async () => {
        try {
            notebooksBody.innerHTML = '<tr><td colspan="7" class="text-center">Loading notebooks...</td></tr>';
            
            const res = await fetch(`${API_BASE}/notebook`);
            if (!res.ok) throw new Error('Failed to fetch notebooks');
            
            notebooksData = await res.json();
            
            updateStats();
            renderTable(notebooksData);
        } catch (error) {
            console.error(error);
            notebooksBody.innerHTML = '<tr><td colspan="7" class="text-center" style="color: var(--danger);">Error loading data. Make sure the database is connected.</td></tr>';
        }
    };

    const updateStats = () => {
        totalNotebooksEl.textContent = notebooksData.length;
        
        let small = 0;
        let medium = 0;
        let large = 0;

        notebooksData.forEach(notebook => {
            const leaves = parseInt(notebook.size_leaves, 10) || 0;
            if (leaves < 80) small++;
            else if (leaves <= 150) medium++;
            else large++;
        });

        smallCountEl.textContent = small;
        mediumCountEl.textContent = medium;
        largeCountEl.textContent = large;
    };

    const renderTable = (list) => {
        notebooksBody.innerHTML = '';

        if (list.length === 0) {
            notebooksBody.innerHTML = '<tr><td colspan="7" class="text-center">No notebooks match your search.</td></tr>';
            return;
        }

        list.forEach(notebook => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <div class="name-container">
                        <span class="common-name">${notebook.name}</span>
                    </div>
                </td>
                <td class="scientific-name">${notebook.type}</td>
                <td>
                    <span class="taxonomy-badge order-badge">Brand ${notebook.brand}</span>
                </td>
                <td class="text-right font-mono">${notebook.size_leaves}</td>
                <td class="text-right font-mono">${notebook.cost}</td>
                <td class="text-right font-mono">${notebook.cost_per_leaf !== undefined && notebook.cost_per_leaf !== null ? notebook.cost_per_leaf : (parseFloat(notebook.cost.replace(/[^0-9.]/g, '')) / parseInt(notebook.size_leaves, 10)).toFixed(4)}</td>
                <td class="text-center">
                    <button class="action-btn btn-delete" data-id="${notebook.id}" title="Delete notebook">Delete</button>
                </td>
            `;
            notebooksBody.appendChild(tr);
        });
    };

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase().trim();
        if (!query) {
            renderTable(notebooksData);
            return;
        }

        const filtered = notebooksData.filter(notebook => {
            return (
                (notebook.name && notebook.name.toLowerCase().includes(query)) ||
                (notebook.type && notebook.type.toLowerCase().includes(query)) ||
                (notebook.brand && String(notebook.brand).toLowerCase().includes(query))
            );
        });
        renderTable(filtered);
    });

    notebooksBody.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-delete')) {
            const id = e.target.getAttribute('data-id');
            const name = e.target.closest('tr').querySelector('.common-name').textContent;
            
            showConfirm(
                'Delete Notebook',
                `Are you sure you want to delete the "${name}" (ID: ${id}) from the database?`,
                async () => {
                    try {
                        const res = await fetch(`${API_BASE}/notebook/${id}`, {
                            method: 'DELETE'
                        });
                        if (res.ok) {
                            await fetchAndRender();
                        } else {
                            const errData = await res.json();
                            alert(`Error: ${errData.message || 'Could not delete notebook'}`);
                        }
                    } catch (error) {
                        console.error(error);
                        alert('Network error trying to delete notebook.');
                    }
                }
            );
        }
    });

    deleteCategoryBtn.addEventListener('click', () => {
        const category = categorySelect.value;
        if (!category) {
            alert('Please select a category to delete.');
            return;
        }

        showConfirm(
            'Delete Category',
            `WARNING: Are you sure you want to delete ALL notebooks in the "${category.toUpperCase()}" category?`,
            async () => {
                try {
                    const res = await fetch(`${API_BASE}/notebook/size/${category}`, {
                        method: 'DELETE'
                    });
                    
                    const result = await res.json();
                    if (res.ok) {
                        alert(result.message || `Deleted ${result.count} notebooks successfully.`);
                        categorySelect.selectedIndex = 0;
                        await fetchAndRender();
                    } else {
                        alert(`Error: ${result.message || 'Could not delete category'}`);
                    }
                } catch (error) {
                    console.error(error);
                    alert('Network error trying to delete category.');
                }
            }
        );
    });

    refreshBtn.addEventListener('click', fetchAndRender);

    init();
});