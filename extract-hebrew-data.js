const fs = require('fs');

try {
    // Read the Excel data JSON file
    const data = JSON.parse(fs.readFileSync('F:\\ClaudeCode\\excel-data.json', 'utf8'));
    
    const hebrewData = {
        buildings: new Set(),
        buildingManagers: new Set(),
        teams: new Set(),
        inspectionTypes: new Set(),
        inspectionLeaders: new Set(),
        inspectionRounds: new Set(),
        regulators: new Set(),
        coordinatedOptions: new Set(),
        reportOptions: new Set(),
        reportDistributedOptions: new Set(),
        reinspectionOptions: new Set()
    };
    
    // Process ערכים sheet for building values and other dropdown options
    const valuesSheet = data['ערכים'];
    console.log('Processing ערכים sheet...');
    
    if (valuesSheet && valuesSheet.length > 1) {
        for (let i = 1; i < valuesSheet.length; i++) {
            const row = valuesSheet[i];
            
            // Buildings (column 0)
            if (row[0] && row[0] !== '') {
                hebrewData.buildings.add(row[0].toString());
            }
            
            // Building managers (column 2)
            if (row[2] && row[2] !== '') {
                hebrewData.buildingManagers.add(row[2].toString());
            }
            
            // Teams (column 4)
            if (row[4] && row[4] !== '') {
                hebrewData.teams.add(row[4].toString());
            }
            
            // Inspection types (column 6)
            if (row[6] && row[6] !== '') {
                hebrewData.inspectionTypes.add(row[6].toString());
            }
            
            // Inspection leaders (column 8)
            if (row[8] && row[8] !== '') {
                hebrewData.inspectionLeaders.add(row[8].toString());
            }
            
            // Inspection rounds (column 10)
            if (row[10] && row[10] !== '' && !isNaN(row[10])) {
                hebrewData.inspectionRounds.add(parseInt(row[10]));
            }
            
            // Regulators (column 12)
            if (row[12] && row[12] !== '') {
                hebrewData.regulators.add(row[12].toString());
            }
            
            // Coordinated options (column 14)
            if (row[14] && row[14] !== '') {
                hebrewData.coordinatedOptions.add(row[14].toString());
            }
            
            // Report options (column 16)
            if (row[16] && row[16] !== '') {
                hebrewData.reportOptions.add(row[16].toString());
            }
            
            // Report distributed options (column 18)
            if (row[18] && row[18] !== '') {
                hebrewData.reportDistributedOptions.add(row[18].toString());
            }
            
            // Reinspection options (column 20)
            if (row[20] && row[20] !== '') {
                hebrewData.reinspectionOptions.add(row[20].toString());
            }
        }
    }
    
    // Also process main sheet for additional values
    const mainSheet = data['טבלה מרכזת'];
    console.log('Processing main sheet...');
    
    if (mainSheet && mainSheet.length > 4) { // Skip header rows
        for (let i = 4; i < mainSheet.length; i++) {
            const row = mainSheet[i];
            
            // Buildings
            if (row[0] && row[0] !== '') {
                hebrewData.buildings.add(row[0].toString());
            }
            
            // Building managers
            if (row[1] && row[1] !== '') {
                hebrewData.buildingManagers.add(row[1].toString());
            }
            
            // Teams
            if (row[2] && row[2] !== '') {
                hebrewData.teams.add(row[2].toString());
            }
            
            // Inspection types
            if (row[3] && row[3] !== '') {
                hebrewData.inspectionTypes.add(row[3].toString());
            }
            
            // Inspection leaders
            if (row[4] && row[4] !== '') {
                hebrewData.inspectionLeaders.add(row[4].toString());
            }
            
            // Inspection rounds
            if (row[5] && row[5] !== '' && !isNaN(row[5])) {
                hebrewData.inspectionRounds.add(parseInt(row[5]));
            }
            
            // Coordinated options
            if (row[12] && row[12] !== '') {
                hebrewData.coordinatedOptions.add(row[12].toString());
            }
            
            // Report distributed options
            if (row[14] && row[14] !== '') {
                hebrewData.reportDistributedOptions.add(row[14].toString());
            }
            
            // Reinspection options
            if (row[16] && row[16] !== '') {
                hebrewData.reinspectionOptions.add(row[16].toString());
            }
        }
    }
    
    // Convert Sets to Arrays for JSON serialization
    const finalData = {
        buildings: Array.from(hebrewData.buildings).sort(),
        buildingManagers: Array.from(hebrewData.buildingManagers).sort(),
        teams: Array.from(hebrewData.teams).sort(),
        inspectionTypes: Array.from(hebrewData.inspectionTypes).sort(),
        inspectionLeaders: Array.from(hebrewData.inspectionLeaders).sort(),
        inspectionRounds: Array.from(hebrewData.inspectionRounds).sort((a, b) => a - b),
        regulators: Array.from(hebrewData.regulators).sort(),
        coordinatedOptions: Array.from(hebrewData.coordinatedOptions).sort(),
        reportOptions: Array.from(hebrewData.reportOptions).sort(),
        reportDistributedOptions: Array.from(hebrewData.reportDistributedOptions).sort(),
        reinspectionOptions: Array.from(hebrewData.reinspectionOptions).sort()
    };
    
    console.log('Extracted Hebrew Data:');
    console.log('Buildings:', finalData.buildings);
    console.log('Building Managers:', finalData.buildingManagers);
    console.log('Teams:', finalData.teams);
    console.log('Inspection Types:', finalData.inspectionTypes);
    console.log('Inspection Leaders:', finalData.inspectionLeaders);
    console.log('Inspection Rounds:', finalData.inspectionRounds);
    console.log('Regulators:', finalData.regulators);
    console.log('Coordinated Options:', finalData.coordinatedOptions);
    console.log('Report Options:', finalData.reportOptions);
    console.log('Report Distributed Options:', finalData.reportDistributedOptions);
    console.log('Reinspection Options:', finalData.reinspectionOptions);
    
    // Save extracted data
    fs.writeFileSync('F:\\ClaudeCode\\hebrew-extracted-data.json', JSON.stringify(finalData, null, 2), 'utf8');
    console.log('\nExtracted data saved to: F:\\ClaudeCode\\hebrew-extracted-data.json');
    
} catch (error) {
    console.error('Error:', error.message);
}