
// YouTube service - main export file

// Re-export all functionality from separate utility files
export { getCurrentVideoId } from './videoIdentifier';
export { getCurrentVideoTime, seekToTime } from './videoController';
export { getVideoTranscript } from './transcriptData';
export { searchInTranscript } from './transcriptSearch';
export { formatTime } from './timeUtils';
