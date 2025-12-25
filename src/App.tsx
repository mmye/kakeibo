import { TransactionProvider, FilterProvider } from '@/contexts';
import { Header, DashboardGrid, GridItem, Section } from '@/components/layout';
import {
  SummaryCards,
  FilterPanel,
  TransactionTable,
  RankingList,
  HighExpenseList,
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
        <div className="min-h-screen bg-background">
          <Header />
          <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {/* サマリー */}
            <SummaryCards />

            {/* フィルター */}
            <div className="mt-6">
              <FilterPanel />
            </div>

            {/* チャート */}
            <Section title="収支分析" className="mt-8">
              <DashboardGrid>
                <GridItem colSpan={2}>
                  <MonthlyTrendChart />
                </GridItem>
                <GridItem>
                  <CategoryPieChart />
                </GridItem>
                <GridItem>
                  <CategoryBarChart />
                </GridItem>
                <GridItem>
                  <InstitutionChart />
                </GridItem>
                <GridItem>
                  <IncomeChart />
                </GridItem>
              </DashboardGrid>
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
            <Section title="取引明細" className="mt-8">
              <TransactionTable />
            </Section>
          </main>
        </div>
      </FilterProvider>
    </TransactionProvider>
  );
}

export default App;
