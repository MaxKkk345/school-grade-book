// ������� ��� ����������� ������ �������
function showTab(tabId) {
    const tabs = document.querySelectorAll('.tab-content');

    
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove('active');
    }

    const selectedTab = document.getElementById(tabId);  
    
    if (selectedTab !== null) {
        selectedTab.classList.add('active');
    } else {
        console.log('������� � id "' + tabId + '" �� �������.');
    }

}


// ������� ��� ���������� ������ � ������ �����
function updateFileName() {
    const fileInput = document.getElementById('file-upload');
    const fileNameText = document.getElementById('file-name');

    // ���� ������ ����, �� ������ ��� ��������
    if (fileInput.files.length > 0) { 
        const fileName = fileInput.files[0].name;
        fileNameText.textContent = fileName; 
    } else {
        fileNameText.textContent = '���� �� ������';
    }
}


// ������� �������� �����
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

                /*������ �� ������*/
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
        alert("����������, �������� ����!");
    }
}

// �������� ������ ��� ������� file-preview
function createPreviewRow(columns) {
    const row = document.createElement('tr');

    columns.forEach(column => {
        const cell = document.createElement('td');
        cell.textContent = column.trim();
        row.appendChild(cell);
    });

    return row;
}

// �������� ������������� ������ ��� ������� file-add
function createEditableRow(columns) {
    const row = document.createElement('tr');
    columns.forEach((column, index) => {
        const cell = document.createElement('td');

        const input = document.createElement('input');
        input.type = 'text';
        input.value = column.trim();

        // ������ ��� ��������� (index=2)
        if (index >= 2) { 
            input.addEventListener('input', () => {
                // ��������� ���� ������ ���� �� 1 �� 5
                input.value = input.value.replace(/[^1-5]/g, '');
                if (input.value > 5) input.value = 5;
                if (input.value < 1 && input.value !== '') input.value = 1;
            });
        }

        cell.appendChild(input);
        row.appendChild(cell);
    });

    // ������� ������ ��� ������ "�������"
    const deleteCell = document.createElement('td');
    const deleteButton = document.createElement('button');
    deleteButton.textContent = '�'; // 
    deleteButton.classList.add('delete-button'); 
    deleteButton.addEventListener('click', () => {
        const addTableBody = document.querySelector('#file-add tbody');
        if (addTableBody.children.length > 1) {
            row.remove(); 
        } else {
            alert('������ ������� ��������� ������!');
        }
    });
    deleteCell.appendChild(deleteButton);
    row.appendChild(deleteCell);

    return row;
}

// ���������� ����� ������ � ������� file-add
function addNewRow() {
    const addTableBody = document.querySelector('#file-add tbody');
    const columnsCount = document.querySelector('#file-add thead tr').children.length;
    const newRow = document.createElement('tr');

    for (let i = 0; i < columnsCount; i++) {
        const cell = document.createElement('td');
        const input = document.createElement('input');
        input.type = 'text';

        // ���������, �������� �� ������� ������� ���������
        if (i >= 2) { // ������� � ������� "�����������"
            input.addEventListener('input', () => {
                // ��������� ���� ������ ���� �� 1 �� 5
                input.value = input.value.replace(/[^1-5]/g, '');
                if (input.value > 5) input.value = 5;
                if (input.value < 1 && input.value !== '') input.value = 1;
            });
        }

        cell.appendChild(input);
        newRow.appendChild(cell);
    }

    // ��������� ������ "�������" ������ �� ������
    const deleteButton = document.createElement('button');
    deleteButton.textContent = '�';
    deleteButton.classList.add('delete-button');
    deleteButton.addEventListener('click', () => {
        if (addTableBody.children.length > 1) {
            newRow.remove();
        } else {
            alert('������ ������� ��������� ������!');
        }
    });

    const deleteCell = document.createElement('td');
    deleteCell.appendChild(deleteButton);
    newRow.appendChild(deleteCell);

    addTableBody.appendChild(newRow);
}

// ��������� ������ � ��������
document.getElementById('add-row-button').addEventListener('click', addNewRow);



// ������� ��� ���������� �������
function downloadTable() {
    const addTableBody = document.querySelector('#file-add tbody');
    const rows = Array.from(addTableBody.querySelectorAll('tr'));
        
    const headerRow = ['���', '�����', '�����������', '������', '����������', '����������', '������'];

    const csvContent = [];
    csvContent.push(headerRow.join(';'));

    // �������� �� ���� ������� �������, ������� �� �������� � ����� � ������
    rows.forEach(row => {
        const inputs = Array.from(row.querySelectorAll('input'));
        const rowData = inputs.map(input => input.value.trim());
        csvContent.push(rowData.join(';')); 
    });

    const csvString = csvContent.join('\n');

    
    const bom = '\uFEFF'; // BOM ��� UTF-8
    const csvWithBom = bom + csvString; 

    const csvBlob = new Blob([csvWithBom], { type: 'text/csv;charset=utf-8;' });

    // ������� ������ � ���������� ����������
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(csvBlob);
    downloadLink.download = '����� ������.csv';
    downloadLink.click(); 
}


document.getElementById('download-button').addEventListener('click', downloadTable);
document.getElementById('add-row-button').addEventListener('click', addNewRow);

addNewRow();


// ������� ��� ��������� ���������� �� ������� file-add
function collectTableData(subjectIndex) {
    const tableAdd = document.querySelector('#file-add tbody');
    const rows = Array.from(tableAdd.querySelectorAll('tr'));

    const classStats = {}; 
    const allScores = []; 

    rows.forEach(row => {
        const cells = row.querySelectorAll('td input');
        if (cells.length > subjectIndex) {
            const className = cells[1].value.trim(); // ����� ��������� � ������� 2
            const score = parseInt(cells[subjectIndex].value.trim(), 10); 
            if (!isNaN(score)) {
                // ��������� ������ �� �������. ��������� ��������������� �����
                if (!classStats[className]) {
                    classStats[className] = [];
                }
                classStats[className].push(score);

                // ��������� ����� ������
                allScores.push(score);
            }
        }
    });

    return { classStats, allScores };
}

// ������� ��� ������� ������� ������
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


// ������� ��� ������� �������
function calculateMedian(scores) {

    if (scores.length === 0) {
        return 0;
    }

    // ��������� ������ ����� �� �����������
    let sorted = [];
    for (let i = 0; i < scores.length; i++) {
        sorted.push(scores[i]);
    }
    sorted.sort(function (a, b) {
        return a - b;
    });

    const mid = Math.floor(sorted.length / 2);

    // ���� ���������� ��������� ��������, ���������� ������� � ��������
    if (sorted.length % 2 !== 0) {
        return sorted[mid];
    } else {
        // ���� ���������� ��������� ������, ���������� ������� �� ���� ����������� ���������
        const middleLeft = sorted[mid - 1];
        const middleRight = sorted[mid];
        return (middleLeft + middleRight) / 2;
    }
}


// ������� ��� �������� ���������� ������
function countScores(scores, value) {
    let count = 0;

    for (let i = 0; i < scores.length; i++) {
      
        if (scores[i] === value) {
            count++; 
        }
    }

    return count;
}


// ������� ��� ���������� ������� ���������� �������
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

// ������� ��� ���������� ������� ����� ����������
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

// ���������� ����������� ������ � �������� ���������� �������
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
        console.error('�������� �������:', subject);
    }
}

// ����������� ������� ��������� � ����������� ������
const subjectSelect = document.querySelector('#table-stats-select');
subjectSelect.addEventListener('change', handleSubjectChange);





// ����������� Chart.js � ���������� ����������� ����������
let classStatsChart;
let medianStatsChart;
let countStatsCharts = [];
let allStatsChart;

function updateGraphicStats(subjectIndex) {
    const { classStats, allScores } = collectTableData(subjectIndex);

    // ��������� ������ ������� ������ �� �������
    const classLabels = Object.keys(classStats);
    const classAverages = classLabels.map(label => calculateAverage(classStats[label]));

    const ctxClass = document.getElementById('class-stats-chart').getContext('2d');

    //������� ������������ ������
    if (classStatsChart) {
        classStatsChart.destroy();
    }
    classStatsChart = new Chart(ctxClass, {
        type: 'bar',
        data: {
            labels: classLabels,
            datasets: [{
                label: '������� ������ �� �������',
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

    // ��������� ������ ������ �� �������
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
                label: '������� �� �������',
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

    // ��������� ������� ���������� ������ �� ������� (5, 4, 3, 2)
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
                    label: `���������� ������ ${grade} �� �������`,
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

    // ��������� ������ ����� ������
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
                label: '������������� ������',
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
                    text: '������������� ������'
                }
            }
        }
    });
}

// ����������� ��������� ����������� ������ � ���������� ��������
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
        console.error('�������� �������:', graphicStatsSelect.value);
    }
});