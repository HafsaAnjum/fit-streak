
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import FeedbackForm from "./FeedbackForm";
import { MessageSquare } from "lucide-react";

interface FeedbackDialogProps {
  triggerClassName?: string;
}

const FeedbackDialog: React.FC<FeedbackDialogProps> = ({ triggerClassName }) => {
  const [open, setOpen] = React.useState(false);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className={triggerClassName}>
          <MessageSquare className="w-4 h-4 mr-2" />
          Send Feedback
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send Feedback</DialogTitle>
          <DialogDescription>
            Share your thoughts, report bugs, or suggest new features.
          </DialogDescription>
        </DialogHeader>
        <FeedbackForm onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog;
