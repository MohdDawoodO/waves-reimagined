export type UserType = {
  role: "user" | "admin" | null;
  id: string;
  name: string | null;
  handle: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
  password: string | null;
  profileDescription: string | null;
};

export type AlbumCoverType = {
  id: number;
  imageURL: string;
  publicID: string;
  trackID: string;
};

export type CommentType = {
  id: number;
  comment: string;
  userID: string;
  trackID: string;
  commentedOn: Date;
  commentUser: UserType;
};

export type TrackType = {
  visibility: "private" | "unlisted" | "public" | null;
  duration: number;
  id: string;
  description: string;
  userID: string;
  publicID: string;
  trackName: string;
  trackURL: string;
  uploadedOn: Date;
  views: number;
  albumCover: AlbumCoverType;
  user?: UserType;
  like?: LikeType[];
  trackTags?: tagsType[];
};

export type tagsType = {
  id: number;
  tag: string;
  trackID: string;
};

export type LikeType = {
  id: number;
  userID: string;
  trackID: string;
};

export type PlaylistType = {
  id: string;
  userID: string;
  name: string;
  description: string;
  visibility: "public" | "unlisted" | "private";
  tracks: number;
  editable: boolean;
  createdOn: Date;
};

export type PlaylistTrackType = {
  id: number;
  playlistID: string;
  trackID: string;
};

export type PlaylistWithTrackType = PlaylistType & {
  playlistTracks: PlaylistTrackType[];
};

export type DisplayPlaylistType = {
  id: string;
  name: string;
  description: string;
  tracks: number;
  editable: boolean;
  latestTrackCover: string | undefined;
  userHandle: string | null;
  visibility: "private" | "unlisted" | "public";
};
