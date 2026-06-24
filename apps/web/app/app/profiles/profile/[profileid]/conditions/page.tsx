import { redirect } from "next/navigation";

export default async function LegacyProfileConditionsPage({ params }: { params: Promise<{ profileid: string }> }) {
    const { profileid } = await params;
    redirect(`/app/profiles/profile/${profileid}/configurations`);
}
