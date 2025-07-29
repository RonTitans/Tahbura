const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

try {
    // Read the Excel file
    const filePath = 'C:\\Users\\Ron Geller\\Downloads\\קובץ בדיקות כולל לקריית התקשוב גרסא מלאה 150725.xlsx';
    
    console.log('Reading Excel file...');
    const workbook = XLSX.readFile(filePath);
    
    console.log('Available sheets:', workbook.SheetNames);
    
    // Read all sheets
    const allData = {};
    
    workbook.SheetNames.forEach(sheetName => {
        console.log(`\n=== Processing sheet: ${sheetName} ===`);
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
        
        allData[sheetName] = jsonData;
        
        console.log(`Rows in ${sheetName}:`, jsonData.length);
        if (jsonData.length > 0) {
            console.log('First few rows:');
            jsonData.slice(0, 10).forEach((row, index) => {
                console.log(`Row ${index}:`, row);
            });
        }
    });
    
    // Save all data to a JSON file for further processing
    const outputPath = 'F:\\ClaudeCode\\excel-data.json';
    fs.writeFileSync(outputPath, JSON.stringify(allData, null, 2), 'utf8');
    console.log(`\nData saved to: ${outputPath}`);
    
} catch (error) {
    console.error('Error reading Excel file:', error.message);
    
    // If XLSX module is not installed, provide instructions
    if (error.code === 'MODULE_NOT_FOUND') {
        console.log('\nXLSX module not found. Installing...');
        require('child_process').execSync('npm install xlsx', { stdio: 'inherit' });
        console.log('Please run the script again.');
    }
}