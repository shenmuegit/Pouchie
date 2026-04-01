export interface AppleIdentity {
  appleSub: string;
  email: string | null;
  displayName: string | null;
}

export interface TokenPair {
  rawToken: string;
  tokenHash: string;
}

export interface AuthProvider {
  verifyAppleIdToken(idToken: string): Promise<AppleIdentity>;
  issueOpaqueToken(): Promise<TokenPair>;
}

export interface Clock {
  now(): Date;
}

export const systemClock: Clock = {
  now: () => new Date()
};

