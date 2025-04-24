
import { useState } from "react";
import { MessageSquarePlus, ThumbsUp, ThumbsDown, Star, AlertCircle, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface FeedbackWidgetProps {
  sectionId: string;
  sectionTitle: string;
}

type FeedbackCategory = "helpful" | "needs_improvement" | "bug" | "feature" | "code_example";

interface FeedbackData {
  feedbackType: "positive" | "negative" | null;
  category: FeedbackCategory | null;
  rating: number | null;
  feedback: string;
}

const FeedbackWidget = ({ sectionId, sectionTitle }: FeedbackWidgetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackData, setFeedbackData] = useState<FeedbackData>({
    feedbackType: null,
    category: null,
    rating: null,
    feedback: ""
  });
  const { toast } = useToast();

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real implementation, you'd send this to your backend
    console.log({
      sectionId,
      sectionTitle,
      ...feedbackData,
      timestamp: new Date().toISOString(),
    });
    
    toast({
      title: "Feedback submitted",
      description: "Thank you for your feedback! We'll use it to improve the documentation.",
    });
    
    setIsOpen(false);
    setFeedbackData({
      feedbackType: null,
      category: null,
      rating: null,
      feedback: ""
    });
  };

  const feedbackCategories = [
    { value: "helpful", label: "This helped me", icon: ThumbsUp },
    { value: "needs_improvement", label: "Could be clearer", icon: AlertCircle },
    { value: "bug", label: "Found an error", icon: AlertCircle },
    { value: "feature", label: "Feature request", icon: Star },
    { value: "code_example", label: "Code example issue", icon: Code }
  ];

  const handleFeedbackTypeChange = (type: "positive" | "negative") => {
    setFeedbackData({...feedbackData, feedbackType: type});
  };

  const handleCategoryChange = (category: FeedbackCategory) => {
    setFeedbackData({...feedbackData, category});
  };

  const handleRatingChange = (rating: number) => {
    setFeedbackData({...feedbackData, rating});
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
          <CardContent className="space-y-4 pb-2">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={feedbackData.feedbackType === "positive" ? "default" : "outline"}
                className="flex-1"
                onClick={() => handleFeedbackTypeChange("positive")}
              >
                <ThumbsUp className="mr-1 h-4 w-4" />
                Helpful
              </Button>
              <Button
                size="sm"
                variant={feedbackData.feedbackType === "negative" ? "default" : "outline"}
                className="flex-1"
                onClick={() => handleFeedbackTypeChange("negative")}
              >
                <ThumbsDown className="mr-1 h-4 w-4" />
                Needs Improvement
              </Button>
            </div>
            
            {feedbackData.feedbackType && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">What specifically would you like to provide feedback on?</p>
                <RadioGroup 
                  className="grid grid-cols-1 sm:grid-cols-2 gap-2" 
                  value={feedbackData.category || ""}
                  onValueChange={(value) => handleCategoryChange(value as FeedbackCategory)}
                >
                  {feedbackCategories.map(category => (
                    <div key={category.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={category.value} id={category.value} />
                      <Label htmlFor={category.value} className="flex items-center">
                        <category.icon className="h-3.5 w-3.5 mr-1.5" />
                        <span>{category.label}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}
            
            {feedbackData.feedbackType === "positive" && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">How would you rate this section?</p>
                <div className="flex space-x-1 items-center">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <Button
                      key={rating}
                      variant="ghost"
                      size="sm"
                      className={`p-1 ${feedbackData.rating === rating ? 'text-primary' : 'text-muted-foreground'}`}
                      onClick={() => handleRatingChange(rating)}
                    >
                      <Star className={`h-4 w-4 ${feedbackData.rating !== null && rating <= feedbackData.rating ? 'fill-current' : ''}`} />
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            <Textarea
              placeholder="Your detailed feedback (optional)"
              value={feedbackData.feedback}
              onChange={(e) => setFeedbackData({...feedbackData, feedback: e.target.value})}
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
              disabled={!feedbackData.feedbackType}
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
