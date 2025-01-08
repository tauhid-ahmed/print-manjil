import TShirt from "@/components/features/t-shirt";
import Table from "@/components/table";

export default async function Homepage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const query = await searchParams;
  return (
    <div className="min-h-screen p-10">
      <Table searchParams={query} />
      <TShirt />
    </div>
  );
}
