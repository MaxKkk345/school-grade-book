// Ôóíêöèÿ äëÿ îòîáðàæåíèÿ íóæíîé âêëàäêè
function showTab(tabId) {
    const tabs = document.querySelectorAll('.tab-content');

    
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove('active');
    }

    const selectedTab = document.getElementById(tabId);  
    
    if (selectedTab !== null) {
        selectedTab.classList.add('active');
    } else {
        console.log('Âêëàäêà ñ id "' + tabId + '" íå íàéäåíà.');
    }

}


// Ôóíêöèÿ äëÿ îáíîâëåíèÿ òåêñòà ñ èìåíåì ôàéëà
function updateFileName() {
    const fileInput = document.getElementById('file-upload');
    const fileNameText = document.getElementById('file-name');

    // Åñëè âûáðàí ôàéë, òî ìåíÿåì åãî íàçâàíèå
    if (fileInput.files.length > 0) { 
        const fileName = fileInput.files[0].name;
        fileNameText.textContent = fileName; 
    } else {
        fileNameText.textContent = 'Ôàéë íå âûáðàí';
    }
}


// Ôóíêöèÿ çàãðóçêè ôàéëà
function uploadFile() {
    const fileInput = document.getElementById('file-upload');

    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = function (event) {
            const fileContent = event.target.result;
            const rows = fileContent.split('\n');
            const previewTableBody = document.querySelector('#file-preview tbody');
            const addTableBody = document.querySelector('#file-add tbody');

            previewTableBody.innerHTML = '';
            addTableBody.innerHTML = '';

            for (let i = 1; i < rows.length; i++) {
                const row = rows[i].trim();

                /*Ñòðîêà íå ïóñòàÿ*/
                if (row) {
                    const columns = row.split(';');

                    const previewRow = createPreviewRow(columns);
                    const addRow = createEditableRow(columns);

                    previewTableBody.appendChild(previewRow);
                    addTableBody.appendChild(addRow);
                }
            }
        };

        reader.readAsText(file, 'windows-1251');
    } else {
        alert("Ïîæàëóéñòà, âûáåðèòå ôàéë!");
    }
}

// Ñîçäàíèå ñòðîêè äëÿ òàáëèöû file-preview
function createPreviewRow(columns) {
    const row = document.createElement('tr');

    columns.forEach(column => {
        const cell = document.createElement('td');
        cell.textContent = column.trim();
        row.appendChild(cell);
    });

    return row;
}

// Ñîçäàíèå ðåäàêòèðóåìîé ñòðîêè äëÿ òàáëèöû file-add
function createEditableRow(columns) {
    const row = document.createElement('tr');
    columns.forEach((column, index) => {
        const cell = document.createElement('td');

        const input = document.createElement('input');
        input.type = 'text';
        input.value = column.trim();

        // Òîëüêî äëÿ ïðåäìåòîâ (index=2)
        if (index >= 2) { 
            input.addEventListener('input', () => {
                // Ðàçðåøàåì ââîä òîëüêî öèôð îò 1 äî 5
                input.value = input.value.replace(/[^1-5]/g, '');
                if (input.value > 5) input.value = 5;
                if (input.value < 1 && input.value !== '') input.value = 1;
            });
        }

        cell.appendChild(input);
        row.appendChild(cell);
    });

    // Ñîçäàåì ÿ÷åéêó äëÿ êíîïêè "óäàëèòü"
    const deleteCell = document.createElement('td');
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Õ'; // 
    deleteButton.classList.add('delete-button'); 
    deleteButton.addEventListener('click', () => {
        const addTableBody = document.querySelector('#file-add tbody');
        if (addTableBody.children.length > 1) {
            row.remove(); 
        } else {
            alert('Íåëüçÿ óäàëèòü ïîñëåäíþþ ñòðîêó!');
        }
    });
    deleteCell.appendChild(deleteButton);
    row.appendChild(deleteCell);

    return row;
}

// Äîáàâëåíèå íîâîé ñòðîêè â òàáëèöó file-add
function addNewRow() {
    const addTableBody = document.querySelector('#file-add tbody');
    const columnsCount = document.querySelector('#file-add thead tr').children.length;
    const newRow = document.createElement('tr');

    for (let i = 0; i < columnsCount; i++) {
        const cell = document.createElement('td');
        const input = document.createElement('input');
        input.type = 'text';

        // Ïðîâåðÿåì, ÿâëÿåòñÿ ëè òåêóùàÿ êîëîíêà ïðåäìåòîì
        if (i >= 2) { // Íà÷èíàÿ ñ êîëîíêè "Èíôîðìàòèêà"
            input.addEventListener('input', () => {
                // Ðàçðåøàåì ââîä òîëüêî öèôð îò 1 äî 5
                input.value = input.value.replace(/[^1-5]/g, '');
                if (input.value > 5) input.value = 5;
                if (input.value < 1 && input.value !== '') input.value = 1;
            });
        }

        cell.appendChild(input);
        newRow.appendChild(cell);
    }

    // Äîáàâëÿåì êíîïêó "Óäàëèòü" ñïðàâà îò ñòðîêè
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Х';
    deleteButton.classList.add('delete-button');
    deleteButton.addEventListener('click', () => {
        if (addTableBody.children.length > 1) {
            newRow.remove();
        } else {
            alert('Íåëüçÿ óäàëèòü ïîñëåäíþþ ñòðîêó!');
        }
    });

    const deleteCell = document.createElement('td');
    deleteCell.appendChild(deleteButton);
    newRow.appendChild(deleteCell);

    addTableBody.appendChild(newRow);
}

// Ñâÿçûâàåì êíîïêó ñ ôóíêöèåé
document.getElementById('add-row-button').addEventListener('click', addNewRow);



// Ôóíêöèÿ äëÿ ñêà÷èâàíèÿ òàáëèöû
function downloadTable() {
    const addTableBody = document.querySelector('#file-add tbody');
    const rows = Array.from(addTableBody.querySelectorAll('tr'));
        
    const headerRow = ['ÔÈÎ', 'Êëàññ', 'Èíôîðìàòèêà', 'Ôèçèêà', 'Ìàòåìàòèêà', 'Ëèòåðàòóðà', 'Ìóçûêà'];

    const csvContent = [];
    csvContent.push(headerRow.join(';'));

    // Ïðîõîäèì ïî âñåì ñòðîêàì òàáëèöû, î÷èùàåì îò ïðîáåëîâ â êîíöå è íà÷àëå
    rows.forEach(row => {
        const inputs = Array.from(row.querySelectorAll('input'));
        const rowData = inputs.map(input => input.value.trim());
        csvContent.push(rowData.join(';')); 
    });

    const csvString = csvContent.join('\n');

    
    const bom = '\uFEFF'; // BOM äëÿ UTF-8
    const csvWithBom = bom + csvString; 

    const csvBlob = new Blob([csvWithBom], { type: 'text/csv;charset=utf-8;' });

    // Ñîçäàåì ññûëêó è èíèöèèðóåì ñêà÷èâàíèå
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(csvBlob);
    downloadLink.download = 'Íîâûé æóðíàë.csv';
    downloadLink.click(); 
}


document.getElementById('download-button').addEventListener('click', downloadTable);
document.getElementById('add-row-button').addEventListener('click', addNewRow);

addNewRow();


// Ôóíêöèÿ äëÿ ïîëó÷åíèÿ ñòàòèñòèêè èç òàáëèöû file-add
function collectTableData(subjectIndex) {
    const tableAdd = document.querySelector('#file-add tbody');
    const rows = Array.from(tableAdd.querySelectorAll('tr'));

    const classStats = {}; 
    const allScores = []; 

    rows.forEach(row => {
        const cells = row.querySelectorAll('td input');
        if (cells.length > subjectIndex) {
            const className = cells[1].value.trim(); // Êëàññ íàõîäèòñÿ â êîëîíêå 2
            const score = parseInt(cells[subjectIndex].value.trim(), 10); 
            if (!isNaN(score)) {
                // Ñîõðàíÿåì îöåíêè ïî êëàññàì. Äîáàâëÿåì íåïîâòîðÿþùèåñÿ êëþ÷è
                if (!classStats[className]) {
                    classStats[className] = [];
                }
                classStats[className].push(score);

                // Ñîõðàíÿåì îáùèå îöåíêè
                allScores.push(score);
            }
        }
    });

    return { classStats, allScores };
}

// Ôóíêöèÿ äëÿ ðàñ÷åòà ñðåäíåé îöåíêè
function calculateAverage(scores) {

    if (scores.length === 0) {
        return 0;
    }


    let total = 0;
    for (let i = 0; i < scores.length; i++) {
        total += scores[i];
    }

    const average = total / scores.length;
    return average;
}


// Ôóíêöèÿ äëÿ ðàñ÷åòà ìåäèàíû
function calculateMedian(scores) {

    if (scores.length === 0) {
        return 0;
    }

    // Ñîðòèðóåì ìàññèâ ÷èñåë ïî âîçðàñòàíèþ
    let sorted = [];
    for (let i = 0; i < scores.length; i++) {
        sorted.push(scores[i]);
    }
    sorted.sort(function (a, b) {
        return a - b;
    });

    const mid = Math.floor(sorted.length / 2);

    // Åñëè êîëè÷åñòâî ýëåìåíòîâ íå÷åòíîå, âîçâðàùàåì ýëåìåíò â ñåðåäèíå
    if (sorted.length % 2 !== 0) {
        return sorted[mid];
    } else {
        // Åñëè êîëè÷åñòâî ýëåìåíòîâ ÷åòíîå, âîçâðàùàåì ñðåäíåå èç äâóõ öåíòðàëüíûõ ýëåìåíòîâ
        const middleLeft = sorted[mid - 1];
        const middleRight = sorted[mid];
        return (middleLeft + middleRight) / 2;
    }
}


// Ôóíêöèÿ äëÿ ïîäñ÷åòà êîëè÷åñòâà îöåíîê
function countScores(scores, value) {
    let count = 0;

    for (let i = 0; i < scores.length; i++) {
      
        if (scores[i] === value) {
            count++; 
        }
    }

    return count;
}


// Ôóíêöèÿ äëÿ çàïîëíåíèÿ òàáëèöû ñòàòèñòèêè êëàññîâ
function updateClassStatsTable(classStats) {
    const tableBody = document.querySelector('#table_stats_classes tbody');


       tableBody.innerHTML = '';



    Object.keys(classStats).forEach(className => {
        const scores = classStats[className];
        const totalStudents = scores.length;
        const average = calculateAverage(scores).toFixed(2);
        const median = calculateMedian(scores);
        const count5 = countScores(scores, 5);
        const count4 = countScores(scores, 4);
        const count3 = countScores(scores, 3);
        const count2 = countScores(scores, 2);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${className}</td>
            <td>${average}</td>
            <td>${median}</td>
            <td>${count5} (${((count5 / totalStudents) * 100).toFixed(1)}%)</td>
            <td>${count4} (${((count4 / totalStudents) * 100).toFixed(1)}%)</td>
            <td>${count3} (${((count3 / totalStudents) * 100).toFixed(1)}%)</td>
            <td>${count2} (${((count2 / totalStudents) * 100).toFixed(1)}%)</td>
        `;
        tableBody.appendChild(row);
    });


}

// Ôóíêöèÿ äëÿ çàïîëíåíèÿ òàáëèöû îáùåé ñòàòèñòèêè
function updateAllStatsTable(allScores) {
    const tableBody = document.querySelector('#table_stats_all tbody');
    tableBody.innerHTML = '';

    const totalStudents = allScores.length;
    const average = calculateAverage(allScores).toFixed(2);
    const median = calculateMedian(allScores);
    const count5 = countScores(allScores, 5);
    const count4 = countScores(allScores, 4);
    const count3 = countScores(allScores, 3);
    const count2 = countScores(allScores, 2);

    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${average}</td>
        <td>${median}</td>
        <td>${count5} (${((count5 / totalStudents) * 100).toFixed(1)}%)</td>
        <td>${count4} (${((count4 / totalStudents) * 100).toFixed(1)}%)</td>
        <td>${count3} (${((count3 / totalStudents) * 100).toFixed(1)}%)</td>
        <td>${count2} (${((count2 / totalStudents) * 100).toFixed(1)}%)</td>
    `;
    tableBody.appendChild(row);
}

// Ñâÿçûâàíèå âûïàäàþùåãî ñïèñêà ñ ôóíêöèåé îáíîâëåíèÿ òàáëèöû
function handleSubjectChange() {
    const selectElement = document.querySelector('#table-stats-select');
    const subject = selectElement.value;

    const subjectIndexMap = {
        informatics: 2,
        physics: 3,
        mathematics: 4,
        literature: 5,
        music: 6
    };

    const subjectIndex = subjectIndexMap[subject];
    if (subjectIndex !== undefined) {
        const { classStats, allScores } = collectTableData(subjectIndex);
        updateClassStatsTable(classStats);
        updateAllStatsTable(allScores);
    } else {
        console.error('Íåâåðíûé ïðåäìåò:', subject);
    }
}

// Ïðèâÿçûâàåì ñîáûòèå èçìåíåíèÿ ê âûïàäàþùåìó ñïèñêó
const subjectSelect = document.querySelector('#table-stats-select');
subjectSelect.addEventListener('change', handleSubjectChange);





// Ïîäêëþ÷åíèå Chart.js è îáíîâëåíèå ãðàôè÷åñêîé ñòàòèñòèêè
let classStatsChart;
let medianStatsChart;
let countStatsCharts = [];
let allStatsChart;

function updateGraphicStats(subjectIndex) {
    const { classStats, allScores } = collectTableData(subjectIndex);

    // Îáíîâëÿåì ãðàôèê ñðåäíåé îöåíêè ïî êëàññàì
    const classLabels = Object.keys(classStats);
    const classAverages = classLabels.map(label => calculateAverage(classStats[label]));

    const ctxClass = document.getElementById('class-stats-chart').getContext('2d');

    //Óäàëÿåì ñóùåñòâóþùèé ãðàôèê
    if (classStatsChart) {
        classStatsChart.destroy();
    }
    classStatsChart = new Chart(ctxClass, {
        type: 'bar',
        data: {
            labels: classLabels,
            datasets: [{
                label: 'Ñðåäíÿÿ îöåíêà ïî êëàññàì',
                data: classAverages,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: false,
                                        
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Îáíîâëÿåì ãðàôèê ìåäèàí ïî êëàññàì
    const classMedians = classLabels.map(label => calculateMedian(classStats[label]));

    const ctxMedian = document.getElementById('median-stats-chart').getContext('2d');
    if (medianStatsChart) {
        medianStatsChart.destroy();
    }
    medianStatsChart = new Chart(ctxMedian, {
        type: 'bar',
        data: {
            labels: classLabels,
            datasets: [{
                label: 'Ìåäèàíà ïî êëàññàì',
                data: classMedians,
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: false,
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Îáíîâëÿåì ãðàôèêè êîëè÷åñòâà îöåíîê ïî êëàññàì (5, 4, 3, 2)
    const grades = [5, 4, 3, 2];
    const ctxCountElements = ['count-stats-chart-5', 'count-stats-chart-4', 'count-stats-chart-3', 'count-stats-chart-2']
        .map(id => document.getElementById(id).getContext('2d'));

    countStatsCharts.forEach(chart => chart.destroy());
    countStatsCharts = grades.map((grade, index) => {
        const counts = classLabels.map(label => countScores(classStats[label], grade));

        return new Chart(ctxCountElements[index], {
            type: 'bar',
            data: {
                labels: classLabels,
                datasets: [{
                    label: `Êîëè÷åñòâî îöåíîê ${grade} ïî êëàññàì`,
                    data: counts,
                    backgroundColor: 'rgba(255, 159, 64, 0.2)',
                    borderColor: 'rgba(255, 159, 64, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: false,
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    });

    // Îáíîâëÿåì ãðàôèê îáùèõ îöåíîê
    const allLabels = ['5', '4', '3', '2'];
    const allCounts = allLabels.map(label => countScores(allScores, parseInt(label)));

    const ctxAll = document.getElementById('all-stats-chart').getContext('2d');
    if (allStatsChart) {
        allStatsChart.destroy();
    }
    allStatsChart = new Chart(ctxAll, {
        type: 'pie',
        data: {
            labels: allLabels,
            datasets: [{
                label: 'Ðàñïðåäåëåíèå îöåíîê',
                data: allCounts,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Ðàñïðåäåëåíèå îöåíîê'
                }
            }
        }
    });
}

// Ïðèâÿçûâàåì èçìåíåíèå âûïàäàþùåãî ñïèñêà ê îáíîâëåíèþ ãðàôèêîâ
const graphicStatsSelect = document.querySelector('#graphic-stats select');
graphicStatsSelect.addEventListener('change', () => {
    const subjectIndexMap = {
        informatics: 2,
        physics: 3,
        mathematics: 4,
        literature: 5,
        music: 6
    };

    const subjectIndex = subjectIndexMap[graphicStatsSelect.value];
    if (subjectIndex !== undefined) {
        updateGraphicStats(subjectIndex);
    } else {
        console.error('Íåâåðíûé ïðåäìåò:', graphicStatsSelect.value);
    }
});
