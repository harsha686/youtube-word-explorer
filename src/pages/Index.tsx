import { useState, useEffect } from "react";
import { SearchResult } from "@/types";
import { 
  getVideoTranscript, 
  searchInTranscript, 
  getCurrentVideoId, 
  getCurrentVideoTime,
  seekToTime,
  checkCaptionsAvailability
} from "@/services/youtubeService";
import SearchBar from "@/components/SearchBar";
import SearchResults from "@/components/SearchResults";
import VideoPlayer from "@/components/VideoPlayer";
import ExtensionInfo from "@/components/ExtensionInfo";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Check, AlertCircle, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeTab, setActiveTab] = useState("demo");
  const [currentVideoId, setCurrentVideoId] = useState<string>("dQw4w9WgXcQ"); // Default to demo video
  const [captionsAvailable, setCaptionsAvailable] = useState<boolean | null>(null);
  const [isYouTubePage, setIsYouTubePage] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Get the current video ID when the extension is opened
    const fetchCurrentVideoId = async () => {
      try {
        console.log("Fetching current video ID...");
        const videoId = await getCurrentVideoId();
        console.log("Current video ID:", videoId);
        
        // Check if we got a real YouTube video ID (not the demo)
        const isRealVideo = videoId !== "dQw4w9WgXcQ";
        setIsYouTubePage(isRealVideo);
        setCurrentVideoId(videoId);
        
        // Also get the current time
        const time = await getCurrentVideoTime();
        console.log("Current video time:", time);
        setCurrentTime(time);
        
        // Check if captions are available
        if (isRealVideo) {
          const hasCaptions = await checkCaptionsAvailability();
          console.log("Captions available:", hasCaptions);
          setCaptionsAvailable(hasCaptions);
        } else {
          // Demo video always has captions
          setCaptionsAvailable(true);
        }
      } catch (error) {
        console.error("Error fetching current video ID:", error);
        // Keep using the default demo video ID if there's an error
        setCaptionsAvailable(true); // Demo video has captions
      }
    };
    
    fetchCurrentVideoId();
  }, []);

  const handleSearch = async (searchTerm: string) => {
    console.log(`Searching for: "${searchTerm}" in video: ${currentVideoId}`);
    setIsLoading(true);
    try {
      const transcript = await getVideoTranscript(currentVideoId);
      console.log(`Retrieved transcript with ${transcript.length} entries`);
      
      const results = searchInTranscript(transcript, searchTerm);
      console.log(`Search results:`, results);
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

  const handleJumpToTimestamp = async (timestamp: number) => {
    console.log(`Jumping to timestamp: ${timestamp}`);
    setCurrentTime(timestamp);
    
    // Also send a message to the content script to jump to that timestamp
    // This will affect the actual YouTube video in the tab
    try {
      await seekToTime(timestamp);
    } catch (error) {
      console.error("Error seeking to time:", error);
      toast({
        title: "Seek Error",
        description: "Failed to jump to the specified timestamp in the YouTube video.",
        variant: "destructive",
      });
    }
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

        {isYouTubePage && captionsAvailable === false && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              This YouTube video doesn't appear to have captions. Word search may not work correctly.
            </AlertDescription>
          </Alert>
        )}
        
        {!isYouTubePage && (
          <Alert variant="default" className="mb-4">
            <Info className="h-4 w-4" />
            <AlertDescription>
              Open a YouTube video in this tab to search for words in that video. Currently showing demo mode.
            </AlertDescription>
          </Alert>
        )}

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
                  videoId={currentVideoId}
                  currentTime={currentTime}
                  onTimeUpdate={(time) => setCurrentTime(time)}
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
