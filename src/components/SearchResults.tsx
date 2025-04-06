
import { SearchResult } from "@/types";
import { formatTime } from "@/services/youtubeService";
import { Card, CardContent } from "@/components/ui/card";

interface SearchResultsProps {
  results: SearchResult[];
  onJumpToTimestamp: (timestamp: number) => void;
}

const SearchResults = ({ results, onJumpToTimestamp }: SearchResultsProps) => {
  if (results.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 space-y-3">
      <h3 className="text-lg font-semibold">Results ({results.length})</h3>
      {results.map((result, index) => (
        <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <button
                onClick={() => onJumpToTimestamp(result.timestamp)}
                className="timestamp shrink-0 pt-0.5"
              >
                {formatTime(result.timestamp)}
              </button>
              <p className="text-sm">
                {result.contextBefore}
                <span className="result-highlight font-medium animate-pulse-red">
                  {result.matchedText}
                </span>
                {result.contextAfter}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SearchResults;
