
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";

const ExtensionInfo = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Info className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">YouTube Word Explorer</CardTitle>
        </div>
        <CardDescription>
          Search for words within YouTube videos and jump directly to where they appear
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm">
        <p>
          This extension is a demo of how you could search for words in a YouTube video.
          In a real Chrome extension, this would integrate with the YouTube player on the page.
        </p>
      </CardContent>
    </Card>
  );
};

export default ExtensionInfo;
