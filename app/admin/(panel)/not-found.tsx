import Link from "next/link";
import { PageHeader, buttonGhost } from "@/components/admin/ui";

export default function AdminNotFound() {
  return (
    <>
      <PageHeader title="Not found" intro="This item does not exist anymore. It may have been deleted." />
      <Link href="/admin" className={buttonGhost}>
        Back to overview
      </Link>
    </>
  );
}
