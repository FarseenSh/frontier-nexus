import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DAppKitProvider } from "@mysten/dapp-kit-react";
import { ErrorBoundary } from "./components/shared/error-boundary";
import { ToastProvider } from "./components/shared/toast-context";
import { ToastContainer } from "./components/shared/toast";
import { PageLayout } from "./components/layout/page-layout";
import { dAppKit } from "./lib/dapp-kit";
import LandingPage from "./pages/landing-page";

const GalaxyPage = lazy(() => import("./pages/galaxy-page"));
const MarketplacePage = lazy(() => import("./pages/marketplace-page"));
const KillsPage = lazy(() => import("./pages/kills-page"));
const AssembliesPage = lazy(() => import("./pages/assemblies-page"));
const TribesPage = lazy(() => import("./pages/tribes-page"));
const DashboardPage = lazy(() => import("./pages/dashboard-page"));

const queryClient = new QueryClient();

const PageFallback = () => (
  <div className="flex items-center justify-center h-64">
    <div className="w-3 h-3 rounded-full bg-cyan animate-pulse" />
  </div>
);

const App = () => {
  return (
    <ErrorBoundary>
      <DAppKitProvider dAppKit={dAppKit}>
        <QueryClientProvider client={queryClient}>
          <ToastProvider>
            <BrowserRouter>
              <Suspense fallback={<PageFallback />}>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route element={<PageLayout />}>
                    <Route path="/map" element={<GalaxyPage />} />
                    <Route path="/marketplace" element={<MarketplacePage />} />
                    <Route path="/kills" element={<KillsPage />} />
                    <Route path="/assemblies" element={<AssembliesPage />} />
                    <Route path="/tribes" element={<TribesPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                  </Route>
                </Routes>
              </Suspense>
            </BrowserRouter>
            <ToastContainer />
          </ToastProvider>
        </QueryClientProvider>
      </DAppKitProvider>
    </ErrorBoundary>
  );
};

export default App;
