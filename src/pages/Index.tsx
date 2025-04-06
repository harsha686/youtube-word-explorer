
import { useState } from "react";
import { SearchResult } from "@/types";
import { getVideoTranscript, searchInTranscript } from "@/services/youtubeService";
import SearchBar from "@/components/SearchBar";
import SearchResults from "@/components/SearchResults";
import VideoPlayer from "@/components/VideoPlayer";
import ExtensionInfo from "@/components/ExtensionInfo";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeTab, setActiveTab] = useState("demo");
  
  // In a real extension, we would get the current video ID from the YouTube page
  const demoVideoId = "dQw4w9WgXcQ"; // Just a demo video ID

  const handleSearch = async (searchTerm: string) => {
    setIsLoading(true);
    try {
      // In a real extension, we would extract the video ID from the current page URL
      const transcript = await getVideoTranscript(demoVideoId);
      const results = searchInTranscript(transcript, searchTerm);
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching transcript:", error);
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
