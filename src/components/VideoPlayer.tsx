import { useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface VideoPlayerProps {
  videoId: string;
  currentTime: number;
  onTimeUpdate?: (time: number) => void;
}

const VideoPlayer = ({ videoId, currentTime, onTimeUpdate }: VideoPlayerProps) => {
  const playerRef = useRef<HTMLDivElement>(null);
  const playerInstanceRef = useRef<any>(null);

  useEffect(() => {
    // Load the YouTube IFrame Player API
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    if (firstScriptTag.parentNode) {
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    const onYouTubeIframeAPIReady = () => {
      // In a real extension, we would not create a player here but control the existing one
      playerInstanceRef.current = new (window as any).YT.Player(playerRef.current, {
        videoId: videoId,
        events: {
          onReady: () => {
            console.log("Player ready");
          },
          onStateChange: (event: any) => {
            if (event.data === (window as any).YT.PlayerState.PLAYING && onTimeUpdate) {
              const interval = setInterval(() => {
                const currentTime = playerInstanceRef.current.getCurrentTime();
                onTimeUpdate(currentTime);
              }, 1000);
              
              return () => clearInterval(interval);
            }
          }
        }
      });
    };

    // If the API is already loaded, initialize the player
    if ((window as any).YT && (window as any).YT.Player) {
      onYouTubeIframeAPIReady();
    } else {
      // Otherwise wait for the API to load
      (window as any).onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
    }

    return () => {
      if (playerInstanceRef.current) {
        playerInstanceRef.current.destroy();
      }
    };
  }, [videoId, onTimeUpdate]);

  useEffect(() => {
    if (playerInstanceRef.current && currentTime !== null) {
      playerInstanceRef.current.seekTo(currentTime, true);
      playerInstanceRef.current.playVideo();
    }
  }, [currentTime]);

  return (
    <Card className="w-full overflow-hidden">
      <CardContent className="p-0 aspect-video">
        <div ref={playerRef} className="w-full h-full" />
      </CardContent>
    </Card>
  );
};

export default VideoPlayer;
