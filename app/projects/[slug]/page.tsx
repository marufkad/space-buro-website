import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projectLocations } from "../../data";
import ProjectDetail from "./ProjectDetail";

export function generateStaticParams() {
  return projectLocations.filter((project) => project.published).map((project) => ({ slug: project.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = projectLocations.find((item) => item.id === slug);
  if (!project?.published) return {};
  return {
    title: `${project.shortTitle.ru} | Space Buro`,
    description: project.summary.ru,
    openGraph: project.cover ? { images: [{ url: project.cover }] } : undefined,
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projectLocations.find((item) => item.id === slug);
  if (!project?.published) notFound();

  return <ProjectDetail project={project} />;
}
