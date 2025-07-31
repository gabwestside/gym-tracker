import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface ConfirmationAlertProps {
  open?: boolean
  title?: string
  description?: string
  onCompleted: () => void
  onCancel: () => void
  cancelButtonTitle: string
  confirmButtonTitle: string
}

export const ConfirmationAlert = ({
  open,
  title,
  description,
  onCompleted,
  onCancel,
  cancelButtonTitle,
  confirmButtonTitle,
}: ConfirmationAlertProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onCancel}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onCanPlay={onCancel}>
            {cancelButtonTitle}
          </AlertDialogCancel>
          <AlertDialogAction className='bg-red-500' onClick={onCompleted}>
            {confirmButtonTitle}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
