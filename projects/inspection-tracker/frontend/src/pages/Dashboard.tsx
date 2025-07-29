import { useState, useMemo } from 'react'
import { HebrewButton } from '../components/ui/HebrewButton'
import { HebrewSelect } from '../components/ui/HebrewSelect'
import { HEBREW_STRINGS } from '../utils/hebrewStrings'
import { formatHebrewDate } from '../utils/hebrew'

interface InspectionRecord {
  id: string
  type: string
  building: string
  floor: string
  room: string
  technician: string
  status: 'pending' | 'inProgress' | 'completed' | 'failed' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  scheduledDate: string
  completedDate?: string
  duration?: number
  notes: string
  photoCount: number
}

/**
 * Desktop dashboard for managers
 * Features comprehensive table view, filtering, and export capabilities
 */
export function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [buildingFilter, setBuildingFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [isExporting, setIsExporting] = useState(false)

  // Mock data - in real app this would come from API
  const inspections: InspectionRecord[] = [
    {
      id: 'INS-2025-001',
      type: 'electrical',
      building: 'building-10a',
      floor: '2',
      room: 'חדר שרתים A',
      technician: 'yossi-cohen',
      status: 'completed',
      priority: 'high',
      scheduledDate: '2025-01-27',
      completedDate: '2025-01-27',
      duration: 45,
      notes: 'בדיקה שגרתית של לוח חשמל ראשי. נמצאו בעיות קלות בחיבורים.',
      photoCount: 3
    },
    {
      id: 'INS-2025-002',
      type: 'hvac',
      building: 'building-20',
      floor: '1',
      room: 'משרד מנהל',
      technician: 'miriam-levy',
      status: 'inProgress',
      priority: 'medium',
      scheduledDate: '2025-01-27',
      notes: 'בדיקת מערכת מיזוג - נדרש ניקוי פילטרים.',
      photoCount: 2
    },
    {
      id: 'INS-2025-003',
      type: 'fire',
      building: 'building-10b',
      floor: '3',
      room: 'מסדרון מרכזי',
      technician: 'michael-avraham',
      status: 'pending',
      priority: 'urgent',
      scheduledDate: '2025-01-28',
      notes: 'בדיקת מערכת כיבוי אש חירום.',
      photoCount: 0
    },
    {
      id: 'INS-2025-004',
      type: 'security',
      building: 'building-30',
      floor: '1',
      room: 'כניסה ראשית',
      technician: 'david-israeli',
      status: 'failed',
      priority: 'high',
      scheduledDate: '2025-01-26',
      completedDate: '2025-01-26',
      duration: 30,
      notes: 'נמצאה תקלה במערכת האבטחה - נדרשת התערבות דחופה.',
      photoCount: 5
    },
    {
      id: 'INS-2025-005',
      type: 'network',
      building: 'building-40',
      floor: '2',
      room: 'חדר תקשורת',
      technician: 'sarah-goldstein',
      status: 'completed',
      priority: 'low',
      scheduledDate: '2025-01-25',
      completedDate: '2025-01-25',
      duration: 60,
      notes: 'בדיקת תשתית רשת - הכל תקין.',
      photoCount: 1
    }
  ]

  const buildingOptions = [
    { value: '', label: 'כל הבניינים' },
    { value: 'building-10a', label: 'בניין 10A - מרכז נתונים ראשי' },
    { value: 'building-10b', label: 'בניין 10B - מרכז נתונים משני' },
    { value: 'building-20', label: 'בניין 20 - משרדים' },
    { value: 'building-30', label: 'בניין 30 - מעבדות' },
    { value: 'building-40', label: 'בניין 40 - תשתיות' },
    { value: 'building-50', label: 'בניין 50 - אחסון' },
  ]

  const statusOptions = [
    { value: '', label: 'כל הסטטוסים' },
    { value: 'pending', label: HEBREW_STRINGS.status.pending },
    { value: 'inProgress', label: HEBREW_STRINGS.status.inProgress },
    { value: 'completed', label: HEBREW_STRINGS.status.completed },
    { value: 'failed', label: HEBREW_STRINGS.status.failed },
    { value: 'cancelled', label: HEBREW_STRINGS.status.cancelled },
  ]

  const typeOptions = [
    { value: '', label: 'כל סוגי הבדיקות' },
    { value: 'electrical', label: HEBREW_STRINGS.inspectionTypes.electrical },
    { value: 'plumbing', label: HEBREW_STRINGS.inspectionTypes.plumbing },
    { value: 'hvac', label: HEBREW_STRINGS.inspectionTypes.hvac },
    { value: 'structural', label: HEBREW_STRINGS.inspectionTypes.structural },
    { value: 'safety', label: HEBREW_STRINGS.inspectionTypes.safety },
    { value: 'fire', label: HEBREW_STRINGS.inspectionTypes.fire },
    { value: 'security', label: HEBREW_STRINGS.inspectionTypes.security },
    { value: 'network', label: HEBREW_STRINGS.inspectionTypes.network },
  ]

  const priorityOptions = [
    { value: '', label: 'כל העדיפויות' },
    { value: 'low', label: HEBREW_STRINGS.priority.low },
    { value: 'medium', label: HEBREW_STRINGS.priority.medium },
    { value: 'high', label: HEBREW_STRINGS.priority.high },
    { value: 'urgent', label: HEBREW_STRINGS.priority.urgent },
  ]

  const technicianNames: Record<string, string> = {
    'yossi-cohen': 'יוסי כהן',
    'miriam-levy': 'מרים לוי',
    'david-israeli': 'דוד ישראלי',
    'sarah-goldstein': 'שרה גולדשטיין',
    'michael-avraham': 'מיכאל אברהם'
  }

  const buildingNames: Record<string, string> = {
    'building-10a': 'בניין 10A',
    'building-10b': 'בניין 10B',
    'building-20': 'בניין 20',
    'building-30': 'בניין 30',
    'building-40': 'בניין 40',
    'building-50': 'בניין 50'
  }

  // Filtered inspections
  const filteredInspections = useMemo(() => {
    return inspections.filter(inspection => {
      const matchesSearch = searchTerm === '' || 
        inspection.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inspection.notes.includes(searchTerm) ||
        technicianNames[inspection.technician]?.includes(searchTerm)

      const matchesStatus = statusFilter === '' || inspection.status === statusFilter
      const matchesBuilding = buildingFilter === '' || inspection.building === buildingFilter
      const matchesType = typeFilter === '' || inspection.type === typeFilter
      const matchesPriority = priorityFilter === '' || inspection.priority === priorityFilter

      return matchesSearch && matchesStatus && matchesBuilding && matchesType && matchesPriority
    })
  }, [inspections, searchTerm, statusFilter, buildingFilter, typeFilter, priorityFilter])

  // Statistics
  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    
    return {
      total: inspections.length,
      today: inspections.filter(i => i.scheduledDate === today).length,
      pending: inspections.filter(i => i.status === 'pending').length,
      completed: inspections.filter(i => i.status === 'completed').length,
      failed: inspections.filter(i => i.status === 'failed').length,
      inProgress: inspections.filter(i => i.status === 'inProgress').length,
    }
  }, [inspections])

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      pending: 'bg-yellow-100 text-yellow-800',
      inProgress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800'
    }

    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusClasses[status as keyof typeof statusClasses]}`}>
        {HEBREW_STRINGS.status[status as keyof typeof HEBREW_STRINGS.status]}
      </span>
    )
  }

  const getPriorityBadge = (priority: string) => {
    const priorityClasses = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    }

    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${priorityClasses[priority as keyof typeof priorityClasses]}`}>
        {HEBREW_STRINGS.priority[priority as keyof typeof HEBREW_STRINGS.priority]}
      </span>
    )
  }

  const handleExportToExcel = async () => {
    setIsExporting(true)
    try {
      // In a real app, this would call an API to generate and download Excel file
      await new Promise(resolve => setTimeout(resolve, 2000))
      alert('הקובץ יוצא בהצלחה! ייעשה הורדה בקרוב...')
    } catch (error) {
      alert('שגיאה בייצוא הקובץ. אנא נסה שוב.')
    } finally {
      setIsExporting(false)
    }
  }

  const clearFilters = () => {
    setSearchTerm('')
    setStatusFilter('')
    setBuildingFilter('')
    setTypeFilter('')
    setPriorityFilter('')
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-gray-600">סה"כ בדיקות</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-3xl font-bold text-green-600">{stats.today}</div>
          <div className="text-gray-600">{HEBREW_STRINGS.dashboard.todayInspections}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-gray-600">{HEBREW_STRINGS.dashboard.pendingInspections}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-3xl font-bold text-blue-600">{stats.inProgress}</div>
          <div className="text-gray-600">בביצוע</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-3xl font-bold text-green-600">{stats.completed}</div>
          <div className="text-gray-600">{HEBREW_STRINGS.dashboard.completedInspections}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-3xl font-bold text-red-600">{stats.failed}</div>
          <div className="text-gray-600">{HEBREW_STRINGS.dashboard.failedInspections}</div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            ניהול בדיקות הנדסיות
          </h2>
          <div className="flex gap-2">
            <HebrewButton
              variant="secondary"
              onClick={clearFilters}
            >
              נקה סינונים
            </HebrewButton>
            <HebrewButton
              variant="primary"
              onClick={handleExportToExcel}
              loading={isExporting}
            >
              {isExporting ? 'מייצא...' : HEBREW_STRINGS.export.exportToExcel}
            </HebrewButton>
          </div>
        </div>

        {/* Search and Filters Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 hebrew-font mb-1">
              {HEBREW_STRINGS.general.search}
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="חפש לפי מזהה, הערות או טכנאי..."
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm hebrew-font text-right focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <HebrewSelect
            label="סינון לפי סטטוס"
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
          />

          <HebrewSelect
            label="סינון לפי בניין"
            options={buildingOptions}
            value={buildingFilter}
            onChange={setBuildingFilter}
          />

          <HebrewSelect
            label="סינון לפי סוג בדיקה"
            options={typeOptions}
            value={typeFilter}
            onChange={setTypeFilter}
          />

          <HebrewSelect
            label="סינון לפי עדיפות"
            options={priorityOptions}
            value={priorityFilter}
            onChange={setPriorityFilter}
          />
        </div>

        {/* Results Count */}
        <div className="mt-4 text-sm text-gray-600 text-right">
          מציג {filteredInspections.length} מתוך {inspections.length} בדיקות
        </div>
      </div>

      {/* Inspections Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  מזהה
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {HEBREW_STRINGS.table.type}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {HEBREW_STRINGS.table.building}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  מיקום
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {HEBREW_STRINGS.table.technician}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {HEBREW_STRINGS.table.status}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {HEBREW_STRINGS.table.priority}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  תאריך
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  תמונות
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {HEBREW_STRINGS.table.actions}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInspections.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-6 py-12 text-center text-gray-500">
                    {HEBREW_STRINGS.empty.noInspections}
                  </td>
                </tr>
              ) : (
                filteredInspections.map((inspection) => (
                  <tr key={inspection.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                      {inspection.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {HEBREW_STRINGS.inspectionTypes[inspection.type as keyof typeof HEBREW_STRINGS.inspectionTypes]}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {buildingNames[inspection.building]}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      קומה {inspection.floor}, {inspection.room}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {technicianNames[inspection.technician]}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {getStatusBadge(inspection.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {getPriorityBadge(inspection.priority)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {formatHebrewDate(new Date(inspection.scheduledDate))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {inspection.photoCount > 0 ? (
                        <span className="text-blue-600">📷 {inspection.photoCount}</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                      <div className="flex gap-2 justify-end">
                        <button className="text-blue-600 hover:text-blue-900">
                          {HEBREW_STRINGS.general.view}
                        </button>
                        <button className="text-blue-600 hover:text-blue-900">
                          {HEBREW_STRINGS.general.edit}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}