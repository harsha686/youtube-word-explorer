import { useRef, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface VideoPlayerProps {
  videoId: string;
  currentTime: number;
  onTimeUpdate?: (time: number) => void;
}

const VideoPlayer = ({ videoId, currentTime, onTimeUpdate }: VideoPlayerProps) => {
  const playerRef = useRef<HTMLDivElement>(null);
  const playerInstanceRef = useRef<any>(null);
  const [playerReady, setPlayerReady] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!document.getElementById('youtube-api')) {
      const tag = document.createElement("script");
      tag.id = 'youtube-api';
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      if (firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      }
    }
  }, []);

  useEffect(() => {
    const initializePlayer = () => {
      if (!playerRef.current) return;
      
      if (playerInstanceRef.current) {
        playerInstanceRef.current.destroy();
      }
      
      playerInstanceRef.current = new (window as any).YT.Player(playerRef.current, {
        videoId: videoId,
        playerVars: {
          autoplay: 0,
          controls: 1,
          modestbranding: 1,
          rel: 0
        },
        events: {
          onReady: (event: any) => {
            console.log("Player ready");
            setPlayerReady(true);
          },
          onStateChange: (event: any) => {
            if (intervalRef.current) {
              window.clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            
            if (event.data === (window as any).YT.PlayerState.PLAYING && onTimeUpdate) {
              intervalRef.current = window.setInterval(() => {
                const time = event.target.getCurrentTime();
                onTimeUpdate(time);
              }, 1000);
            }
          }
        }
      });
    };

    if ((window as any).YT && (window as any).YT.Player) {
      initializePlayer();
    } else {
      (window as any).onYouTubeIframeAPIReady = initializePlayer;
    }

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      if (playerInstanceRef.current) {
        playerInstanceRef.current.destroy();
      }
    };
  }, [videoId, onTimeUpdate]);

  useEffect(() => {
    if (playerReady && playerInstanceRef.current && typeof currentTime === 'number') {
      try {
        const player = playerInstanceRef.current;
        if (player && typeof player.seekTo === 'function') {
          player.seekTo(currentTime, true);
          player.playVideo();
        }
      } catch (error) {
        console.error("Error seeking to time:", error);
      }
    }
  }, [currentTime, playerReady]);

  return (
    <Card className="w-full overflow-hidden">
      <CardContent className="p-0 aspect-video">
        <div ref={playerRef} className="w-full h-full" />
      </CardContent>
    </Card>
  );
};

export default VideoPlayer;
