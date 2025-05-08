
/* 
    Fetching the data JavaScript code
*/
const apiKey= 'AIzaSyDbJOqAmIdtmfTKGKztuto-LXEFxBqTtmo'; // API key created from console.cloud.google.com
const sheetId = '1DpkzKMnE8io4rmBz2uc8KfclJm4FpZnXazk2BacpupA'; // the id of the spreadsheet labelled like: https://docs.google.com/spreadsheets/d/1DpkzKMnE8io4rmBz2uc8KfclJm4FpZnXazk2BacpupA/edit?gid=2122775497#gid=2122775497
const sheetName = 'TestData01'; // Name of the sheet(tab in case multiple tabs) we want to pull the data from
const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${apiKey}`; //Google sheets API v4 URL

/* 
    Fetch data from the Google Sheet API
    This comes with selected columns and auto scrolls on reload to the left
*/
fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        if (data.values) {
            const rows = data.values;
            const tableName = 'transfer_data';
            const tableBody = document.querySelector(`#${tableName} tbody`);
            const tableHeader = document.querySelector(`#${tableName} thead`);

            // Clear existing rows
            tableBody.innerHTML = '';

            rows.forEach(row => {
                const tr = document.createElement('tr');

                // Columns from the spreadsheet we want to use
                const columnsToInclude = [1, 2, 3, 4, 5, 6, 7, 8, 11, 14, 18, 19, 20, 21, 22, 23];

                columnsToInclude.forEach(index => {
                    const cellValue = row[index] !== undefined && row[index] !== null && row[index] !== ''
                        ? row[index]
                        : '\u00A0'; // Non-breaking space for empty cells

                    const td = document.createElement('td');
                    td.textContent = cellValue; // Set the cell content
                    tr.appendChild(td);
                });

                // Add a data attribute for filtering based on column C (index 2)
                tr.setAttribute('data-category', row[8]); // Assuming column C is at index 2
                tableBody.appendChild(tr);
            });
            // Reset the horizontal scroll position of the window
            window.scrollTo(0, 0); // This resets both vertical and horizontal scroll positions

            // Reset horizontal scroll position of the specific element
            const transferDataElement = document.getElementById('transfer_data');
            if (transferDataElement) {
                transferDataElement.scrollLeft = 0; // Reset horizontal scroll position of the specific element
            }
            // Add filter functionality
            const filters = document.querySelectorAll('.menu-item');
            filters.forEach(filter => {
                filter.addEventListener('click', function() {
                    // Find the anchor for the clicked menu item
                    const anchor_hover = this.querySelector('a');
                    // Set the menu-item css
                    anchor_hover.className = 'menu-item active';

                    // Deactivate all other css hover styling
                    filters.forEach(otherItem => {
                        const other_anchor = otherItem.querySelector('a');
                        if (otherItem !== this) {
                            other_anchor.className = 'menu-item';
                        }
                    });

                    const filterValue = this.getAttribute('data-filter');

                    // Show all rows if 'all' is selected
                    switch(filterValue) {
                        case 'all':
                            tableBody.querySelectorAll('tr').forEach(row => {
                                row.style.display = '';
                            });
                            break;
                        case 'FBS':
                        case 'FCS':
                            tableBody.querySelectorAll('tr').forEach(row => {
                                row.style.display = (row.getAttribute('data-category') === 'I') ? '' : 'none';
                            });
                            break;
                        case 'D2':
                            tableBody.querySelectorAll('tr').forEach(row => {
                                row.style.display = (row.getAttribute('data-category') === 'II') ? '' : 'none';
                            });
                            break;  
                        case 'D3':
                            tableBody.querySelectorAll('tr').forEach(row => {
                                row.style.display = (row.getAttribute('data-category') === 'III') ? '' : 'none';
                            });
                            break;  
                        case 'JUCO':
                            tableHeader.textContent = 'No data for JUCO at this time';
                            tableBody.querySelectorAll('tr').forEach(row => {
                                row.style.display = 'none';
                            });
                            break;
                        case 'NAIA':
                            tableHeader.textContent = 'No data for NAIA at this time';
                            tableBody.querySelectorAll('tr').forEach(row => {
                                row.style.display = 'none';
                            });
                            break;
                        default:
                            console.warn('Unknown filter value:', filterValue);
                    }
                });
            });

        } else {
            console.error('No data found in the response');
        }
    })
    .catch(error => console.error('Error fetching data: ', error));

/*
    Sort the data
*/