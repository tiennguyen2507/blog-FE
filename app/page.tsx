import { redirect } from "next/navigation";

export default function Home() {
  redirect("/dashboard/blogs");
  return null;
}
