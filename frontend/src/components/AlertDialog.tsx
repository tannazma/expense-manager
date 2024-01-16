import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@radix-ui/react-alert-dialog";
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";

type AlertDialogDemoProps = {
  isOpen: boolean;
  onContinue: () => void;
  onCancel: () => void;
};

export function AlertDialogDemo({
  isOpen,
  onContinue,
  onCancel,
}: AlertDialogDemoProps) {
  return (
    <div className="min-h-[200px] min-w-[200px] grid place-items-center fixed top-0 left-0 right-0 bottom-0 transition-all-1s z-50 bg-black bg-opacity-20">
      {isOpen && (
        <AlertDialog open={isOpen} onOpenChange={onCancel}>
          <AlertDialogContent className="bg-white p-6 rounded-lg shadow-md">
            <AlertDialogTitle className="text-lg font-semibold mb-2">
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              This action cannot be undone. This will permanently delete and
              remove your data from our servers.
            </AlertDialogDescription>
            <div className="flex justify-end mt-4 space-x-3">
              <PrimaryButton onClick={onCancel}>Cancel</PrimaryButton>
              <SecondaryButton onClick={onContinue}>Continue</SecondaryButton>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
