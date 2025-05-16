import PageHeader from "../../../../components/UI/PrivatePageHeader";
import IncompletedBooksSection from "./IncompleteBooks";
import CompletedBooksSection from "./CompletedBooks";

export default function EmployeeBooksPage() {
  return (
    <>
      <PageHeader title={"Books"} menuBar={true} />

      <CompletedBooksSection />

      <IncompletedBooksSection />
    </>
  );
}
