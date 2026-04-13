let allItems = [];
let filteredItems = [];

document.addEventListener('DOMContentLoaded', function() {
    loadItems();
    setupEventListeners();
});

function loadItems() {
    chrome.storage.local.get(['savedTexts'], function(result) {
        allItems = result.savedTexts || [];
        filteredItems = [...allItems];
        renderItems();
    });
}

function renderItems() {
    const container = document.getElementById('items-list');
    const emptyState = document.getElementById('empty-state');

    container.innerHTML = '';

    if (filteredItems.length === 0) {
        emptyState.style.display = 'block';
        emptyState.innerHTML = allItems.length === 0
            ? '<p>No saved items found.</p>'
            : '<p class="no-results">No items match your search.</p>';
        return;
    }

    emptyState.style.display = 'none';

    filteredItems.forEach((item, index) => {
        const itemEl = document.createElement('div');
        itemEl.className = 'item';
        itemEl.innerHTML = `
            <div class="item-text">${escapeHtml(item.text)}</div>
            <div class="item-meta">
                <a href="${escapeHtml(item.url)}" target="_blank" class="item-url" title="${escapeHtml(item.url)}">${escapeHtml(item.url)}</a>
                <div class="item-actions">
                    <span class="item-date">${formatDate(item.date)}</span>
                    <button class="btn-delete" data-index="${index}">Delete</button>
                </div>
            </div>
        `;
        container.appendChild(itemEl);
    });

    // Re-attach delete listeners
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            deleteItem(index);
        });
    });
}

function setupEventListeners() {
    // Search
    document.getElementById('search').addEventListener('input', function(e) {
        const query = e.target.value.toLowerCase();
        filterItems(query);
    });

    // Sort
    document.getElementById('sort').addEventListener('change', function(e) {
        sortItems(e.target.value);
    });

    // Export All button
    document.getElementById('export-all').addEventListener('click', function() {
        showExportOptions();
    });

    // Export filtered button
    document.getElementById('export-filtered').addEventListener('click', function() {
        exportData(filteredItems);
    });

    // Export cancel button
    document.getElementById('export-cancel').addEventListener('click', function() {
        hideExportOptions();
    });

    // Delete All button
    document.getElementById('delete-all').addEventListener('click', function() {
        deleteAllItems();
    });
}

function filterItems(query) {
    if (!query) {
        filteredItems = [...allItems];
    } else {
        filteredItems = allItems.filter(item =>
            item.text.toLowerCase().includes(query) ||
            item.url.toLowerCase().includes(query)
        );
    }
    renderItems();
}

function sortItems(order) {
    filteredItems.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return order === 'newest' ? dateB - dateA : dateA - dateB;
    });
    renderItems();
}

function showExportOptions() {
    document.getElementById('export-options').style.display = 'block';
}

function hideExportOptions() {
    document.getElementById('export-options').style.display = 'none';
}

function exportData(items) {
    const dataStr = JSON.stringify(items, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `baginstrument-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    hideExportOptions();
}

function deleteItem(index) {
    // Find the actual item in allItems based on filtered position
    const itemToDelete = filteredItems[index];

    chrome.storage.local.get(['savedTexts'], function(result) {
        let savedTexts = result.savedTexts || [];
        // Find and remove the item by matching date and text
        const originalIndex = savedTexts.findIndex(
            item => item.date === itemToDelete.date && item.text === itemToDelete.text
        );
        if (originalIndex !== -1) {
            savedTexts.splice(originalIndex, 1);
            chrome.storage.local.set({ savedTexts }, function() {
                loadItems(); // Reload all items
            });
        }
    });
}

function deleteAllItems() {
    if (confirm('Are you sure you want to delete all saved items? This cannot be undone.')) {
        chrome.storage.local.set({ savedTexts: [] }, function() {
            loadItems();
        });
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleString();
}
