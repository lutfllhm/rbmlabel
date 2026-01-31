import Button from './Button'

const FormActions = ({ 
  onCancel, 
  onSubmit,
  submitText = 'Simpan',
  cancelText = 'Batal',
  isSubmitting = false,
  app = 'material',
  className = ''
}) => {
  return (
    <div className={`flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200 dark:border-slate-700 mt-6 ${className}`}>
      <Button
        type="button"
        variant="secondary"
        app={app}
        onClick={onCancel}
        disabled={isSubmitting}
        className="w-full sm:w-auto"
      >
        {cancelText}
      </Button>
      <Button
        type="submit"
        variant="primary"
        app={app}
        onClick={onSubmit}
        disabled={isSubmitting}
        className="w-full sm:w-auto min-w-[120px]"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Menyimpan...
          </span>
        ) : (
          submitText
        )}
      </Button>
    </div>
  )
}

export default FormActions
