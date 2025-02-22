const apiKey= 'AIzaSyDbJOqAmIdtmfTKGKztuto-LXEFxBqTtmo'; // API key created from console.cloud.google.com
const sheetId = '1DpkzKMnE8io4rmBz2uc8KfclJm4FpZnXazk2BacpupA'; // the id of the spreadsheet labelled like: https://docs.google.com/spreadsheets/d/1DpkzKMnE8io4rmBz2uc8KfclJm4FpZnXazk2BacpupA/edit?gid=2122775497#gid=2122775497
const sheetName = 'TestData01'; // Name of the sheet(tab in case multiple tabs) we want to pull the data from
const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${apiKey}`; //Google sheets API v4 URL

// Fetch data from the Google Sheet API
fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        if (data.values) {
            const rows = data.values;
            const tableName = 'transfer_data';

            // Display data in a table
            const table = document.getElementById(tableName);
            rows.forEach(row => {
                const tr = document.createElement('tr');
                row.forEach(cell => {
                    const td = document.createElement('td');
                    td.textContent = cell;
                    tr.appendChild(td);
                });
                table.appendChild(tr);
            });
        } else {
            console.error('No data found in the response');
        }
    })
    .catch(error => console.error('Error fetching data: ', error));