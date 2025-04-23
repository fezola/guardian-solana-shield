import { useState } from "react";
import { MessageSquarePlus, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useSupabaseUser } from "@/hooks/useSupabaseUser";
import { submitFeedback } from "@/integrations/supabase/documentationApi";

interface FeedbackWidgetProps {
  sectionId: string;
  sectionTitle: string;
}

const FeedbackWidget = ({ sectionId, sectionTitle }: FeedbackWidgetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState<"positive" | "negative" | null>(null);
  const { toast } = useToast();
  const user = useSupabaseUser();

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await submitFeedback({
        sectionId,
        helpful: feedbackType === "positive",
        message: feedback,
        userId: user?.id || null
      });

      toast({
        title: "Feedback submitted",
        description: "Thank you for your feedback!",
      });
    } catch (error: any) {
      toast({
        title: "Submission error",
        description: error?.message || "Something went wrong."
      });
    }

    setIsOpen(false);
    setFeedback("");
    setFeedbackType(null);
  };

  return (
    <div className="mt-8 border-t pt-4">
      {!isOpen ? (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsOpen(true)}
          className="text-xs"
        >
          <MessageSquarePlus className="mr-1 h-3.5 w-3.5" />
          Provide feedback on this section
        </Button>
      ) : (
        <Card className="border border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Feedback on: {sectionTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pb-2">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={feedbackType === "positive" ? "default" : "outline"}
                className="flex-1"
                onClick={() => setFeedbackType("positive")}
              >
                <ThumbsUp className="mr-1 h-4 w-4" />
                Helpful
              </Button>
              <Button
                size="sm"
                variant={feedbackType === "negative" ? "default" : "outline"}
                className="flex-1"
                onClick={() => setFeedbackType("negative")}
              >
                <ThumbsDown className="mr-1 h-4 w-4" />
                Needs Improvement
              </Button>
            </div>
            <Textarea
              placeholder="Your feedback (optional)"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="h-24 resize-none"
            />
          </CardContent>
          <CardFooter className="flex justify-end gap-2 pt-0">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              size="sm" 
              onClick={handleSubmitFeedback}
              disabled={!feedbackType}
            >
              Submit
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default FeedbackWidget;
