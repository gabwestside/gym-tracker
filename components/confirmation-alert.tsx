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
}

export const ConfirmationAlert = ({
  open,
  title,
  description,
  onCompleted,
  onCancel,
}: ConfirmationAlertProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onCancel}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onCanPlay={onCancel}>Cancelar</AlertDialogCancel>
          <AlertDialogAction className='bg-red-500' onClick={onCompleted}>
            Sim
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
