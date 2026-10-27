import { ActivityForm } from '../../components/activities/ActivityForm';
import { PageHeader } from '../../components/layout/PageHeader';

export function NewActivityPage() {
  return (
    <>
      <PageHeader
        title="Log an activity"
        subtitle="Add what you did. A recommendation is generated after you save."
        back={{ to: '/activities', label: 'Activities' }}
      />
      <ActivityForm />
    </>
  );
}
