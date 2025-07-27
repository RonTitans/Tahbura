// Extract Unique Values from Hebrew Inspection Excel
// חילוץ ערכים ייחודיים מקובץ האקסל של מערכת הבדיקות העברית

import XLSX from 'xlsx'
import fs from 'fs'

const extractUniqueValues = (filePath) => {
  console.log(`📊 Extracting unique values from: ${filePath}`)
  
  const workbook = XLSX.readFile(filePath)
  const result = {
    mainSheet: {},
    valuesSheet: {},
    columnMappings: {},
    summary: {}
  }
  
  // Process main sheet (טבלה מרכזת)
  const mainSheetName = 'טבלה מרכזת'
  if (workbook.Sheets[mainSheetName]) {
    const mainData = XLSX.utils.sheet_to_json(workbook.Sheets[mainSheetName], { header: 1 })
    
    // Headers are at row 4 (index 3)
    const headers = mainData[3] || []
    const dataRows = mainData.slice(4)
    
    console.log(`📋 Main sheet headers:`, headers.filter(h => h))
    
    // Extract unique values for each column
    headers.forEach((header, index) => {
      if (!header) return
      
      const cleanHeader = header.replace(/\r\n/g, ' ')
      const columnValues = dataRows
        .map(row => row[index])
        .filter(val => val !== null && val !== undefined && val !== '')
        .map(val => String(val).trim())
      
      const uniqueValues = [...new Set(columnValues)]
      
      result.mainSheet[cleanHeader] = {
        totalCount: columnValues.length,
        uniqueCount: uniqueValues.length,
        uniqueValues: uniqueValues.slice(0, 50), // First 50 unique values
        sampleValues: columnValues.slice(0, 10)
      }
      
      console.log(`   ${cleanHeader}: ${uniqueValues.length} unique values (${columnValues.length} total)`)
    })
  }
  
  // Process values sheet (ערכים)
  const valuesSheetName = 'ערכים'
  if (workbook.Sheets[valuesSheetName]) {
    const valuesData = XLSX.utils.sheet_to_json(workbook.Sheets[valuesSheetName], { header: 1 })
    
    console.log(`\n📊 Values sheet analysis:`)
    console.log(`   Rows: ${valuesData.length}`)
    
    // Find columns with meaningful data
    const maxCols = Math.max(...valuesData.map(row => row.length))
    
    for (let colIndex = 0; colIndex < maxCols; colIndex++) {
      const columnValues = valuesData
        .map(row => row[colIndex])
        .filter(val => val !== null && val !== undefined && val !== '')
        .map(val => String(val).trim())
      
      if (columnValues.length > 0) {
        const uniqueValues = [...new Set(columnValues)]
        const columnName = `Column_${colIndex + 1}` + (columnValues[0] ? `_${columnValues[0].substring(0, 10)}` : '')
        
        result.valuesSheet[columnName] = {
          totalCount: columnValues.length,
          uniqueCount: uniqueValues.length,
          uniqueValues: uniqueValues.slice(0, 100), // More values for lookup tables
          allValues: uniqueValues // Store all for critical lookups
        }
        
        console.log(`   ${columnName}: ${uniqueValues.length} unique values`)
        
        // Show first few values for context
        if (uniqueValues.length <= 20) {
          console.log(`     Values: ${uniqueValues.slice(0, 10).join(', ')}${uniqueValues.length > 10 ? '...' : ''}`)
        }
      }
    }
  }
  
  // Generate column mappings for database design
  result.columnMappings = {
    'מבנה': 'building_code',
    'מנהל מבנה': 'building_manager',
    'צוות אדום': 'red_team',
    'סוג הבדיקה': 'inspection_type',
    'מוביל הבדיקה': 'inspection_leader',
    'סבב בדיקות': 'inspection_round',
    'רגולטור 1': 'regulator_1',
    'רגולטור 2': 'regulator_2', 
    'רגולטור 3': 'regulator_3',
    'רגולטור 4': 'regulator_4',
    'לוז ביצוע מתואם/ ריאלי': 'scheduled_execution_date',
    'יעד לסיום': 'target_completion_date',
    'האם מתואם מול זכיין?': 'coordinated_with_contractor',
    'צרופת דוח ליקויים': 'defects_report_attached',
    'האם הדוח הופץ': 'report_distributed',
    'תאריך הפצת הדוח': 'report_distribution_date',
    'בדיקה חוזרת': 'follow_up_inspection',
    'התרשמות מהבדיקה': 'inspection_notes'
  }
  
  // Generate summary statistics
  result.summary = {
    totalInspections: result.mainSheet['מבנה']?.totalCount || 0,
    uniqueBuildings: result.mainSheet['מבנה']?.uniqueCount || 0,
    uniqueInspectionTypes: result.mainSheet['סוג הבדיקה']?.uniqueCount || 0,
    uniqueInspectionLeaders: result.mainSheet['מוביל הבדיקה']?.uniqueCount || 0,
    uniqueBuildingManagers: result.mainSheet['מנהל מבנה']?.uniqueCount || 0
  }
  
  return result
}

// Save extracted data
const saveExtractedData = (data, outputPath) => {
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf8')
  console.log(`💾 Extracted data saved to: ${outputPath}`)
}

// Generate database schema insights
const generateSchemaInsights = (data) => {
  console.log(`\n🔍 DATABASE SCHEMA INSIGHTS:`)
  console.log(`=====================================`)
  
  console.log(`\n📊 MAIN ENTITIES:`)
  console.log(`• Buildings: ${data.summary.uniqueBuildings} unique`)
  console.log(`• Inspection Types: ${data.summary.uniqueInspectionTypes} unique`)
  console.log(`• Inspection Leaders: ${data.summary.uniqueInspectionLeaders} unique`)
  console.log(`• Building Managers: ${data.summary.uniqueBuildingManagers} unique`)
  console.log(`• Total Inspections: ${data.summary.totalInspections}`)
  
  console.log(`\n🏢 BUILDINGS:`)
  if (data.mainSheet['מבנה']) {
    console.log(`   Sample building codes: ${data.mainSheet['מבנה'].sampleValues.slice(0, 10).join(', ')}`)
  }
  
  console.log(`\n🔍 INSPECTION TYPES:`)
  if (data.mainSheet['סוג הבדיקה']) {
    console.log(`   Sample types: ${data.mainSheet['סוג הבדיקה'].uniqueValues.slice(0, 5).join(', ')}`)
  }
  
  console.log(`\n👥 INSPECTION LEADERS:`)
  if (data.mainSheet['מוביל הבדיקה']) {
    console.log(`   Leaders: ${data.mainSheet['מוביל הבדיקה'].uniqueValues.join(', ')}`)
  }
  
  console.log(`\n🏗️ BUILDING MANAGERS:`)
  if (data.mainSheet['מנהל מבנה']) {
    console.log(`   Managers: ${data.mainSheet['מנהל מבנה'].uniqueValues.join(', ')}`)
  }
  
  console.log(`\n📋 RECOMMENDED TABLES:`)
  console.log(`1. buildings (building_code, name_hebrew, manager_id, is_active)`)
  console.log(`2. users (id, name_hebrew, role, email, is_active)`)
  console.log(`3. inspection_types (id, name_hebrew, category, estimated_duration)`)
  console.log(`4. inspections (id, building_id, type_id, leader_id, round, status)`)
  console.log(`5. inspection_regulators (inspection_id, regulator_name, position)`)
  console.log(`6. inspection_reports (inspection_id, report_attached, distributed, notes)`)
}

// Main execution
const main = () => {
  try {
    const filePath = 'F:\\ClaudeCode\\work\\inspection-tracker\\inspections.xlsx'
    const outputPath = 'F:\\ClaudeCode\\work\\inspection-tracker\\analysis\\unique-values.json'
    
    const extractedData = extractUniqueValues(filePath)
    saveExtractedData(extractedData, outputPath)
    generateSchemaInsights(extractedData)
    
    console.log(`\n✅ Unique values extraction completed!`)
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

main()