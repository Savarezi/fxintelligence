import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardCurrencyCards from '@/components/DashboardCurrencyCards';
import ProductCards from '@/components/ProductCards';
import ImportSemaphore from '@/components/ImportSemaphore';
import TimelineChart from '@/components/TimelineChart';
import ExpertInsights from '@/components/ExpertInsights';
import { BarChart3, Lightbulb, Package, Activity, LineChart } from 'lucide-react';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background pt-16">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-background pt-16">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold md:text-3xl">
            <BarChart3 className="mr-2 inline-block h-7 w-7 text-primary" />
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Visão completa do mercado • Dados atualizados em tempo real
          </p>
        </div>

        {/* Currency Cards */}
        <section className="mb-10">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <Activity className="h-5 w-5 text-primary" />
            Câmbio
          </h2>
          <DashboardCurrencyCards />
        </section>

        {/* Timeline Chart */}
        <section className="mb-10">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <LineChart className="h-5 w-5 text-primary" />
            Histórico Cambial
          </h2>
          <TimelineChart />
        </section>

        {/* Products */}
        <section className="mb-10">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <Package className="h-5 w-5 text-primary" />
            Produtos Globais
          </h2>
          <ProductCards />
        </section>

        {/* Semaphore */}
        <section className="mb-10">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <Activity className="h-5 w-5 text-primary" />
            Semáforo de Importação
          </h2>
          <ImportSemaphore />
        </section>

        {/* Expert Insights */}
        <section className="mb-10">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <Lightbulb className="h-5 w-5 text-primary" />
            Insights Exclusivos
          </h2>
          <ExpertInsights />
        </section>
      </div>
    </main>
  );
}
