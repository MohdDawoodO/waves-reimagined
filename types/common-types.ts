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
  likes: number;
  user: UserType;
  albumCover: AlbumCoverType;
};

export type LikeType =
  | {
      id: number;
      userID: string;
      trackID: string;
    }
  | undefined;
