// Deep Excel Analysis Script for Hebrew Inspection System
// סקריפט ניתוח מעמיק לקובץ אקסל של מערכת בדיקות עברית

import XLSX from 'xlsx'
import fs from 'fs'
import path from 'path'

/**
 * Deep analysis of Excel file structure and content
 */
export const analyzeExcelFile = (filePath) => {
  try {
    console.log(`📖 Starting deep analysis of Excel file: ${filePath}`)
    
    const workbook = XLSX.readFile(filePath)
    const analysis = {
      fileInfo: {
        fileName: path.basename(filePath),
        sheetCount: workbook.SheetNames.length,
        sheetNames: workbook.SheetNames
      },
      sheets: {},
      summary: {
        totalRecords: 0,
        uniqueValues: {},
        relationships: {},
        dataQuality: {}
      }
    }
    
    // Analyze each sheet in detail
    workbook.SheetNames.forEach(sheetName => {
      console.log(`📊 Analyzing sheet: ${sheetName}`)
      analysis.sheets[sheetName] = analyzeSheet(workbook.Sheets[sheetName], sheetName)
      analysis.summary.totalRecords += analysis.sheets[sheetName].rowCount
    })
    
    // Generate cross-sheet analysis
    analysis.relationships = analyzeCrossSheetRelationships(analysis.sheets)
    analysis.recommendations = generateRecommendations(analysis)
    
    console.log(`✅ Analysis completed for ${Object.keys(analysis.sheets).length} sheets`)
    return analysis
    
  } catch (error) {
    console.error('❌ Error analyzing Excel file:', error.message)
    throw error
  }
}

/**
 * Analyze individual sheet structure and content
 */
const analyzeSheet = (worksheet, sheetName) => {
  const range = XLSX.utils.decode_range(worksheet['!ref'])
  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: null })
  
  const analysis = {
    sheetName,
    dimensions: {
      rows: range.e.r + 1,
      cols: range.e.c + 1,
      range: worksheet['!ref']
    },
    rowCount: data.length,
    headers: {},
    columns: {},
    dataTypes: {},
    uniqueValues: {},
    nullCounts: {},
    sampleData: []
  }
  
  if (data.length === 0) return analysis
  
  // Analyze header structure (first 4 rows for complex headers)
  analysis.headers = analyzeHeaders(data.slice(0, 4))
  
  // Get actual data rows (skip headers)
  const dataRows = data.slice(analysis.headers.dataStartRow || 1)
  analysis.rowCount = dataRows.length
  
  // Analyze each column
  const actualHeaders = analysis.headers.cleanHeaders || data[0] || []
  actualHeaders.forEach((header, colIndex) => {
    if (!header) return
    
    const columnData = dataRows.map(row => row[colIndex]).filter(val => val != null)
    
    analysis.columns[header] = {
      index: colIndex,
      totalValues: columnData.length,
      nullCount: dataRows.length - columnData.length,
      dataType: detectDataType(columnData),
      uniqueCount: new Set(columnData.map(v => String(v))).size,
      sampleValues: columnData.slice(0, 10),
      hasDropdownIndicator: checkForDropdownIndicator(data, colIndex)
    }
    
    // Store unique values for key columns
    if (columnData.length > 0 && columnData.length < 200) {
      analysis.uniqueValues[header] = [...new Set(columnData.map(v => String(v)))]
    }
  })
  
  // Sample data for review
  analysis.sampleData = dataRows.slice(0, 5).map(row => {
    const obj = {}
    actualHeaders.forEach((header, index) => {
      if (header && row[index] != null) {
        obj[header] = row[index]
      }
    })
    return obj
  })
  
  return analysis
}

/**
 * Analyze header structure including multi-row headers
 */
const analyzeHeaders = (headerRows) => {
  const analysis = {
    rowCount: headerRows.length,
    structure: [],
    dropdownIndicators: [],
    cleanHeaders: [],
    dataStartRow: 1
  }
  
  headerRows.forEach((row, rowIndex) => {
    analysis.structure.push({
      rowIndex,
      values: row || [],
      hasDropdownMarkers: row ? row.some(cell => 
        cell && typeof cell === 'string' && cell.includes('רשימה נפתחת')
      ) : false
    })
    
    // Look for dropdown indicators
    if (row) {
      row.forEach((cell, colIndex) => {
        if (cell && typeof cell === 'string' && cell.includes('רשימה נפתחת')) {
          analysis.dropdownIndicators.push({ row: rowIndex, col: colIndex, text: cell })
        }
      })
    }
  })
  
  // Find the actual header row (usually has most non-null values)
  let bestHeaderRow = 0
  let maxNonNullCount = 0
  
  headerRows.forEach((row, index) => {
    if (row) {
      const nonNullCount = row.filter(cell => cell != null && cell !== '').length
      if (nonNullCount > maxNonNullCount) {
        maxNonNullCount = nonNullCount
        bestHeaderRow = index
      }
    }
  })
  
  analysis.cleanHeaders = headerRows[bestHeaderRow] || []
  analysis.dataStartRow = bestHeaderRow + 1
  
  return analysis
}

/**
 * Check if column has dropdown indicator in header rows
 */
const checkForDropdownIndicator = (data, colIndex) => {
  // Check first few rows for dropdown indicators
  for (let rowIndex = 0; rowIndex < Math.min(4, data.length); rowIndex++) {
    const cell = data[rowIndex] && data[rowIndex][colIndex]
    if (cell && typeof cell === 'string' && cell.includes('רשימה נפתחת')) {
      return true
    }
  }
  return false
}

/**
 * Detect data type based on column values
 */
const detectDataType = (values) => {
  if (values.length === 0) return 'empty'
  
  const sample = values.slice(0, 100) // Sample for performance
  let dateCount = 0
  let numberCount = 0
  let booleanCount = 0
  let textCount = 0
  
  sample.forEach(value => {
    if (value instanceof Date || 
        (typeof value === 'string' && /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(value))) {
      dateCount++
    } else if (typeof value === 'number' || 
               (typeof value === 'string' && /^\d+(\.\d+)?$/.test(value))) {
      numberCount++
    } else if (typeof value === 'boolean' || 
               (typeof value === 'string' && /^(true|false|yes|no|כן|לא|V|X)$/i.test(value))) {
      booleanCount++
    } else {
      textCount++
    }
  })
  
  const total = sample.length
  if (dateCount / total > 0.8) return 'date'
  if (numberCount / total > 0.8) return 'number'
  if (booleanCount / total > 0.8) return 'boolean'
  return 'text'
}

/**
 * Analyze relationships between sheets
 */
const analyzeCrossSheetRelationships = (sheets) => {
  const relationships = {
    sharedColumns: {},
    potentialKeys: {},
    lookupTables: {}
  }
  
  const sheetNames = Object.keys(sheets)
  
  // Find shared column names
  sheetNames.forEach(sheet1 => {
    sheetNames.forEach(sheet2 => {
      if (sheet1 !== sheet2) {
        const headers1 = Object.keys(sheets[sheet1].columns || {})
        const headers2 = Object.keys(sheets[sheet2].columns || {})
        const shared = headers1.filter(h => headers2.includes(h))
        
        if (shared.length > 0) {
          relationships.sharedColumns[`${sheet1}_${sheet2}`] = shared
        }
      }
    })
  })
  
  // Identify potential lookup tables (sheets with unique values for shared columns)
  sheetNames.forEach(sheetName => {
    const sheet = sheets[sheetName]
    Object.keys(sheet.uniqueValues || {}).forEach(column => {
      const values = sheet.uniqueValues[column]
      if (values && values.length > 0 && values.length < 500) {
        relationships.lookupTables[`${sheetName}.${column}`] = {
          sheet: sheetName,
          column,
          uniqueValueCount: values.length,
          sampleValues: values.slice(0, 10)
        }
      }
    })
  })
  
  return relationships
}

/**
 * Generate recommendations based on analysis
 */
const generateRecommendations = (analysis) => {
  const recommendations = {
    schema: [],
    dataQuality: [],
    performance: [],
    hebrew: []
  }
  
  // Schema recommendations
  Object.keys(analysis.sheets).forEach(sheetName => {
    const sheet = analysis.sheets[sheetName]
    
    if (sheet.rowCount > 100) {
      recommendations.schema.push(`Consider ${sheetName} as main entity table with ${sheet.rowCount} records`)
    }
    
    if (Object.keys(sheet.uniqueValues).length > 5) {
      recommendations.schema.push(`${sheetName} contains multiple lookup columns suitable for normalization`)
    }
  })
  
  // Hebrew-specific recommendations
  recommendations.hebrew.push('Use UTF-8 encoding with Hebrew collation (he_IL.UTF-8)')
  recommendations.hebrew.push('Implement proper RTL text handling in application layer')
  recommendations.hebrew.push('Add Hebrew full-text search indices for text columns')
  
  // Performance recommendations
  const totalRecords = analysis.summary.totalRecords
  if (totalRecords > 1000) {
    recommendations.performance.push('Consider partitioning large tables by date or building')
    recommendations.performance.push('Add composite indices for frequent query patterns')
  }
  
  return recommendations
}

/**
 * Save analysis results to files
 */
const saveAnalysisResults = (analysis, outputDir) => {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }
  
  // Save detailed analysis as JSON
  fs.writeFileSync(
    path.join(outputDir, 'excel-analysis-detailed.json'), 
    JSON.stringify(analysis, null, 2),
    'utf8'
  )
  
  // Save human-readable summary
  const summary = generateHumanReadableSummary(analysis)
  fs.writeFileSync(
    path.join(outputDir, 'excel-analysis-summary.md'), 
    summary,
    'utf8'
  )
  
  console.log(`📄 Analysis results saved to ${outputDir}`)
}

/**
 * Generate human-readable summary
 */
const generateHumanReadableSummary = (analysis) => {
  const { fileInfo, sheets, relationships, recommendations } = analysis
  
  let summary = `# Excel File Analysis Summary\n\n`
  summary += `**File:** ${fileInfo.fileName}\n`
  summary += `**Sheets:** ${fileInfo.sheetCount}\n`
  summary += `**Total Records:** ${analysis.summary.totalRecords}\n\n`
  
  // Sheet details
  summary += `## Sheet Analysis\n\n`
  Object.keys(sheets).forEach(sheetName => {
    const sheet = sheets[sheetName]
    summary += `### ${sheetName}\n`
    summary += `- **Rows:** ${sheet.rowCount}\n`
    summary += `- **Columns:** ${Object.keys(sheet.columns).length}\n`
    summary += `- **Data Start Row:** ${sheet.headers.dataStartRow}\n`
    
    if (sheet.headers.dropdownIndicators.length > 0) {
      summary += `- **Dropdown Columns:** ${sheet.headers.dropdownIndicators.length}\n`
    }
    
    // Key columns
    const keyColumns = Object.keys(sheet.columns).filter(col => 
      sheet.columns[col].uniqueCount > 10 && sheet.columns[col].nullCount < sheet.rowCount * 0.1
    )
    if (keyColumns.length > 0) {
      summary += `- **Key Columns:** ${keyColumns.join(', ')}\n`
    }
    
    summary += `\n`
  })
  
  // Relationships
  if (Object.keys(relationships.sharedColumns).length > 0) {
    summary += `## Cross-Sheet Relationships\n\n`
    Object.keys(relationships.sharedColumns).forEach(key => {
      summary += `- **${key}:** ${relationships.sharedColumns[key].join(', ')}\n`
    })
    summary += `\n`
  }
  
  // Recommendations
  summary += `## Recommendations\n\n`
  
  if (recommendations.schema.length > 0) {
    summary += `### Schema Design\n`
    recommendations.schema.forEach(rec => summary += `- ${rec}\n`)
    summary += `\n`
  }
  
  if (recommendations.hebrew.length > 0) {
    summary += `### Hebrew Support\n`
    recommendations.hebrew.forEach(rec => summary += `- ${rec}\n`)
    summary += `\n`
  }
  
  if (recommendations.performance.length > 0) {
    summary += `### Performance\n`
    recommendations.performance.forEach(rec => summary += `- ${rec}\n`)
    summary += `\n`
  }
  
  return summary
}

// Main execution
const main = async () => {
  try {
    const excelFilePath = 'F:\\ClaudeCode\\work\\inspection-tracker\\inspections.xlsx'
    const outputDir = 'F:\\ClaudeCode\\work\\inspection-tracker\\analysis'
    
    console.log('🚀 Starting comprehensive Excel analysis...')
    
    const analysis = analyzeExcelFile(excelFilePath)
    saveAnalysisResults(analysis, outputDir)
    
    console.log('\n📊 ANALYSIS SUMMARY:')
    console.log(`📄 File: ${analysis.fileInfo.fileName}`)
    console.log(`📋 Sheets: ${analysis.fileInfo.sheetCount} (${analysis.fileInfo.sheetNames.join(', ')})`)
    console.log(`📈 Total Records: ${analysis.summary.totalRecords}`)
    
    Object.keys(analysis.sheets).forEach(sheetName => {
      const sheet = analysis.sheets[sheetName]
      console.log(`\n📊 ${sheetName}:`)
      console.log(`   • Rows: ${sheet.rowCount}`)
      console.log(`   • Columns: ${Object.keys(sheet.columns).length}`)
      console.log(`   • Dropdowns: ${sheet.headers.dropdownIndicators.length}`)
      
      // Show key columns with high unique values
      const keyColumns = Object.keys(sheet.columns)
        .filter(col => sheet.columns[col].uniqueCount > 5)
        .slice(0, 5)
      if (keyColumns.length > 0) {
        console.log(`   • Key Columns: ${keyColumns.join(', ')}`)
      }
    })
    
    console.log('\n✅ Analysis completed successfully!')
    console.log(`📁 Results saved to: ${outputDir}`)
    
  } catch (error) {
    console.error('❌ Analysis failed:', error.message)
    process.exit(1)
  }
}

// Run analysis
main()