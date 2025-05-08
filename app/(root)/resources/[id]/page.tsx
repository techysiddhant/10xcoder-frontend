import { Metadata } from "next";
import React from "react";

import { ResourceMain } from "@/components/resource/resource-main";
import { env } from "@/env";
import { getResource, getResources } from "@/lib/http";
import { ResourceType } from "@/lib/types";

export const revalidate = 86400;
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const { data: resource } = await getResource(id);

  return {
    title: resource.title,
    description: resource.description,
    keywords: [...resource.tags],
    openGraph: {
      title: resource.title,
      description: resource.description,
      images: [resource?.image || ""],
    },
    twitter: {
      title: resource.title,
      description: resource.description,
      images: [
        {
          url:
            resource?.image || `${env.NEXT_PUBLIC_URL}/opengraph-image.png.png`,
          alt: resource.title,
        },
      ],
    },
    metadataBase: new URL(env.NEXT_PUBLIC_URL),
  };
}

export async function generateStaticParams() {
  const { data } = await getResources("?limit=25");
  if (data.resources.length === 0) {
    return [];
  }
  return data.resources.map((resource: ResourceType) => ({
    id: resource.id,
  }));
}

const ResourcePage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  return <ResourceMain id={id} />;
};

export default ResourcePage;
