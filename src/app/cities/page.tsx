import PageLayout from '../../Components/PageLayout';
import { cities } from '../../constants/cities';
import CitiesSearch from './CitiesSearch';

export default function CitiesPage() {
  return (
    <PageLayout>
      <CitiesSearch cities={cities} />
    </PageLayout>
  );
}
