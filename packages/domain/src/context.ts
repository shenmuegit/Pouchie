import type { AuthProvider, Clock } from "./services";
import type {
  AnalyticsRepository,
  CategoryRepository,
  SessionRepository,
  TransactionRepository,
  UserRepository
} from "./ports/repositories";

export interface DomainContext {
  repos: {
    users: UserRepository;
    sessions: SessionRepository;
    categories: CategoryRepository;
    transactions: TransactionRepository;
    analytics: AnalyticsRepository;
  };
  services: {
    authProvider: AuthProvider;
    clock: Clock;
  };
  config: {
    enableDevBypass: boolean;
    sessionTtlHours: number;
  };
}
