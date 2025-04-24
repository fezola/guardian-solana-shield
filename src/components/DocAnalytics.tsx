
import { useEffect } from "react";

type DocAnalyticsProps = {
  sectionId: string;
  sectionTitle: string;
};

const DocAnalytics = ({ sectionId, sectionTitle }: DocAnalyticsProps) => {
  useEffect(() => {
    // Track when a documentation section is viewed
    const trackView = () => {
      console.log(`Analytics: Viewed section ${sectionId} - ${sectionTitle}`);
      // In a production app, you would send this data to your analytics service
      // Example: sendToAnalytics('doc_section_view', { sectionId, sectionTitle });
    };

    trackView();
  }, [sectionId, sectionTitle]);

  return null; // This is a non-visual component
};

export default DocAnalytics;
