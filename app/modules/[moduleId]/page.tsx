import { ModuleRenderer } from "@/shell/module-loader/ModuleRenderer";

export default async function ModulePage({ params }: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = await params;
  return <ModuleRenderer moduleId={moduleId} />;
}
