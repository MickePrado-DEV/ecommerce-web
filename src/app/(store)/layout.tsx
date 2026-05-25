import { StoreLayout } from '@/widgets/store-layout/ui/store-layout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <StoreLayout>{children}</StoreLayout>;
}
