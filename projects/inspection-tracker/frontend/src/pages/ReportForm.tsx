import React, { useState } from 'react'
import { HebrewButton } from '../components/ui/HebrewButton'
import { HebrewInput } from '../components/ui/HebrewInput'
import { HebrewSelect } from '../components/ui/HebrewSelect'
import { HEBREW_STRINGS } from '../utils/hebrewStrings'

/**
 * Mobile-friendly report form for technicians
 * Optimized for touch interfaces and mobile usage
 */
export function ReportForm() {
  const [formData, setFormData] = useState({
    inspectionType: '',
    building: '',
    floor: '',
    room: '',
    technician: '',
    scheduledDate: '',
    scheduledTime: '',
    notes: '',
    priority: 'medium'
  })
  
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const inspectionOptions = [
    { value: 'electrical', label: HEBREW_STRINGS.inspectionTypes.electrical },
    { value: 'plumbing', label: HEBREW_STRINGS.inspectionTypes.plumbing },
    { value: 'hvac', label: HEBREW_STRINGS.inspectionTypes.hvac },
    { value: 'structural', label: HEBREW_STRINGS.inspectionTypes.structural },
    { value: 'safety', label: HEBREW_STRINGS.inspectionTypes.safety },
    { value: 'fire', label: HEBREW_STRINGS.inspectionTypes.fire },
    { value: 'security', label: HEBREW_STRINGS.inspectionTypes.security },
    { value: 'network', label: HEBREW_STRINGS.inspectionTypes.network },
  ]

  const buildingOptions = [
    { value: 'building-10a', label: 'בניין 10A - מרכז נתונים ראשי' },
    { value: 'building-10b', label: 'בניין 10B - מרכז נתונים משני' },
    { value: 'building-20', label: 'בניין 20 - משרדים' },
    { value: 'building-30', label: 'בניין 30 - מעבדות' },
    { value: 'building-40', label: 'בניין 40 - תשתיות' },
    { value: 'building-50', label: 'בניין 50 - אחסון' },
  ]

  const technicianOptions = [
    { value: 'yossi-cohen', label: 'יוסי כהן - חשמלאי ראשי' },
    { value: 'miriam-levy', label: 'מרים לוי - מהנדסת מיזוג' },
    { value: 'david-israeli', label: 'דוד ישראלי - טכנאי אבטחה' },
    { value: 'sarah-goldstein', label: 'שרה גולדשטיין - מהנדסת רשת' },
    { value: 'michael-avraham', label: 'מיכאל אברהם - טכנאי כיבוי אש' },
  ]

  const priorityOptions = [
    { value: 'low', label: HEBREW_STRINGS.priority.low },
    { value: 'medium', label: HEBREW_STRINGS.priority.medium },
    { value: 'high', label: HEBREW_STRINGS.priority.high },
    { value: 'urgent', label: HEBREW_STRINGS.priority.urgent },
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handlePhotoSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setSelectedPhotos(prev => [...prev, ...files])
  }

  const removePhoto = (index: number) => {
    setSelectedPhotos(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      alert(`דיווח נשלח בהצלחה!\n\nפרטי הדיווח:\nסוג בדיקה: ${inspectionOptions.find(opt => opt.value === formData.inspectionType)?.label}\nבניין: ${buildingOptions.find(opt => opt.value === formData.building)?.label}\nטכנאי: ${technicianOptions.find(opt => opt.value === formData.technician)?.label}\nתמונות: ${selectedPhotos.length}`)
      
      // Reset form
      setFormData({
        inspectionType: '',
        building: '',
        floor: '',
        room: '',
        technician: '',
        scheduledDate: '',
        scheduledTime: '',
        notes: '',
        priority: 'medium'
      })
      setSelectedPhotos([])
    } catch (error) {
      alert('שגיאה בשליחת הדיווח. אנא נסה שוב.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto p-4 pb-20">
      {/* Mobile Header */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 text-center hebrew-font">
          {HEBREW_STRINGS.mobile.newInspection}
        </h2>
        <p className="text-gray-600 text-center mt-1">
          מלא את הפרטים ושלח דיווח
        </p>
      </div>

      {/* Report Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information Card */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-right">
            פרטים בסיסיים
          </h3>
          
          <div className="space-y-4">
            <HebrewSelect
              label={HEBREW_STRINGS.forms.inspectionType}
              options={inspectionOptions}
              value={formData.inspectionType}
              onChange={(value) => handleInputChange('inspectionType', value)}
              placeholder={HEBREW_STRINGS.placeholders.selectInspectionType}
              required
            />

            <HebrewSelect
              label={HEBREW_STRINGS.forms.technician}
              options={technicianOptions}
              value={formData.technician}
              onChange={(value) => handleInputChange('technician', value)}
              placeholder={HEBREW_STRINGS.placeholders.selectTechnician}
              required
            />

            <HebrewSelect
              label={HEBREW_STRINGS.forms.priority}
              options={priorityOptions}
              value={formData.priority}
              onChange={(value) => handleInputChange('priority', value)}
              required
            />
          </div>
        </div>

        {/* Location Card */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-right">
            מיקום הבדיקה
          </h3>
          
          <div className="space-y-4">
            <HebrewSelect
              label={HEBREW_STRINGS.forms.building}
              options={buildingOptions}
              value={formData.building}
              onChange={(value) => handleInputChange('building', value)}
              placeholder={HEBREW_STRINGS.placeholders.selectBuilding}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <HebrewInput
                type="text"
                label={HEBREW_STRINGS.forms.floor}
                value={formData.floor}
                onChange={(e) => handleInputChange('floor', e.target.value)}
                placeholder="קומה"
              />

              <HebrewInput
                type="text"
                label={HEBREW_STRINGS.forms.room}
                value={formData.room}
                onChange={(e) => handleInputChange('room', e.target.value)}
                placeholder="חדר"
              />
            </div>
          </div>
        </div>

        {/* Scheduling Card */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-right">
            זמן הבדיקה
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <HebrewInput
              type="date"
              label={HEBREW_STRINGS.forms.scheduledDate}
              value={formData.scheduledDate}
              onChange={(e) => handleInputChange('scheduledDate', e.target.value)}
              required
            />

            <HebrewInput
              type="time"
              label="שעה מתוכננת"
              value={formData.scheduledTime}
              onChange={(e) => handleInputChange('scheduledTime', e.target.value)}
              required
            />
          </div>
        </div>

        {/* Notes Card */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-right">
            {HEBREW_STRINGS.forms.notes}
          </h3>
          
          <textarea
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            rows={4}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm hebrew-font text-right resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder={HEBREW_STRINGS.placeholders.enterNotes}
          />
        </div>

        {/* Photos Card */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-right">
            {HEBREW_STRINGS.forms.photos}
          </h3>
          
          <div className="space-y-4">
            {/* Photo Upload Button */}
            <label className="block">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoSelection}
                className="hidden"
              />
              <div className="w-full py-4 px-4 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                <div className="text-blue-600 text-2xl mb-2">📷</div>
                <p className="text-gray-700 hebrew-font">
                  {HEBREW_STRINGS.mobile.addPhoto}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  לחץ כדי לצלם או לבחור תמונות
                </p>
              </div>
            </label>

            {/* Selected Photos Preview */}
            {selectedPhotos.length > 0 && (
              <div>
                <p className="text-sm text-gray-700 mb-2 text-right">
                  {HEBREW_STRINGS.mobile.photosSelected(selectedPhotos.length)}
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {selectedPhotos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`תמונה ${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="sticky bottom-4 bg-white rounded-lg shadow-lg p-4">
          <HebrewButton
            type="submit"
            variant="primary"
            size="lg"
            loading={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? HEBREW_STRINGS.general.saving : HEBREW_STRINGS.mobile.saveInspection}
          </HebrewButton>
        </div>
      </form>
    </div>
  )
}