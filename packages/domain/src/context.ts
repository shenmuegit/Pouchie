import type { AuthProvider, Clock } from "./services";
import type {
  AnalyticsRepository,
  BudgetRepository,
  CategoryRepository,
  PreferenceRepository,
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
    budgets: BudgetRepository;
    analytics: AnalyticsRepository;
    preferences: PreferenceRepository;
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

