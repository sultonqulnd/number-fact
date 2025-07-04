import { UI_CONSTANTS } from "@/utils/constants";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

interface ErrorAlertProps {
  message: string;
}

export function ErrorAlert({ message }: ErrorAlertProps) {
  return (
    <Alert variant="destructive">
      <Terminal className="h-4 w-4" />
      <AlertTitle>{UI_CONSTANTS.ERROR_TITLE}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
