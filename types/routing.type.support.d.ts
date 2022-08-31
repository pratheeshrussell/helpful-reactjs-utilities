export type FuncComponentProp = { [key: string]: any };

// Route Type definitions
export type CoreRoute = {
  path: string;
  children?: CoreRoutes;
} & (
   { component: React.ReactNode }
  | { redirectTo: string; redirectReplace?: boolean }
);
export type CoreRoutes = CoreRoute[];
