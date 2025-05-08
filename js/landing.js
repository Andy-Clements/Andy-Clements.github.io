
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
                switch (row[11]) {
                    case 'I':
                        tr.setAttribute('data-category', 'FBS');
                        break;
                    case 'II':
                        tr.setAttribute('data-category', 'D2');
                        break;
                    case 'III':
                        tr.setAttribute('data-category', 'D3');
                        break;
                    default:
                        tr.setAttribute('data-category', 'none');
                }
                tableBody.appendChild(tr);
            });
            // Reset the horizontal scroll position of the window
            window.scrollTo(0, 0); // This resets both vertical and horizontal scroll positions

            // Reset horizontal scroll position of the specific element
            const transferDataElement = document.getElementById('transfer_data');
            if (transferDataElement) {
                transferDataElement.scrollLeft = 0; // Reset horizontal scroll position of the specific element
            }
            // Function to filter rows based on category
            function filterRows(filterValue) {
                const rows = tableBody.querySelectorAll('tr');
                rows.forEach(row => {
                    if(row.children[8].textContent !== 'Div') {
                        const category = row.getAttribute('data-category');
                        if (filterValue === 'All') {
                            row.style.display = ''; // Show all rows
                        } else if (category === filterValue) {
                            row.style.display = ''; // Show matching rows
                        } else {
                            row.style.display = 'none'; // Hide non-matching rows
                        }
                    }else{
                        row.style.display = ''; // show the column names
                    }
                });
            }
            // Add filter functionality
            const filters = document.querySelectorAll('.menu-item');
            filters.forEach(filter => {
                filter.addEventListener('click', function(event) {
                    event.preventDefault(); // Prevent default anchor behavior

                    // Remove active class from all menu links
                    filters.forEach(otherItem => {
                        const otherAnchor = otherItem.querySelector('a');
                        otherAnchor.classList.remove('active'); // Remove active class
                    });

                    // Add active class to the clicked menu item
                    const anchorHover = this.querySelector('a');
                    anchorHover.classList.add('active'); // Set the clicked item as active

                    const filterValue = this.getAttribute('data-filter');
                    if(filterValue === 'FCS' || filterValue === 'JUCO' || filterValue === 'NAIA'){
                        tableHeader.textContent = 'No information at this time';
                    }else{
                        tableHeader.textContent = filterValue + ' Players Metrics';
                    }
                    filterRows(filterValue); // Call the filter function
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