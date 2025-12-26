import { TransactionProvider, FilterProvider, BudgetProvider } from '@/contexts';
import { Header, DashboardGrid, GridItem, Section } from '@/components/layout';
import { ChartCarousel } from '@/components/ui';
import {
  SummaryCards,
  FilterPanel,
  TransactionTable,
  RankingList,
  HighExpenseList,
  InsightCards,
} from '@/components/dashboard';
import {
  MonthlyTrendChart,
  CategoryPieChart,
  CategoryBarChart,
  InstitutionChart,
  IncomeChart,
  HeatmapChart,
} from '@/components/charts';

export function App() {
  return (
    <TransactionProvider>
      <FilterProvider>
        <BudgetProvider>
          <div className="min-h-screen bg-background">
            <Header />
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
              {/* サマリー */}
              <SummaryCards />

              {/* インサイト */}
              <div className="mt-6">
                <InsightCards />
              </div>

              {/* フィルター */}
              <div className="mt-6">
                <FilterPanel />
              </div>

              {/* チャート */}
              <Section title="収支分析" className="mt-8">
                <ChartCarousel>
                  <MonthlyTrendChart />
                  <CategoryPieChart />
                  <CategoryBarChart />
                  <InstitutionChart />
                  <IncomeChart />
                </ChartCarousel>
              </Section>

              {/* ランキング */}
              <Section title="支出詳細" className="mt-8">
                <DashboardGrid>
                  <GridItem>
                    <RankingList />
                  </GridItem>
                  <GridItem>
                    <HighExpenseList />
                  </GridItem>
                  <GridItem colSpan={3}>
                    <HeatmapChart />
                  </GridItem>
                </DashboardGrid>
              </Section>

              {/* 明細テーブル */}
              <Section title="取引明細" className="mt-8" id="transaction-section">
                <TransactionTable />
              </Section>
            </main>
          </div>
        </BudgetProvider>
      </FilterProvider>
    </TransactionProvider>
  );
}

export default App;
