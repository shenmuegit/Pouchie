export interface AppleIdentity {
  appleSub: string;
  email: string | null;
  displayName: string | null;
}

export interface GoogleIdentity {
  googleSub: string;
  email: string | null;
  displayName: string | null;
}

export interface TokenPair {
  rawToken: string;
  tokenHash: string;
}

export interface AuthProvider {
  verifyAppleIdToken(idToken: string): Promise<AppleIdentity>;
  verifyGoogleIdToken(idToken: string): Promise<GoogleIdentity>;
  issueOpaqueToken(): Promise<TokenPair>;
}

export interface Clock {
  now(): Date;
}

export const systemClock: Clock = {
  now: () => new Date()
};

