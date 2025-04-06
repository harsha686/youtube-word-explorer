
import { useState } from "react";
import { SearchResult } from "@/types";
import { getVideoTranscript, searchInTranscript } from "@/services/youtubeService";
import SearchBar from "@/components/SearchBar";
import SearchResults from "@/components/SearchResults";
import VideoPlayer from "@/components/VideoPlayer";
import ExtensionInfo from "@/components/ExtensionInfo";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeTab, setActiveTab] = useState("demo");
  const { toast } = useToast();
  
  // In a real extension, we would get the current video ID from the YouTube page
  const demoVideoId = "dQw4w9WgXcQ"; // Just a demo video ID

  const handleSearch = async (searchTerm: string) => {
    setIsLoading(true);
    try {
      // In a real extension, we would extract the video ID from the current page URL
      const transcript = await getVideoTranscript(demoVideoId);
      const results = searchInTranscript(transcript, searchTerm);
      setSearchResults(results);
      
      // Show alert message if results are found
      if (results.length > 0) {
        toast({
          title: "Word found!",
          description: `Yes, "${searchTerm}" is present in this video. You can proceed.`,
          variant: "default",
        });
      } else {
        toast({
          title: "Word not found",
          description: `The term "${searchTerm}" was not found in this video.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error searching transcript:", error);
      toast({
        title: "Search Error",
        description: "Failed to search the video transcript. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleJumpToTimestamp = (timestamp: number) => {
    setCurrentTime(timestamp);
  };

  return (
    <div className="youtube-word-explorer container py-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">YouTube Word Explorer</h1>
          <p className="text-muted-foreground">
            Search for words within YouTube videos and jump directly to where they appear
          </p>
        </div>

        <Tabs defaultValue="demo" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="demo">Demo</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>
          <TabsContent value="demo" className="space-y-4 pt-4">
            <SearchBar onSearch={handleSearch} isLoading={isLoading} />
            
            {searchResults.length > 0 && (
              <Alert className="bg-green-50 border-green-200">
                <Check className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">
                  Yes, the word is present. You can proceed.
                </AlertDescription>
              </Alert>
            )}
            
            {activeTab === "demo" && (
              <>
                <VideoPlayer 
                  videoId={demoVideoId}
                  currentTime={currentTime}
                  onTimeUpdate={(time) => {}}
                />
                
                <Separator className="my-4" />
                
                <SearchResults 
                  results={searchResults} 
                  onJumpToTimestamp={handleJumpToTimestamp} 
                />
              </>
            )}
          </TabsContent>
          <TabsContent value="about" className="space-y-4 pt-4">
            <ExtensionInfo />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
