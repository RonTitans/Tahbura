// Excel Import Script for Hebrew Inspection Data
// סקריפט יבוא נתונים מאקסל למערכת בדיקות עברית

import XLSX from 'xlsx'
import { supabaseAdmin, handleDbError, batchInsert } from '../config/supabase.js'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Hebrew column mappings for Excel file
const COLUMN_MAPPINGS = {
  // Main inspection sheet columns
  inspection: {
    'סוג בדיקה': 'inspection_type_hebrew',
    'קטגוריה': 'category',
    'תת קטגוריה': 'subcategory', 
    'אחראי צוות': 'team_leader',
    'משך זמן משוער': 'estimated_duration',
    'עדיפות': 'priority',
    'דרישות בטיחות': 'safety_requirements',
    'כלים נדרשים': 'required_tools',
    'תיאור': 'description_hebrew'
  },
  
  // Buildings/Values sheet columns
  buildings: {
    'מבנה': 'building_code',
    'שם מבנה': 'name_hebrew',
    'סוג מבנה': 'building_type',
    'כתובת': 'address_hebrew',
    'קומות': 'floor_count',
    'תיאור': 'description_hebrew'
  }
}

// Category mappings from Hebrew to English
const CATEGORY_MAPPINGS = {
  'חשמל': 'electrical',
  'אינסטלציה': 'plumbing', 
  'מיזוג אוויר': 'hvac',
  'מבנה': 'structural',
  'בטיחות': 'safety',
  'כיבוי אש': 'fire',
  'אבטחה': 'security',
  'תקשורת': 'network',
  'סביבה': 'environmental'
}

// Priority mappings
const PRIORITY_MAPPINGS = {
  'נמוכה': 'low',
  'בינונית': 'medium', 
  'גבוהה': 'high',
  'דחופה': 'urgent'
}

// Building type mappings
const BUILDING_TYPE_MAPPINGS = {
  'מרכז נתונים': 'datacenter',
  'משרדים': 'office',
  'מחסן': 'warehouse',
  'מעבדה': 'laboratory',
  'ייצור': 'production',
  'תשתיות': 'utilities'
}

/**
 * Read and parse Excel file
 */
export const readExcelFile = (filePath) => {
  try {
    console.log(`📖 Reading Excel file: ${filePath}`)
    
    const workbook = XLSX.readFile(filePath)
    const sheets = {}
    
    // Read all sheets
    workbook.SheetNames.forEach(sheetName => {
      console.log(`📊 Processing sheet: ${sheetName}`)
      const worksheet = workbook.Sheets[sheetName]
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
      
      // Convert to objects with headers
      if (data.length > 0) {
        const headers = data[0]
        const rows = data.slice(1).filter(row => row.some(cell => cell != null))
        
        sheets[sheetName] = rows.map(row => {
          const obj = {}
          headers.forEach((header, index) => {
            if (header && row[index] != null) {
              obj[header] = row[index]
            }
          })
          return obj
        })
      }
    })
    
    console.log(`✅ Successfully read ${Object.keys(sheets).length} sheets`)
    return sheets
    
  } catch (error) {
    console.error('❌ Error reading Excel file:', error.message)
    throw error
  }
}

/**
 * Process buildings data from ערכים sheet
 */
export const processBuildings = (sheetsData) => {
  console.log('🏢 Processing buildings data...')
  
  const valuesSheet = sheetsData['ערכים'] || sheetsData['Values'] || []
  const buildings = []
  
  // Look for building data - usually starts with building codes like 10A, 10B, etc.
  valuesSheet.forEach((row, index) => {
    // Check if this row contains building information
    const possibleCode = Object.values(row)[0]
    if (possibleCode && /^[0-9]+[A-Z]?$/i.test(possibleCode)) {
      const building = {
        building_code: possibleCode,
        name_hebrew: Object.values(row)[1] || `בניין ${possibleCode}`,
        building_type: 'datacenter', // Default type
        address_hebrew: 'קריית התקשוב, אזור תעשיה',
        floor_count: parseInt(Object.values(row)[2]) || 1,
        description_hebrew: Object.values(row)[3] || `מבנה ${possibleCode} בקריית התקשוב`,
        is_active: true
      }
      
      buildings.push(building)
    }
  })
  
  console.log(`✅ Processed ${buildings.length} buildings`)
  return buildings
}

/**
 * Process inspection types from main sheet
 */
export const processInspectionTypes = (sheetsData) => {
  console.log('🔍 Processing inspection types...')
  
  // Look for the main inspection sheet (usually the first one or contains most data)
  const mainSheetName = Object.keys(sheetsData).find(name => 
    sheetsData[name].length > 50 || name.includes('בדיקות')
  ) || Object.keys(sheetsData)[0]
  
  const mainSheet = sheetsData[mainSheetName] || []
  const inspectionTypes = []
  let codeCounter = 1
  
  mainSheet.forEach((row, index) => {
    // Skip empty rows
    if (!Object.values(row).some(val => val != null && val !== '')) return
    
    // Extract inspection type information
    const hebrewName = row['סוג בדיקה'] || row['בדיקה'] || Object.values(row)[0]
    if (!hebrewName || typeof hebrewName !== 'string') return
    
    const category = row['קטגוריה'] || 'electrical' // Default category
    const subcategory = row['תת קטגוריה'] || null
    const teamLeader = row['אחראי צוות'] || null
    const duration = parseInt(row['משך זמן משוער']) || 60
    const priority = row['עדיפות'] || 'medium'
    
    const inspectionType = {
      name_hebrew: hebrewName.trim(),
      name_english: transliterateHebrew(hebrewName),
      code: generateInspectionCode(category, codeCounter++),
      description_hebrew: row['תיאור'] || `בדיקת ${hebrewName}`,
      category: CATEGORY_MAPPINGS[category] || 'electrical',
      subcategory: subcategory,
      estimated_duration_minutes: duration,
      requires_photo: duration > 30, // Longer inspections require photos
      requires_signature: priority === 'דחופה' || priority === 'גבוהה',
      required_tools: parseArrayField(row['כלים נדרשים']),
      safety_requirements: parseArrayField(row['דרישות בטיחות']),
      priority: PRIORITY_MAPPINGS[priority] || 'medium',
      is_active: true
    }
    
    inspectionTypes.push(inspectionType)
  })
  
  console.log(`✅ Processed ${inspectionTypes.length} inspection types`)
  return inspectionTypes
}

/**
 * Generate inspection code based on category
 */
const generateInspectionCode = (category, counter) => {
  const prefixes = {
    'electrical': 'E',
    'plumbing': 'P', 
    'hvac': 'H',
    'structural': 'S',
    'safety': 'SF',
    'fire': 'F',
    'security': 'SEC',
    'network': 'N',
    'environmental': 'ENV'
  }
  
  const prefix = prefixes[CATEGORY_MAPPINGS[category]] || prefixes[category] || 'GEN'
  return `${prefix}${counter.toString().padStart(3, '0')}`
}

/**
 * Simple Hebrew to English transliteration
 */
const transliterateHebrew = (hebrewText) => {
  const transliterationMap = {
    'א': 'a', 'ב': 'b', 'ג': 'g', 'ד': 'd', 'ה': 'h', 'ו': 'v', 'ז': 'z',
    'ח': 'ch', 'ט': 't', 'י': 'y', 'כ': 'k', 'ל': 'l', 'מ': 'm', 'ן': 'n',
    'נ': 'n', 'ס': 's', 'ע': 'a', 'פ': 'p', 'ץ': 'tz', 'צ': 'tz', 'ק': 'k',
    'ר': 'r', 'ש': 'sh', 'ת': 't', 'ף': 'f', 'ך': 'ch', 'ם': 'm'
  }
  
  return hebrewText
    .split('')
    .map(char => transliterationMap[char] || char)
    .join('')
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Parse array fields (comma-separated values)
 */
const parseArrayField = (value) => {
  if (!value || typeof value !== 'string') return null
  
  return value
    .split(',')
    .map(item => item.trim())
    .filter(item => item.length > 0)
}

/**
 * Import data to Supabase
 */
export const importToSupabase = async (buildings, inspectionTypes) => {
  console.log('📤 Importing data to Supabase...')
  
  try {
    // Import buildings first
    if (buildings.length > 0) {
      console.log('🏢 Importing buildings...')
      const buildingsResult = await batchInsert('buildings', buildings)
      
      if (buildingsResult.errors.length > 0) {
        console.warn('⚠️ Some buildings failed to import:', buildingsResult.errors)
      } else {
        console.log(`✅ Successfully imported ${buildingsResult.results.length} buildings`)
      }
    }
    
    // Import inspection types
    if (inspectionTypes.length > 0) {
      console.log('🔍 Importing inspection types...')
      const typesResult = await batchInsert('inspection_types', inspectionTypes)
      
      if (typesResult.errors.length > 0) {
        console.warn('⚠️ Some inspection types failed to import:', typesResult.errors)
      } else {
        console.log(`✅ Successfully imported ${typesResult.results.length} inspection types`)
      }
    }
    
    console.log('🎉 Data import completed!')
    
  } catch (error) {
    console.error('❌ Error importing data:', error.message)
    throw error
  }
}

/**
 * Main import function
 */
export const importExcelData = async (filePath) => {
  try {
    console.log('🚀 Starting Excel data import...')
    
    // Read Excel file
    const sheetsData = readExcelFile(filePath)
    
    // Process data
    const buildings = processBuildings(sheetsData)
    const inspectionTypes = processInspectionTypes(sheetsData)
    
    // Import to Supabase
    await importToSupabase(buildings, inspectionTypes)
    
    console.log('✅ Excel import completed successfully!')
    
    return {
      buildings: buildings.length,
      inspectionTypes: inspectionTypes.length
    }
    
  } catch (error) {
    console.error('❌ Excel import failed:', error.message)
    throw error
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const excelFilePath = process.argv[2] || 'קובץ בדיקות כולל לקריית התקשוב גרסא מלאה 150725.xlsx'
  
  if (!excelFilePath) {
    console.error('❌ Please provide Excel file path as argument')
    process.exit(1)
  }
  
  importExcelData(excelFilePath)
    .then(result => {
      console.log(`🎉 Import completed: ${result.buildings} buildings, ${result.inspectionTypes} inspection types`)
      process.exit(0)
    })
    .catch(error => {
      console.error('💥 Import failed:', error.message)
      process.exit(1)
    })
}